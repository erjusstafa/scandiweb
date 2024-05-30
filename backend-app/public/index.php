<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow the specified HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow the specified headers

require_once  '../app/services/database.php';
require_once  '../app/models/category.php';
require_once  '../app/models/product.php';
require_once  '../app/models/attribute.php';
require_once '../vendor/autoload.php';
require_once '../config/index.php';

$categories = new Category(DB_HOST, DB_NAME, DB_USER, DB_PASS);
$categories->createTable(); //create table for categories
$products = new Product(DB_HOST, DB_NAME, DB_USER, DB_PASS);
$products->createTable(); //create table for products
$json_data = file_get_contents('data.json');
$data = json_decode($json_data, true);


//populate with data categoriesa  && products table
foreach ($data['data']['categories'] as $categoryData) {
    $categories->insertCategory($categoryData['name']);
}

foreach ($data['data']['products'] as $productsData) {
    $products->insertProduct($productsData);
}


$dispatcher = FastRoute\simpleDispatcher(function (FastRoute\RouteCollector $r) {
    $r->post('/graphql', [App\Controller\GraphQL::class, 'handle']);
    $r->get('/', function () {
        echo "Connected!";
    });
});

$routeInfo = $dispatcher->dispatch(
    $_SERVER['REQUEST_METHOD'] ?? '',
    $_SERVER['REQUEST_URI'] ?? ''
);


switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        echo $handler($vars);
        break;
}
