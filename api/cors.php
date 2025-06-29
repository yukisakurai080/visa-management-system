<?php
// CORS設定
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: https://visa-management-system-frontend.vercel.app');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Max-Age: 86400');

// OPTIONSリクエストの処理
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>