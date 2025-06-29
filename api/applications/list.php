<?php
// 申請一覧の取得
require_once '../cors.php';
require_once '../config/database.php';

// データベース接続
$database = new Database();
$db = $database->getConnection();

try {
    // SQLクエリ
    $query = "SELECT * FROM short_stay_applications ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $applications = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $applications[] = $row;
    }
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $applications,
        'count' => count($applications)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>