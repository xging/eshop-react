<?php
require_once 'db_connect.php';
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$json = file_get_contents('data.json');
if ($json === false) {
    die("Error reading JSON file.");
}

$data = json_decode($json, true);
if ($data === null) {
    die("Error decoding JSON data.");
}


$categories_json = json_encode($data['data']['categories'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
$products_json = json_encode($data['data']['products'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$categories_json = $conn->real_escape_string($categories_json);
$products_json = $conn->real_escape_string($products_json);

$sql_drop_table = "DROP TABLE IF EXISTS `xx_data`";
if ($conn->query($sql_drop_table) !== TRUE) {
    echo "Error dropping table: " . $conn->error;
}


$sql_create_table = "CREATE TABLE `xx_data` (
    `data_categories` JSON,
    `data_products` JSON
)";
if ($conn->query($sql_create_table) !== TRUE) {
    die("Error creating table: " . $conn->error);
}

$sql = "INSERT INTO `xx_data` (`data_categories`, `data_products`) VALUES ('$categories_json', '$products_json')";

if ($conn->query($sql) === TRUE) {
    echo "Data inserted successfully.";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>