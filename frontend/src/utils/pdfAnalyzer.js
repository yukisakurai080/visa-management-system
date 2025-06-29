// PDFフォームフィールド分析ツール
export const analyzePdfFields = async (pdfPath) => {
  try {
    const { PDFDocument } = await import('pdf-lib');
    
    // PDFファイルを読み込み
    const existingPdfBytes = await fetch(pdfPath).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // フォームを取得
    const form = pdfDoc.getForm();
    
    // 全フォームフィールドを取得
    const fields = form.getFields();
    
    console.log('=== PDF Form Fields Analysis ===');
    console.log(`Total fields found: ${fields.length}`);
    
    const fieldInfo = [];
    
    fields.forEach((field, index) => {
      const fieldData = {
        index: index,
        name: field.getName(),
        type: field.constructor.name,
        isRequired: field.isRequired ? field.isRequired() : false,
        isReadOnly: field.isReadOnly ? field.isReadOnly() : false,
      };
      
      // フィールドタイプ別の詳細情報
      if (field.constructor.name === 'PDFTextField') {
        fieldData.maxLength = field.getMaxLength ? field.getMaxLength() : 'unlimited';
        fieldData.defaultValue = field.getText ? field.getText() : '';
        fieldData.isMultiline = field.isMultiline ? field.isMultiline() : false;
      } else if (field.constructor.name === 'PDFCheckBox') {
        fieldData.isChecked = field.isChecked ? field.isChecked() : false;
      } else if (field.constructor.name === 'PDFDropdown') {
        fieldData.options = field.getOptions ? field.getOptions() : [];
        fieldData.selectedOption = field.getSelected ? field.getSelected() : '';
      }
      
      fieldInfo.push(fieldData);
      
      console.log(`\nField ${index + 1}:`);
      console.log(`  Name: "${fieldData.name}"`);
      console.log(`  Type: ${fieldData.type}`);
      console.log(`  Required: ${fieldData.isRequired}`);
      console.log(`  ReadOnly: ${fieldData.isReadOnly}`);
      
      if (fieldData.maxLength) {
        console.log(`  Max Length: ${fieldData.maxLength}`);
      }
      if (fieldData.defaultValue) {
        console.log(`  Default Value: "${fieldData.defaultValue}"`);
      }
      if (fieldData.isMultiline !== undefined) {
        console.log(`  Multiline: ${fieldData.isMultiline}`);
      }
      if (fieldData.options) {
        console.log(`  Options: ${JSON.stringify(fieldData.options)}`);
      }
    });
    
    return fieldInfo;
    
  } catch (error) {
    console.error('PDF analysis failed:', error);
    return [];
  }
};

// フィールドマッピングを提案する関数
export const suggestFieldMapping = (fieldInfo, applicationData) => {
  const mapping = {};
  
  // よくあるフィールド名パターンと推測
  const commonPatterns = {
    // 名前関連
    'family_name': ['family_name', 'surname', 'last_name', '姓', 'みょうじ'],
    'given_name': ['given_name', 'first_name', 'name', '名', 'なまえ'],
    'family_name_kana': ['family_name_kana', 'surname_kana', '姓カナ', 'セイ'],
    'given_name_kana': ['given_name_kana', 'first_name_kana', '名カナ', 'メイ'],
    
    // 基本情報
    'gender': ['gender', 'sex', '性別'],
    'date_of_birth': ['date_of_birth', 'birth_date', 'dob', '生年月日'],
    'nationality': ['nationality', 'country', '国籍'],
    'passport_number': ['passport_number', 'passport', 'パスポート番号'],
    
    // 連絡先
    'email': ['email', 'mail', 'e_mail', 'メール'],
    'phone_number': ['phone_number', 'phone', 'tel', '電話番号'],
    
    // 渡航情報
    'purpose_of_visit': ['purpose_of_visit', 'purpose', '訪問目的'],
    'intended_arrival_date': ['intended_arrival_date', 'arrival_date', '入国予定日'],
    'intended_departure_date': ['intended_departure_date', 'departure_date', '出国予定日']
  };
  
  // フィールド名を分析してマッピングを提案
  fieldInfo.forEach(field => {
    const fieldName = field.name.toLowerCase();
    
    for (const [dataKey, patterns] of Object.entries(commonPatterns)) {
      if (patterns.some(pattern => fieldName.includes(pattern.toLowerCase()))) {
        mapping[field.name] = dataKey;
        break;
      }
    }
  });
  
  console.log('\n=== Suggested Field Mapping ===');
  console.log(mapping);
  
  return mapping;
};