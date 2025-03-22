#!/bin/bash
# Script pour vérifier l'état des services MongoDB et Airflow

# Vérifier MongoDB
echo "Vérification de MongoDB..."
if docker exec ml-platform-poc_mongodb_1 mongosh --eval "db.runCommand('ping').ok" --quiet; then
  echo "✅ MongoDB fonctionne correctement"
else
  echo "❌ MongoDB ne répond pas"
fi

# Vérifier Airflow Webserver
echo "Vérification d'Airflow Webserver..."
if curl -s http://localhost:8081/health | grep -q "healthy"; then
  echo "✅ Airflow Webserver fonctionne correctement"
else
  echo "❌ Airflow Webserver ne répond pas"
fi

# Vérifier les logs d'Airflow pour les erreurs de permission
echo "Vérification des permissions des répertoires Airflow..."
if docker exec ml-platform-poc_airflow-webserver_1 ls -la /opt/airflow/logs | grep -q "drwxrwxrwx"; then
  echo "✅ Les permissions des répertoires Airflow sont correctes"
else
  echo "❌ Problème de permissions sur les répertoires Airflow"
fi

# Vérifier Keycloak
echo "Vérification de Keycloak..."
if curl -s http://localhost:8080/health/ready | grep -q "UP"; then
  echo "✅ Keycloak fonctionne correctement"
else
  echo "❌ Keycloak ne répond pas"
fi

echo "Vérification terminée"
