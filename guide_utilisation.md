# Guide d'Utilisation - Plateforme Centralisée de Modèles ML

## 1. Introduction

Bienvenue dans le guide d'utilisation de la Plateforme Centralisée de Modèles ML. Cette plateforme vous permet de gérer, déployer et exécuter des modèles d'apprentissage automatique de manière centralisée à travers différents départements et zones géographiques.

Ce guide est destiné aux utilisateurs finaux de la plateforme et couvre toutes les fonctionnalités principales.

## 2. Accès à la plateforme

### 2.1 Connexion

1. Ouvrez votre navigateur et accédez à l'URL de la plateforme : `http://localhost:3000`
2. Vous serez redirigé vers la page de connexion Keycloak
3. Entrez vos identifiants :
   - Nom d'utilisateur
   - Mot de passe
4. Cliquez sur "Se connecter"

**Utilisateurs de démonstration :**
- Admin : `admin` / `admin123`
- Data Scientist : `datascientist` / `password123`
- Business User : `business` / `password123`
- Viewer : `viewer` / `password123`

### 2.2 Rôles et permissions

La plateforme définit quatre rôles principaux avec différents niveaux d'accès :

| Rôle | Permissions |
|------|-------------|
| Admin | Accès complet à toutes les fonctionnalités |
| Data Scientist | Création et gestion des modèles, déploiements et exécutions |
| Business User | Exécution des modèles et visualisation des résultats |
| Viewer | Visualisation des modèles et résultats en lecture seule |

## 3. Interface utilisateur

### 3.1 Navigation principale

L'interface utilisateur est organisée en plusieurs sections accessibles via le menu latéral :

- **Tableau de bord** : Vue d'ensemble avec statistiques et graphiques
- **Modèles** : Gestion des modèles d'apprentissage automatique
- **Déploiements** : Configuration et planification des déploiements
- **Exécutions** : Suivi des exécutions de modèles
- **Utilisateurs** : Gestion des utilisateurs (Admin uniquement)
- **Rapports** : Visualisation des rapports et tableaux de bord
- **Intégrations** : Configuration des intégrations externes

### 3.2 Tableau de bord

Le tableau de bord présente une vue d'ensemble de la plateforme avec :

- Statistiques sur le nombre de modèles, déploiements et exécutions
- Répartition des modèles par type
- Répartition des modèles par département
- Activité récente

## 4. Gestion des modèles

### 4.1 Liste des modèles

La page "Modèles" affiche la liste de tous les modèles disponibles avec des options de filtrage :

1. Utilisez la barre de recherche pour trouver des modèles par nom ou description
2. Filtrez par département, région ou statut à l'aide des menus déroulants
3. Cliquez sur un modèle pour accéder à sa page de détail
4. Utilisez les icônes d'action pour des opérations rapides (voir, modifier, supprimer)

### 4.2 Création d'un modèle

Pour créer un nouveau modèle :

1. Cliquez sur le bouton "Ajouter un modèle" en haut à droite de la page "Modèles"
2. Remplissez le formulaire avec les informations du modèle :
   - **Nom** : Nom descriptif du modèle
   - **Description** : Description détaillée du modèle
   - **Version** : Version du modèle (par défaut : 1.0.0)
   - **Type** : Type de modèle (classification, régression, etc.)
   - **Framework** : Framework utilisé (scikit-learn, TensorFlow, etc.)
   - **Département** : Département propriétaire du modèle
   - **Région** : Région d'application du modèle
3. Ajoutez des tags pour faciliter la recherche
4. Téléchargez le fichier du modèle en le glissant-déposant ou en cliquant sur la zone de dépôt
5. Cliquez sur "Créer le modèle" pour finaliser la création

### 4.3 Détail d'un modèle

La page de détail d'un modèle affiche toutes les informations relatives au modèle et permet diverses actions :

