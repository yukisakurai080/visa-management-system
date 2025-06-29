import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  Collapse,
  Alert,
  LinearProgress,
  CircularProgress,
} from '@mui/material'
import {
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  FamilyRestroom as FamilyIcon,
  Flight as FlightIcon,
  Business as BusinessIcon,
  Groups as GroupsIcon,
} from '@mui/icons-material'

interface ShortStayFormData {
  // 申請者基本情報
  familyName: string
  givenName: string
  familyNameKatakana: string
  givenNameKatakana: string
  gender: string
  dateOfBirth: string
  placeOfBirth: string
  nationality: string
  passportNumber: string
  passportIssueDate: string
  passportExpiryDate: string
  passportIssuePlace: string
  
  // 現住所・連絡先
  currentAddress: string
  phoneNumber: string
  email: string
  
  // 職業・勤務先
  occupation: string
  companyName: string
  companyAddress: string
  companyPhone: string
  position: string
  
  // 渡航目的・滞在予定
  purposeOfVisit: string
  intendedLengthOfStay: string
  intendedDateOfArrival: string
  intendedDateOfDeparture: string
  portOfEntry: string
  
  // 滞在先
  accommodationType: string
  accommodationName: string
  accommodationAddress: string
  accommodationPhone: string
  
  // 招へい人情報
  inviterName: string
  inviterRelationship: string
  inviterAddress: string
  inviterPhone: string
  inviterOccupation: string
  inviterNationality: string
  
  // 身元保証人情報
  guarantorName: string
  guarantorRelationship: string
  guarantorAddress: string
  guarantorPhone: string
  guarantorOccupation: string
  
  // 費用負担
  travelExpenseBearer: string
  stayExpenseBearer: string
  
  // 過去の渡航歴
  hasVisitedJapan: string
  lastVisitDate: string
  lastVisitPurpose: string
  lastVisitLength: string
  
  // その他
  hasBeenRefused: string
  refusalDetails: string
  accompaniedPersons: string
  accompaniedDetails: string
  otherCountriesVisited: string
  criminalRecord: string
  
  // 連絡先（緊急時）
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
}

