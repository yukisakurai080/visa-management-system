<?php
// 短期滞在申請の作成
require_once '../cors.php';
require_once '../config/database.php';

// POSTデータの取得
$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input data']);
    exit;
}

// データベース接続
$database = new Database();
$db = $database->getConnection();

try {
    // SQLクエリ準備
    $query = "INSERT INTO short_stay_applications 
              (form_id, application_type, family_name, given_name, 
               family_name_kana, given_name_kana, gender, date_of_birth, 
               nationality, passport_number, email, phone_number, 
               purpose_of_visit, intended_arrival_date, intended_departure_date) 
              VALUES 
              (:form_id, :application_type, :family_name, :given_name,
               :family_name_kana, :given_name_kana, :gender, :date_of_birth,
               :nationality, :passport_number, :email, :phone_number,
               :purpose_of_visit, :intended_arrival_date, :intended_departure_date)";
    
    $stmt = $db->prepare($query);
    
    // パラメータのバインド
    $stmt->bindParam(':form_id', $data->formId);
    $stmt->bindParam(':application_type', $data->applicationType);
    $stmt->bindParam(':family_name', $data->familyName);
    $stmt->bindParam(':given_name', $data->givenName);
    $stmt->bindParam(':family_name_kana', $data->familyNameKatakana);
    $stmt->bindParam(':given_name_kana', $data->givenNameKatakana);
    $stmt->bindParam(':gender', $data->gender);
    $stmt->bindParam(':date_of_birth', $data->dateOfBirth);
    $stmt->bindParam(':nationality', $data->nationality);
    $stmt->bindParam(':passport_number', $data->passportNumber);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':phone_number', $data->phoneNumber);
    $stmt->bindParam(':purpose_of_visit', $data->purposeOfVisit);
    $stmt->bindParam(':intended_arrival_date', $data->intendedDateOfArrival);
    $stmt->bindParam(':intended_departure_date', $data->intendedDateOfDeparture);
    
    // 実行
    if ($stmt->execute()) {
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