1. **Informations générales** : Nom, description, statut, type, framework, etc.
2. **Onglets** :
   - **Paramètres** : Paramètres et hyperparamètres du modèle
   - **Métriques** : Métriques de performance du modèle
   - **Déploiements** : Liste des déploiements associés au modèle
   - **Exécutions** : Historique des exécutions du modèle
3. **Actions** :
   - **Déployer** : Créer un nouveau déploiement pour ce modèle
   - **Exécuter** : Exécuter directement le modèle
   - **Télécharger** : Télécharger le fichier du modèle
   - **Modifier** : Modifier les informations du modèle
   - **Supprimer** : Supprimer le modèle

## 5. Gestion des déploiements

### 5.1 Liste des déploiements

La page "Déploiements" affiche tous les déploiements de modèles avec des options de filtrage :

1. Utilisez la barre de recherche pour trouver des déploiements par nom
2. Filtrez par département, région ou statut
3. Cliquez sur un déploiement pour accéder à sa page de détail
4. Utilisez les icônes d'action pour des opérations rapides (voir, démarrer/arrêter)

### 5.2 Création d'un déploiement

Pour créer un nouveau déploiement :

1. Depuis la page de détail d'un modèle, cliquez sur le bouton "Déployer"
2. Ou depuis la page "Déploiements", cliquez sur "Nouveau déploiement"
3. Remplissez le formulaire de déploiement :
   - **Nom** : Nom descriptif du déploiement
   - **Description** : Description détaillée du déploiement
   - **Modèle** : Sélectionnez le modèle à déployer (si non prérempli)
   - **Paramètres** : Configurez les paramètres spécifiques au déploiement
   - **Planification** : Définissez une planification d'exécution (format cron)
4. Cliquez sur "Créer le déploiement" pour finaliser

### 5.3 Détail d'un déploiement

La page de détail d'un déploiement affiche :

1. **Informations générales** : Nom, description, statut, modèle associé, etc.
2. **Configuration** : Paramètres de configuration du déploiement
3. **Planification** : Planification d'exécution (si définie)
4. **Exécutions** : Historique des exécutions du déploiement
5. **Actions** :
   - **Démarrer/Arrêter** : Activer ou désactiver le déploiement
   - **Exécuter** : Lancer une exécution manuelle
   - **Modifier** : Modifier la configuration du déploiement
   - **Supprimer** : Supprimer le déploiement

## 6. Suivi des exécutions

### 6.1 Liste des exécutions

La page "Exécutions" affiche l'historique de toutes les exécutions de modèles :

1. Utilisez les filtres pour affiner la liste par déploiement, modèle ou statut
2. Consultez le statut, la date de début et la durée de chaque exécution
3. Cliquez sur une exécution pour accéder à sa page de détail

### 6.2 Détail d'une exécution

La page de détail d'une exécution affiche :

1. **Informations générales** : ID, statut, dates de début et de fin, durée
2. **Paramètres** : Paramètres utilisés pour cette exécution
3. **Logs** : Journaux d'exécution détaillés
4. **Résultats** : Résultats de l'exécution avec option de téléchargement
5. **Actions** :
   - **Télécharger les résultats** : Télécharger les résultats de l'exécution
   - **Annuler** : Annuler une exécution en cours (si applicable)
   - **Relancer** : Relancer l'exécution avec les mêmes paramètres

## 7. Visualisation des résultats

### 7.1 Rapports intégrés

La plateforme propose des rapports intégrés accessibles depuis la section "Rapports" :

1. **Performances des modèles** : Métriques de performance par modèle
2. **Tendances d'exécution** : Évolution des exécutions dans le temps
3. **Utilisation par département** : Répartition de l'utilisation par département
4. **Statut des déploiements** : Vue d'ensemble des déploiements actifs/inactifs

### 7.2 Grafana

Pour des visualisations plus avancées, Grafana est intégré à la plateforme :

