<?php
// エラー表示を有効化（デバッグ用）
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 短期滞在申請の作成（デバッグ版）
require_once '../cors_simple.php';

try {
    // データベース接続をテスト
    require_once '../config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception('Database connection failed');
    }

    // POSTデータの取得
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData);

    // デバッグ情報を返す
    echo json_encode([
        'debug' => true,
        'received_data' => $data,
        'raw_data' => $rawData,
        'raw_data_length' => strlen($rawData),
        'database_connected' => ($db !== null),
        'php_version' => phpversion(),
        'method' => $_SERVER['REQUEST_METHOD'],
        'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set',
        'content_length' => $_SERVER['CONTENT_LENGTH'] ?? 'not set',
        'headers' => getallheaders(),
        'json_last_error' => json_last_error_msg()
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'line' => $e->getLine(),
        'file' => basename($e->getFile()),
        'trace' => $e->getTraceAsString()
    ]);
}
?>