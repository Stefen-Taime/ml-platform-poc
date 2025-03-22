#!/bin/bash

# Script d'initialisation pour Keycloak
# Ce script configure le royaume, les clients, les rôles et les utilisateurs

echo "Initialisation de Keycloak..."

# Attendre que Keycloak soit prêt
echo "Attente de la disponibilité de Keycloak..."
until curl -s http://keycloak:8080/health/ready
do
  echo "Keycloak n'est pas encore prêt - attente..."
  sleep 5
done

# Configuration des variables
KEYCLOAK_URL="http://keycloak:8080"
ADMIN_USER="admin"
ADMIN_PASSWORD="admin"
REALM_NAME="ml-platform"
FRONTEND_CLIENT_ID="ml-platform-frontend"
BACKEND_CLIENT_ID="ml-platform-backend"

# Obtenir un token d'accès admin
echo "Obtention du token d'accès admin..."
ADMIN_TOKEN=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${ADMIN_USER}" \
  -d "password=${ADMIN_PASSWORD}" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

if [ -z "$ADMIN_TOKEN" ] || [ "$ADMIN_TOKEN" == "null" ]; then
  echo "Erreur: Impossible d'obtenir le token d'accès admin"
  exit 1
fi

# Créer le royaume
echo "Création du royaume ${REALM_NAME}..."
curl -s -X POST "${KEYCLOAK_URL}/admin/realms" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "realm": "'"${REALM_NAME}"'",
    "enabled": true,
    "displayName": "Plateforme ML",
    "displayNameHtml": "<div class=\"kc-logo-text\"><span>Plateforme ML</span></div>",
    "sslRequired": "external",
    "registrationAllowed": false,
    "loginWithEmailAllowed": true,
    "duplicateEmailsAllowed": false,
    "resetPasswordAllowed": true,
    "editUsernameAllowed": false,
    "bruteForceProtected": true
  }'

# Créer le client frontend
echo "Création du client frontend ${FRONTEND_CLIENT_ID}..."
curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "'"${FRONTEND_CLIENT_ID}"'",
    "name": "ML Platform Frontend",
    "description": "Client pour l'\''interface utilisateur de la plateforme ML",
    "enabled": true,
    "publicClient": true,
    "redirectUris": ["http://localhost:3000/*"],
    "webOrigins": ["http://localhost:3000"],
    "standardFlowEnabled": true,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": false,
    "authorizationServicesEnabled": false,
    "fullScopeAllowed": true
  }'

# Créer le client backend
echo "Création du client backend ${BACKEND_CLIENT_ID}..."
BACKEND_CLIENT_RESPONSE=$(curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "'"${BACKEND_CLIENT_ID}"'",
    "name": "ML Platform Backend",
    "description": "Client pour l'\''API backend de la plateforme ML",
    "enabled": true,
    "publicClient": false,
    "bearerOnly": false,
    "standardFlowEnabled": false,
    "implicitFlowEnabled": false,
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": true,
    "authorizationServicesEnabled": true,
    "redirectUris": ["http://localhost:8000/*"],
    "webOrigins": ["http://localhost:8000"],
    "fullScopeAllowed": true
  }' -v)

# Récupérer l'ID du client backend
BACKEND_CLIENT_UUID=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" | jq -r '.[] | select(.clientId=="'"${BACKEND_CLIENT_ID}"'") | .id')

# Récupérer le secret du client backend
BACKEND_CLIENT_SECRET=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients/${BACKEND_CLIENT_UUID}/client-secret" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" | jq -r '.value')

echo "Secret du client backend: ${BACKEND_CLIENT_SECRET}"

# Créer les rôles du royaume
echo "Création des rôles..."
for ROLE in "admin" "data_scientist" "business_user" "viewer"; do
  curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/roles" \
    -H "Authorization: Bearer ${ADMIN_TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "'"${ROLE}"'",
      "description": "Rôle '"${ROLE}"' pour la plateforme ML"
    }'
done

# Créer des utilisateurs de démonstration
echo "Création des utilisateurs de démonstration..."

# Utilisateur admin
curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "enabled": true,
    "emailVerified": true,
    "credentials": [
      {
        "type": "password",
        "value": "admin123",
        "temporary": false
      }
    ],
    "attributes": {
      "department": ["IT"],
      "region": ["Global"]
    }
  }'

# Attribuer le rôle admin à l'utilisateur admin
ADMIN_ROLE_ID=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/roles/admin" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" | jq -r '.id')

ADMIN_USER_ID=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users?username=admin" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" | jq -r '.[0].id')

curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users/${ADMIN_USER_ID}/role-mappings/realm" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "id": "'"${ADMIN_ROLE_ID}"'",
      "name": "admin"
    }
  ]'

# Utilisateur data scientist
curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "datascientist",
    "email": "datascientist@example.com",
    "firstName": "Data",
    "lastName": "Scientist",
    "enabled": true,
    "emailVerified": true,
    "credentials": [
      {
        "type": "password",
        "value": "password123",
        "temporary": false
      }
    ],
    "attributes": {
      "department": ["Data Science"],
      "region": ["Europe"]
    }
  }'

# Attribuer le rôle data_scientist à l'utilisateur datascientist
DS_ROLE_ID=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/roles/data_scientist" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" | jq -r '.id')

DS_USER_ID=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users?username=datascientist" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" | jq -r '.[0].id')

curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users/${DS_USER_ID}/role-mappings/realm" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "id": "'"${DS_ROLE_ID}"'",
      "name": "data_scientist"
    }
  ]'

# Utilisateur business
curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "business",
    "email": "business@example.com",
    "firstName": "Business",
    "lastName": "User",
    "enabled": true,
    "emailVerified": true,
    "credentials": [
      {
        "type": "password",
        "value": "password123",
        "temporary": false
      }
    ],
    "attributes": {
      "department": ["Marketing"],
      "region": ["Amérique du Nord"]
    }
  }'

# Attribuer le rôle business_user à l'utilisateur business
BU_ROLE_ID=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/roles/business_user" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" | jq -r '.id')

BU_USER_ID=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users?username=business" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" | jq -r '.[0].id')

curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users/${BU_USER_ID}/role-mappings/realm" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "id": "'"${BU_ROLE_ID}"'",
      "name": "business_user"
    }
  ]'

# Utilisateur viewer
curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "viewer",
    "email": "viewer@example.com",
    "firstName": "Viewer",
    "lastName": "User",
    "enabled": true,
    "emailVerified": true,
    "credentials": [
      {
        "type": "password",
        "value": "password123",
        "temporary": false
      }
    ],
    "attributes": {
      "department": ["Finance"],
      "region": ["Global"]
    }
  }'

# Attribuer le rôle viewer à l'utilisateur viewer
VIEWER_ROLE_ID=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/roles/viewer" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" | jq -r '.id')

VIEWER_USER_ID=$(curl -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users?username=viewer" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" | jq -r '.[0].id')

curl -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users/${VIEWER_USER_ID}/role-mappings/realm" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "id": "'"${VIEWER_ROLE_ID}"'",
      "name": "viewer"
    }
  ]'

echo "Configuration de Keycloak terminée!"
echo "Informations de connexion:"
echo "URL: ${KEYCLOAK_URL}/realms/${REALM_NAME}"
echo "Client frontend: ${FRONTEND_CLIENT_ID}"
echo "Client backend: ${BACKEND_CLIENT_ID}"
echo "Secret du client backend: ${BACKEND_CLIENT_SECRET}"
echo "Utilisateurs: admin/admin123, datascientist/password123, business/password123, viewer/password123"
