-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               5.5.8 - MySQL Community Server (GPL)
-- Server OS:                    Win32
-- HeidiSQL Version:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for shanthi
CREATE DATABASE IF NOT EXISTS `shanthi` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `shanthi`;

-- Dumping structure for table shanthi.appointment
CREATE TABLE IF NOT EXISTS `appointment` (
  `idappointment` int(11) NOT NULL AUTO_INCREMENT,
  `number` int(11) DEFAULT NULL,
  `patient_intime` time DEFAULT '00:00:00',
  `payment_status` varchar(45) DEFAULT NULL,
  `iddoctor_schedule` int(11) NOT NULL,
  `patient_idpatient` int(11) NOT NULL,
  `issued_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`idappointment`),
  KEY `fk_appointment_doctor_schedule1_idx` (`iddoctor_schedule`),
  KEY `fk_appointment_patient1_idx` (`patient_idpatient`),
  CONSTRAINT `fk_appointment_doctor_schedule1` FOREIGN KEY (`iddoctor_schedule`) REFERENCES `doctor_schedule` (`iddoctor_schedule`),
  CONSTRAINT `fk_appointment_patient1` FOREIGN KEY (`patient_idpatient`) REFERENCES `patient` (`idpatient`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Dumping data for table shanthi.appointment: ~1 rows (approximately)
DELETE FROM `appointment`;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;

-- Dumping structure for table shanthi.bck
CREATE TABLE IF NOT EXISTS `bck` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `qry` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dte` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table shanthi.bck: ~0 rows (approximately)
DELETE FROM `bck`;
/*!40000 ALTER TABLE `bck` DISABLE KEYS */;
/*!40000 ALTER TABLE `bck` ENABLE KEYS */;

-- Dumping structure for table shanthi.configuration
CREATE TABLE IF NOT EXISTS `configuration` (
  `idconfiguration` int(11) NOT NULL,
  `keyy` varchar(45) DEFAULT NULL,
  `valuee` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idconfiguration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table shanthi.configuration: ~2 rows (approximately)
DELETE FROM `configuration`;
/*!40000 ALTER TABLE `configuration` DISABLE KEYS */;
INSERT INTO `configuration` (`idconfiguration`, `keyy`, `valuee`) VALUES
	(1, 'fee', '400'),
	(2, 'printer', 'EPSON');
/*!40000 ALTER TABLE `configuration` ENABLE KEYS */;

-- Dumping structure for table shanthi.doctor
CREATE TABLE IF NOT EXISTS `doctor` (
  `iddoctor` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `contactNo` varchar(45) DEFAULT NULL,
  `fee` double DEFAULT NULL,
  `base_hospital` varchar(45) DEFAULT NULL,
  `specialization` varchar(45) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `con_period` int(11) DEFAULT '0',
  PRIMARY KEY (`iddoctor`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8;

-- Dumping data for table shanthi.doctor: ~24 rows (approximately)
DELETE FROM `doctor`;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` (`iddoctor`, `name`, `contactNo`, `fee`, `base_hospital`, `specialization`, `description`, `con_period`) VALUES
	(1, 'S. F. Jayamanne', '-', 1500, 'Ragama', 'VP', 'Test', 10),
	(2, 'A. Hiththarage', '-', 1000, 'Colombo', 'VP', 'Test', 10),
	(3, 'Champa Jayamanne', '-', 1200, 'Negombo', 'VP', 'Test', 10),
	(4, 'Aruni Wijesinghe', '-', 1200, 'Negombo', 'Pediatrician', 'Test', 10),
	(5, 'Winson Perera', '-', 700, 'Ragama', 'Pediatrician', 'Test', 10),
	(6, 'Anura Jayasinghe', '-', 1000, 'Ragama', 'Pediatrician', 'Test', 10),
	(7, 'Upul P. Meegama', '-', 1000, 'Colombo', 'Dermatologist', 'Test', 10),
	(8, 'Athula Fernando', '-', 1000, 'Negombo', 'VOG', 'Test', 15),
	(9, 'Chandana Jayasundara', '-', 1000, 'De Soyza Women\'s Hospital', 'VOG', 'Test', 15),
	(10, 'Ajith P. Ukwatthaarachchi', '-', 1350, 'Ragama', 'Orthopaedic', 'Test', 10),
	(11, 'Niroshan Lokunarangoda', '-', 1100, 'Colombo', 'Cardiologist', 'Test', 10),
	(12, 'Yasath Weerakkody', '-', 1000, 'Ragama', 'ENT', 'Test', 10),
	(13, 'Janaka Chaminda', '-', 1200, 'Welisara', 'Chest Physician', 'Test', 10),
	(14, 'Arjun Wijewardhana', '-', 1000, 'Colombo', 'Surgeon', 'Test', 10),
	(15, 'Maheshi Amarawardhana', '-', 1300, 'Colombo', 'Diabets Endocrinologist', 'Test', 10),
	(16, 'P. Gamini Jayasinghe', '-', 1200, 'Colombo', 'Psychiatrist', 'Test', 10),
	(17, 'Shyawinda D. Appuhamy', '-', 1200, 'Colombo', 'Orthopaedic', 'Test', 10),
	(18, 'Prabash Hettiarachchi', '-', 1800, 'Colombo', 'Scan-Radiologist', 'Test & Scan', 5),
	(19, 'Damintha Disanayaka', '-', 1500, 'Wijaya Kumarathunga Hospital', 'VP', 'Test', 10),
	(20, 'Disna Amarathunga', '-', 1200, 'Negombo', 'Cardiologist', 'Test', 10),
	(21, 'Rohan Paris', '-', 1200, 'Colombo', 'Neuro Surgeon', 'Test', 10),
	(22, 'Sarojini Wanigarathna', '-', 1100, 'Negombo', 'Orthodontics', 'Test', 10),
	(23, 'Amindri Fernando', '-', 800, 'Negombo', 'Physiotherapy', 'Test', 10),
	(24, 'Test_Doctor', '123456789', 2500, 'test', 'test', 'test', 5);
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;

-- Dumping structure for table shanthi.doctor_invoice
CREATE TABLE IF NOT EXISTS `doctor_invoice` (
  `iddoctor_invoice` int(11) NOT NULL AUTO_INCREMENT,
  `datee` datetime DEFAULT NULL,
  `patient_count` int(11) DEFAULT NULL,
  `center_fee` double DEFAULT NULL,
  `doc_fee` double DEFAULT NULL,
  `doctor_schedule_iddoctor_schedule` int(11) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`iddoctor_invoice`),
  KEY `fk_doctor_invoice_doctor1_idx` (`doctor_schedule_iddoctor_schedule`),
  CONSTRAINT `fk_doctor_invoice_doctor1` FOREIGN KEY (`doctor_schedule_iddoctor_schedule`) REFERENCES `doctor_schedule` (`iddoctor_schedule`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table shanthi.doctor_invoice: ~1 rows (approximately)
DELETE FROM `doctor_invoice`;
/*!40000 ALTER TABLE `doctor_invoice` DISABLE KEYS */;
INSERT INTO `doctor_invoice` (`iddoctor_invoice`, `datee`, `patient_count`, `center_fee`, `doc_fee`, `doctor_schedule_iddoctor_schedule`, `status`) VALUES
	(1, '2019-06-29 20:35:02', 1, 5000, 1500, 1, 'Cancelled');
/*!40000 ALTER TABLE `doctor_invoice` ENABLE KEYS */;

-- Dumping structure for table shanthi.doctor_schedule
CREATE TABLE IF NOT EXISTS `doctor_schedule` (
  `iddoctor_schedule` int(11) NOT NULL,
  `doctor_iddoctor` int(11) NOT NULL,
  `datee` date NOT NULL,
  `doctor_in` time NOT NULL,
  `doctor_out` time NOT NULL,
  PRIMARY KEY (`iddoctor_schedule`),
  KEY `doctor_iddoctor_idx` (`doctor_iddoctor`),
  CONSTRAINT `doctor_iddoctor` FOREIGN KEY (`doctor_iddoctor`) REFERENCES `doctor` (`iddoctor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table shanthi.doctor_schedule: ~6 rows (approximately)
DELETE FROM `doctor_schedule`;
/*!40000 ALTER TABLE `doctor_schedule` DISABLE KEYS */;
INSERT INTO `doctor_schedule` (`iddoctor_schedule`, `doctor_iddoctor`, `datee`, `doctor_in`, `doctor_out`) VALUES
	(1, 1, '2019-06-30', '08:00:00', '10:00:00'),
	(2, 5, '2019-09-10', '08:00:00', '10:00:00'),
	(3, 4, '2019-10-24', '08:00:00', '10:00:00'),
	(5, 24, '2019-09-17', '08:00:00', '10:00:00'),
	(6, 18, '2019-09-09', '17:30:00', '18:30:00'),
	(7, 3, '2019-09-20', '08:00:00', '10:00:00');
/*!40000 ALTER TABLE `doctor_schedule` ENABLE KEYS */;

-- Dumping structure for table shanthi.patient
CREATE TABLE IF NOT EXISTS `patient` (
  `idpatient` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `contactNo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idpatient`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- Dumping data for table shanthi.patient: ~2 rows (approximately)
DELETE FROM `patient`;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;

-- Dumping structure for table shanthi.patient_invoice
CREATE TABLE IF NOT EXISTS `patient_invoice` (
  `idpatient_invoice` int(11) NOT NULL AUTO_INCREMENT,
  `doctor_fee` double DEFAULT '0',
  `center_fee` double DEFAULT '0',
  `amount` double DEFAULT NULL,
  `idappointment` int(11) NOT NULL,
  `issued_datetime` datetime DEFAULT NULL,
  PRIMARY KEY (`idpatient_invoice`),
  KEY `fk_patient_invoice_appointment1_idx` (`idappointment`),
  CONSTRAINT `fk_patient_invoice_appointment1` FOREIGN KEY (`idappointment`) REFERENCES `appointment` (`idappointment`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Dumping data for table shanthi.patient_invoice: ~1 rows (approximately)
DELETE FROM `patient_invoice`;
/*!40000 ALTER TABLE `patient_invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `patient_invoice` ENABLE KEYS */;

-- Dumping structure for table shanthi.user
CREATE TABLE IF NOT EXISTS `user` (
  `iduser` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `designation` varchar(45) DEFAULT NULL,
  `iduser_type` int(11) NOT NULL,
  `passwd` varchar(45) DEFAULT NULL,
  `uname` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`iduser`),
  KEY `fk_user_user_type1_idx` (`iduser_type`),
  CONSTRAINT `fk_user_user_type1` FOREIGN KEY (`iduser_type`) REFERENCES `user_type` (`iduser_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table shanthi.user: ~1 rows (approximately)
DELETE FROM `user`;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`iduser`, `name`, `designation`, `iduser_type`, `passwd`, `uname`) VALUES
	(1, 'Charith', 'Administrator', 1, 'admin', 'admin');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

-- Dumping structure for table shanthi.user_type
CREATE TABLE IF NOT EXISTS `user_type` (
  `iduser_type` int(11) NOT NULL,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`iduser_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table shanthi.user_type: ~1 rows (approximately)
DELETE FROM `user_type`;
/*!40000 ALTER TABLE `user_type` DISABLE KEYS */;
INSERT INTO `user_type` (`iduser_type`, `type`) VALUES
	(1, 'admin');
/*!40000 ALTER TABLE `user_type` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
