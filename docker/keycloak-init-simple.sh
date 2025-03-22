#!/bin/sh

echo "Initialisation de Keycloak..."

# Configuration des variables
KEYCLOAK_URL="http://keycloak:8080"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin"
REALM_NAME="ml-platform"

# Attendre que Keycloak soit disponible
echo "Attente de la disponibilité de Keycloak..."
until curl -s http://keycloak:8080/ > /dev/null
do
  echo "Keycloak n'est pas encore prêt - attente..."
  sleep 5
done

# Obtenir un token d'accès admin
echo "Obtention du token d'accès admin..."
RESPONSE=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${ADMIN_USER}" \
  -d "password=${ADMIN_PASSWORD}" \
  -d "grant_type=password" \
  -d "client_id=admin-cli")

# Extraire le token manuellement
ADMIN_TOKEN=$(echo $RESPONSE | grep -o '"access_token":"[^"]*"' | sed 's/"access_token":"\(.*\)"/\1/')

if [ -z "$ADMIN_TOKEN" ]; then
  echo "Erreur: Impossible d'obtenir le token d'accès admin"
  echo "Réponse: $RESPONSE"
  exit 1
fi

echo "Token obtenu avec succès!"

# Créer le royaume
echo "Création du royaume ${REALM_NAME}..."
curl -s -X POST "${KEYCLOAK_URL}/admin/realms" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "realm": "ml-platform",
    "enabled": true,
    "displayName": "Plateforme ML"
  }'

# Créer un client public pour le frontend
echo "Création du client frontend..."
curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "ml-platform-frontend",
    "publicClient": true,
    "redirectUris": ["http://localhost:3000/*"],
    "webOrigins": ["http://localhost:3000"],
    "enabled": true
  }'

# Créer des rôles de base
echo "Création des rôles..."
for ROLE in "admin" "data_scientist" "business_user" "viewer"; do
  curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/roles" \
    -H "Authorization: Bearer ${ADMIN_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"name\": \"${ROLE}\"}"
done

# Créer un utilisateur admin
echo "Création d'un utilisateur admin..."
curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "enabled": true,
    "credentials": [
      {
        "type": "password",
        "value": "admin123",
        "temporary": false
      }
    ]
  }'

echo "Configuration de Keycloak terminée avec succès!"
