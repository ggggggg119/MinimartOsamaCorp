-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 10, 2025 at 07:13 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `penjualan_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(2, 'Aksesoris'),
(7, 'Elektronik'),
(12, 'Makanan'),
(1, 'Pakaian'),
(3, 'Sepatu'),
(4, 'Topi');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `description` text NOT NULL,
  `category_id` int(11) NOT NULL,
  `image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `title`, `price`, `description`, `category_id`, `image`) VALUES
(2, 'Mens Casual Premium Slim Fit T-Shirts', 300000.00, 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, lightweight &amp; soft fabric for breathable and comfortable wearing. Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.', 1, 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png'),
(3, 'Mens Cotton Jacket', 900000.00, 'Great outerwear jacket for Spring/Autumn/Winter, suitable for many occasions such as working, hiking, camping, climbing, cycling, or traveling. Good gift choice for family. A warm-hearted gift for Father, husband or son in Thanksgiving or Christmas.', 1, 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_t.png'),
(4, 'Mens Casual Slim Fit', 149999.99, 'The color may vary slightly between on-screen and actual product. Please note that body builds vary by person, so detailed size information should be reviewed below in the product description.', 1, 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_t.png'),
(5, 'John Hardy Women&#039;s Legends Naga Gold &amp; Silver Dragon Station Chain Bracelet', 695.00, 'From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean&#039;s pearl. Wear facing inward to be bestowed with love and abundance, or outward for protection.', 2, 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_t.png'),
(6, 'Solid Gold Petite Micropave', 168.00, 'Satisfaction guaranteed. Return or exchange any order within 30 days. Designed and sold by Hafeez Center in the United States.', 2, 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_t.png'),
(7, 'White Gold Plated Princess', 9.99, 'Classic created wedding engagement solitaire diamond promise ring for her. A perfect gift for engagement, wedding, anniversary, or Valentine&#039;s Day.', 2, 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_t.png'),
(8, 'Pierced Owl Rose Gold Plated Stainless Steel Double', 10.99, 'Rose gold plated double flared tunnel plug earrings made of 316L stainless steel.', 2, 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_t.png'),
(9, 'WD 2TB Elements Portable External Hard Drive - USB 3.0', 64.00, 'USB 3.0 and USB 2.0 compatibility. Fast data transfers, improve PC performance, high capacity. Formatted NTFS for Windows 10, 8.1, 7 (reformatting may be required for other OS).', 7, 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_t.png'),
(10, 'SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s', 109.00, 'Easy upgrade for faster boot up, shutdown, and application load times. Boosts burst write performance and provides up to 535MB/s read and 450MB/s write speeds.', 7, 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_t.png'),
(11, 'Plus Men&#039;s Light Blue Regular Fit Washed Jeans Stretchable', 200000.00, 'Make heads turn with these Urbano Plus Men&#039;s Light Blue Regular Fit Shaded Washed Stretch Jeans. High on style and comfort, perfect for casual and party wear.', 1, 'https://www.urbanofashion.com/cdn/shop/files/pluscfjeanp-001-lblue-1.jpg'),
(13, 'Toko Sneakers Store Adidas di Bandung dan Jakarta - 807GARAGE', 2000000.00, 'Hasil kolaborasi inovatif antara Pharrell Williams&amp;amp;#039; Humanrace dan Adidas, sepatu Adizero Evo SL Black Green Blue ini memadukan estetika modern yang unik dengan performa lari kelas atas. Mengambil inspirasi dari warna-warna alam untuk mempromosikan persatuan, sepatu ini menampilkan basis warna hitam pekat yang dipercantik dengan aksen berani berwarna hijau dan biru pada tiga garis ikonik Adidas di bagian samping. Sepatu ini dirancang untuk kecepatan dan kenyamanan, dengan midsole LIGHTSTRIKE PRO yang ringan dan responsif, memberikan bantalan maksimal tanpa memberatkan. Bagian atasnya terbuat dari engineered mesh yang memberikan sirkulasi udara optimal, sementara outsole karetnya menjamin cengkeraman yang kuat di berbagai permukaan. Kombinasi desain minimalis namun mencolok dengan teknologi lari terdepan menjadikan sepatu ini pilihan ideal bagi pelari yang mengutamakan gaya dan performa.\n', 3, 'https://image.807garage.com/content/uploads/2025/9/adidas-adizero-evo-sl-pharrell-humanrace-black-green-blue-5.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_product_category` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
