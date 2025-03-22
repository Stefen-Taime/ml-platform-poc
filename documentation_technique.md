# Documentation Technique - Plateforme Centralisée de Modèles ML

## 1. Introduction

Cette documentation technique décrit la solution POC (Proof of Concept) développée pour centraliser les modèles d'apprentissage automatique d'une entreprise. La solution répond au besoin de consolider plus de 300 modèles ML dispersés dans différents départements et zones géographiques, en permettant leur visibilité, accessibilité et industrialisation à travers tous les marchés.

### 1.1 Contexte

L'entreprise cliente, leader dans le domaine des produits de grande consommation, possède près de 300 modèles d'apprentissage automatique répartis dans des fonctions telles que la R&D, le marketing, la chaîne d'approvisionnement, les ventes, les ressources humaines et la finance.

Ces modèles étaient dispersés et ne parvenaient pas à s'adapter aux différentes zones géographiques. Les scientifiques des données travaillaient en silos, développant et optimisant leurs propres modèles localement, ce qui entraînait une duplication des efforts sur les différents marchés.

### 1.2 Objectifs

La plateforme centralisée de modèles ML vise à :

- Centraliser tous les modèles ML de l'entreprise en un seul endroit
- Permettre une mise à l'échelle à travers les zones géographiques et les marques
- Faciliter le déploiement et l'exécution des modèles sans nécessiter de code
- Réduire le temps de mise à l'échelle des modèles
- Améliorer la collaboration entre les équipes

### 1.3 Approche

Contrairement à la solution originale basée sur des services cloud, cette POC utilise exclusivement des technologies open source et Docker/Docker Compose pour l'orchestration des services, offrant ainsi une solution plus flexible et indépendante des fournisseurs cloud.

## 2. Architecture Globale

### 2.1 Vue d'ensemble

L'architecture de la plateforme est composée de plusieurs couches :

1. **Interface Utilisateur** : Application web React pour la gestion des modèles
2. **Backend API** : API REST FastAPI pour orchestrer les opérations
3. **Orchestration** : Apache Airflow pour la planification et l'exécution des workflows
4. **Traitement** : Apache Spark pour l'exécution distribuée des modèles
5. **Stockage** : MongoDB pour les métadonnées, MinIO pour les fichiers, PostgreSQL/TimescaleDB pour les données structurées
6. **Visualisation** : Grafana et Apache Superset pour les tableaux de bord
7. **Authentification** : Keycloak pour la gestion des identités et l'authentification SSO

### 2.2 Diagramme d'architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Interface UI   │────▶│   Backend API   │────▶│     Keycloak    │
│    (React)      │◀────│    (FastAPI)    │◀────│      (SSO)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       
         │                       │                       
         ▼                       ▼                       
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     MongoDB     │     │      MinIO      │     │   PostgreSQL    │
│  (Métadonnées)  │     │   (Stockage)    │     │    (Données)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │                       
                                │                       
                                ▼                       
                        ┌─────────────────┐     ┌─────────────────┐
                        │     Airflow     │────▶│      Spark      │
                        │ (Orchestration) │     │  (Traitement)   │
                        └─────────────────┘     └─────────────────┘
                                │                       
                                │                       
                                ▼                       
                        ┌─────────────────┐     ┌─────────────────┐
                        │     Grafana     │     │     Superset    │
                        │ (Visualisation) │     │ (Visualisation) │
                        └─────────────────┘     └─────────────────┘
