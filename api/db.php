<?php
// Izinkan akses dari mana saja (untuk pengembangan)
header("Access-Control-Allow-Origin: *");

// Konfigurasi koneksi database
$host = 'localhost';
$user = 'root'; // User default XAMPP
$pass = ''; // Password default XAMPP
$db   = 'penjualan_db'; // Nama database

// Membuat koneksi
$conn = new mysqli($host, $user, $pass, $db);

// Cek koneksi
if ($conn->connect_error) {
    die("Koneksi gagal: " . $conn->connect_error);
}

// Set charset ke utf8mb4 untuk mendukung karakter lebih luas
$conn->set_charset("utf8mb4");

// (Opsional) Tampilkan pesan sukses untuk pengujian
// echo "Koneksi berhasil";
?>
