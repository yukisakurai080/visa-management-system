<?php
// エラー表示を有効化（デバッグ用）
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// CORS設定
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

// データベース接続テスト
try {
    require_once 'config/database.php';
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db) {
        echo json_encode([
            'database' => 'Connected successfully',
            'php_version' => phpversion(),
            'post_max_size' => ini_get('post_max_size'),
            'upload_max_filesize' => ini_get('upload_max_filesize')
        ]);
    } else {
        echo json_encode(['error' => 'Database connection failed']);
    }
} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage(),
        'line' => $e->getLine(),
        'file' => $e->getFile()
    ]);
}
?>