```

### 2.3 Composants principaux

| Composant | Technologie | Description |
|-----------|-------------|-------------|
| Interface Utilisateur | React, Material-UI | Application web pour la gestion des modèles |
| Backend API | FastAPI (Python) | API REST pour orchestrer les opérations |
| Orchestration | Apache Airflow | Planification et exécution des workflows |
| Traitement | Apache Spark | Exécution distribuée des modèles |
| Métadonnées | MongoDB | Stockage des métadonnées des modèles |
| Données | PostgreSQL/TimescaleDB | Stockage des données structurées |
| Stockage d'objets | MinIO | Stockage des modèles et résultats |
| Visualisation | Grafana, Apache Superset | Tableaux de bord et rapports |
| Authentification | Keycloak | Gestion des identités et SSO |

## 3. Composants Techniques

### 3.1 Interface Utilisateur (Frontend)

L'interface utilisateur est développée avec React et Material-UI, offrant une expérience moderne et responsive.

#### 3.1.1 Fonctionnalités principales

- Tableau de bord avec métriques et visualisations
- Gestion des modèles (liste, détail, création, modification)
- Gestion des déploiements (configuration, planification)
- Suivi des exécutions (statut, logs, résultats)
- Gestion des utilisateurs et des rôles

#### 3.1.2 Structure des répertoires

```
frontend/
├── public/              # Fichiers statiques
├── src/
│   ├── components/      # Composants réutilisables
│   ├── contexts/        # Contextes React (auth, etc.)
│   ├── layouts/         # Layouts de l'application
│   ├── pages/           # Pages de l'application
│   │   ├── models/      # Pages liées aux modèles
│   │   ├── deployments/ # Pages liées aux déploiements
│   │   ├── executions/  # Pages liées aux exécutions
│   │   └── users/       # Pages liées aux utilisateurs
│   ├── services/        # Services d'API
│   ├── App.js           # Composant principal
│   └── index.js         # Point d'entrée
└── Dockerfile           # Configuration Docker
```

### 3.2 Backend API

Le backend est développé avec FastAPI (Python), offrant une API REST performante et bien documentée.

#### 3.2.1 Endpoints principaux

- `/api/models` : Gestion des modèles ML
- `/api/deployments` : Gestion des déploiements
- `/api/executions` : Gestion des exécutions
- `/api/users` : Gestion des utilisateurs

#### 3.2.2 Structure des répertoires

```
backend/
├── app/
│   ├── api/             # Endpoints API
│   │   ├── models.py    # API pour les modèles
│   │   ├── deployments.py # API pour les déploiements
│   │   ├── executions.py # API pour les exécutions
│   │   └── users.py     # API pour les utilisateurs
│   ├── models/          # Modèles de données
│   │   └── schemas.py   # Schémas Pydantic
│   ├── services/        # Services d'intégration
│   │   ├── database.py  # Service MongoDB
│   │   ├── minio_client.py # Service MinIO
│   │   └── airflow_client.py # Service Airflow
│   └── main.py          # Point d'entrée de l'application
├── requirements.txt     # Dépendances Python
└── Dockerfile           # Configuration Docker
```

### 3.3 Stockage de Données

#### 3.3.1 MongoDB (Métadonnées)

MongoDB est utilisé pour stocker les métadonnées des modèles, déploiements, exécutions et utilisateurs.

**Collections principales :**
- `models` : Métadonnées des modèles ML
- `deployments` : Configurations de déploiement
- `executions` : Historique des exécutions
- `users` : Informations utilisateurs

#### 3.3.2 MinIO (Stockage d'objets)

MinIO est utilisé pour stocker les fichiers des modèles, les datasets et les résultats d'exécution.

**Buckets principaux :**
- `models` : Fichiers des modèles ML
- `datasets` : Jeux de données d'entrée
- `results` : Résultats des exécutions

#### 3.3.3 PostgreSQL/TimescaleDB (Données structurées)

PostgreSQL avec l'extension TimescaleDB est utilisé pour stocker les données structurées et les séries temporelles.

**Tables principales :**
- `metrics` : Métriques de performance des modèles
- `timeseries_data` : Données de séries temporelles

### 3.4 Orchestration et Traitement

#### 3.4.1 Apache Airflow

Airflow est utilisé pour orchestrer l'exécution des modèles ML selon des planifications définies.

**Fonctionnalités :**
- Création dynamique de DAGs pour les déploiements
- Planification des exécutions (cron)
- Suivi de l'état des exécutions
- Gestion des dépendances entre tâches

#### 3.4.2 Apache Spark

Spark est utilisé pour le traitement distribué des données et l'exécution des modèles ML à grande échelle.

**Fonctionnalités :**
- Exécution distribuée des modèles
- Traitement de données à grande échelle
- Support pour différents langages (Python, R, Scala)

### 3.5 Authentification et Sécurité

#### 3.5.1 Keycloak

Keycloak est utilisé pour la gestion des identités, l'authentification SSO et le contrôle d'accès.

**Fonctionnalités :**
- Authentification unique (SSO)
- Gestion des rôles et permissions
- Intégration avec le frontend et le backend

**Rôles définis :**
- `admin` : Accès complet à toutes les fonctionnalités
- `data_scientist` : Création et gestion des modèles
- `business_user` : Exécution des modèles et visualisation des résultats
- `viewer` : Visualisation des modèles et résultats en lecture seule

## 4. Déploiement

### 4.1 Prérequis

- Docker Engine 20.10+
- Docker Compose 2.0+
- 8 GB RAM minimum
- 20 GB espace disque minimum

### 4.2 Structure des fichiers

```
ml-platform-poc/
├── backend/             # Code source du backend
├── frontend/            # Code source du frontend
├── docker/              # Scripts d'initialisation
│   ├── mongodb-init.sh  # Initialisation MongoDB
│   ├── minio-init.sh    # Initialisation MinIO
│   └── keycloak-init.sh # Initialisation Keycloak
├── airflow/             # Configuration Airflow
│   └── dags/            # DAGs Airflow
├── grafana/             # Configuration Grafana
│   └── provisioning/    # Dashboards et sources de données
├── docker-compose.yml   # Configuration Docker Compose
└── README.md            # Documentation générale
```

### 4.3 Instructions de déploiement

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/example/ml-platform-poc.git
   cd ml-platform-poc
   ```

