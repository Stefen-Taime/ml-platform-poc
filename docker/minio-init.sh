#!/bin/bash

# Script d'initialisation pour MinIO
# Ce script crée les buckets nécessaires et ajoute des fichiers de démonstration

echo "Initialisation de MinIO..."

# Attendre que MinIO soit prêt
echo "Attente de la disponibilité de MinIO..."
until curl -s http://minio:9000/minio/health/ready
do
  echo "MinIO n'est pas encore prêt - attente..."
  sleep 2
done

# Configuration du client MinIO
mc alias set myminio http://minio:9000 minioadmin minioadmin

# Créer les buckets
echo "Création des buckets..."
mc mb myminio/models
mc mb myminio/datasets
mc mb myminio/results

# Définir les politiques d'accès
echo "Configuration des politiques d'accès..."
mc policy set download myminio/models
mc policy set download myminio/datasets
mc policy set download myminio/results

# Créer des répertoires pour les modèles de démonstration
mkdir -p /tmp/minio-init/models/model1
mkdir -p /tmp/minio-init/models/model2
mkdir -p /tmp/minio-init/models/model3
mkdir -p /tmp/minio-init/datasets/ventes
mkdir -p /tmp/minio-init/datasets/clients
mkdir -p /tmp/minio-init/datasets/transactions
mkdir -p /tmp/minio-init/results/ventes/europe
mkdir -p /tmp/minio-init/results/clients/global
mkdir -p /tmp/minio-init/results/fraude

# Créer des fichiers de démonstration pour les modèles
echo "Création de fichiers de démonstration..."

# Modèle 1: Prévision des ventes
cat > /tmp/minio-init/models/model1/model.pkl << EOF
# Ceci est un fichier de démonstration simulant un modèle pickle
# Dans un environnement réel, ce serait un véritable modèle sérialisé
EOF

cat > /tmp/minio-init/models/model1/metadata.json << EOF
{
  "name": "Prévision des ventes",
  "version": "1.2.0",
  "framework": "scikit-learn",
  "created_at": "2025-01-15T10:30:00Z",
  "metrics": {
    "mape": 8.5,
    "rmse": 245.3,
    "r2": 0.87
  }
}
EOF

# Modèle 2: Segmentation clients
cat > /tmp/minio-init/models/model2/model.h5 << EOF
# Ceci est un fichier de démonstration simulant un modèle TensorFlow
# Dans un environnement réel, ce serait un véritable modèle sérialisé
EOF

cat > /tmp/minio-init/models/model2/metadata.json << EOF
{
  "name": "Segmentation clients",
  "version": "2.0.1",
  "framework": "tensorflow",
  "created_at": "2025-02-20T14:45:00Z",
  "metrics": {
    "silhouette_score": 0.72,
    "davies_bouldin_index": 0.85,
    "calinski_harabasz_index": 120.5
  }
}
EOF

# Modèle 3: Détection de fraude
cat > /tmp/minio-init/models/model3/model.pt << EOF
# Ceci est un fichier de démonstration simulant un modèle PyTorch
# Dans un environnement réel, ce serait un véritable modèle sérialisé
EOF

cat > /tmp/minio-init/models/model3/metadata.json << EOF
{
  "name": "Détection de fraude",
  "version": "1.0.5",
  "framework": "pytorch",
  "created_at": "2025-01-05T09:15:00Z",
  "metrics": {
    "accuracy": 0.95,
    "precision": 0.92,
    "recall": 0.89,
    "f1_score": 0.91,
    "auc": 0.97
  }
}
EOF

# Datasets de démonstration
cat > /tmp/minio-init/datasets/ventes/ventes_europe_2024.csv << EOF
date,produit,region,prix,promotion,ventes
2024-01-01,Produit A,Europe Nord,100,0,150
2024-01-02,Produit A,Europe Nord,100,0,145
2024-01-03,Produit A,Europe Nord,100,0,160
2024-01-01,Produit B,Europe Sud,80,1,200
2024-01-02,Produit B,Europe Sud,80,1,210
2024-01-03,Produit B,Europe Sud,80,0,180
EOF

cat > /tmp/minio-init/datasets/clients/clients_global.csv << EOF
id,age,revenu,frequence_achat,montant_moyen,categories_preferees
1,35,75000,12,120,Électronique
2,42,95000,8,250,Maison
3,28,45000,20,80,Mode
4,55,120000,4,500,Luxe
5,31,60000,15,110,Sport
EOF

cat > /tmp/minio-init/datasets/transactions/transactions_20250319.csv << EOF
id,date,montant,localisation,appareil,client_id
1001,2025-03-19T08:15:00Z,125.50,Paris,mobile,12345
1002,2025-03-19T09:30:00Z,75.20,Londres,desktop,67890
1003,2025-03-19T10:45:00Z,1500.00,New York,mobile,23456
1004,2025-03-19T11:00:00Z,50.75,Berlin,tablet,78901
1005,2025-03-19T12:30:00Z,300.25,Tokyo,desktop,34567
EOF

# Résultats de démonstration
cat > /tmp/minio-init/results/ventes/europe/execution_20250315.csv << EOF
date,produit,region,ventes_prevues,intervalle_confiance_bas,intervalle_confiance_haut
2025-04-01,Produit A,Europe Nord,165,155,175
2025-04-02,Produit A,Europe Nord,170,160,180
2025-04-03,Produit A,Europe Nord,175,165,185
2025-04-01,Produit B,Europe Sud,195,185,205
2025-04-02,Produit B,Europe Sud,200,190,210
2025-04-03,Produit B,Europe Sud,190,180,200
EOF

cat > /tmp/minio-init/results/clients/global/segmentation_20250320.json << EOF
{
  "clusters": [
    {
      "id": 0,
      "name": "Premium",
      "size": 120,
      "centroid": {
        "age": 45,
        "revenu": 110000,
        "frequence_achat": 5,
        "montant_moyen": 450
      },
      "categories_preferees": ["Luxe", "Voyage"]
    },
    {
      "id": 1,
      "name": "Standard",
      "size": 350,
      "centroid": {
        "age": 35,
        "revenu": 70000,
        "frequence_achat": 12,
        "montant_moyen": 150
      },
      "categories_preferees": ["Électronique", "Maison"]
    },
    {
      "id": 2,
      "name": "Économique",
      "size": 280,
      "centroid": {
        "age": 28,
        "revenu": 45000,
        "frequence_achat": 18,
        "montant_moyen": 80
      },
      "categories_preferees": ["Mode", "Alimentation"]
    }
  ]
}
EOF

cat > /tmp/minio-init/results/fraude/detection_20250318.json << EOF
{
  "transactions_analysees": 10000,
  "transactions_suspectes": 42,
  "taux_fraude": 0.42,
  "alertes": [
    {
      "transaction_id": 8765,
      "score": 0.95,
      "raison": "Montant inhabituel et localisation suspecte"
    },
    {
      "transaction_id": 9123,
      "score": 0.88,
      "raison": "Appareil non reconnu et heure inhabituelle"
    }
  ]
}
EOF

# Télécharger les fichiers vers MinIO
echo "Téléchargement des fichiers vers MinIO..."
mc cp --recursive /tmp/minio-init/models/ myminio/models/
mc cp --recursive /tmp/minio-init/datasets/ myminio/datasets/
mc cp --recursive /tmp/minio-init/results/ myminio/results/

# Nettoyage
rm -rf /tmp/minio-init

echo "Configuration de MinIO terminée!"
