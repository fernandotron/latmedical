<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$requestUri = $_SERVER['REQUEST_URI'];
// Clean up query string if any
$requestUri = explode('?', $requestUri)[0];
// Get the last segment of the URI
$pathSegments = explode('/', rtrim($requestUri, '/'));
$endpoint = end($pathSegments);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    
    // Ensure data directory exists
    $dataDir = __DIR__ . '/data';
    if (!file_exists($dataDir)) {
        mkdir($dataDir, 0755, true);
    }

    if ($endpoint === 'save-products') {
        file_put_contents($dataDir . '/products.json', $input);
        echo json_encode(['success' => true]);
        exit;
    }
    
    if ($endpoint === 'save-inventory') {
        file_put_contents($dataDir . '/inventory.json', $input);
        echo json_encode(['success' => true]);
        exit;
    }
    
    if ($endpoint === 'save-settings') {
        file_put_contents($dataDir . '/general_settings.json', $input);
        echo json_encode(['success' => true]);
        exit;
    }
    
    if ($endpoint === 'save-slides') {
        file_put_contents($dataDir . '/home_slides.json', $input);
        echo json_encode(['success' => true]);
        exit;
    }
    
    if ($endpoint === 'save-orders') {
        file_put_contents($dataDir . '/orders.json', $input);
        echo json_encode(['success' => true]);
        exit;
    }
    
    if ($endpoint === 'save-submissions') {
        $newSubmission = json_decode($input, true);
        $subFile = $dataDir . '/form_submissions.json';
        $existing = [];
        if (file_exists($subFile)) {
            $content = file_get_contents($subFile);
            if (trim($content)) {
                $existing = json_decode($content, true);
            }
        }
        $newSubmission['id'] = 'sub-' . round(microtime(true) * 1000) . '-' . rand(1, 1000);
        $newSubmission['date'] = date('d/m/Y, H:i:s');
        $existing[] = $newSubmission;
        file_put_contents($subFile, json_encode($existing, JSON_PRETTY_PRINT));
        echo json_encode(['success' => true]);
        exit;
    }
    
    if ($endpoint === 'upload-image') {
        $payload = json_decode($input, true);
        $name = $payload['name'];
        $data = $payload['data'];
        
        // Extract base64 part
        $parts = explode(';base64,', $data);
        $base64String = end($parts);
        $decodedData = base64_decode($base64String);
        
        $uploadDir = __DIR__ . '/../images/uploads';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        file_put_contents($uploadDir . '/' . $name, $decodedData);
        echo json_encode(['success' => true, 'url' => '/images/uploads/' . $name]);
        exit;
    }
    
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Endpoint not found']);
    exit;
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if ($endpoint === 'form_submissions.json') {
        $subFile = __DIR__ . '/data/form_submissions.json';
        if (file_exists($subFile)) {
            echo file_get_contents($subFile);
        } else {
            echo json_encode([]);
        }
        exit;
    }
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Method not allowed']);
