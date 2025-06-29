-- Créer la base de données si elle n'existe pas
CREATE DATABASE IF NOT EXISTS tmp_db;
USE tmp_db;

-- Créer la table Guilds
CREATE TABLE Guilds (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    GuildId VARCHAR(255) NOT NULL,
    AnnonceChannelId VARCHAR(255)
);

-- Accorder tous les privilèges à l'utilisateur 'root' sur toutes les bases de données
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- Appliquer les changements
FLUSH PRIVILEGES;