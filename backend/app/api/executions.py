from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from app.models.schemas import Execution, ExecutionCreate, ExecutionStatus
from app.services.database import get_db
from app.services.airflow_client import trigger_dag, get_dag_run_status
from app.services.minio_client import get_presigned_url

router = APIRouter()

# Fonction utilitaire pour convertir ObjectId en str
def serialize_object_id(obj_id):
    return str(obj_id)

@router.get("/", response_model=List[Execution])
async def get_executions(
    skip: int = 0, 
    limit: int = 100,
    deployment_id: Optional[str] = None,
    model_id: Optional[str] = None,
    status: Optional[ExecutionStatus] = None,
    db = Depends(get_db)
):
    """
    Récupère la liste des exécutions avec filtrage optionnel.
    """
    # Construire le filtre
    filter_query = {}
    if deployment_id:
        filter_query["deployment_id"] = deployment_id
    if model_id:
        filter_query["model_id"] = model_id
    if status:
        filter_query["status"] = status
    
    # Exécuter la requête
    cursor = db.executions.find(filter_query).skip(skip).limit(limit).sort("created_at", -1)
    executions = await cursor.to_list(length=limit)
    
    # Convertir les ObjectId en str
    for execution in executions:
        execution["_id"] = serialize_object_id(execution["_id"])
    
    return executions

@router.get("/{execution_id}", response_model=Execution)
async def get_execution(execution_id: str, db = Depends(get_db)):
    """
    Récupère une exécution spécifique par son ID.
    """
    try:
        execution = await db.executions.find_one({"_id": ObjectId(execution_id)})
        if execution is None:
            raise HTTPException(status_code=404, detail="Exécution non trouvée")
        
        execution["_id"] = serialize_object_id(execution["_id"])
        return execution
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération de l'exécution: {str(e)}")

@router.post("/", response_model=Execution, status_code=status.HTTP_201_CREATED)
async def create_execution(execution_data: ExecutionCreate, db = Depends(get_db)):
    """
    Crée une nouvelle exécution pour un déploiement.
    """
    try:
        # Vérifier si le déploiement existe
        deployment = await db.deployments.find_one({"_id": ObjectId(execution_data.deployment_id)})
        if deployment is None:
            raise HTTPException(status_code=404, detail="Déploiement non trouvé")
        
        # Récupérer le modèle associé au déploiement
        model = await db.models.find_one({"_id": ObjectId(deployment["model_id"])})
        if model is None:
            raise HTTPException(status_code=404, detail="Modèle non trouvé")
        
        # Préparer les données de l'exécution
        execution_dict = execution_data.dict()
        execution_dict["model_id"] = deployment["model_id"]
        execution_dict["created_at"] = datetime.now()
        execution_dict["status"] = ExecutionStatus.QUEUED
        execution_dict["logs"] = []
        
        # Insérer l'exécution dans la base de données
        result = await db.executions.insert_one(execution_dict)
        execution_id = serialize_object_id(result.inserted_id)
        
        # Déclencher le DAG Airflow pour l'exécution
        try:
            # Configuration pour le DAG
            dag_conf = {
                "model_id": deployment["model_id"],
                "deployment_id": execution_data.deployment_id,
                "execution_id": execution_id,
                "parameters": execution_data.parameters
            }
            
            # Déclencher le DAG
            await trigger_dag(deployment["dag_id"], dag_conf)
            
            # Mettre à jour le statut de l'exécution
            await db.executions.update_one(
                {"_id": ObjectId(execution_id)},
                {
                    "$set": {
                        "status": ExecutionStatus.RUNNING,
                        "start_time": datetime.now()
                    }
                }
            )
        except Exception as e:
            # En cas d'erreur, mettre à jour le statut de l'exécution
            await db.executions.update_one(
                {"_id": ObjectId(execution_id)},
                {
                    "$set": {
                        "status": ExecutionStatus.FAILED,
                        "logs": ["Erreur lors du déclenchement de l'exécution: " + str(e)]
                    }
                }
            )
            raise HTTPException(status_code=500, detail=f"Erreur lors du déclenchement de l'exécution: {str(e)}")
        
        # Récupérer l'exécution créée
        created_execution = await db.executions.find_one({"_id": ObjectId(execution_id)})
        created_execution["_id"] = execution_id
        
        return created_execution
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création de l'exécution: {str(e)}")

