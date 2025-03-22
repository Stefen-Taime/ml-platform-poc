# Architecture détaillée de la plateforme centralisée de modèles ML

## Vue d'ensemble

L'architecture proposée est conçue pour remplacer les solutions cloud par des alternatives open source tout en maintenant les fonctionnalités essentielles requises pour centraliser et gérer les modèles d'apprentissage automatique à grande échelle.

## Composants principaux

### 1. Interface Utilisateur (Frontend)

**Technologies:**
- **Framework:** React.js
- **Bibliothèque UI:** Material-UI
- **Visualisation:** D3.js, Chart.js
- **Conteneurisation:** Docker

**Fonctionnalités:**
- Tableau de bord pour visualiser les modèles disponibles
- Interface de configuration des modèles par pays, marque, etc.
- Formulaires de téléchargement et de déploiement de nouveaux modèles
- Visualisation des résultats et métriques des modèles
- Gestion des utilisateurs et des permissions

**Conteneur Docker:**
```
ml-platform-ui:
  image: ml-platform-ui:latest
  build: ./frontend
  ports:
    - "3000:3000"
  environment:
    - API_URL=http://api:8000
  depends_on:
    - api
```

### 2. Serveur d'Application (Backend API)

**Technologies:**
- **Framework:** FastAPI (Python)
- **ORM:** SQLAlchemy
- **Validation:** Pydantic
- **Conteneurisation:** Docker

**Fonctionnalités:**
- API RESTful pour la gestion des modèles
- Endpoints pour le déploiement, l'exécution et la surveillance des modèles
- Intégration avec le système d'orchestration (Airflow)
- Gestion des métadonnées des modèles

**Conteneur Docker:**
```
api:
  image: ml-platform-api:latest
  build: ./backend
  ports:
    - "8000:8000"
  environment:
    - MONGODB_URI=mongodb://mongodb:27017
    - MINIO_ENDPOINT=minio:9000
    - AIRFLOW_ENDPOINT=http://airflow-webserver:8080
  depends_on:
    - mongodb
    - minio
    - airflow-webserver
```

### 3. Système d'Orchestration

**Technologies:**
- **Orchestrateur:** Apache Airflow
- **Conteneurisation:** Docker

**Fonctionnalités:**
- Planification et exécution des workflows de modèles ML
- Gestion des dépendances entre tâches
- Surveillance de l'exécution des modèles
- Intégration avec Spark pour le traitement distribué

**Conteneurs Docker:**
```
airflow-webserver:
  image: apache/airflow:2.5.0
  ports:
    - "8080:8080"
  environment:
    - AIRFLOW__CORE__EXECUTOR=LocalExecutor
    - AIRFLOW__CORE__SQL_ALCHEMY_CONN=postgresql://airflow:airflow@postgres-airflow:5432/airflow
  volumes:
    - ./dags:/opt/airflow/dags
    - ./plugins:/opt/airflow/plugins
  depends_on:
    - postgres-airflow

airflow-scheduler:
  image: apache/airflow:2.5.0
  command: scheduler
  environment:
    - AIRFLOW__CORE__EXECUTOR=LocalExecutor
    - AIRFLOW__CORE__SQL_ALCHEMY_CONN=postgresql://airflow:airflow@postgres-airflow:5432/airflow
  volumes:
    - ./dags:/opt/airflow/dags
    - ./plugins:/opt/airflow/plugins
  depends_on:
    - airflow-webserver
    - postgres-airflow
```

### 4. Moteur d'Exécution

**Technologies:**
- **Traitement distribué:** Apache Spark
- **Conteneurisation:** Docker

**Fonctionnalités:**
- Exécution distribuée des modèles ML
- Traitement de données à grande échelle
- Support pour différents langages (Python, R, Scala)

**Conteneurs Docker:**
```
spark-master:
  image: bitnami/spark:3.3.0
  environment:
    - SPARK_MODE=master
    - SPARK_RPC_AUTHENTICATION_ENABLED=no
    - SPARK_RPC_ENCRYPTION_ENABLED=no
    - SPARK_LOCAL_STORAGE_ENCRYPTION_ENABLED=no
    - SPARK_SSL_ENABLED=no
  ports:
    - "8181:8080"
    - "7077:7077"

spark-worker:
  image: bitnami/spark:3.3.0
  environment:
    - SPARK_MODE=worker
    - SPARK_MASTER_URL=spark://spark-master:7077
    - SPARK_WORKER_MEMORY=2G
    - SPARK_WORKER_CORES=2
    - SPARK_RPC_AUTHENTICATION_ENABLED=no
    - SPARK_RPC_ENCRYPTION_ENABLED=no
    - SPARK_LOCAL_STORAGE_ENCRYPTION_ENABLED=no
    - SPARK_SSL_ENABLED=no
  depends_on:
    - spark-master
```

### 5. Stockage de Métadonnées

**Technologies:**
- **Base de données NoSQL:** MongoDB
- **Conteneurisation:** Docker

**Fonctionnalités:**
- Stockage des métadonnées des modèles
- Gestion des configurations utilisateur
- Suivi des exécutions de modèles

