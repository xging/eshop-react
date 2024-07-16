<?php

// Enable displaying of all errors for debugging purposes
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include Composer's autoloader to load necessary classes
require_once __DIR__ . '/../vendor/autoload.php';

use App\Controller\GraphQL;

// Set response content type to JSON
header('Content-Type: application/json');

// Call the test method of the GraphQL class to perform testing
echo GraphQL::test();

// Example configuration in your index.php or server configuration

// Allow access from any source (not recommended for production)
// header('Access-Control-Allow-Origin: *');

// Additional permissive headers if needed
// header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
// header('Access-Control-Allow-Headers: Content-Type');

// Check if the request method is OPTIONS (preflight request) and exit if true
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}