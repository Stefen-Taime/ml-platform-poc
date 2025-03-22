from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import List, Optional
from bson import ObjectId
from datetime import datetime
import os
import tempfile

from app.models.schemas import Model, ModelCreate, ModelUpdate, ModelStatus
from app.services.database import get_db
from app.services.minio_client import upload_file, get_presigned_url

router = APIRouter()

# Fonction utilitaire pour convertir ObjectId en str
def serialize_object_id(obj_id):
    return str(obj_id)

@router.get("/", response_model=List[Model])
async def get_models(
    skip: int = 0, 
    limit: int = 100,
    department: Optional[str] = None,
    region: Optional[str] = None,
    status: Optional[ModelStatus] = None,
    db = Depends(get_db)
):
    """
    Récupère la liste des modèles avec filtrage optionnel.
    """
    # Construire le filtre
    filter_query = {}
    if department:
        filter_query["department"] = department
    if region:
        filter_query["region"] = region
    if status:
        filter_query["status"] = status
    
    # Exécuter la requête
    cursor = db.models.find(filter_query).skip(skip).limit(limit)
    models = await cursor.to_list(length=limit)
    
    # Convertir les ObjectId en str
    for model in models:
        model["_id"] = serialize_object_id(model["_id"])
    
    return models

@router.get("/{model_id}", response_model=Model)
async def get_model(model_id: str, db = Depends(get_db)):
    """
    Récupère un modèle spécifique par son ID.
    """
    try:
        model = await db.models.find_one({"_id": ObjectId(model_id)})
        if model is None:
            raise HTTPException(status_code=404, detail="Modèle non trouvé")
        
        model["_id"] = serialize_object_id(model["_id"])
        return model
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération du modèle: {str(e)}")

@router.post("/", response_model=Model, status_code=status.HTTP_201_CREATED)
async def create_model(
    model_data: ModelCreate = Form(...),
    model_file: Optional[UploadFile] = File(None),
    db = Depends(get_db)
):
    """
    Crée un nouveau modèle et télécharge optionnellement le fichier du modèle.
    """
    try:
        # Préparer les données du modèle
        model_dict = model_data.dict()
        model_dict["created_at"] = datetime.now()
        model_dict["updated_at"] = datetime.now()
        model_dict["status"] = ModelStatus.DRAFT
        
        # Insérer le modèle dans la base de données
        result = await db.models.insert_one(model_dict)
        model_id = serialize_object_id(result.inserted_id)
        
        # Si un fichier de modèle est fourni, le télécharger vers MinIO
        if model_file:
            # Créer un fichier temporaire
            with tempfile.NamedTemporaryFile(delete=False) as temp_file:
                # Écrire le contenu du fichier téléchargé dans le fichier temporaire
                temp_file.write(await model_file.read())
                temp_file_path = temp_file.name
            
            try:
                # Télécharger le fichier vers MinIO
                object_name = f"{model_id}/{model_file.filename}"
                upload_file("models", object_name, temp_file_path)
                
                # Mettre à jour le chemin du fichier dans la base de données
                await db.models.update_one(
                    {"_id": ObjectId(model_id)},
                    {"$set": {"file_path": object_name}}
                )
            finally:
                # Supprimer le fichier temporaire
                os.unlink(temp_file_path)
        
        # Récupérer le modèle créé
        created_model = await db.models.find_one({"_id": ObjectId(model_id)})
        created_model["_id"] = model_id
        
        return created_model
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création du modèle: {str(e)}")

@router.put("/{model_id}", response_model=Model)
async def update_model(
    model_id: str,
    model_update: ModelUpdate,
    db = Depends(get_db)
):
    """
    Met à jour un modèle existant.
    """
    try:
        # Vérifier si le modèle existe
        model = await db.models.find_one({"_id": ObjectId(model_id)})
        if model is None:
            raise HTTPException(status_code=404, detail="Modèle non trouvé")
        
        # Préparer les données de mise à jour
        update_data = {k: v for k, v in model_update.dict(exclude_unset=True).items() if v is not None}
        update_data["updated_at"] = datetime.now()
        
        # Mettre à jour le modèle
        await db.models.update_one(
            {"_id": ObjectId(model_id)},
            {"$set": update_data}
        )
        
        # Récupérer le modèle mis à jour
        updated_model = await db.models.find_one({"_id": ObjectId(model_id)})
        updated_model["_id"] = model_id
        
        return updated_model
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la mise à jour du modèle: {str(e)}")

@router.delete("/{model_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_model(model_id: str, db = Depends(get_db)):
    """
    Supprime un modèle existant.
    """
    try:
        # Vérifier si le modèle existe
        model = await db.models.find_one({"_id": ObjectId(model_id)})
        if model is None:
            raise HTTPException(status_code=404, detail="Modèle non trouvé")
        
        # Supprimer le modèle
        await db.models.delete_one({"_id": ObjectId(model_id)})
        
        return JSONResponse(status_code=204, content={})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la suppression du modèle: {str(e)}")

@router.get("/{model_id}/download")
async def download_model(model_id: str, db = Depends(get_db)):
    """
    Génère une URL présignée pour télécharger le fichier du modèle.
    """
    try:
        # Récupérer le modèle
        model = await db.models.find_one({"_id": ObjectId(model_id)})
        if model is None:
            raise HTTPException(status_code=404, detail="Modèle non trouvé")
        
        # Vérifier si le modèle a un fichier associé
        if "file_path" not in model or not model["file_path"]:
            raise HTTPException(status_code=404, detail="Aucun fichier associé à ce modèle")
        
        # Générer l'URL présignée
        presigned_url = get_presigned_url("models", model["file_path"], expires=3600)
        
        return {"download_url": presigned_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération de l'URL de téléchargement: {str(e)}")
