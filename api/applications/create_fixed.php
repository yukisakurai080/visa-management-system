<?php
// 短期滞在申請の作成（修正版）
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
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);

    if (!$data) {
        throw new Exception('Invalid JSON data received');
    }

    // 日付を適切な形式に変換
    $date_of_birth = !empty($data['dateOfBirth']) ? date('Y-m-d', strtotime($data['dateOfBirth'])) : null;
    $intended_arrival_date = !empty($data['intendedDateOfArrival']) ? date('Y-m-d', strtotime($data['intendedDateOfArrival'])) : null;
    $intended_departure_date = !empty($data['intendedDateOfDeparture']) ? date('Y-m-d', strtotime($data['intendedDateOfDeparture'])) : null;
    
    // SQLクエリ準備
    $query = "INSERT INTO short_stay_applications 
              (form_id, application_type, family_name, given_name, 
               family_name_kana, given_name_kana, gender, date_of_birth, 
               nationality, passport_number, email, phone_number, 
               purpose_of_visit, intended_arrival_date, intended_departure_date) 
              VALUES 
              (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmt = $db->prepare($query);
    
    // パラメータをバインドして実行
    $result = $stmt->execute([
        $data['formId'] ?? '',
        $data['applicationType'] ?? '',
        $data['familyName'] ?? '',
        $data['givenName'] ?? '',
        $data['familyNameKatakana'] ?? '',
        $data['givenNameKatakana'] ?? '',
        $data['gender'] ?? '',
        $date_of_birth,
        $data['nationality'] ?? '',
        $data['passportNumber'] ?? '',
        $data['email'] ?? '',
        $data['phoneNumber'] ?? '',
        $data['purposeOfVisit'] ?? '',
        $intended_arrival_date,
        $intended_departure_date
    ]);
    
    if ($result) {
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Application created successfully',
            'id' => $db->lastInsertId()
        ]);
    } else {
        throw new Exception('Failed to create application');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>