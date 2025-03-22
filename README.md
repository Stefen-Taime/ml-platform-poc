# Plateforme Centralisée de Modèles ML - POC

## Contexte et problématique

Ce POC (Proof of Concept) vise à résoudre un problème réel rencontré par une entreprise leader dans le domaine des produits de grande consommation. Cette entreprise possède près de 300 modèles d'apprentissage automatique répartis dans différentes fonctions telles que la R&D, le marketing, la chaîne d'approvisionnement, les ventes, les ressources humaines et la finance.

### Problèmes identifiés

- Modèles dispersés à travers différents départements et zones géographiques
- Travail en silos des scientifiques des données
- Duplication des efforts sur différents marchés
- Manque de partage des connaissances et des modèles entre les marchés
- Exécution locale des modèles limitant leur industrialisation

### Objectifs

- Créer un portail centralisé pour tous les modèles d'apprentissage automatique
- Assurer la visibilité et l'accessibilité des modèles à travers toutes les zones géographiques
- Permettre une industrialisation aisée des modèles sur tous les marchés
- Réduire le temps de mise à l'échelle des modèles ML
- Permettre aux équipes commerciales d'exécuter des modèles sans avoir à écrire du code

## Solution proposée

Notre POC propose une plateforme centralisée basée entièrement sur des technologies open source et utilisant Docker et Docker Compose pour le déploiement et l'orchestration des services.

### Remplacement des solutions cloud par des alternatives open source

| Solution Cloud | Alternative Open Source |
|----------------|-------------------------|
| Google BigQuery | PostgreSQL avec TimescaleDB |
| Google Firestore | MongoDB |
| Google Cloud Storage | MinIO |
| Airflow (GCP) | Apache Airflow (self-hosted) |
| Spark (GCP) | Apache Spark (self-hosted) |
| PowerBI | Grafana + Superset |
| Azure Active Directory | Keycloak |

### Architecture globale

La plateforme sera composée des éléments suivants :

1. **Interface utilisateur (UI)** : Application web permettant aux utilisateurs de configurer et d'exécuter des modèles ML
2. **Serveur d'application** : API REST pour gérer les requêtes et orchestrer l'exécution des modèles
3. **Système d'orchestration** : Apache Airflow pour planifier et exécuter les workflows
4. **Moteur d'exécution** : Apache Spark pour le traitement distribué des données
5. **Stockage de métadonnées** : MongoDB pour stocker les configurations et métadonnées des modèles
6. **Stockage de données** : PostgreSQL avec TimescaleDB pour les données structurées et séries temporelles
7. **Stockage d'objets** : MinIO pour stocker les modèles, datasets et résultats
8. **Visualisation** : Grafana et Apache Superset pour la création de tableaux de bord
9. **Authentification** : Keycloak pour la gestion des identités et l'authentification SSO

Tous ces composants seront déployés via Docker et orchestrés avec Docker Compose, offrant une solution complète et facilement déployable.
# ml-platform-poc
