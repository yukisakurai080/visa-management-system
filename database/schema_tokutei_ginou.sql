-- 特定技能管理システム追加スキーマ

-- 業務区分マスターテーブル
CREATE TABLE business_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_code VARCHAR(10) NOT NULL UNIQUE,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    max_workers INT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 従事業務マスターテーブル
CREATE TABLE job_duties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    business_category_id INT NOT NULL,
    duty_code VARCHAR(20) NOT NULL,
    duty_name VARCHAR(200) NOT NULL,
    skill_level ENUM('basic', 'intermediate', 'advanced') DEFAULT 'basic',
    description TEXT,
    required_experience_months INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_category_id) REFERENCES business_categories(id)
);

-- 受入機関テーブル
CREATE TABLE receiving_organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_name VARCHAR(255) NOT NULL,
    organization_name_kana VARCHAR(255),
    registration_number VARCHAR(50) UNIQUE,
    representative_name VARCHAR(100),
    postal_code VARCHAR(10),
    address TEXT,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    industry_type VARCHAR(100),
    employee_count INT,
    capital_amount BIGINT,
    established_date DATE,
    business_categories JSON, -- 対応可能な業務区分
    status ENUM('active', 'suspended', 'cancelled') DEFAULT 'active',
    registration_date DATE,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 登録支援機関テーブル
CREATE TABLE support_organizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    organization_name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(50) UNIQUE,
    representative_name VARCHAR(100),
    address TEXT,
    phone_number VARCHAR(20),
    email VARCHAR(255),
    support_services JSON, -- 提供可能な支援サービス
    supported_languages JSON, -- 対応可能言語
    business_categories JSON, -- 対応可能な業務区分
    status ENUM('active', 'suspended', 'cancelled') DEFAULT 'active',
    registration_date DATE,
    expiry_date DATE,
    fee_structure JSON, -- 料金体系
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 特定技能外国人テーブル（外国人テーブルの拡張）
CREATE TABLE tokutei_ginou_workers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    foreigner_id INT NOT NULL UNIQUE,
    tokutei_ginou_type ENUM('1', '2') NOT NULL,
    business_category_id INT NOT NULL,
    receiving_organization_id INT NOT NULL,
    support_organization_id INT,
    job_duties JSON, -- 従事する業務
    previous_visa_status VARCHAR(100), -- 前の在留資格
    transition_from_technical_intern BOOLEAN DEFAULT FALSE,
    technical_intern_completion_date DATE,
    skill_test_results JSON, -- 技能試験結果
    japanese_test_results JSON, -- 日本語試験結果
    contract_start_date DATE,
    contract_end_date DATE,
    monthly_salary INT,
    working_hours_per_week INT,
    workplace_address TEXT,
    accommodation_type ENUM('company_dormitory', 'rental', 'own', 'other'),
    accommodation_address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    status ENUM('active', 'on_leave', 'transferred', 'returned', 'other') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (foreigner_id) REFERENCES foreigners(id) ON DELETE CASCADE,
    FOREIGN KEY (business_category_id) REFERENCES business_categories(id),
    FOREIGN KEY (receiving_organization_id) REFERENCES receiving_organizations(id),
    FOREIGN KEY (support_organization_id) REFERENCES support_organizations(id)
);

-- 支援計画テーブル
CREATE TABLE support_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    worker_id INT NOT NULL,
    plan_type ENUM('initial', 'ongoing', 'special') DEFAULT 'initial',
    plan_title VARCHAR(255) NOT NULL,
    plan_description TEXT,
    planned_start_date DATE,
    planned_end_date DATE,
    support_items JSON, -- 支援項目の詳細
    responsible_person VARCHAR(100),
    budget_amount INT,
    status ENUM('draft', 'approved', 'in_progress', 'completed', 'cancelled') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES tokutei_ginou_workers(id) ON DELETE CASCADE
);

-- 支援実施記録テーブル
CREATE TABLE support_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    worker_id INT NOT NULL,
    support_plan_id INT,
    support_date DATE NOT NULL,
    support_type VARCHAR(100) NOT NULL,
    support_content TEXT NOT NULL,
    duration_minutes INT,
    participants JSON, -- 参加者
    location VARCHAR(255),
    materials_used TEXT,
    outcome TEXT,
    next_action TEXT,
    responsible_person VARCHAR(100),
    attachments JSON, -- 添付ファイル
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES tokutei_ginou_workers(id) ON DELETE CASCADE,
    FOREIGN KEY (support_plan_id) REFERENCES support_plans(id)
);

-- 技能評価記録テーブル
CREATE TABLE skill_evaluations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    worker_id INT NOT NULL,
    evaluation_date DATE NOT NULL,
    evaluation_type ENUM('skill_test', 'workplace_evaluation', 'self_assessment', 'other'),
    test_name VARCHAR(200),
    score VARCHAR(50),
    max_score VARCHAR(50),
    pass_status ENUM('pass', 'fail', 'pending'),
    evaluation_details JSON,
    evaluator_name VARCHAR(100),
    certificate_number VARCHAR(100),
    certificate_expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES tokutei_ginou_workers(id) ON DELETE CASCADE
);

-- 日本語能力評価記録テーブル
CREATE TABLE japanese_evaluations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    worker_id INT NOT NULL,
    evaluation_date DATE NOT NULL,
    test_type ENUM('JLPT', 'JFT-Basic', 'workplace_test', 'other'),
    test_level VARCHAR(20),
    score VARCHAR(50),
    pass_status ENUM('pass', 'fail', 'pending'),
    certificate_number VARCHAR(100),
    certificate_expiry_date DATE,
    listening_score VARCHAR(20),
    reading_score VARCHAR(20),
    speaking_score VARCHAR(20),
    writing_score VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (worker_id) REFERENCES tokutei_ginou_workers(id) ON DELETE CASCADE
);

-- 報告書テーブル
CREATE TABLE reports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    report_type ENUM('quarterly', 'annual', 'incident', 'custom'),
    title VARCHAR(255) NOT NULL,
    reporting_period_start DATE,
    reporting_period_end DATE,
    organization_id INT,
    organization_type ENUM('receiving', 'support'),
    report_data JSON,
    file_path VARCHAR(500),
    status ENUM('draft', 'submitted', 'approved') DEFAULT 'draft',
    submitted_at TIMESTAMP NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 初期データ挿入
INSERT INTO business_categories (category_code, category_name, description, max_workers) VALUES
('01', '介護', '高齢者や障害者の身体上又は精神上の世話', 60000),
('02', 'ビルクリーニング', '建築物内部の清掃', 37000),
('03', '素形材産業', '鋳造、鍛造、ダイカスト等', 21500),
('04', '産業機械製造業', '工業用機械器具製造', 5250),
('05', '電気・電子情報関連産業', '電気機械器具製造等', 4700),
('06', '建設', '型枠施工、左官、とび等', 40000),
('07', '造船・舶用工業', '溶接、塗装、鉄工等', 13000),
('08', '自動車整備', '自動車の日常点検整備等', 7000),
('09', '航空', '空港グランドハンドリング等', 2200),
('10', '宿泊', 'フロント、企画・広報等', 22000),
('11', '農業', '耕種農業、畜産農業', 36500),
('12', '漁業', '漁船漁業、養殖業', 9000),
('13', '飲食料品製造業', '食料品製造業全般', 34000),
('14', '外食業', '外食業全般', 53000);