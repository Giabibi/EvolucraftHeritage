# Load environment variables
include .env
export $(shell sed 's/=.*//' .env)

# Nom du conteneur MySQL (à adapter selon votre configuration Docker)
MYSQL_CONTAINER_NAME=mysql_container

# Dossier de sauvegarde
BACKUP_DIR=./backup

# Nom du fichier de sauvegarde avec la date
BACKUP_FILE=$(BACKUP_DIR)/tmp_db_$(shell date +"%Y%m%d_%H%M%S").sql

# Commande par défaut pour Docker Compose
DOCKER_COMPOSE=docker-compose

# Lancer Docker et restaurer la sauvegarde
.PHONY: start
start:
	@echo "Lancement des conteneurs Docker..."
	@$(DOCKER_COMPOSE) up -d
	@echo "Attente de l'initialisation de MySQL..."
	@until docker exec $(MYSQL_CONTAINER_NAME) mysqladmin ping -h ${IP} -u root -p${PMA_ROOT_PASSWORD} --silent; do \
        echo "En attente de MySQL..."; \
        sleep 2; \
    done
	@sleep 5;
	@echo "MySQL est prêt."
	@echo "Restauration de la dernière sauvegarde si disponible..."
	@if [ -f $(BACKUP_DIR)/latest_backup.sql ]; then \
		cat $(BACKUP_DIR)/latest_backup.sql | docker exec -i $(MYSQL_CONTAINER_NAME) mysql -h ${IP} -P ${DISCORD_BOT_DB} -u root -p${PMA_ROOT_PASSWORD} tmp_db; \
		echo "Restauration terminée."; \
	else \
		echo "Aucune sauvegarde trouvée. Démarrage sans restauration."; \
	fi

# Sauvegarder la base de données avant d'arrêter Docker
.PHONY: stop
stop: backup
	@echo "Arrêt des conteneurs Docker..."
	@$(DOCKER_COMPOSE) down -v

# Arrêter Docker
.PHONY: stop-no-backup
stop-no-backup:
	@echo "Arrêt des conteneurs Docker..."
	@$(DOCKER_COMPOSE) down -v

# Sauvegarder la base de données MySQL
.PHONY: backup
backup:
	@echo "Création d'une sauvegarde de la base de données..."
	@mkdir -p $(BACKUP_DIR)
	@docker exec -i $(MYSQL_CONTAINER_NAME) mysqldump -u root -p${PMA_ROOT_PASSWORD} tmp_db > $(BACKUP_FILE)
	@cp $(BACKUP_FILE) $(BACKUP_DIR)/latest_backup.sql
	@echo "Sauvegarde terminée : $(BACKUP_FILE)"

# Supprimer toutes les sauvegardes
.PHONY: clean-backup
clean-backup:
	@echo "Suppression de toutes les sauvegardes dans $(BACKUP_DIR)..."
	@rm -rf $(BACKUP_DIR)/*.sql
	@echo "Toutes les sauvegardes ont été supprimées."

# Redémarrer les conteneurs Docker avec restauration
.PHONY: restart
restart: stop start
	@echo "Redémarrage complet effectué avec restauration des données si disponible."

.PHONY: check-vars
check-vars:
	@echo "DISCORD_BOT_DB = ${DISCORD_BOT_DB}"
	@echo "DISCORD_BOT_PMA = ${DISCORD_BOT_PMA}"
	@echo "DISCORD_BOT_API = ${DISCORD_BOT_API}"