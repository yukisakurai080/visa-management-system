<?php
// 申請一覧の取得（デバッグ版）
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

// エラー表示を有効化
ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    require_once '../config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception('Database connection failed');
    }
    
    // SQLクエリ
    $query = "SELECT * FROM short_stay_applications ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $applications = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $applications[] = $row;
    }
    
    // 件数も確認
    $countQuery = "SELECT COUNT(*) as total FROM short_stay_applications";
    $countStmt = $db->prepare($countQuery);
    $countStmt->execute();
    $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'data' => $applications,
        'count' => count($applications),
        'total_in_db' => $totalCount,
        'query_executed' => $query,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'line' => $e->getLine(),
        'file' => basename($e->getFile())
    ]);
}
?>