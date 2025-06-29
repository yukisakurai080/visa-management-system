<?php
// CORS設定
header('Content-Type: application/json; charset=UTF-8');

// 許可するオリジンのリスト
$allowed_origins = [
    'https://visa-management-system-frontend.vercel.app',
    'https://visa-management-system-psi.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
];

// リクエストのオリジンを取得
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// オリジンが許可リストに含まれているかチェック
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    // 開発中は全てのオリジンを許可（本番環境では削除すること）
    header('Access-Control-Allow-Origin: *');
}

// その他のCORSヘッダー
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');

// OPTIONSリクエストの処理（プリフライトリクエスト）
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>