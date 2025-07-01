#!/bin/bash

# Obtenir le chemin du dossier où se trouve le script
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)

# Custom prints
. "$SCRIPT_DIR/../../print.sh"

# Chemin du fichier .env dans le même dossier que le script
ENV_FILE="$SCRIPT_DIR/.env"

# Lire les variables depuis le fichier .env
source "$ENV_FILE"

# Vérifier que les variables nécessaires existent
if [[ -z "$DATABASE_URL" || -z "$DISCORD_EVO_DB" ]]; then
  printError "Les variables DATABASE_URL ou DISCORD_EVO_DB sont manquantes dans $ENV_FILE." 4
  exit 1
fi

# Remplacer le port dans DATABASE_URL par la valeur de DISCORD_EVO_DB
UPDATED_DATABASE_URL=$(echo "$DATABASE_URL" | sed -E "s/:[0-9]+\/w/:$DISCORD_EVO_DB\/w/")

# Mettre à jour le fichier .env
sed -i -E "s|^DATABASE_URL=.*|DATABASE_URL=\"$UPDATED_DATABASE_URL\"|" "$ENV_FILE"

printSuccess "Mise à jour effectuée : DATABASE_URL=$UPDATED_DATABASE_URL" 4
