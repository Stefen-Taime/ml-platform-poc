FROM node:16-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Exposer le port du serveur de développement
EXPOSE 3000

# Commande pour exécuter le serveur de développement
CMD ["npm", "start"]