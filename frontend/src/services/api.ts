// API通信用のサービス
const API_BASE_URL = 'https://office-tree.jp/api';

export interface ShortStayApplication {
  formId: string;
  applicationType: string;
  familyName: string;
  givenName: string;
  familyNameKatakana: string;
  givenNameKatakana: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  email: string;
  phoneNumber: string;
  purposeOfVisit: string;
  intendedDateOfArrival: string;
  intendedDateOfDeparture: string;
}

export const api = {
  // 申請を作成
  createApplication: async (data: ShortStayApplication) => {
    console.log('API sending data:', data);
    
    const response = await fetch(`${API_BASE_URL}/applications/create_fixed.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const responseText = await response.text();
    console.log('API response status:', response.status);
    console.log('API response text:', responseText);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${responseText}`);
    }
    
    try {
      return JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
  },

  // 申請一覧を取得
  getApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/applications/list_fixed.php`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    
    return response.json();
  },

  // 申請詳細を取得
  getApplicationDetail: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/applications/detail.php?id=${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch application detail');
    }
    
    return response.json();
  },

  // 申請を更新
  updateApplication: async (id: number, data: any) => {
    const response = await fetch(`${API_BASE_URL}/applications/update.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...data }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update application');
    }
    
    return response.json();
  },
};