**Conteneur Docker:**
```
mongodb:
  image: mongo:5.0
  ports:
    - "27017:27017"
  volumes:
    - mongodb_data:/data/db
```

### 6. Stockage de Données

**Technologies:**
- **Base de données SQL:** PostgreSQL avec TimescaleDB
- **Conteneurisation:** Docker

**Fonctionnalités:**
- Stockage des données structurées
- Gestion des séries temporelles
- Support pour les requêtes analytiques

**Conteneurs Docker:**
```
postgres:
  image: timescale/timescaledb:latest-pg14
  ports:
    - "5432:5432"
  environment:
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=postgres
    - POSTGRES_DB=mlplatform
  volumes:
    - postgres_data:/var/lib/postgresql/data

postgres-airflow:
  image: postgres:14
  environment:
    - POSTGRES_USER=airflow
    - POSTGRES_PASSWORD=airflow
    - POSTGRES_DB=airflow
  volumes:
    - postgres_airflow_data:/var/lib/postgresql/data
```

### 7. Stockage d'Objets

**Technologies:**
- **Stockage d'objets:** MinIO
- **Conteneurisation:** Docker

**Fonctionnalités:**
- Stockage des modèles ML
- Stockage des datasets d'entrée
- Stockage des résultats de modèles
- API compatible S3

**Conteneur Docker:**
```
minio:
  image: minio/minio:RELEASE.2023-01-25T00-19-54Z
  ports:
    - "9000:9000"
    - "9001:9001"
  environment:
    - MINIO_ROOT_USER=minioadmin
    - MINIO_ROOT_PASSWORD=minioadmin
  command: server /data --console-address ":9001"
  volumes:
    - minio_data:/data
```

### 8. Visualisation

**Technologies:**
- **Tableaux de bord:** Grafana
- **Analyse de données:** Apache Superset
- **Conteneurisation:** Docker

**Fonctionnalités:**
- Création de tableaux de bord interactifs
- Visualisation des résultats de modèles
- Analyse exploratoire des données

**Conteneurs Docker:**
```
grafana:
  image: grafana/grafana:9.3.2
  ports:
    - "3001:3000"
  environment:
    - GF_SECURITY_ADMIN_USER=admin
    - GF_SECURITY_ADMIN_PASSWORD=admin
  volumes:
    - grafana_data:/var/lib/grafana

superset:
  image: apache/superset:latest
  ports:
    - "8088:8088"
  environment:
    - SUPERSET_SECRET_KEY=superset_secret
  volumes:
    - superset_data:/app/superset_home
  depends_on:
    - postgres
```

### 9. Authentification et Gestion des Accès

**Technologies:**
- **IAM:** Keycloak
- **Conteneurisation:** Docker

**Fonctionnalités:**
- Authentification unique (SSO)
- Gestion des identités
- Contrôle d'accès basé sur les rôles (RBAC)
- Intégration avec des fournisseurs d'identité externes

**Conteneur Docker:**
```
keycloak:
  image: quay.io/keycloak/keycloak:20.0.2
  ports:
    - "8090:8080"
  environment:
    - KEYCLOAK_ADMIN=admin
    - KEYCLOAK_ADMIN_PASSWORD=admin
    - KC_DB=postgres
    - KC_DB_URL=jdbc:postgresql://postgres-keycloak:5432/keycloak
    - KC_DB_USERNAME=keycloak
    - KC_DB_PASSWORD=keycloak
  command: start-dev
  depends_on:
    - postgres-keycloak

postgres-keycloak:
  image: postgres:14
  environment:
    - POSTGRES_USER=keycloak
    - POSTGRES_PASSWORD=keycloak
    - POSTGRES_DB=keycloak
  volumes:
    - postgres_keycloak_data:/var/lib/postgresql/data
```

## Flux de données et interactions

1. **Soumission de modèle:**
   - L'utilisateur soumet un modèle ML via l'interface utilisateur
   - Le modèle est stocké dans MinIO
   - Les métadonnées du modèle sont enregistrées dans MongoDB

2. **Configuration et exécution:**
   - L'utilisateur configure les paramètres d'exécution via l'interface utilisateur
   - L'API backend crée un DAG Airflow pour l'exécution du modèle
   - Airflow orchestre l'exécution du modèle sur Spark

3. **Stockage et visualisation des résultats:**
   - Les résultats d'exécution sont stockés dans MinIO
   - Les métriques sont enregistrées dans PostgreSQL/TimescaleDB
   - Les résultats sont visualisés via Grafana ou Superset

4. **Partage et réutilisation:**
   - Les modèles et résultats peuvent être partagés entre utilisateurs selon leurs permissions
   - Les modèles peuvent être réutilisés sur différents marchés ou départements

## Avantages de cette architecture

1. **Entièrement open source:** Tous les composants sont des projets open source matures et activement maintenus
2. **Facilement déployable:** Utilisation de Docker et Docker Compose pour un déploiement simplifié
3. **Scalable:** Possibilité d'ajouter des workers Spark pour augmenter la capacité de traitement
4. **Flexible:** Support pour différents langages et frameworks de ML
5. **Sécurisée:** Authentification centralisée et gestion fine des permissions
6. **Indépendante du cloud:** Peut être déployée sur site ou sur n'importe quel fournisseur cloud
