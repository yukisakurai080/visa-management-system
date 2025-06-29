<?php
// 直接テスト用のエンドポイント
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// エラー表示を有効化
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // データベース接続
    $host = 'localhost';
    $dbname = 'xs708838_db';
    $username = 'xs708838_admin';
    $password = 'test0307';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // POSTデータを取得
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);
    
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $data) {
        // 実際にデータベースに挿入
        $sql = "INSERT INTO short_stay_applications 
                (form_id, application_type, family_name, given_name, email, phone_number, nationality) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data['formId'] ?? 'test-' . time(),
            $data['applicationType'] ?? 'test',
            $data['familyName'] ?? '',
            $data['givenName'] ?? '',
            $data['email'] ?? '',
            $data['phoneNumber'] ?? '',
            $data['nationality'] ?? ''
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Data inserted successfully',
            'id' => $pdo->lastInsertId()
        ]);
    } else {
        echo json_encode([
            'debug' => true,
            'method' => $_SERVER['REQUEST_METHOD'],
            'received_data' => $data,
            'raw_data' => $rawData,
            'raw_data_length' => strlen($rawData)
        ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'line' => $e->getLine()
    ]);
}
?>