2. Démarrer les services :
   ```bash
   docker-compose up -d
   ```

3. Vérifier que tous les services sont opérationnels :
   ```bash
   docker-compose ps
   ```

4. Accéder aux interfaces :
   - Interface utilisateur : http://localhost:3000
   - API Backend : http://localhost:8000
   - Keycloak : http://localhost:8090
   - MinIO Console : http://localhost:9001
   - Airflow : http://localhost:8080
   - Grafana : http://localhost:3001
   - Superset : http://localhost:8088

### 4.4 Configuration initiale

Les scripts d'initialisation configurent automatiquement :

- Les collections MongoDB avec des données de démonstration
- Les buckets MinIO avec des fichiers de démonstration
- Le royaume Keycloak avec des utilisateurs et rôles

**Utilisateurs de démonstration :**
- Admin : `admin` / `admin123`
- Data Scientist : `datascientist` / `password123`
- Business User : `business` / `password123`
- Viewer : `viewer` / `password123`

## 5. Flux de travail typiques

### 5.1 Ajout d'un nouveau modèle

1. Se connecter à l'interface utilisateur
2. Naviguer vers "Modèles" > "Ajouter un modèle"
3. Remplir les informations du modèle (nom, description, type, etc.)
4. Télécharger le fichier du modèle
5. Soumettre le formulaire

### 5.2 Déploiement d'un modèle

1. Naviguer vers la page de détail du modèle
2. Cliquer sur "Déployer"
3. Configurer les paramètres de déploiement
4. Définir la planification (cron) si nécessaire
5. Soumettre le déploiement

### 5.3 Exécution d'un modèle

1. Naviguer vers la page de détail du déploiement
2. Cliquer sur "Exécuter"
3. Configurer les paramètres d'exécution
4. Lancer l'exécution
5. Suivre l'état de l'exécution et consulter les résultats

## 6. Extensibilité et personnalisation

### 6.1 Ajout de nouveaux types de modèles

Pour ajouter un nouveau type de modèle :

1. Mettre à jour le schéma dans `backend/app/models/schemas.py`
2. Ajouter le type dans l'interface utilisateur (`frontend/src/pages/models/ModelCreate.js`)
3. Créer un DAG Airflow adapté au nouveau type

### 6.2 Intégration avec d'autres systèmes

La plateforme peut être étendue pour s'intégrer avec :

- Systèmes de gestion de données existants
- Outils de BI supplémentaires
- Systèmes de notification (email, Slack, etc.)
- Pipelines CI/CD

## 7. Limitations et améliorations futures

### 7.1 Limitations actuelles

- Pas de scaling automatique des workers Spark
- Authentification simplifiée pour les services internes
- Pas de chiffrement des données au repos
- Pas de mécanisme de sauvegarde automatique

### 7.2 Améliorations futures

- Implémentation d'un système de versionnement des modèles
- Ajout de fonctionnalités de monitoring avancées
- Intégration avec des outils MLOps (MLflow, etc.)
- Support pour le déploiement en production avec Kubernetes
- Implémentation de tests automatisés pour les modèles

## 8. Conclusion

Cette POC démontre la faisabilité d'une plateforme centralisée de modèles ML basée entièrement sur des technologies open source et Docker. Elle répond aux besoins de centralisation, de visibilité et d'industrialisation des modèles ML à travers différents départements et zones géographiques.

La solution est flexible, extensible et peut être déployée sur site ou dans n'importe quel environnement cloud, offrant ainsi une indépendance vis-à-vis des fournisseurs cloud.
