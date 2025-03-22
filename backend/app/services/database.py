from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
import logging
import os

logger = logging.getLogger(__name__)

# Variables d'environnement
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://mongodb:27017/ml-platform")

# Clients MongoDB
mongo_client = None
motor_client = None
db = None

async def init_db():
    """Initialise la connexion à la base de données MongoDB."""
    global mongo_client, motor_client, db
    
    try:
        # Initialiser le client synchrone
        mongo_client = MongoClient(MONGODB_URI)
        # Vérifier la connexion
        mongo_client.admin.command('ping')
        logger.info("Connexion MongoDB (synchrone) établie avec succès")
        
        # Initialiser le client asynchrone
        motor_client = AsyncIOMotorClient(MONGODB_URI)
        db = motor_client.get_database()
        logger.info("Connexion MongoDB (asynchrone) établie avec succès")
        
        # Créer les collections si elles n'existent pas
        await create_collections()
        
        return True
    except Exception as e:
        logger.error(f"Erreur lors de la connexion à MongoDB: {e}")
        raise

async def create_collections():
    """Crée les collections nécessaires si elles n'existent pas."""
    collections = await db.list_collection_names()
    
    # Collection pour les modèles
    if "models" not in collections:
        await db.create_collection("models")
        logger.info("Collection 'models' créée")
    
    # Collection pour les déploiements
    if "deployments" not in collections:
        await db.create_collection("deployments")
        logger.info("Collection 'deployments' créée")
    
    # Collection pour les exécutions
    if "executions" not in collections:
        await db.create_collection("executions")
        logger.info("Collection 'executions' créée")
    
    # Collection pour les utilisateurs
    if "users" not in collections:
        await db.create_collection("users")
        logger.info("Collection 'users' créée")

def get_db():
    """Retourne l'instance de la base de données."""
    if db is None:
        raise Exception("La base de données n'a pas été initialisée")
    return db
