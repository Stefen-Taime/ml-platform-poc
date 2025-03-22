import httpx
import logging
import os
from urllib.parse import urljoin
import json
import base64

logger = logging.getLogger(__name__)

# Variables d'environnement
AIRFLOW_ENDPOINT = os.getenv("AIRFLOW_ENDPOINT", "http://airflow-webserver:8080")
AIRFLOW_USERNAME = os.getenv("AIRFLOW_USERNAME", "airflow")
AIRFLOW_PASSWORD = os.getenv("AIRFLOW_PASSWORD", "airflow")

# Client Airflow
airflow_client = None
airflow_auth_header = None

def init_airflow():
    """Initialise la connexion au service Airflow."""
    global airflow_client, airflow_auth_header
    
    try:
        # Créer l'en-tête d'authentification Basic
        auth_string = f"{AIRFLOW_USERNAME}:{AIRFLOW_PASSWORD}"
        auth_bytes = auth_string.encode('ascii')
        base64_bytes = base64.b64encode(auth_bytes)
        base64_auth = base64_bytes.decode('ascii')
        
        airflow_auth_header = {"Authorization": f"Basic {base64_auth}"}
        
        # Initialiser le client HTTP
        airflow_client = httpx.AsyncClient(
            base_url=AIRFLOW_ENDPOINT,
            headers=airflow_auth_header,
            timeout=30.0
        )
        
        logger.info("Client Airflow initialisé avec succès")
        return True
    except Exception as e:
        logger.error(f"Erreur lors de l'initialisation du client Airflow: {e}")
        raise

async def get_airflow_client():
    """Retourne l'instance du client Airflow."""
    if airflow_client is None:
        raise Exception("Le client Airflow n'a pas été initialisé")
    return airflow_client

async def get_dags():
    """Récupère la liste des DAGs disponibles."""
    try:
        client = await get_airflow_client()
        response = await client.get("/api/v1/dags")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des DAGs: {e}")
        raise

async def get_dag(dag_id):
    """Récupère les informations d'un DAG spécifique."""
    try:
        client = await get_airflow_client()
        response = await client.get(f"/api/v1/dags/{dag_id}")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Erreur lors de la récupération du DAG {dag_id}: {e}")
        raise

async def trigger_dag(dag_id, conf=None):
    """Déclenche l'exécution d'un DAG."""
    try:
        client = await get_airflow_client()
        payload = {"conf": conf or {}}
        response = await client.post(f"/api/v1/dags/{dag_id}/dagRuns", json=payload)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Erreur lors du déclenchement du DAG {dag_id}: {e}")
        raise

async def get_dag_runs(dag_id):
    """Récupère les exécutions d'un DAG spécifique."""
    try:
        client = await get_airflow_client()
        response = await client.get(f"/api/v1/dags/{dag_id}/dagRuns")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des exécutions du DAG {dag_id}: {e}")
        raise

async def get_dag_run_status(dag_id, run_id):
    """Récupère le statut d'une exécution spécifique d'un DAG."""
    try:
        client = await get_airflow_client()
        response = await client.get(f"/api/v1/dags/{dag_id}/dagRuns/{run_id}")
        response.raise_for_status()
        return response.json()
    except Exception as e:
        logger.error(f"Erreur lors de la récupération du statut de l'exécution {run_id} du DAG {dag_id}: {e}")
        raise

async def create_dag_file(dag_id, dag_content):
    """Crée un fichier DAG dans le répertoire dags d'Airflow."""
    # Cette fonction est une simulation car l'API Airflow ne permet pas de créer des DAGs directement
    # En production, il faudrait utiliser un mécanisme comme Git ou un volume partagé
    logger.warning("La création de fichiers DAG via l'API n'est pas supportée par Airflow")
    logger.info(f"Simulation de création du DAG {dag_id}")
    return {"status": "simulated", "dag_id": dag_id}
