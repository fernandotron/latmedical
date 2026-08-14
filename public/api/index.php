<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$requestUri = $_SERVER['REQUEST_URI'];
$requestUri = explode('?', $requestUri)[0];
$pathSegments = explode('/', rtrim($requestUri, '/'));
$endpoint = end($pathSegments);

$dataDir = __DIR__ . '/data';
if (!file_exists($dataDir)) {
    @mkdir($dataDir, 0775, true);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');

    if ($endpoint === 'save-products') {
        $res = @file_put_contents($dataDir . '/products.json', $input);
        if ($res !== false) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'No se pudo guardar el archivo de productos. Verifique permisos en api/data/']);
        }
        exit;
    }
    
    if ($endpoint === 'save-inventory') {
        $res = @file_put_contents($dataDir . '/inventory.json', $input);
        if ($res !== false) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'No se pudo guardar el inventario']);
        }
        exit;
    }

    if ($endpoint === 'save-clearance') {
        $res = @file_put_contents($dataDir . '/clearance.json', $input);
        if ($res !== false) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'No se pudo guardar clearance.json']);
        }
        exit;
    }
    
    if ($endpoint === 'save-settings') {
        $res = @file_put_contents($dataDir . '/general_settings.json', $input);
        if ($res !== false) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'No se pudo guardar la configuración']);
        }
        exit;
    }
    
    if ($endpoint === 'save-slides') {
        $res = @file_put_contents($dataDir . '/home_slides.json', $input);
        if ($res !== false) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'No se pudieron guardar las diapositivas']);
        }
        exit;
    }
    
    if ($endpoint === 'save-orders') {
        $incomingOrders = json_decode($input, true);
        $ordersFile = $dataDir . '/orders.json';
        $existing = [];
        if (file_exists($ordersFile)) {
            $content = file_get_contents($ordersFile);
            if (trim($content)) {
                $existing = json_decode($content, true) ?: [];
            }
        }
        if (is_array($incomingOrders)) {
            $orderMap = [];
            foreach ($existing as $ord) {
                if (isset($ord['id'])) {
                    $orderMap[$ord['id']] = $ord;
                }
            }
            foreach ($incomingOrders as $ord) {
                if (isset($ord['id'])) {
                    $orderMap[$ord['id']] = $ord;
                }
            }
            $mergedOrders = array_values($orderMap);
            $written = @file_put_contents($ordersFile, json_encode($mergedOrders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        } else {
            $written = @file_put_contents($ordersFile, $input);
        }

        // Email notification for orders
        if (is_array($incomingOrders) && count($incomingOrders) > 0) {
            $latest = end($incomingOrders);
            $to = 'info@latmedical.com.ar';
            $subject = 'Nuevo Pedido Recibido #' . ($latest['id'] ?? '');
            $itemsSummary = "";
            if (isset($latest['items']) && is_array($latest['items'])) {
                foreach ($latest['items'] as $it) {
                    $itemsSummary .= "- " . ($it['quantity'] ?? 1) . "x " . ($it['productName'] ?? '') . " (" . ($it['variantName'] ?? 'Estándar') . ")\n";
                }
            }
            $body = "Se ha recibido un nuevo pedido en latmedical.com.ar:\n\n" .
                    "ID Pedido: " . ($latest['id'] ?? '') . "\n" .
                    "Cliente: " . ($latest['fullName'] ?? '') . "\n" .
                    "Email: " . ($latest['email'] ?? '') . "\n" .
                    "Teléfono: " . ($latest['phone'] ?? '') . "\n" .
                    "Especialidad: " . ($latest['specialty'] ?? '') . "\n" .
                    "Matrícula: " . ($latest['licenseNumber'] ?? '') . "\n" .
                    "Dirección: " . ($latest['address'] ?? '') . ", " . ($latest['city'] ?? '') . ", " . ($latest['province'] ?? '') . "\n" .
                    "Método de Pago: " . ($latest['paymentMethod'] ?? '') . "\n" .
                    "Total: USD $" . ($latest['total'] ?? 0) . "\n\n" .
                    "Detalle de Productos:\n" . $itemsSummary;
            $headers = "From: noreply@latmedical.com.ar\r\n" .
                       "Reply-To: " . ($latest['email'] ?? 'info@latmedical.com.ar') . "\r\n" .
                       "Content-Type: text/plain; charset=UTF-8\r\n";
            @mail($to, $subject, $body, $headers);
        }

        if ($written !== false) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'No se pudo guardar el pedido en el servidor. Verifique permisos de api/data/']);
        }
        exit;
    }
    
    if ($endpoint === 'save-submissions') {
        $newSubmission = json_decode($input, true);
        $subFile = $dataDir . '/form_submissions.json';
        $existing = [];
        if (file_exists($subFile)) {
            $content = file_get_contents($subFile);
            if (trim($content)) {
                $existing = json_decode($content, true) ?: [];
            }
        }
        if (!isset($newSubmission['id'])) {
            $newSubmission['id'] = 'sub-' . round(microtime(true) * 1000) . '-' . rand(1, 1000);
        }
        if (!isset($newSubmission['date'])) {
            $newSubmission['date'] = date('d/m/Y, H:i:s');
        }
        $existing[] = $newSubmission;
        $written = @file_put_contents($subFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        // Email notification to info@latmedical.com.ar
        $to = 'info@latmedical.com.ar';
        $subType = $newSubmission['type'] ?? 'Contacto Web';
        $subject = 'Nuevo Formulario Recibido: ' . $subType;
        $body = "Se ha recibido un nuevo registro en latmedical.com.ar:\n\n" .
                "Fecha: " . ($newSubmission['date'] ?? '') . "\n" .
                "Tipo: " . $subType . "\n" .
                "Nombre: " . ($newSubmission['name'] ?? '') . "\n" .
                "Email: " . ($newSubmission['email'] ?? '') . "\n" .
                "Teléfono: " . ($newSubmission['phone'] ?? '') . "\n" .
                "País/Especialidad: " . ($newSubmission['country'] ?? '') . "\n" .
                "Mensaje: " . ($newSubmission['message'] ?? '') . "\n";
        $headers = "From: noreply@latmedical.com.ar\r\n" .
                   "Reply-To: " . ($newSubmission['email'] ?? 'info@latmedical.com.ar') . "\r\n" .
                   "Content-Type: text/plain; charset=UTF-8\r\n";
        @mail($to, $subject, $body, $headers);

        if ($written !== false) {
            echo json_encode(['success' => true, 'total' => count($existing)]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'No se pudo guardar el formulario en el servidor. Verifique permisos de api/data/']);
        }
        exit;
    }
    
    if ($endpoint === 'upload-image') {
        $payload = json_decode($input, true);
        $name = $payload['name'];
        $data = $payload['data'];
        
        $parts = explode(';base64,', $data);
        $base64String = end($parts);
        $decodedData = base64_decode($base64String);
        
        $uploadDir = __DIR__ . '/../images/uploads';
        if (!file_exists($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }
        
        $written = @file_put_contents($uploadDir . '/' . $name, $decodedData);
        if ($written !== false) {
            echo json_encode(['success' => true, 'url' => '/images/uploads/' . $name]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'No se pudo subir la imagen']);
        }
        exit;
    }
    
    http_response_code(404);
    echo json_encode(['success' => false, 'error' => 'Endpoint no encontrado']);
    exit;
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $knownDataFiles = [
        'form_submissions.json',
        'orders.json',
        'products.json',
        'inventory.json',
        'general_settings.json',
        'home_slides.json'
    ];
    if (in_array($endpoint, $knownDataFiles)) {
        $filePath = $dataDir . '/' . $endpoint;
        if (file_exists($filePath)) {
            echo file_get_contents($filePath);
        } else {
            echo json_encode([]);
        }
        exit;
    }
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Método no permitido']);


