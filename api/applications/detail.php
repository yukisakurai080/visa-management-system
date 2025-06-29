<?php
// 申請詳細の取得
require_once '../cors_simple.php';
require_once '../config/database.php';

try {
    // データベース接続
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception('Database connection failed');
    }

    // IDパラメータの取得
    $id = $_GET['id'] ?? null;
    
    if (!$id) {
        throw new Exception('ID parameter is required');
    }
    
    // SQLクエリ
    $query = "SELECT * FROM short_stay_applications WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute([$id]);
    
    $application = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$application) {
        throw new Exception('Application not found');
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $application
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>