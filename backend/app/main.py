from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer

from app.api import models, deployments, executions, users
from app.services.database import init_db
from app.services.minio_client import init_minio
from app.services.airflow_client import init_airflow

import logging
import os
from dotenv import load_dotenv

# Charger les variables d'environnement
load_dotenv()

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Initialisation de l'application FastAPI
app = FastAPI(
    title="ML Platform API",
    description="API pour la plateforme centralisée de modèles ML",
    version="0.1.0",
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À remplacer par les origines spécifiques en production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Événement de démarrage
@app.on_event("startup")
async def startup_event():
    logger.info("Initialisation de l'API ML Platform")
    # Initialiser la connexion à la base de données
    await init_db()
    # Initialiser la connexion à MinIO
    init_minio()
    # Initialiser la connexion à Airflow
    init_airflow()
    logger.info("API ML Platform initialisée avec succès")

# Inclure les routeurs
app.include_router(models.router, prefix="/api/models", tags=["models"])
app.include_router(deployments.router, prefix="/api/deployments", tags=["deployments"])
app.include_router(executions.router, prefix="/api/executions", tags=["executions"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

# Route de base
@app.get("/", tags=["root"])
async def root():
    return {
        "message": "Bienvenue sur l'API de la plateforme centralisée de modèles ML",
        "version": "0.1.0",
        "status": "online",
    }

# Route de vérification de santé
@app.get("/health", tags=["health"])
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "minio": "connected",
            "airflow": "connected",
        }
    }
