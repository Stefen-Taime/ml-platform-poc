from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from app.models.schemas import Deployment, DeploymentCreate, DeploymentUpdate, DeploymentStatus
from app.services.database import get_db
from app.services.airflow_client import trigger_dag, get_dag_run_status

router = APIRouter()

# Fonction utilitaire pour convertir ObjectId en str
def serialize_object_id(obj_id):
    return str(obj_id)

@router.get("/", response_model=List[Deployment])
async def get_deployments(
    skip: int = 0, 
    limit: int = 100,
    model_id: Optional[str] = None,
    status: Optional[DeploymentStatus] = None,
    db = Depends(get_db)
):
    """
    Récupère la liste des déploiements avec filtrage optionnel.
    """
    # Construire le filtre
    filter_query = {}
    if model_id:
        filter_query["model_id"] = model_id
    if status:
        filter_query["status"] = status
    
    # Exécuter la requête
    cursor = db.deployments.find(filter_query).skip(skip).limit(limit)
    deployments = await cursor.to_list(length=limit)
    
    # Convertir les ObjectId en str
    for deployment in deployments:
        deployment["_id"] = serialize_object_id(deployment["_id"])
    
    return deployments

@router.get("/{deployment_id}", response_model=Deployment)
async def get_deployment(deployment_id: str, db = Depends(get_db)):
    """
    Récupère un déploiement spécifique par son ID.
    """
    try:
        deployment = await db.deployments.find_one({"_id": ObjectId(deployment_id)})
        if deployment is None:
            raise HTTPException(status_code=404, detail="Déploiement non trouvé")
        
        deployment["_id"] = serialize_object_id(deployment["_id"])
        return deployment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération du déploiement: {str(e)}")

@router.post("/", response_model=Deployment, status_code=status.HTTP_201_CREATED)
async def create_deployment(deployment_data: DeploymentCreate, db = Depends(get_db)):
    """
    Crée un nouveau déploiement pour un modèle.
    """
    try:
        # Vérifier si le modèle existe
        model = await db.models.find_one({"_id": ObjectId(deployment_data.model_id)})
        if model is None:
            raise HTTPException(status_code=404, detail="Modèle non trouvé")
        
        # Préparer les données du déploiement
        deployment_dict = deployment_data.dict()
        deployment_dict["created_at"] = datetime.now()
        deployment_dict["updated_at"] = datetime.now()
        deployment_dict["status"] = DeploymentStatus.PENDING
        
        # Générer un ID de DAG unique
        dag_id = f"model_{deployment_data.model_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}"
        deployment_dict["dag_id"] = dag_id
        
        # Insérer le déploiement dans la base de données
        result = await db.deployments.insert_one(deployment_dict)
        deployment_id = serialize_object_id(result.inserted_id)
        
        # Créer et déclencher le DAG Airflow
        # Note: Dans un environnement réel, il faudrait générer dynamiquement le DAG
        # et le déployer dans le répertoire dags d'Airflow
        try:
            # Configuration pour le DAG
            dag_conf = {
                "model_id": deployment_data.model_id,
                "deployment_id": deployment_id,
                "parameters": deployment_data.parameters
            }
            
            # Déclencher le DAG (simulation)
            await trigger_dag(dag_id, dag_conf)
            
            # Mettre à jour le statut du déploiement
            await db.deployments.update_one(
                {"_id": ObjectId(deployment_id)},
                {"$set": {"status": DeploymentStatus.RUNNING}}
            )
        except Exception as e:
            # En cas d'erreur, mettre à jour le statut du déploiement
            await db.deployments.update_one(
                {"_id": ObjectId(deployment_id)},
                {"$set": {"status": DeploymentStatus.FAILED}}
            )
            raise HTTPException(status_code=500, detail=f"Erreur lors du déclenchement du DAG: {str(e)}")
        
        # Récupérer le déploiement créé
        created_deployment = await db.deployments.find_one({"_id": ObjectId(deployment_id)})
        created_deployment["_id"] = deployment_id
        
        return created_deployment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création du déploiement: {str(e)}")

