-- MySQL dump 10.13  Distrib 9.1.0, for Linux (x86_64)
--
-- Host: localhost    Database: tmp_db
-- ------------------------------------------------------
-- Server version	9.1.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Announcements`
--

DROP TABLE IF EXISTS `Announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Announcements` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `GuildId` int NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Content` text NOT NULL,
  `Date` datetime DEFAULT NULL,
  `TimeInterval` bigint DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Guild_Announcements` (`GuildId`),
  CONSTRAINT `FK_Guild_Announcements` FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Announcements`
--

LOCK TABLES `Announcements` WRITE;
/*!40000 ALTER TABLE `Announcements` DISABLE KEYS */;
/*!40000 ALTER TABLE `Announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Guilds`
--

DROP TABLE IF EXISTS `Guilds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Guilds` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `GuildId` varchar(255) NOT NULL,
  `AnnonceChannelId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Guilds`
--

LOCK TABLES `Guilds` WRITE;
/*!40000 ALTER TABLE `Guilds` DISABLE KEYS */;
/*!40000 ALTER TABLE `Guilds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `JobsLevels`
--

DROP TABLE IF EXISTS `JobsLevels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `JobsLevels` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `GuildId` int NOT NULL,
  `User` varchar(255) NOT NULL,
  `Level` int NOT NULL,
  `Job` varchar(255) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_Guild_JobsLevels` (`GuildId`),
  CONSTRAINT `FK_Guild_JobsLevels` FOREIGN KEY (`GuildId`) REFERENCES `Guilds` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `JobsLevels`
--

LOCK TABLES `JobsLevels` WRITE;
/*!40000 ALTER TABLE `JobsLevels` DISABLE KEYS */;
/*!40000 ALTER TABLE `JobsLevels` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-27 22:48:16