1. Accédez à Grafana via l'URL : `http://localhost:3001`
2. Connectez-vous avec les identifiants par défaut : `admin` / `admin`
3. Explorez les tableaux de bord préconfigurés ou créez vos propres visualisations

### 7.3 Apache Superset

Pour l'analyse exploratoire des données, Apache Superset est disponible :

1. Accédez à Superset via l'URL : `http://localhost:8088`
2. Connectez-vous avec les identifiants par défaut : `admin` / `admin`
3. Créez des visualisations personnalisées et des tableaux de bord interactifs

## 8. Administration

### 8.1 Gestion des utilisateurs

Les administrateurs peuvent gérer les utilisateurs depuis la section "Utilisateurs" :

1. **Liste des utilisateurs** : Affiche tous les utilisateurs de la plateforme
2. **Création d'utilisateur** : Ajoute un nouvel utilisateur avec un rôle spécifique
3. **Modification d'utilisateur** : Modifie les informations et le rôle d'un utilisateur
4. **Désactivation d'utilisateur** : Désactive temporairement un compte utilisateur

### 8.2 Configuration système

La configuration avancée du système est accessible via l'interface d'administration :

1. **Paramètres globaux** : Configuration générale de la plateforme
2. **Intégrations** : Configuration des intégrations externes
3. **Journaux système** : Consultation des journaux système
4. **Sauvegarde et restauration** : Gestion des sauvegardes

## 9. Bonnes pratiques

### 9.1 Organisation des modèles

Pour une gestion efficace des modèles :

- Utilisez des noms descriptifs et cohérents
- Ajoutez des tags pertinents pour faciliter la recherche
- Documentez précisément les modèles (description, paramètres, cas d'usage)
- Versionnez correctement les modèles (suivez une convention de versionnement)

### 9.2 Planification des déploiements

Pour optimiser les déploiements :

- Évitez les exécutions trop fréquentes qui pourraient surcharger le système
- Planifiez les exécutions intensives pendant les heures creuses
- Utilisez des expressions cron précises pour les planifications récurrentes
- Testez les déploiements avec des exécutions manuelles avant d'activer la planification

### 9.3 Collaboration

Pour favoriser la collaboration entre équipes :

- Partagez les modèles performants entre départements
- Documentez les cas d'usage réussis
- Standardisez les formats de données d'entrée et de sortie
- Utilisez les tags pour catégoriser les modèles par projet ou initiative

## 10. Résolution des problèmes courants

### 10.1 Problèmes de connexion

Si vous rencontrez des problèmes de connexion :

1. Vérifiez que vos identifiants sont corrects
2. Assurez-vous que votre compte est actif
3. Effacez le cache de votre navigateur
4. Contactez un administrateur si le problème persiste

### 10.2 Échecs d'exécution

En cas d'échec d'exécution d'un modèle :

1. Consultez les logs d'exécution pour identifier l'erreur
2. Vérifiez que les données d'entrée sont au format attendu
3. Assurez-vous que les paramètres sont correctement configurés
4. Vérifiez la compatibilité entre le modèle et l'environnement d'exécution

### 10.3 Problèmes de performance

Si vous constatez des problèmes de performance :

1. Vérifiez la taille des données traitées
2. Optimisez les paramètres du modèle
3. Ajustez les ressources allouées au déploiement
4. Planifiez les exécutions intensives pendant les heures creuses

## 11. Support et assistance

Pour obtenir de l'aide supplémentaire :

1. Consultez la documentation technique pour des informations détaillées
2. Contactez l'équipe de support via le formulaire de contact
3. Signalez les bugs ou demandez des fonctionnalités via le système de tickets
4. Participez aux sessions de formation régulières

---

Ce guide d'utilisation couvre les fonctionnalités principales de la Plateforme Centralisée de Modèles ML. Pour des informations plus détaillées sur l'architecture technique et le déploiement, veuillez consulter la documentation technique.
