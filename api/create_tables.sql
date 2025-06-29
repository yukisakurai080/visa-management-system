-- 短期滞在申請フォーム用テーブル
CREATE TABLE IF NOT EXISTS short_stay_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  form_id VARCHAR(100) UNIQUE NOT NULL,
  application_type VARCHAR(50) NOT NULL,
  
  -- 申請者基本情報
  family_name VARCHAR(100) NOT NULL,
  given_name VARCHAR(100) NOT NULL,
  family_name_kana VARCHAR(100),
  given_name_kana VARCHAR(100),
  gender VARCHAR(10),
  date_of_birth DATE,
  nationality VARCHAR(50),
  passport_number VARCHAR(50),
  
  -- 連絡先情報
  email VARCHAR(100),
  phone_number VARCHAR(50),
  
  -- 渡航情報
  purpose_of_visit TEXT,
  intended_arrival_date DATE,
  intended_departure_date DATE,
  
  -- 招へい人情報（後で追加可能）
  inviter_name VARCHAR(100),
  inviter_relationship VARCHAR(100),
  
  -- メタ情報
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'submitted',
  
  INDEX idx_form_id (form_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 管理者ユーザーテーブル（必要に応じて）
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;