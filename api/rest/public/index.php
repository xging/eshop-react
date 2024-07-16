<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';

use App\Controller\GraphQL;

// Set response content type to JSON
header('Content-Type: application/json');

// Allow access from any origin
header('Access-Control-Allow-Origin: *');

// Allow specific HTTP methods
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

// Allow specific headers
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Handle incoming GraphQL request using GraphQL class's handle method
echo GraphQL::handle();
