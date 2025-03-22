
// Script d'initialisation pour MongoDB
// Ce script crée les collections nécessaires et ajoute des données initiales

// Création des collections
db.createCollection("models");
db.createCollection("deployments");
db.createCollection("executions");
db.createCollection("users");

// Création d'un utilisateur administrateur
db.users.insertOne({
  username: "admin",
  email: "admin@example.com",
  full_name: "Administrateur",
  department: "IT",
  region: "Global",
  role: "admin",
  hashed_password: "$2b$12$K3JNi5XYmJTKhMJbKyBNJeJDzxOvpgx7hkGMPeZ8tBDMLSQ7jfnge", // mot de passe: admin123
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
});

// Insertion de quelques modèles de démonstration
db.models.insertMany([
  {
    name: "Prévision des ventes",
    description: "Ce modèle utilise des séries temporelles pour prédire les ventes futures basées sur les données historiques et les facteurs saisonniers.",
    type: "forecasting",
    framework: "scikit-learn",
    version: "1.2.0",
    tags: ["ventes", "prévision", "série temporelle"],
    parameters: {
      features: ["date", "produit", "région", "prix", "promotion"],
      algorithm: "Prophet",
      hyperparameters: {
        seasonality_mode: "multiplicative",
        changepoint_prior_scale: 0.05
      }
    },
    metadata: {
      author: "Jean Dupont",
      team: "Data Science - Ventes"
    },
    owner_id: "user123",
    department: "Ventes",
    region: "Europe",
    brand: "Marque A",
    status: "deployed",
    file_path: "models/model1/model.pkl",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Segmentation clients",
    description: "Modèle de clustering pour segmenter les clients en fonction de leur comportement d'achat et de leurs caractéristiques démographiques.",
    type: "clustering",
    framework: "tensorflow",
    version: "2.0.1",
    tags: ["marketing", "segmentation", "clients"],
    parameters: {
      features: ["âge", "revenu", "fréquence_achat", "montant_moyen", "catégories_préférées"],
      algorithm: "K-Means",
      hyperparameters: {
        n_clusters: 5,
        random_state: 42
      }
    },
    metadata: {
      author: "Marie Martin",
      team: "Data Science - Marketing"
    },
    owner_id: "user456",
    department: "Marketing",
    region: "Amérique du Nord",
    brand: "Marque B",
    status: "ready",
    file_path: "models/model2/model.h5",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: "Détection de fraude",
    description: "Modèle de classification pour détecter les transactions frauduleuses en temps réel.",
    type: "classification",
    framework: "pytorch",
    version: "1.0.5",
    tags: ["finance", "fraude", "sécurité"],
    parameters: {
      features: ["montant", "localisation", "heure", "appareil", "historique"],
      algorithm: "Random Forest",
      hyperparameters: {
        n_estimators: 100,
        max_depth: 10,
        min_samples_split: 5
      }
    },
    metadata: {
      author: "Pierre Dubois",
      team: "Data Science - Finance"
    },
    owner_id: "user789",
    department: "Finance",
    region: "Global",
    brand: null,
    status: "deployed",
    file_path: "models/model3/model.pt",
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// Récupération des IDs des modèles
var salesModelId = db.models.findOne({name: "Prévision des ventes"})._id;
var segmentationModelId = db.models.findOne({name: "Segmentation clients"})._id;
var fraudModelId = db.models.findOne({name: "Détection de fraude"})._id;

// Insertion de quelques déploiements de démonstration
db.deployments.insertMany([
  {
    model_id: salesModelId,
    name: "Déploiement Europe - Prévision des ventes",
    description: "Déploiement du modèle de prévision des ventes pour l'Europe",
    parameters: {
      input_data_path: "data/ventes/europe/",
      output_data_path: "results/ventes/europe/",
      batch_size: 64
    },
    schedule: "0 8 * * 1",
    owner_id: "user123",
    status: "running",
    dag_id: "model_sales_forecast_europe",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    model_id: segmentationModelId,
    name: "Déploiement global - Segmentation clients",
    description: "Déploiement du modèle de segmentation clients pour toutes les régions",
    parameters: {
      input_data_path: "data/clients/global/",
      output_data_path: "results/clients/global/",
      batch_size: 128
    },
    schedule: "0 0 * * *",
    owner_id: "user456",
    status: "running",
    dag_id: "model_customer_segmentation_global",
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    model_id: fraudModelId,
    name: "Déploiement Finance - Détection de fraude",
    description: "Déploiement du modèle de détection de fraude pour le département Finance",
    parameters: {
      input_data_path: "data/transactions/",
      output_data_path: "results/fraude/",
      threshold: 0.85,
      real_time: true
    },
    schedule: null,
    owner_id: "user789",
    status: "running",
    dag_id: "model_fraud_detection_finance",
    created_at: new Date(),
    updated_at: new Date()
  }
]);

// Récupération des IDs des déploiements
var salesDeploymentId = db.deployments.findOne({name: "Déploiement Europe - Prévision des ventes"})._id;
var segmentationDeploymentId = db.deployments.findOne({name: "Déploiement global - Segmentation clients"})._id;
var fraudDeploymentId = db.deployments.findOne({name: "Déploiement Finance - Détection de fraude"})._id;

// Insertion de quelques exécutions de démonstration
db.executions.insertMany([
  {
    deployment_id: salesDeploymentId,
    model_id: salesModelId,
    parameters: {
      date_debut: "2025-01-01",
      date_fin: "2025-03-31"
    },
    owner_id: "user123",
    status: "success",
    start_time: new Date(new Date().getTime() - 7*24*60*60*1000),
    end_time: new Date(new Date().getTime() - 7*24*60*60*1000 + 10*60*1000),
    result_path: "results/ventes/europe/execution_20250315.csv",
    logs: ["Exécution démarrée", "Chargement des données", "Prédiction effectuée", "Résultats sauvegardés", "Exécution terminée avec succès"],
    created_at: new Date(new Date().getTime() - 7*24*60*60*1000)
  },
  {
    deployment_id: segmentationDeploymentId,
    model_id: segmentationModelId,
    parameters: {
      filter: "nouveaux_clients"
    },
    owner_id: "user456",
    status: "success",
    start_time: new Date(new Date().getTime() - 1*24*60*60*1000),
    end_time: new Date(new Date().getTime() - 1*24*60*60*1000 + 15*60*1000),
    result_path: "results/clients/global/segmentation_20250320.json",
    logs: ["Exécution démarrée", "Chargement des données clients", "Prétraitement", "Clustering effectué", "Résultats sauvegardés", "Exécution terminée avec succès"],
    created_at: new Date(new Date().getTime() - 1*24*60*60*1000)
  },
  {
    deployment_id: fraudDeploymentId,
    model_id: fraudModelId,
    parameters: {
      batch: "transactions_20250319"
    },
    owner_id: "user789",
    status: "failed",
    start_time: new Date(new Date().getTime() - 2*24*60*60*1000),
    end_time: new Date(new Date().getTime() - 2*24*60*60*1000 + 3*60*1000),
    result_path: null,
    logs: ["Exécution démarrée", "Chargement des données", "Erreur: Données incomplètes", "Exécution échouée"],
    created_at: new Date(new Date().getTime() - 2*24*60*60*1000)
  }
]);

print("Initialisation de MongoDB terminée avec succès");
EOF