const ShortStayCustomerForm = () => {
  const { type, formId } = useParams<{ type: string; formId: string }>()
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<ShortStayFormData>({
    familyName: '',
    givenName: '',
    familyNameKatakana: '',
    givenNameKatakana: '',
    gender: '',
    dateOfBirth: '',
    placeOfBirth: '',
    nationality: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    passportIssuePlace: '',
    currentAddress: '',
    phoneNumber: '',
    email: '',
    occupation: '',
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    position: '',
    purposeOfVisit: '',
    intendedLengthOfStay: '',
    intendedDateOfArrival: '',
    intendedDateOfDeparture: '',
    portOfEntry: '',
    accommodationType: '',
    accommodationName: '',
    accommodationAddress: '',
    accommodationPhone: '',
    inviterName: '',
    inviterRelationship: '',
    inviterAddress: '',
    inviterPhone: '',
    inviterOccupation: '',
    inviterNationality: '',
    guarantorName: '',
    guarantorRelationship: '',
    guarantorAddress: '',
    guarantorPhone: '',
    guarantorOccupation: '',
    travelExpenseBearer: '',
    stayExpenseBearer: '',
    hasVisitedJapan: '',
    lastVisitDate: '',
    lastVisitPurpose: '',
    lastVisitLength: '',
    hasBeenRefused: '',
    refusalDetails: '',
    accompaniedPersons: '',
    accompaniedDetails: '',
    otherCountriesVisited: '',
    criminalRecord: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  })

  const steps = ['基本情報の入力', '渡航・滞在情報の入力']

  const getFormInfo = (visitType: string) => {
    switch (visitType) {
      case 'family-visit':
        return {
          title: '短期滞在ビザ申請書（親族訪問）',
          icon: <FamilyIcon />,
          color: '#f57c00',
          description: '日本に住む親族を訪問される方の申請書です'
        }
      case 'friend-visit':
        return {
          title: '短期滞在ビザ申請書（知人訪問）',
          icon: <GroupsIcon />,
          color: '#1976d2',
          description: '日本に住む知人・友人を訪問される方の申請書です'
        }
      case 'tourism':
        return {
          title: '短期滞在ビザ申請書（観光）',
          icon: <FlightIcon />,
          color: '#388e3c',
          description: '日本への観光目的の方の申請書です'
        }
      case 'business':
        return {
          title: '短期滞在ビザ申請書（商用）',
          icon: <BusinessIcon />,
          color: '#7b1fa2',
          description: 'ビジネス・商用目的の方の申請書です'
        }
      default:
        return {
          title: '短期滞在ビザ申請書',
          icon: <FlightIcon />,
          color: '#757575',
          description: '短期滞在目的の申請書です'
        }
    }
  }

  const formInfo = getFormInfo(type || '')

  const handleInputChange = (field: keyof ShortStayFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    setActiveStep(prev => prev + 1)
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      // APIに送信するデータを準備
      const applicationData = {
        formId: formId || '',
        applicationType: type || '',
        familyName: formData.familyName,
        givenName: formData.givenName,
        familyNameKatakana: formData.familyNameKatakana,
        givenNameKatakana: formData.givenNameKatakana,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        nationality: formData.nationality,
        passportNumber: formData.passportNumber,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        purposeOfVisit: formData.purposeOfVisit,
        intendedDateOfArrival: formData.intendedDateOfArrival,
        intendedDateOfDeparture: formData.intendedDateOfDeparture,
      }
      
      // APIに送信
      const result = await api.createApplication(applicationData)
      
      if (result.success) {
        alert('短期滞在ビザ申請書の入力が完了しました。ありがとうございます。')
        // 成功ページへリダイレクトなど
      } else {
        throw new Error(result.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      alert('申請の送信中にエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((activeStep + 1) / steps.length) * 100

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          {formInfo.title}
        </Typography>
        <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
          {formInfo.description}
        </Typography>

        {/* プログレスバー */}
        <Box sx={{ mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              {steps[activeStep]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={3}>
          <CardContent sx={{ p: 4 }}>
            {activeStep === 0 && (
              <Box>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <PersonIcon color="primary" />
                  <Typography variant="h5">STEP1: 基本情報の入力</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  申請者ご本人の情報をご記入ください
                </Typography>

                <Grid container spacing={3}>
                  {/* 氏名（英字） */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="姓（英字）"
                      required
                      value={formData.familyName}
                      onChange={(e) => handleInputChange('familyName', e.target.value)}
                      placeholder="例：YAMADA"
                      helperText="パスポートと同じ表記で入力してください"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="名（英字）"
                      required
                      value={formData.givenName}
                      onChange={(e) => handleInputChange('givenName', e.target.value)}
                      placeholder="例：HANAKO"
                      helperText="パスポートと同じ表記で入力してください"
                    />
                  </Grid>

                  {/* 氏名（カタカナ） */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="姓（カタカナ）"
                      value={formData.familyNameKatakana}
                      onChange={(e) => handleInputChange('familyNameKatakana', e.target.value)}
                      placeholder="例：ヤマダ"
                      helperText="日本語読みをカタカナで入力（任意）"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="名（カタカナ）"
                      value={formData.givenNameKatakana}
                      onChange={(e) => handleInputChange('givenNameKatakana', e.target.value)}
                      placeholder="例：ハナコ"
                      helperText="日本語読みをカタカナで入力（任意）"
                    />
                  </Grid>

                  {/* 性別 */}
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">性別 *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.gender}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                      >
                        <FormControlLabel value="男性" control={<Radio />} label="男性" />
                        <FormControlLabel value="女性" control={<Radio />} label="女性" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* 生年月日 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="生年月日"
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* 出生地 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="出生地"
                      required
                      value={formData.placeOfBirth}
                      onChange={(e) => handleInputChange('placeOfBirth', e.target.value)}
                      placeholder="例：Seoul, Korea"
                      helperText="国・都市名を英語で入力"
                    />
                  </Grid>

                  {/* 国籍 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="国籍"
                      required
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      placeholder="例：Republic of Korea"
                    />
                  </Grid>

                  {/* パスポート情報 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">パスポート情報</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="パスポート番号"
                      required
                      value={formData.passportNumber}
                      onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                      placeholder="例：M12345678"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="パスポート発行地"
                      required
                      value={formData.passportIssuePlace}
                      onChange={(e) => handleInputChange('passportIssuePlace', e.target.value)}
                      placeholder="例：Seoul"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="パスポート発行日"
                      type="date"
                      required
                      value={formData.passportIssueDate}
                      onChange={(e) => handleInputChange('passportIssueDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="パスポート有効期限"
                      type="date"
                      required
                      value={formData.passportExpiryDate}
                      onChange={(e) => handleInputChange('passportExpiryDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* 現住所・連絡先 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">現住所・連絡先</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="現住所"
                      required
                      multiline
                      rows={2}
                      value={formData.currentAddress}
                      onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                      placeholder="現在お住まいの住所を英語で記入"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="電話番号"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="例：+82-10-1234-5678"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="メールアドレス"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="例：example@email.com"
                    />
                  </Grid>

                  {/* 職業・勤務先 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">職業・勤務先</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="職業"
                      required
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      placeholder="例：Engineer, Teacher, Student"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="役職・地位"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      placeholder="例：Manager, Senior Engineer"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="勤務先・学校名"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="例：ABC Company Limited"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="勤務先電話番号"
                      value={formData.companyPhone}
                      onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                      placeholder="例：+82-2-1234-5678"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="勤務先住所"
                      multiline
                      rows={2}
                      value={formData.companyAddress}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                      placeholder="勤務先の住所を英語で記入"
                    />
                  </Grid>

                  {/* 緊急連絡先 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">緊急連絡先</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="緊急連絡先氏名"
                      required
                      value={formData.emergencyContactName}
                      onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                      placeholder="緊急時の連絡先"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="緊急連絡先電話番号"
                      required
                      value={formData.emergencyContactPhone}
                      onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                      placeholder="例：+82-10-1234-5678"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="続柄"
                      required
                      value={formData.emergencyContactRelationship}
                      onChange={(e) => handleInputChange('emergencyContactRelationship', e.target.value)}
                      placeholder="例：父、母、配偶者"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    size="large"
                  >
                    次へ
                  </Button>
                </Box>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <FlightIcon color="primary" />
                  <Typography variant="h5">STEP2: 渡航・滞在情報の入力</Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* 訪問目的 */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="訪問目的の詳細"
                      required
                      multiline
                      rows={3}
                      value={formData.purposeOfVisit}
                      onChange={(e) => handleInputChange('purposeOfVisit', e.target.value)}
                      placeholder={
                        type === 'family-visit' ? '訪問する親族の詳細（氏名、続柄、訪問の理由など）' :
                        type === 'friend-visit' ? '訪問する知人の詳細（氏名、関係性、訪問の理由など）' :
                        type === 'tourism' ? '観光の詳細（訪問予定地、観光内容、旅行計画など）' :
                        type === 'business' ? 'ビジネスの詳細（会議内容、取引先、商談内容など）' :
                        '訪問目的の詳細をご記入ください'
                      }
                    />
                  </Grid>

                  {/* 滞在期間・渡航日程 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">渡航日程</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth required>
                      <InputLabel>滞在予定期間</InputLabel>
                      <Select
                        value={formData.intendedLengthOfStay}
                        onChange={(e) => handleInputChange('intendedLengthOfStay', e.target.value)}
                        label="滞在予定期間"
                      >
                        <MenuItem value="15日以内">15日以内</MenuItem>
                        <MenuItem value="30日以内">30日以内</MenuItem>
                        <MenuItem value="90日以内">90日以内</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="入国予定日"
                      type="date"
                      required
                      value={formData.intendedDateOfArrival}
                      onChange={(e) => handleInputChange('intendedDateOfArrival', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="出国予定日"
                      type="date"
                      required
                      value={formData.intendedDateOfDeparture}
                      onChange={(e) => handleInputChange('intendedDateOfDeparture', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>入国予定港</InputLabel>
                      <Select
                        value={formData.portOfEntry}
                        onChange={(e) => handleInputChange('portOfEntry', e.target.value)}
                        label="入国予定港"
                      >
                        <MenuItem value="成田国際空港">成田国際空港</MenuItem>
                        <MenuItem value="羽田空港">羽田空港</MenuItem>
                        <MenuItem value="関西国際空港">関西国際空港</MenuItem>
                        <MenuItem value="中部国際空港">中部国際空港</MenuItem>
                        <MenuItem value="新千歳空港">新千歳空港</MenuItem>
                        <MenuItem value="福岡空港">福岡空港</MenuItem>
                        <MenuItem value="その他">その他</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* 滞在先情報 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">滞在先情報</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">滞在先の種類 *</FormLabel>
                      <RadioGroup
                        value={formData.accommodationType}
                        onChange={(e) => handleInputChange('accommodationType', e.target.value)}
                      >
                        <FormControlLabel value="招へい人宅" control={<Radio />} label="招へい人宅" />
                        <FormControlLabel value="ホテル" control={<Radio />} label="ホテル・旅館" />
                        <FormControlLabel value="その他" control={<Radio />} label="その他" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="滞在先名称"
                      required
                      value={formData.accommodationName}
                      onChange={(e) => handleInputChange('accommodationName', e.target.value)}
                      placeholder="ホテル名、招へい人氏名など"
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="滞在先住所"
                      required
                      multiline
                      rows={2}
                      value={formData.accommodationAddress}
                      onChange={(e) => handleInputChange('accommodationAddress', e.target.value)}
                      placeholder="日本での滞在先住所"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="滞在先電話番号"
                      required
                      value={formData.accommodationPhone}
                      onChange={(e) => handleInputChange('accommodationPhone', e.target.value)}
                      placeholder="例：03-1234-5678"
                    />
                  </Grid>

                  {/* 招へい人情報 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">招へい人情報</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="招へい人氏名"
                      required
                      value={formData.inviterName}
                      onChange={(e) => handleInputChange('inviterName', e.target.value)}
                      placeholder="例：田中太郎"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="申請人との関係"
                      required
                      value={formData.inviterRelationship}
                      onChange={(e) => handleInputChange('inviterRelationship', e.target.value)}
                      placeholder={
                        type === 'family-visit' ? '例：父、母、兄弟、配偶者' :
                        type === 'friend-visit' ? '例：友人、同僚、同級生' :
                        type === 'business' ? '例：取引先、会社関係者' :
                        '例：友人'
                      }
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="招へい人住所"
                      required
                      multiline
                      rows={2}
                      value={formData.inviterAddress}
                      onChange={(e) => handleInputChange('inviterAddress', e.target.value)}
                      placeholder="例：東京都新宿区..."
                    />
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="招へい人電話番号"
                      required
                      value={formData.inviterPhone}
                      onChange={(e) => handleInputChange('inviterPhone', e.target.value)}
                      placeholder="例：03-1234-5678"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="招へい人職業"
                      required
                      value={formData.inviterOccupation}
                      onChange={(e) => handleInputChange('inviterOccupation', e.target.value)}
                      placeholder="例：会社員、公務員"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="招へい人国籍"
                      required
                      value={formData.inviterNationality}
                      onChange={(e) => handleInputChange('inviterNationality', e.target.value)}
                      placeholder="例：日本、Korea"
                    />
                  </Grid>

                  {/* 費用負担 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">費用負担</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">旅費負担者 *</FormLabel>
                      <RadioGroup
                        value={formData.travelExpenseBearer}
                        onChange={(e) => handleInputChange('travelExpenseBearer', e.target.value)}
                      >
                        <FormControlLabel value="申請人本人" control={<Radio />} label="申請人本人" />
                        <FormControlLabel value="招へい人" control={<Radio />} label="招へい人" />
                        <FormControlLabel value="その他" control={<Radio />} label="その他" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">滞在費負担者 *</FormLabel>
                      <RadioGroup
                        value={formData.stayExpenseBearer}
                        onChange={(e) => handleInputChange('stayExpenseBearer', e.target.value)}
                      >
                        <FormControlLabel value="申請人本人" control={<Radio />} label="申請人本人" />
                        <FormControlLabel value="招へい人" control={<Radio />} label="招へい人" />
                        <FormControlLabel value="その他" control={<Radio />} label="その他" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* 過去の渡航歴 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">過去の渡航歴</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">過去に日本を訪問したことがありますか？ *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.hasVisitedJapan}
                        onChange={(e) => handleInputChange('hasVisitedJapan', e.target.value)}
                      >
                        <FormControlLabel value="はい" control={<Radio />} label="はい" />
                        <FormControlLabel value="いいえ" control={<Radio />} label="いいえ" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Collapse in={formData.hasVisitedJapan === 'はい'}>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="最後の訪問日"
                          type="date"
                          value={formData.lastVisitDate}
                          onChange={(e) => handleInputChange('lastVisitDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="最後の訪問目的"
                          value={formData.lastVisitPurpose}
                          onChange={(e) => handleInputChange('lastVisitPurpose', e.target.value)}
                          placeholder="例：観光、商用、親族訪問"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="滞在期間"
                          value={formData.lastVisitLength}
                          onChange={(e) => handleInputChange('lastVisitLength', e.target.value)}
                          placeholder="例：15日間"
                        />
                      </Grid>
                    </Grid>
                  </Collapse>

                  {/* その他の質問 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">その他</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">過去に日本への入国拒否や強制退去の経験がありますか？ *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.hasBeenRefused}
                        onChange={(e) => handleInputChange('hasBeenRefused', e.target.value)}
                      >
                        <FormControlLabel value="はい" control={<Radio />} label="はい" />
                        <FormControlLabel value="いいえ" control={<Radio />} label="いいえ" />
                      </RadioGroup>
                    </FormControl>
                    
                    <Collapse in={formData.hasBeenRefused === 'はい'}>
                      <TextField
                        fullWidth
                        label="詳細な理由"
                        multiline
                        rows={3}
                        value={formData.refusalDetails}
                        onChange={(e) => handleInputChange('refusalDetails', e.target.value)}
                        sx={{ mt: 2 }}
                      />
                    </Collapse>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">同伴者はいますか？ *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.accompaniedPersons}
                        onChange={(e) => handleInputChange('accompaniedPersons', e.target.value)}
                      >
                        <FormControlLabel value="はい" control={<Radio />} label="はい" />
                        <FormControlLabel value="いいえ" control={<Radio />} label="いいえ" />
                      </RadioGroup>
                    </FormControl>
                    
                    <Collapse in={formData.accompaniedPersons === 'はい'}>
                      <TextField
                        fullWidth
                        label="同伴者の詳細"
                        multiline
                        rows={2}
                        value={formData.accompaniedDetails}
                        onChange={(e) => handleInputChange('accompaniedDetails', e.target.value)}
                        placeholder="同伴者の氏名、関係性、人数など"
                        sx={{ mt: 2 }}
                      />
                    </Collapse>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">犯罪歴はありますか？ *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.criminalRecord}
                        onChange={(e) => handleInputChange('criminalRecord', e.target.value)}
                      >
                        <FormControlLabel value="はい" control={<Radio />} label="はい" />
                        <FormControlLabel value="いいえ" control={<Radio />} label="いいえ" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box display="flex" justifyContent="space-between">
                  <Button
                    onClick={handleBack}
                    size="large"
                  >
                    戻る
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    size="large"
                    startIcon={<CheckCircleIcon />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '送信中...' : '申請書提出'}
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Paper>

        {/* 注意事項 */}
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>重要事項：</strong><br />
            • 全ての項目を正確に入力してください<br />
            • パスポートの情報は正確に記入してください<br />
            • 虚偽の申告は入国拒否の原因となります<br />
            • 申請書提出後、必要書類の準備についてご案内いたします
          </Typography>
        </Alert>
      </Box>
    </Container>
  )
}

export default ShortStayCustomerForm