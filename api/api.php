<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once 'db_connect.php';

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT `data_categories` AS categories, `data_products` AS products FROM `xx_data`";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $categories = json_decode($row['categories'], true); 
    $products = json_decode($row['products'], true); 
    $data = array(
        'categories' => $categories,
        'products' => $products
    );

    echo json_encode($data);
} else {
    echo json_encode(array('message' => 'No data found'));
}
$conn->close();
?>