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
    const response = await fetch(`${API_BASE_URL}/applications/create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create application');
    }
    
    return response.json();
  },

  // 申請一覧を取得
  getApplications: async () => {
    const response = await fetch(`${API_BASE_URL}/applications/list.php`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    
    return response.json();
  },
};