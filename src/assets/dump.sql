/*
SQLyog Community v13.1.2 (64 bit)
MySQL - 10.4.13-MariaDB : Database - ecommerce
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`ecommerce` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `ecommerce`;

/*Table structure for table `customer` */

DROP TABLE IF EXISTS `customer`;

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(200) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `latitude` varchar(100) DEFAULT NULL,
  `longitude` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

/*Data for the table `customer` */

insert  into `customer`(`customer_id`,`customer_name`,`address`,`latitude`,`longitude`) values 
(1,'paijo','jl. Kutilang berkicau 12, jakarta barat',NULL,NULL);

/*Table structure for table `mutasi_stock` */

DROP TABLE IF EXISTS `mutasi_stock`;

CREATE TABLE `mutasi_stock` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tgl_mutasi` date DEFAULT NULL,
  `pcode` varchar(200) NOT NULL,
  `order_id` varchar(200) DEFAULT NULL,
  `type_mutasi` enum('O','I') DEFAULT NULL,
  `jumlah` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`,`pcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `mutasi_stock` */

/*Table structure for table `order_detail` */

DROP TABLE IF EXISTS `order_detail`;

CREATE TABLE `order_detail` (
  `order_detail_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(200) NOT NULL,
  `pcode` varchar(200) DEFAULT NULL,
  `qty` int(11) DEFAULT NULL,
  `price` decimal(65,2) DEFAULT NULL,
  `subtotal` decimal(65,2) DEFAULT NULL,
  PRIMARY KEY (`order_detail_id`,`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `order_detail` */

/*Table structure for table `order_header` */

DROP TABLE IF EXISTS `order_header`;

CREATE TABLE `order_header` (
  `order_id` varchar(200) NOT NULL,
  `order_date` date DEFAULT NULL,
  `customer_id` int(11) NOT NULL,
  `promo_code` varchar(200) DEFAULT NULL,
  `amount_discount` decimal(65,2) DEFAULT NULL,
  `net` decimal(65,2) DEFAULT NULL,
  `ppn` decimal(65,2) DEFAULT NULL,
  `total` decimal(65,2) DEFAULT NULL,
  PRIMARY KEY (`order_id`,`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `order_header` */

/*Table structure for table `product` */

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `pcode` varchar(200) DEFAULT NULL,
  `product_name` text DEFAULT NULL,
  `price` decimal(65,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `product` */

insert  into `product`(`pcode`,`product_name`,`price`) values 
('010001','MIRANDA H.C N.BLACK 30.MC1',10000.00);

/*Table structure for table `promo` */

DROP TABLE IF EXISTS `promo`;

CREATE TABLE `promo` (
  `promo_code` varchar(200) NOT NULL,
  `promo_name` text DEFAULT NULL,
  PRIMARY KEY (`promo_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `promo` */

insert  into `promo`(`promo_code`,`promo_name`) values 
('pmo-001','Setiap pembelian MIRANDA H.C N.BLACK 30.MC1, mendapat porongan Rp. 1.000,-');

/*Table structure for table `stock` */

DROP TABLE IF EXISTS `stock`;

CREATE TABLE `stock` (
  `pcode` varchar(200) NOT NULL,
  `jumlah` int(11) DEFAULT NULL,
  PRIMARY KEY (`pcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Data for the table `stock` */

insert  into `stock`(`pcode`,`jumlah`) values 
('010001',200);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
