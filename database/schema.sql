-- 在留資格管理システムデータベーススキーマ

CREATE DATABASE IF NOT EXISTS visa_management;
USE visa_management;

-- 在留資格マスターテーブル
CREATE TABLE visa_statuses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    category VARCHAR(50),
    max_period VARCHAR(50),
    work_permitted BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 国籍マスターテーブル
CREATE TABLE countries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(3) NOT NULL UNIQUE,
    name_ja VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 外国人情報テーブル
CREATE TABLE foreigners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    residence_card_number VARCHAR(20) UNIQUE,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name_kana VARCHAR(100),
    first_name_kana VARCHAR(100),
    last_name_en VARCHAR(100),
    first_name_en VARCHAR(100),
    gender ENUM('M', 'F', 'OTHER'),
    date_of_birth DATE NOT NULL,
    country_id INT,
    passport_number VARCHAR(50),
    current_visa_status_id INT,
    visa_expiry_date DATE,
    address TEXT,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    employer_name VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    FOREIGN KEY (current_visa_status_id) REFERENCES visa_statuses(id),
    INDEX idx_visa_expiry (visa_expiry_date),
    INDEX idx_residence_card (residence_card_number)
);

-- 在留資格履歴テーブル
CREATE TABLE visa_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    foreigner_id INT NOT NULL,
    visa_status_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    residence_card_number VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (foreigner_id) REFERENCES foreigners(id) ON DELETE CASCADE,
    FOREIGN KEY (visa_status_id) REFERENCES visa_statuses(id),
    INDEX idx_foreigner (foreigner_id)
);

-- 申請書テンプレートテーブル
CREATE TABLE application_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE,
    visa_status_id INT,
    template_type VARCHAR(50),
    template_content JSON,
    form_fields JSON,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (visa_status_id) REFERENCES visa_statuses(id)
);

-- 申請書生成履歴テーブル
CREATE TABLE generated_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    foreigner_id INT NOT NULL,
    template_id INT NOT NULL,
    application_data JSON,
    file_path VARCHAR(500),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    generated_by INT,
    FOREIGN KEY (foreigner_id) REFERENCES foreigners(id) ON DELETE CASCADE,
    FOREIGN KEY (template_id) REFERENCES application_templates(id)
);

-- お問合せフォーム回答テーブル
CREATE TABLE inquiry_responses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inquiry_type VARCHAR(50),
    respondent_name VARCHAR(255),
    respondent_email VARCHAR(255),
    respondent_phone VARCHAR(20),
    form_data JSON,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- お問合せから生成された申請書テーブル
CREATE TABLE inquiry_applications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    inquiry_id INT NOT NULL,
    foreigner_id INT,
    template_id INT,
    application_data JSON,
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inquiry_id) REFERENCES inquiry_responses(id),
    FOREIGN KEY (foreigner_id) REFERENCES foreigners(id),
    FOREIGN KEY (template_id) REFERENCES application_templates(id)
);

-- アラート設定テーブル
CREATE TABLE alert_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    days_before_expiry INT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 送信済みアラートテーブル
CREATE TABLE sent_alerts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    foreigner_id INT NOT NULL,
    alert_type VARCHAR(50),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date DATE,
    FOREIGN KEY (foreigner_id) REFERENCES foreigners(id) ON DELETE CASCADE,
    INDEX idx_sent_at (sent_at)
);

-- ユーザーテーブル（システム管理用）
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'viewer') DEFAULT 'staff',
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 初期データ挿入例
INSERT INTO alert_settings (name, days_before_expiry) VALUES
('30日前アラート', 30),
('60日前アラート', 60),
('90日前アラート', 90);