@router.get("/{execution_id}/status", response_model=dict)
async def get_execution_status(execution_id: str, db = Depends(get_db)):
    """
    Récupère le statut actuel d'une exécution.
    """
    try:
        # Vérifier si l'exécution existe
        execution = await db.executions.find_one({"_id": ObjectId(execution_id)})
        if execution is None:
            raise HTTPException(status_code=404, detail="Exécution non trouvée")
        
        # Récupérer le déploiement associé
        deployment = await db.deployments.find_one({"_id": ObjectId(execution["deployment_id"])})
        if deployment is None:
            raise HTTPException(status_code=404, detail="Déploiement non trouvé")
        
        # Si l'exécution est en cours, vérifier le statut dans Airflow
        if execution["status"] == ExecutionStatus.RUNNING and "dag_id" in deployment:
            try:
                # Récupérer le statut du DAG
                dag_runs = await get_dag_run_status(deployment["dag_id"], "latest")
                
                # Mettre à jour le statut de l'exécution si nécessaire
                if dag_runs["state"] == "success":
                    await db.executions.update_one(
                        {"_id": ObjectId(execution_id)},
                        {
                            "$set": {
                                "status": ExecutionStatus.SUCCESS,
                                "end_time": datetime.now()
                            }
                        }
                    )
                    execution["status"] = ExecutionStatus.SUCCESS
                    execution["end_time"] = datetime.now()
                elif dag_runs["state"] == "failed":
                    await db.executions.update_one(
                        {"_id": ObjectId(execution_id)},
                        {
                            "$set": {
                                "status": ExecutionStatus.FAILED,
                                "end_time": datetime.now()
                            }
                        }
                    )
                    execution["status"] = ExecutionStatus.FAILED
                    execution["end_time"] = datetime.now()
            except Exception as e:
                # En cas d'erreur, ne pas modifier le statut
                pass
        
        return {
            "execution_id": execution_id,
            "status": execution["status"],
            "start_time": execution.get("start_time"),
            "end_time": execution.get("end_time")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération du statut de l'exécution: {str(e)}")

@router.get("/{execution_id}/logs", response_model=List[str])
async def get_execution_logs(execution_id: str, db = Depends(get_db)):
    """
    Récupère les logs d'une exécution.
    """
    try:
        # Vérifier si l'exécution existe
        execution = await db.executions.find_one({"_id": ObjectId(execution_id)})
        if execution is None:
            raise HTTPException(status_code=404, detail="Exécution non trouvée")
        
        # Récupérer les logs
        logs = execution.get("logs", [])
        
        return logs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des logs de l'exécution: {str(e)}")

@router.get("/{execution_id}/results")
async def get_execution_results(execution_id: str, db = Depends(get_db)):
    """
    Génère une URL présignée pour télécharger les résultats de l'exécution.
    """
    try:
        # Vérifier si l'exécution existe
        execution = await db.executions.find_one({"_id": ObjectId(execution_id)})
        if execution is None:
            raise HTTPException(status_code=404, detail="Exécution non trouvée")
        
        # Vérifier si l'exécution a des résultats
        if "result_path" not in execution or not execution["result_path"]:
            raise HTTPException(status_code=404, detail="Aucun résultat disponible pour cette exécution")
        
        # Vérifier si l'exécution est terminée avec succès
        if execution["status"] != ExecutionStatus.SUCCESS:
            raise HTTPException(status_code=400, detail="L'exécution n'est pas terminée avec succès")
        
        # Générer l'URL présignée
        presigned_url = get_presigned_url("results", execution["result_path"], expires=3600)
        
        return {"download_url": presigned_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération de l'URL de téléchargement des résultats: {str(e)}")

@router.post("/{execution_id}/cancel", response_model=dict)
async def cancel_execution(execution_id: str, db = Depends(get_db)):
    """
    Annule une exécution en cours.
    """
    try:
        # Vérifier si l'exécution existe
        execution = await db.executions.find_one({"_id": ObjectId(execution_id)})
        if execution is None:
            raise HTTPException(status_code=404, detail="Exécution non trouvée")
        
        # Vérifier si l'exécution peut être annulée
        if execution["status"] != ExecutionStatus.RUNNING and execution["status"] != ExecutionStatus.QUEUED:
            raise HTTPException(status_code=400, detail="L'exécution ne peut pas être annulée car elle n'est pas en cours ou en attente")
        
        # Mettre à jour le statut de l'exécution
        await db.executions.update_one(
            {"_id": ObjectId(execution_id)},
            {
                "$set": {
                    "status": ExecutionStatus.FAILED,
                    "end_time": datetime.now(),
                    "logs": execution.get("logs", []) + ["Exécution annulée par l'utilisateur"]
                }
            }
        )
        
        return {
            "execution_id": execution_id,
            "status": "cancelled",
            "message": "L'exécution a été annulée avec succès"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de l'annulation de l'exécution: {str(e)}")
