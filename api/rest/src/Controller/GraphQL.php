<?php

namespace App\Controller;

use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;

class GraphQL {
    static public function handle($testInput = null) {
        try {
            // Define input type for product attributes
            $productAttributesInputType = new InputObjectType([
                'name' => 'ProductAttributesInput',
                'fields' => [
                    'Size' => ['type' => Type::string()],
                    'Color' => ['type' => Type::string()],
                    'Capacity' => ['type' => Type::string()],
                    'WithUSB3ports' => ['type' => Type::string()],
                    'TouchIDinkeyboard' => ['type' => Type::string()],
                ],
            ]);

            // Define input type for product
            $productInputType = new InputObjectType([
                'name' => 'ProductInput',
                'fields' => [
                    'name' => ['type' => Type::string()],
                    'price' => ['type' => Type::float()],
                    'productAttributes' => ['type' => $productAttributesInputType],
                    'productId' => ['type' => Type::string()],
                    'qty' => ['type' => Type::int()],
                ],
            ]);

            // Define output type for product attributes
            $productAttributesOutputType = new ObjectType([
                'name' => 'ProductAttributesOutput',
                'fields' => [
                    'Size' => ['type' => Type::string()],
                    'Color' => ['type' => Type::string()],
                    'Capacity' => ['type' => Type::string()],
                    'WithUSB3ports' => ['type' => Type::string()],
                    'TouchIDinkeyboard' => ['type' => Type::string()],
                ],
            ]);

            // Define output type for product
            $productOutputType = new ObjectType([
                'name' => 'ProductOutput',
                'fields' => [
                    'name' => ['type' => Type::string()],
                    'price' => ['type' => Type::float()],
                    'productAttributes' => ['type' => $productAttributesOutputType],
                    'productId' => ['type' => Type::string()],
                    'qty' => ['type' => Type::int()],
                ],
            ]);

            // Define type for a new order
            $newOrderType = new ObjectType([
                'name' => 'NewOrder',
                'fields' => [
                    'orderID' => ['type' => Type::int()],
                    'newOrder' => ['type' => Type::listOf($productOutputType)],
                    'totalPrice' => ['type' => Type::float()],
                ],
            ]);

            // Define QueryType
            $queryType = new ObjectType([
                'name' => 'Query',
                'fields' => [
                    'echo' => [
                        'type' => Type::string(),
                        'args' => [
                            'message' => ['type' => Type::string()],
                        ],
                        'resolve' => function ($rootValue, array $args): string {
                            return $rootValue['prefix'] . $args['message'];
                        },
                    ],
                ],
            ]);

            // Define MutationType
            $mutationType = new ObjectType([
                'name' => 'Mutation',
                'fields' => [
                    'sum' => [
                        'type' => Type::int(),
                        'args' => [
                            'x' => ['type' => Type::int()],
                            'y' => ['type' => Type::int()],
                        ],
                        'resolve' => function ($calc, array $args): int {
                            return $args['x'] + $args['y'];
                        },
                    ],
                    'createOrder' => [
                        'type' => $newOrderType,
                        'args' => [
                            'orderID' => ['type' => Type::int()],
                            'products' => ['type' => Type::listOf($productInputType)],
                            'totalPrice' => ['type' => Type::float()], // Mutation argument setup
                        ],
                        'resolve' => function ($root, array $args) {
                            // Logic to create an order
                            $orderID = $args['orderID'];
                            $products = $args['products'];
                            $totalPrice = $args['totalPrice'];
                            
                            // Return formatted order data
                            return ['orderID' => $orderID, 'newOrder' => $products, 'totalPrice' => $totalPrice];
                        },
                    ],
                ],
            ]);

            // Setup schema
            $schema = new Schema(
                (new SchemaConfig())
                ->setQuery($queryType)
                ->setMutation($mutationType)
            );

            // Handle incoming GraphQL request
            if ($testInput === null) {
                $rawInput = file_get_contents('php://input');
                if ($rawInput === false) {
                    throw new RuntimeException('Failed to get php://input');
                }

                $input = json_decode($rawInput, true);
            } else {
                $input = $testInput;
            }

            // Validate presence of GraphQL query
            if (!isset($input['query'])) {
                throw new RuntimeException('GraphQL query is missing.');
            }

            // Extract query and variables
            $query = $input['query'];
            $variableValues = $input['variables'] ?? null;

            // Define root value for resolver
            $rootValue = ['prefix' => 'You said: '];

            // Execute GraphQL query
            $result = GraphQLBase::executeQuery($schema, $query, $rootValue, null, $variableValues);
            $output = $result->toArray();
        } catch (Throwable $e) {
            // Handle exceptions
            $output = [
                'error' => [
                    'message' => $e->getMessage(),
                ],
            ];
        }

        // Set response content type and return JSON output
        header('Content-Type: application/json; charset=UTF-8');
        return json_encode($output);
    }

    // Function to test createOrder mutation
    static public function test() {
        $testCreateOrder = [
            'query' => 'mutation($orderID: Int!, $products: [ProductInput!]!, $totalPrice: Float!) { createOrder(orderID: $orderID, products: $products, totalPrice: $totalPrice) { orderID newOrder { name price productAttributes { Size, Color, Capacity } productId qty } totalPrice } }',
            'variables' => [
                'orderID' => 123,
                'totalPrice' => 444,
                'products' => [
                    [
                        'name' => 'Nike Air Huarache Le',
                        'price' => 144.69,
                        'productAttributes' => [
                            'Size' => '40',
                            'Color' => 'Red',
                            'Capacity'=> '256'
                        ],
                        'productId' => 'Nik1',
                        'qty' => 1,
                    ],
                    [
                        'name' => 'Nike Air Huarache Le222',
                        'price' => 144.69,
                        'productAttributes' => [
                            'Size' => '40',
                            'Color' => 'Red',
                            'Capacity'=> '256'
                        ],
                        'productId' => 'Nik2',
                        'qty' => 1,
                    ],
                ],
            ],
        ];

        // Execute handle method with the provided test data
        echo self::handle($testCreateOrder);
    }
}