@router.put("/{deployment_id}", response_model=Deployment)
async def update_deployment(
    deployment_id: str,
    deployment_update: DeploymentUpdate,
    db = Depends(get_db)
):
    """
    Met à jour un déploiement existant.
    """
    try:
        # Vérifier si le déploiement existe
        deployment = await db.deployments.find_one({"_id": ObjectId(deployment_id)})
        if deployment is None:
            raise HTTPException(status_code=404, detail="Déploiement non trouvé")
        
        # Préparer les données de mise à jour
        update_data = {k: v for k, v in deployment_update.dict(exclude_unset=True).items() if v is not None}
        update_data["updated_at"] = datetime.now()
        
        # Mettre à jour le déploiement
        await db.deployments.update_one(
            {"_id": ObjectId(deployment_id)},
            {"$set": update_data}
        )
        
        # Récupérer le déploiement mis à jour
        updated_deployment = await db.deployments.find_one({"_id": ObjectId(deployment_id)})
        updated_deployment["_id"] = deployment_id
        
        return updated_deployment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour du déploiement: {str(e)}")

@router.delete("/{deployment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_deployment(deployment_id: str, db = Depends(get_db)):
    """
    Supprime un déploiement existant.
    """
    try:
        # Vérifier si le déploiement existe
        deployment = await db.deployments.find_one({"_id": ObjectId(deployment_id)})
        if deployment is None:
            raise HTTPException(status_code=404, detail="Déploiement non trouvé")
        
        # Supprimer le déploiement
        await db.deployments.delete_one({"_id": ObjectId(deployment_id)})
        
        return JSONResponse(status_code=204, content={})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la suppression du déploiement: {str(e)}")

@router.post("/{deployment_id}/start", response_model=Deployment)
async def start_deployment(deployment_id: str, db = Depends(get_db)):
    """
    Démarre un déploiement existant.
    """
    try:
        # Vérifier si le déploiement existe
        deployment = await db.deployments.find_one({"_id": ObjectId(deployment_id)})
        if deployment is None:
            raise HTTPException(status_code=404, detail="Déploiement non trouvé")
        
        # Vérifier si le déploiement peut être démarré
        if deployment["status"] == DeploymentStatus.RUNNING:
            raise HTTPException(status_code=400, detail="Le déploiement est déjà en cours d'exécution")
        
        # Configuration pour le DAG
        dag_conf = {
            "model_id": deployment["model_id"],
            "deployment_id": deployment_id,
            "parameters": deployment["parameters"]
        }
        
        # Déclencher le DAG
        await trigger_dag(deployment["dag_id"], dag_conf)
        
        # Mettre à jour le statut du déploiement
        await db.deployments.update_one(
            {"_id": ObjectId(deployment_id)},
            {"$set": {"status": DeploymentStatus.RUNNING, "updated_at": datetime.now()}}
        )
        
        # Récupérer le déploiement mis à jour
        updated_deployment = await db.deployments.find_one({"_id": ObjectId(deployment_id)})
        updated_deployment["_id"] = deployment_id
        
        return updated_deployment
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors du démarrage du déploiement: {str(e)}")

@router.get("/{deployment_id}/status", response_model=dict)
async def get_deployment_status(deployment_id: str, db = Depends(get_db)):
    """
    Récupère le statut actuel d'un déploiement.
    """
    try:
        # Vérifier si le déploiement existe
        deployment = await db.deployments.find_one({"_id": ObjectId(deployment_id)})
        if deployment is None:
            raise HTTPException(status_code=404, detail="Déploiement non trouvé")
        
        # Si le déploiement est en cours d'exécution, vérifier le statut dans Airflow
        if deployment["status"] == DeploymentStatus.RUNNING and "dag_id" in deployment:
            try:
                # Récupérer le statut du DAG
                dag_runs = await get_dag_run_status(deployment["dag_id"], "latest")
                
                # Mettre à jour le statut du déploiement si nécessaire
                if dag_runs["state"] == "success":
                    await db.deployments.update_one(
                        {"_id": ObjectId(deployment_id)},
                        {"$set": {"status": DeploymentStatus.COMPLETED, "updated_at": datetime.now()}}
                    )
                    deployment["status"] = DeploymentStatus.COMPLETED
                elif dag_runs["state"] == "failed":
                    await db.deployments.update_one(
                        {"_id": ObjectId(deployment_id)},
                        {"$set": {"status": DeploymentStatus.FAILED, "updated_at": datetime.now()}}
                    )
                    deployment["status"] = DeploymentStatus.FAILED
            except Exception as e:
                # En cas d'erreur, ne pas modifier le statut
                pass
        
        return {
            "deployment_id": deployment_id,
            "status": deployment["status"],
            "updated_at": deployment["updated_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération du statut du déploiement: {str(e)}")
