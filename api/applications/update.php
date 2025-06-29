<?php
// 申請内容の更新
require_once '../cors_simple.php';
require_once '../config/database.php';

try {
    // データベース接続
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        throw new Exception('Database connection failed');
    }

    // POSTデータの取得
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON data');
    }
    
    $id = $input['id'] ?? null;
    
    if (!$id) {
        throw new Exception('ID is required');
    }
    
    // 更新するフィールド
    $updateFields = [
        'family_name' => $input['family_name'] ?? '',
        'given_name' => $input['given_name'] ?? '',
        'family_name_kana' => $input['family_name_kana'] ?? '',
        'given_name_kana' => $input['given_name_kana'] ?? '',
        'gender' => $input['gender'] ?? '',
        'date_of_birth' => $input['date_of_birth'] ?? '',
        'nationality' => $input['nationality'] ?? '',
        'passport_number' => $input['passport_number'] ?? '',
        'email' => $input['email'] ?? '',
        'phone_number' => $input['phone_number'] ?? '',
        'purpose_of_visit' => $input['purpose_of_visit'] ?? '',
        'intended_arrival_date' => $input['intended_arrival_date'] ?? '',
        'intended_departure_date' => $input['intended_departure_date'] ?? '',
        'updated_at' => date('Y-m-d H:i:s')
    ];
    
    // SQLクエリを構築
    $setParts = [];
    $values = [];
    
    foreach ($updateFields as $field => $value) {
        $setParts[] = "$field = ?";
        $values[] = $value;
    }
    
    $values[] = $id; // WHERE条件用のIDを最後に追加
    
    $query = "UPDATE short_stay_applications SET " . implode(', ', $setParts) . " WHERE id = ?";
    $stmt = $db->prepare($query);
    $stmt->execute($values);
    
    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Application updated successfully'
        ]);
    } else {
        throw new Exception('No rows updated. Application may not exist.');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>