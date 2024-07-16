<?php
// Параметры подключения к базе данных
$servername = "xxxxx";
$username = "xxxxx";
$password = "xxxxx";
$dbname = "xxxxx";

try {
    // Подключение к базе данных с использованием PDO
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // echo "Connected successfully"; // Успешное подключение (для проверки)
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage()); // Обработка ошибок подключения
}
?>