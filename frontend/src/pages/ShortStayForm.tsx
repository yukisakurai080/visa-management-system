import { useState } from 'react'
import { useParams } from 'react-router-dom'
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
  Checkbox,
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
  // 申請者情報
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
  
  // 連絡先情報
  homeAddress: string
  phoneNumber: string
  email: string
  occupation: string
  companyName: string
  companyAddress: string
  companyPhone: string
  
  // 訪問情報
  purposeOfVisit: string
  intendedLengthOfStay: string
  intendedDateOfArrival: string
  intendedDateOfDeparture: string
  portOfEntry: string
  
  // 滞在先情報
  accommodationName: string
  accommodationAddress: string
  accommodationPhone: string
  
  // 招へい人・身元保証人情報
  inviterName: string
  inviterRelationship: string
  inviterAddress: string
  inviterPhone: string
  inviterOccupation: string
  
  // 費用負担
  expensePayer: string
  travelExpenseBearer: string
  stayExpenseBearer: string
  
  // 過去の日本渡航歴
  hasVisitedJapan: string
  lastVisitDate: string
  lastVisitPurpose: string
  
  // その他
  hasBeenRefused: string
  refusalReason: string
  accompaniedPersons: string
  accompaniedPersonsDetails: string
}

const ShortStayForm = () => {
  const { type } = useParams<{ type: string }>()
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
    homeAddress: '',
    phoneNumber: '',
    email: '',
    occupation: '',
    companyName: '',
    companyAddress: '',
    companyPhone: '',
    purposeOfVisit: '',
    intendedLengthOfStay: '',
    intendedDateOfArrival: '',
    intendedDateOfDeparture: '',
    portOfEntry: '',
    accommodationName: '',
    accommodationAddress: '',
    accommodationPhone: '',
    inviterName: '',
    inviterRelationship: '',
    inviterAddress: '',
    inviterPhone: '',
    inviterOccupation: '',
    expensePayer: '',
    travelExpenseBearer: '',
    stayExpenseBearer: '',
    hasVisitedJapan: '',
    lastVisitDate: '',
    lastVisitPurpose: '',
    hasBeenRefused: '',
    refusalReason: '',
    accompaniedPersons: '',
    accompaniedPersonsDetails: '',
  })

  const steps = ['基本情報', '渡航・滞在情報', '招へい人情報', '確認・提出']

  const getFormInfo = (visitType: string) => {
    switch (visitType) {
      case 'family-visit':
        return {
          title: '短期滞在ビザ申請書（親族訪問）',
          icon: <FamilyIcon />,
          color: '#f57c00',
          description: '日本に住む親族を訪問する目的'
        }
      case 'friend-visit':
        return {
          title: '短期滞在ビザ申請書（知人訪問）',
          icon: <GroupsIcon />,
          color: '#1976d2',
          description: '日本に住む知人・友人を訪問する目的'
        }
      case 'tourism':
        return {
          title: '短期滞在ビザ申請書（観光）',
          icon: <FlightIcon />,
          color: '#388e3c',
          description: '観光・レジャー目的'
        }
      case 'business':
        return {
          title: '短期滞在ビザ申請書（商用）',
          icon: <BusinessIcon />,
          color: '#7b1fa2',
          description: 'ビジネス・商談・会議等の目的'
        }
      default:
        return {
          title: '短期滞在ビザ申請書',
          icon: <FlightIcon />,
          color: '#757575',
          description: '短期滞在目的'
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

  const handleSubmit = () => {
    console.log('Short stay visa application submitted:', formData)
    alert('短期滞在ビザ申請書の入力が完了しました。ありがとうございます。')
  }

  const progress = ((activeStep + 1) / steps.length) * 100

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} mb={2}>
          <Box sx={{ color: formInfo.color }}>
            {formInfo.icon}
          </Box>
          <Typography variant="h3" component="h1" color="primary" align="center">
            {formInfo.title}
          </Typography>
        </Box>
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
                  <Typography variant="h5">基本情報</Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* 氏名 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="姓（英字）"
                      required
                      value={formData.familyName}
                      onChange={(e) => handleInputChange('familyName', e.target.value)}
                      placeholder="例：TANAKA"
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
                    />
                  </Grid>

                  {/* カタカナ氏名 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="姓（カタカナ）"
                      value={formData.familyNameKatakana}
                      onChange={(e) => handleInputChange('familyNameKatakana', e.target.value)}
                      placeholder="例：タナカ"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="名（カタカナ）"
                      value={formData.givenNameKatakana}
                      onChange={(e) => handleInputChange('givenNameKatakana', e.target.value)}
                      placeholder="例：ハナコ"
                    />
                  </Grid>

                  {/* 性別 */}
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">性別</FormLabel>
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
                      placeholder="例：Korea"
                    />
                  </Grid>

                  {/* パスポート情報 */}
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

                  {/* 連絡先情報 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">連絡先情報</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="本国住所"
                      required
                      multiline
                      rows={2}
                      value={formData.homeAddress}
                      onChange={(e) => handleInputChange('homeAddress', e.target.value)}
                      placeholder="本国での住所を英語で記入"
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

                  {/* 職業情報 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="職業"
                      required
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      placeholder="例：Engineer"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="勤務先名"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="例：ABC Company"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="勤務先住所"
                      value={formData.companyAddress}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                      placeholder="勤務先の住所"
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
                  <Typography variant="h5">渡航・滞在情報</Typography>
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
                        type === 'family-visit' ? '親族訪問の詳細（誰を訪問するか、関係性など）' :
                        type === 'friend-visit' ? '知人訪問の詳細（誰を訪問するか、関係性など）' :
                        type === 'tourism' ? '観光の詳細（訪問予定地、観光内容など）' :
                        type === 'business' ? 'ビジネスの詳細（会議内容、取引先など）' :
                        '訪問目的の詳細'
                      }
                    />
                  </Grid>

                  {/* 滞在期間 */}
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

                  {/* 入国予定日 */}
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

                  {/* 出国予定日 */}
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

                  {/* 入国予定港 */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>入国予定港</InputLabel>
                      <Select
                        value={formData.portOfEntry}
                        onChange={(e) => handleInputChange('portOfEntry', e.target.value)}
                        label="入国予定港"
                      >
                        <MenuItem value="羽田空港">羽田空港</MenuItem>
                        <MenuItem value="成田国際空港">成田国際空港</MenuItem>
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
                    <TextField
                      fullWidth
                      label="滞在先名称"
                      required
                      value={formData.accommodationName}
                      onChange={(e) => handleInputChange('accommodationName', e.target.value)}
                      placeholder="ホテル名、招へい人宅など"
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

                  {/* 過去の渡航歴 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">過去の日本渡航歴</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">過去に日本を訪問したことがありますか？</FormLabel>
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
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="最後の訪問日"
                          type="date"
                          value={formData.lastVisitDate}
                          onChange={(e) => handleInputChange('lastVisitDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="最後の訪問目的"
                          value={formData.lastVisitPurpose}
                          onChange={(e) => handleInputChange('lastVisitPurpose', e.target.value)}
                          placeholder="例：観光、商用、親族訪問"
                        />
                      </Grid>
                    </Grid>
                  </Collapse>
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
                    onClick={handleNext}
                    size="large"
                  >
                    次へ
                  </Button>
                </Box>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <GroupsIcon color="primary" />
                  <Typography variant="h5">招へい人・身元保証人情報</Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* 招へい人情報 */}
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

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="招へい人電話番号"
                      required
                      value={formData.inviterPhone}
                      onChange={(e) => handleInputChange('inviterPhone', e.target.value)}
                      placeholder="例：03-1234-5678"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="招へい人職業"
                      required
                      value={formData.inviterOccupation}
                      onChange={(e) => handleInputChange('inviterOccupation', e.target.value)}
                      placeholder="例：会社員、公務員、自営業"
                    />
                  </Grid>

                  {/* 費用負担 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">費用負担</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">旅費負担者</FormLabel>
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

                  <Grid item xs={12} md={4}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">滞在費負担者</FormLabel>
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

                  {/* その他の質問 */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="h6" color="text.secondary">その他</Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">過去に日本への入国拒否や強制退去の経験がありますか？</FormLabel>
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
                        value={formData.refusalReason}
                        onChange={(e) => handleInputChange('refusalReason', e.target.value)}
                        sx={{ mt: 2 }}
                      />
                    </Collapse>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">同伴者はいますか？</FormLabel>
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
                        value={formData.accompaniedPersonsDetails}
                        onChange={(e) => handleInputChange('accompaniedPersonsDetails', e.target.value)}
                        placeholder="同伴者の氏名、関係性、人数など"
                        sx={{ mt: 2 }}
                      />
                    </Collapse>
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
                    onClick={handleNext}
                    size="large"
                  >
                    次へ
                  </Button>
                </Box>
              </Box>
            )}

            {activeStep === 3 && (
              <Box>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <CheckCircleIcon color="primary" />
                  <Typography variant="h5">確認・提出</Typography>
                </Box>

                <Alert severity="info" sx={{ mb: 3 }}>
                  入力内容をご確認の上、送信してください。
                </Alert>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>申請者情報</Typography>
                        <Typography variant="body2">
                          氏名: {formData.familyName} {formData.givenName}<br />
                          生年月日: {formData.dateOfBirth}<br />
                          国籍: {formData.nationality}<br />
                          パスポート番号: {formData.passportNumber}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>渡航情報</Typography>
                        <Typography variant="body2">
                          入国予定日: {formData.intendedDateOfArrival}<br />
                          出国予定日: {formData.intendedDateOfDeparture}<br />
                          滞在期間: {formData.intendedLengthOfStay}<br />
                          入国港: {formData.portOfEntry}
                        </Typography>
                      </CardContent>
                    </Card>
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
                  >
                    申請書提出
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
            • 申請書提出後、必要書類を別途準備してください
          </Typography>
        </Alert>
      </Box>
    </Container>
  )
}

export default ShortStayForm