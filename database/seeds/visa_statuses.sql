-- 在留資格マスターデータ
-- 出入国在留管理庁の在留資格一覧に基づく

INSERT INTO visa_statuses (code, name, name_en, category, max_period, work_permitted) VALUES
-- 就労資格
('diplomat', '外交', 'Diplomat', '就労資格', '外交活動期間', FALSE),
('official', '公用', 'Official', '就労資格', '公用活動期間', FALSE),
('professor', '教授', 'Professor', '就労資格', '5年、3年、1年又は3月', TRUE),
('artist', '芸術', 'Artist', '就労資格', '5年、3年、1年又は3月', TRUE),
('religious', '宗教', 'Religious Activities', '就労資格', '5年、3年、1年又は3月', TRUE),
('journalist', '報道', 'Journalist', '就労資格', '5年、3年、1年又は3月', TRUE),
('highly_skilled_1a', '高度専門職1号イ', 'Highly Skilled Professional(i)(a)', '就労資格', '5年', TRUE),
('highly_skilled_1b', '高度専門職1号ロ', 'Highly Skilled Professional(i)(b)', '就労資格', '5年', TRUE),
('highly_skilled_1c', '高度専門職1号ハ', 'Highly Skilled Professional(i)(c)', '就労資格', '5年', TRUE),
('highly_skilled_2', '高度専門職2号', 'Highly Skilled Professional(ii)', '就労資格', '無期限', TRUE),
('business_manager', '経営・管理', 'Business Manager', '就労資格', '5年、3年、1年、6月、4月又は3月', TRUE),
('legal_accounting', '法律・会計業務', 'Legal/Accounting Services', '就労資格', '5年、3年、1年又は3月', TRUE),
('medical', '医療', 'Medical Services', '就労資格', '5年、3年、1年又は3月', TRUE),
('researcher', '研究', 'Researcher', '就労資格', '5年、3年、1年又は3月', TRUE),
('instructor', '教育', 'Instructor', '就労資格', '5年、3年、1年又は3月', TRUE),
('engineer', '技術・人文知識・国際業務', 'Engineer/Specialist in Humanities/International Services', '就労資格', '5年、3年、1年又は3月', TRUE),
('intra_company_transferee', '企業内転勤', 'Intra-company Transferee', '就労資格', '5年、3年、1年又は3月', TRUE),
('nursing_care', '介護', 'Nursing Care', '就労資格', '5年、3年、1年又は3月', TRUE),
('entertainer', '興行', 'Entertainer', '就労資格', '3年、1年、6月、3月又は15日', TRUE),
('skilled_labor', '技能', 'Skilled Labor', '就労資格', '5年、3年、1年又は3月', TRUE),
('specified_skilled_1', '特定技能1号', 'Specified Skilled Worker(i)', '就労資格', '1年、6月又は4月', TRUE),
('specified_skilled_2', '特定技能2号', 'Specified Skilled Worker(ii)', '就労資格', '3年、1年又は6月', TRUE),
('technical_intern_1a', '技能実習1号イ', 'Technical Intern Training(i)(a)', '就労資格', '1年又は6月', TRUE),
('technical_intern_1b', '技能実習1号ロ', 'Technical Intern Training(i)(b)', '就労資格', '1年又は6月', TRUE),
('technical_intern_2a', '技能実習2号イ', 'Technical Intern Training(ii)(a)', '就労資格', '2年又は1年', TRUE),
('technical_intern_2b', '技能実習2号ロ', 'Technical Intern Training(ii)(b)', '就労資格', '2年又は1年', TRUE),
('technical_intern_3a', '技能実習3号イ', 'Technical Intern Training(iii)(a)', '就労資格', '2年又は1年', TRUE),
('technical_intern_3b', '技能実習3号ロ', 'Technical Intern Training(iii)(b)', '就労資格', '2年又は1年', TRUE),

-- 非就労資格
('cultural_activities', '文化活動', 'Cultural Activities', '非就労資格', '3年、1年、6月又は3月', FALSE),
('temporary_visitor', '短期滞在', 'Temporary Visitor', '非就労資格', '90日、30日又は15日', FALSE),
('student', '留学', 'Student', '非就労資格', '4年3月、4年、3年3月、3年、2年3月、2年、1年3月、1年、6月又は3月', FALSE),
('trainee', '研修', 'Trainee', '非就労資格', '1年、6月又は3月', FALSE),
('dependent', '家族滞在', 'Dependent', '非就労資格', '5年、4年3月、4年、3年3月、3年、2年3月、2年、1年3月、1年、6月又は3月', FALSE),

-- 居住資格
('permanent_resident', '永住者', 'Permanent Resident', '居住資格', '無期限', TRUE),
('spouse_japanese', '日本人の配偶者等', 'Spouse or Child of Japanese National', '居住資格', '5年、3年、1年又は6月', TRUE),
('spouse_permanent_resident', '永住者の配偶者等', 'Spouse or Child of Permanent Resident', '居住資格', '5年、3年、1年又は6月', TRUE),
('long_term_resident', '定住者', 'Long Term Resident', '居住資格', '5年、3年、1年、6月又は特定活動の在留期間', TRUE),

-- 特定活動
('designated_activities', '特定活動', 'Designated Activities', '特定活動', '5年、3年、1年、6月、3月又は法務大臣が指定する期間', NULL);