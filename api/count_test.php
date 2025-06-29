<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

try {
    $host = 'localhost';
    $dbname = 'xs708838_db';
    $username = 'xs708838_admin';
    $password = 'test0307';
    
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // テーブルの件数を確認
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM short_stay_applications");
    $count = $stmt->fetch()['count'];
    
    // 最新の5件を取得
    $stmt = $pdo->query("SELECT * FROM short_stay_applications ORDER BY id DESC LIMIT 5");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'total_count' => $count,
        'latest_data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'error' => $e->getMessage()
    ]);
}
?>