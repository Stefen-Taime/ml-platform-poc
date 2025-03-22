from minio import Minio
import logging
import os

logger = logging.getLogger(__name__)

# Variables d'environnement
MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT", "minio:9000")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_SECURE = os.getenv("MINIO_SECURE", "false").lower() == "true"

# Client MinIO
minio_client = None

def init_minio():
    """Initialise la connexion au service MinIO."""
    global minio_client
    
    try:
        # Initialiser le client MinIO
        minio_client = Minio(
            endpoint=MINIO_ENDPOINT,
            access_key=MINIO_ACCESS_KEY,
            secret_key=MINIO_SECRET_KEY,
            secure=MINIO_SECURE
        )
        
        # Vérifier si les buckets nécessaires existent, sinon les créer
        create_buckets()
        
        logger.info("Connexion MinIO établie avec succès")
        return True
    except Exception as e:
        logger.error(f"Erreur lors de la connexion à MinIO: {e}")
        raise

def create_buckets():
    """Crée les buckets nécessaires s'ils n'existent pas."""
    buckets = ["models", "datasets", "results"]
    
    for bucket in buckets:
        if not minio_client.bucket_exists(bucket):
            minio_client.make_bucket(bucket)
            logger.info(f"Bucket '{bucket}' créé")

def get_minio_client():
    """Retourne l'instance du client MinIO."""
    if minio_client is None:
        raise Exception("Le client MinIO n'a pas été initialisé")
    return minio_client

def upload_file(bucket_name, object_name, file_path):
    """Télécharge un fichier vers MinIO."""
    try:
        client = get_minio_client()
        client.fput_object(bucket_name, object_name, file_path)
        return True
    except Exception as e:
        logger.error(f"Erreur lors du téléchargement du fichier vers MinIO: {e}")
        raise

def download_file(bucket_name, object_name, file_path):
    """Télécharge un fichier depuis MinIO."""
    try:
        client = get_minio_client()
        client.fget_object(bucket_name, object_name, file_path)
        return True
    except Exception as e:
        logger.error(f"Erreur lors du téléchargement du fichier depuis MinIO: {e}")
        raise

def get_presigned_url(bucket_name, object_name, expires=3600):
    """Génère une URL présignée pour accéder à un objet."""
    try:
        client = get_minio_client()
        url = client.presigned_get_object(bucket_name, object_name, expires=expires)
        return url
    except Exception as e:
        logger.error(f"Erreur lors de la génération de l'URL présignée: {e}")
        raise
