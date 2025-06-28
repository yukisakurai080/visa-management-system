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
  IconButton,
  Alert,
  LinearProgress,
} from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  CheckCircle as CheckCircleIcon,
  Person as PersonIcon,
  FamilyRestroom as FamilyIcon,
} from '@mui/icons-material'

interface FormData {
  // 基本情報
  gender: string
  maritalStatus: string
  country: string
  name: string
  dob: string
  email: string
  lineName: string
  occupation: string
  residenceHome: string
  birthplace: string
  relationshipYears: string
  marriageYears: string
  spouseAddress: string
  spousePhone: string
  spouseMobile: string
  passportNo: string
  passportExpiry: string
  entryDate: string
  entryPort: string
  visaLocation: string
  accompanied: string
  immigrationHistory: string
  entryCount: string
  entryStart: string
  entryEnd: string
  residenceHistory: string
  residenceCount: string
  rejectionCount: string
  misconduct: string
  misconductDescription: string
  deportation: string
  deportationCount: string
  deportationReturn: string
  familyExist: string
  
  // 追加情報
  japaneseLevel: string
  japanMarriageRegistry: string
  japanMarriageDate: string
  foreignMarriageRegistry: string
  foreignMarriageDate: string
  expenseSelf: string
  expenseForeignSponsor: string
  expenseJapanSponsor: string
  expenseGuarantor: string
  expenseOther: string
  workplaceDecided: string
  workplaceName: string
  workplaceBranch: string
  workplaceAddress: string
  workplacePhone: string
  workplaceSalary: string
  remittance: string
  carriedFromAbroad: string
  remittanceFromAbroad: string
  supportType: string
  supporterName: string
  supporterDob: string
  supporterNationality: string
  supporterCardNumber: string
  supporterStatus: string
  supporterPeriod: string
  supporterPeriodEnd: string
  supporterRelationship: string
  supporterWorkplaceName: string
  supporterWorkplaceBranch: string
  supporterWorkplaceAddress: string
  supporterWorkplacePhone: string
  supporterAnnualIncome: string
  sponsorName: string
  sponsorAddress: string
  sponsorPhone: string
  sponsorWorkplaceName: string
  sponsorWorkplacePhone: string
  sponsorAnnualIncome: string
  guarantor: string
  guarantorName: string
  guarantorOccupation: string
  guarantorAddress: string
  guarantorPhone: string
  guarantorMobile: string
}

interface FamilyMember {
  relation: string
  name: string
  dob: string
  nationality: string
  livesWith: string
  workplace: string
  cardNo: string
}

const CustomerForm = () => {
  const { formId } = useParams<{ formId: string }>()
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    gender: '',
    maritalStatus: '',
    country: '',
    name: '',
    dob: '',
    email: '',
    lineName: '',
    occupation: '',
    residenceHome: '',
    birthplace: '',
    relationshipYears: '',
    marriageYears: '',
    spouseAddress: '',
    spousePhone: '',
    spouseMobile: '',
    passportNo: '',
    passportExpiry: '',
    entryDate: '',
    entryPort: '',
    visaLocation: '',
    accompanied: '',
    immigrationHistory: '',
    entryCount: '',
    entryStart: '',
    entryEnd: '',
    residenceHistory: '',
    residenceCount: '',
    rejectionCount: '',
    misconduct: '',
    misconductDescription: '',
    deportation: '',
    deportationCount: '',
    deportationReturn: '',
    familyExist: '',
    japaneseLevel: '',
    japanMarriageRegistry: '',
    japanMarriageDate: '',
    foreignMarriageRegistry: '',
    foreignMarriageDate: '',
    expenseSelf: '',
    expenseForeignSponsor: '',
    expenseJapanSponsor: '',
    expenseGuarantor: '',
    expenseOther: '',
    workplaceDecided: '',
    workplaceName: '',
    workplaceBranch: '',
    workplaceAddress: '',
    workplacePhone: '',
    workplaceSalary: '',
    remittance: '',
    carriedFromAbroad: '',
    remittanceFromAbroad: '',
    supportType: '',
    supporterName: '',
    supporterDob: '',
    supporterNationality: '',
    supporterCardNumber: '',
    supporterStatus: '',
    supporterPeriod: '',
    supporterPeriodEnd: '',
    supporterRelationship: '',
    supporterWorkplaceName: '',
    supporterWorkplaceBranch: '',
    supporterWorkplaceAddress: '',
    supporterWorkplacePhone: '',
    supporterAnnualIncome: '',
    sponsorName: '',
    sponsorAddress: '',
    sponsorPhone: '',
    sponsorWorkplaceName: '',
    sponsorWorkplacePhone: '',
    sponsorAnnualIncome: '',
    guarantor: '',
    guarantorName: '',
    guarantorOccupation: '',
    guarantorAddress: '',
    guarantorPhone: '',
    guarantorMobile: '',
  })

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      relation: '',
      name: '',
      dob: '',
      nationality: '',
      livesWith: '',
      workplace: '',
      cardNo: '',
    }
  ])

  const steps = ['基本情報の入力', '追加情報の入力']

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFamilyMemberChange = (index: number, field: keyof FamilyMember, value: string) => {
    setFamilyMembers(prev => 
      prev.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    )
  }

  const addFamilyMember = () => {
    if (familyMembers.length < 4) {
      setFamilyMembers(prev => [...prev, {
        relation: '',
        name: '',
        dob: '',
        nationality: '',
        livesWith: '',
        workplace: '',
        cardNo: '',
      }])
    }
  }

  const removeFamilyMember = () => {
    if (familyMembers.length > 1) {
      setFamilyMembers(prev => prev.slice(0, -1))
    }
  }

  const handleNext = () => {
    setActiveStep(prev => prev + 1)
  }

  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  const handleSubmit = () => {
    // フォーム送信処理
    console.log('Form submitted:', { formData, familyMembers })
    alert('申請フォームの入力が完了しました。ありがとうございます。')
  }

  const progress = ((activeStep + 1) / steps.length) * 100

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
          在留資格申請フォーム
        </Typography>
        <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
          日本人の配偶者等（認定証明書交付申請）
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
                  外国人の方の情報をご記入ください
                </Typography>

                <Grid container spacing={3}>
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

                  {/* 配偶者の有無 */}
                  <Grid item xs={12} md={6}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">配偶者の有無 *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.maritalStatus}
                        onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                      >
                        <FormControlLabel value="有" control={<Radio />} label="有" />
                        <FormControlLabel value="無" control={<Radio />} label="無" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* 国籍 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="国籍"
                      required
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="例：アメリカ"
                    />
                  </Grid>

                  {/* お名前 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="お名前"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="例：Gyosei Tree"
                    />
                  </Grid>

                  {/* 生年月日 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="生年月日"
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* メールアドレス */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="メールアドレス"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="例：tree@example.com"
                    />
                  </Grid>

                  {/* LINE表示名 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="ご依頼者様のLINE表示名"
                      value={formData.lineName}
                      onChange={(e) => handleInputChange('lineName', e.target.value)}
                      placeholder="例：行政書士法人TreeなどのLINEの表示名"
                      helperText="※LINEでやり取りしているお客様は必ずご入力をお願いします。"
                    />
                  </Grid>

                  {/* 職業 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="職業"
                      required
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      placeholder="例：会社員"
                      helperText="※今現在のご職業をご記入ください。"
                    />
                  </Grid>

                  {/* 本国における居住地 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="本国における居住地"
                      required
                      value={formData.residenceHome}
                      onChange={(e) => handleInputChange('residenceHome', e.target.value)}
                      placeholder="例：アメリカ　ニューヨーク"
                    />
                  </Grid>

                  {/* 出生地 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="出生地"
                      required
                      value={formData.birthplace}
                      onChange={(e) => handleInputChange('birthplace', e.target.value)}
                      placeholder="例：パスポート内のPlace of birthの情報を入力"
                    />
                  </Grid>

                  {/* 交際年数 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="交際年数"
                      required
                      value={formData.relationshipYears}
                      onChange={(e) => handleInputChange('relationshipYears', e.target.value)}
                      placeholder="例：11ヶ月"
                    />
                  </Grid>

                  {/* 婚姻年数 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="婚姻年数"
                      required
                      value={formData.marriageYears}
                      onChange={(e) => handleInputChange('marriageYears', e.target.value)}
                      placeholder="例：4年3ヶ月"
                    />
                  </Grid>

                  {/* 日本人配偶者の住所地 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="日本人配偶者の住所地"
                      required
                      value={formData.spouseAddress}
                      onChange={(e) => handleInputChange('spouseAddress', e.target.value)}
                      placeholder="例：東京都国立市中一丁目9-8"
                    />
                  </Grid>

                  {/* 日本人配偶者の電話番号 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="日本人配偶者の電話番号"
                      value={formData.spousePhone}
                      onChange={(e) => handleInputChange('spousePhone', e.target.value)}
                      placeholder="例：042-1234-5678"
                    />
                  </Grid>

                  {/* 日本人配偶者の携帯電話番号 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="日本人配偶者の携帯電話番号"
                      value={formData.spouseMobile}
                      onChange={(e) => handleInputChange('spouseMobile', e.target.value)}
                      placeholder="例：090-1234-5678"
                    />
                  </Grid>

                  {/* 旅券番号 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="旅券番号"
                      required
                      value={formData.passportNo}
                      onChange={(e) => handleInputChange('passportNo', e.target.value)}
                      placeholder="例：TR1234567"
                    />
                  </Grid>

                  {/* 旅券の有効期限 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="旅券の有効期限"
                      type="date"
                      required
                      value={formData.passportExpiry}
                      onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* 入国予定日 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="入国予定日"
                      type="date"
                      value={formData.entryDate}
                      onChange={(e) => handleInputChange('entryDate', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  {/* 上陸予定港 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="上陸予定港"
                      required
                      value={formData.entryPort}
                      onChange={(e) => handleInputChange('entryPort', e.target.value)}
                      placeholder="例：羽田空港"
                    />
                  </Grid>

                  {/* 査証申請予定地 */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="査証申請予定地"
                      required
                      value={formData.visaLocation}
                      onChange={(e) => handleInputChange('visaLocation', e.target.value)}
                      placeholder="例：在アメリカ日本大使館"
                    />
                  </Grid>

                  {/* 同伴者の有無 */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">同伴者の有無 *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.accompanied}
                        onChange={(e) => handleInputChange('accompanied', e.target.value)}
                      >
                        <FormControlLabel value="有" control={<Radio />} label="有" />
                        <FormControlLabel value="無" control={<Radio />} label="無" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* 過去の出入国歴 */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">過去の出入国歴の有無 *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.immigrationHistory}
                        onChange={(e) => handleInputChange('immigrationHistory', e.target.value)}
                      >
                        <FormControlLabel value="有" control={<Radio />} label="有" />
                        <FormControlLabel value="無" control={<Radio />} label="無" />
                      </RadioGroup>
                    </FormControl>
                    
                    <Collapse in={formData.immigrationHistory === '有'}>
                      <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>出入国歴詳細</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="入国回数"
                              type="number"
                              value={formData.entryCount}
                              onChange={(e) => handleInputChange('entryCount', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="直近の入国日"
                              type="date"
                              value={formData.entryStart}
                              onChange={(e) => handleInputChange('entryStart', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="直近の帰国日"
                              type="date"
                              value={formData.entryEnd}
                              onChange={(e) => handleInputChange('entryEnd', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </Grid>

                  {/* 素行不良の有無 */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">素行不良の有無(交通違反等を含む) *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.misconduct}
                        onChange={(e) => handleInputChange('misconduct', e.target.value)}
                      >
                        <FormControlLabel value="有" control={<Radio />} label="有" />
                        <FormControlLabel value="無" control={<Radio />} label="無" />
                      </RadioGroup>
                    </FormControl>
                    
                    <Collapse in={formData.misconduct === '有'}>
                      <Box sx={{ mt: 2 }}>
                        <TextField
                          fullWidth
                          label="素行不良行為の具体的内容"
                          multiline
                          rows={4}
                          value={formData.misconductDescription}
                          onChange={(e) => handleInputChange('misconductDescription', e.target.value)}
                        />
                      </Box>
                    </Collapse>
                  </Grid>

                  {/* 在日親族及び同居者の有無 */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">在日親族及び同居者の有無 *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.familyExist}
                        onChange={(e) => handleInputChange('familyExist', e.target.value)}
                      >
                        <FormControlLabel value="有" control={<Radio />} label="有" />
                        <FormControlLabel value="無" control={<Radio />} label="無" />
                      </RadioGroup>
                    </FormControl>
                    
                    <Collapse in={formData.familyExist === '有'}>
                      <Box sx={{ mt: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="subtitle2">在日親族・同居者情報（最大4名）</Typography>
                          <Box>
                            <IconButton 
                              onClick={addFamilyMember} 
                              disabled={familyMembers.length >= 4}
                              size="small"
                              color="primary"
                            >
                              <AddIcon />
                            </IconButton>
                            <IconButton 
                              onClick={removeFamilyMember} 
                              disabled={familyMembers.length <= 1}
                              size="small"
                              color="error"
                            >
                              <RemoveIcon />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        {familyMembers.map((member, index) => (
                          <Card key={index} sx={{ mb: 2, bgcolor: 'grey.50' }}>
                            <CardContent>
                              <Typography variant="subtitle2" gutterBottom>
                                【{index + 1}人目】
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                  <TextField
                                    fullWidth
                                    label="続柄"
                                    value={member.relation}
                                    onChange={(e) => handleFamilyMemberChange(index, 'relation', e.target.value)}
                                    placeholder="例: 父、母、兄弟など"
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <TextField
                                    fullWidth
                                    label="氏名"
                                    value={member.name}
                                    onChange={(e) => handleFamilyMemberChange(index, 'name', e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <TextField
                                    fullWidth
                                    label="生年月日"
                                    type="date"
                                    value={member.dob}
                                    onChange={(e) => handleFamilyMemberChange(index, 'dob', e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                  <TextField
                                    fullWidth
                                    label="国籍"
                                    value={member.nationality}
                                    onChange={(e) => handleFamilyMemberChange(index, 'nationality', e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <FormControl component="fieldset">
                                    <FormLabel component="legend">同居予定の有無</FormLabel>
                                    <RadioGroup
                                      row
                                      value={member.livesWith}
                                      onChange={(e) => handleFamilyMemberChange(index, 'livesWith', e.target.value)}
                                    >
                                      <FormControlLabel value="有" control={<Radio />} label="有" />
                                      <FormControlLabel value="無" control={<Radio />} label="無" />
                                    </RadioGroup>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="勤務先又は通学先名称"
                                    value={member.workplace}
                                    onChange={(e) => handleFamilyMemberChange(index, 'workplace', e.target.value)}
                                  />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                  <TextField
                                    fullWidth
                                    label="在留カード番号等"
                                    value={member.cardNo}
                                    onChange={(e) => handleFamilyMemberChange(index, 'cardNo', e.target.value)}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        ))}
                      </Box>
                    </Collapse>
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
                  <FamilyIcon color="primary" />
                  <Typography variant="h5">STEP2: 追加情報の入力</Typography>
                </Box>

                <Grid container spacing={3}>
                  {/* 日本語能力 */}
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>日本語能力</InputLabel>
                      <Select
                        value={formData.japaneseLevel}
                        onChange={(e) => handleInputChange('japaneseLevel', e.target.value)}
                        label="日本語能力"
                      >
                        <MenuItem value="N1">N1</MenuItem>
                        <MenuItem value="N2">N2</MenuItem>
                        <MenuItem value="N3">N3</MenuItem>
                        <MenuItem value="N4">N4</MenuItem>
                        <MenuItem value="N5">N5</MenuItem>
                        <MenuItem value="試験を受けていない">試験を受けていない</MenuItem>
                        <MenuItem value="別の日本語能力試験を受けた">別の日本語能力試験を受けた</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* 婚姻届の提出先 */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      婚姻届の提出先（子については出生届の提出先）
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="(1) 日本の届出先"
                          value={formData.japanMarriageRegistry}
                          onChange={(e) => handleInputChange('japanMarriageRegistry', e.target.value)}
                          placeholder="これから提出される方は届出予定の役所を記載"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="届出年月日"
                          type="date"
                          value={formData.japanMarriageDate}
                          onChange={(e) => handleInputChange('japanMarriageDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="(2) 外国の届出先"
                          value={formData.foreignMarriageRegistry}
                          onChange={(e) => handleInputChange('foreignMarriageRegistry', e.target.value)}
                          placeholder="これから提出される方は届出予定の役所を記載"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="届出年月日"
                          type="date"
                          value={formData.foreignMarriageDate}
                          onChange={(e) => handleInputChange('foreignMarriageDate', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* 滞在費用支弁方法 */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      滞在費用支弁方法
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      ※大体の毎月生活費の負担額を記入します。日本人配偶者が負担する場合は、身元保証人の欄に入力下さい。
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="本人負担"
                          value={formData.expenseSelf}
                          onChange={(e) => handleInputChange('expenseSelf', e.target.value)}
                          placeholder="円"
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="在外経費支弁者負担"
                          value={formData.expenseForeignSponsor}
                          onChange={(e) => handleInputChange('expenseForeignSponsor', e.target.value)}
                          placeholder="円"
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="在日経費支弁者負担"
                          value={formData.expenseJapanSponsor}
                          onChange={(e) => handleInputChange('expenseJapanSponsor', e.target.value)}
                          placeholder="円"
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="身元保証人負担"
                          value={formData.expenseGuarantor}
                          onChange={(e) => handleInputChange('expenseGuarantor', e.target.value)}
                          placeholder="円"
                        />
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <TextField
                          fullWidth
                          label="その他"
                          value={formData.expenseOther}
                          onChange={(e) => handleInputChange('expenseOther', e.target.value)}
                          placeholder="円"
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* 就職先の有無 */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">外国人の方は日本での就職先は決まっていますか。 *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.workplaceDecided}
                        onChange={(e) => handleInputChange('workplaceDecided', e.target.value)}
                      >
                        <FormControlLabel value="有" control={<Radio />} label="有" />
                        <FormControlLabel value="無" control={<Radio />} label="無" />
                      </RadioGroup>
                    </FormControl>
                    
                    <Collapse in={formData.workplaceDecided === '有'}>
                      <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>申請人の勤務先</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ※申請人（外国人）の方の日本における勤務先の項目となります。
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="名称"
                              value={formData.workplaceName}
                              onChange={(e) => handleInputChange('workplaceName', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="支店"
                              value={formData.workplaceBranch}
                              onChange={(e) => handleInputChange('workplaceBranch', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="所在地"
                              value={formData.workplaceAddress}
                              onChange={(e) => handleInputChange('workplaceAddress', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="電話番号"
                              value={formData.workplacePhone}
                              onChange={(e) => handleInputChange('workplacePhone', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="年収"
                              value={formData.workplaceSalary}
                              onChange={(e) => handleInputChange('workplaceSalary', e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Collapse>
                  </Grid>

                  {/* 扶養の有無 */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">外国人の方は扶養に入りますか。 *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.supportType}
                        onChange={(e) => handleInputChange('supportType', e.target.value)}
                      >
                        <FormControlLabel value="有" control={<Radio />} label="有" />
                        <FormControlLabel value="無" control={<Radio />} label="無" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  {/* 日本人配偶者の在日状況 */}
                  <Grid item xs={12}>
                    <FormControl component="fieldset" required>
                      <FormLabel component="legend">日本人配偶者の方は今現在日本在住ですか。 *</FormLabel>
                      <RadioGroup
                        row
                        value={formData.guarantor}
                        onChange={(e) => handleInputChange('guarantor', e.target.value)}
                      >
                        <FormControlLabel value="有" control={<Radio />} label="有" />
                        <FormControlLabel value="無" control={<Radio />} label="無" />
                      </RadioGroup>
                    </FormControl>
                    
                    <Collapse in={formData.guarantor === '有'}>
                      <Box sx={{ mt: 2, p: 2, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
                        <Typography variant="subtitle2" gutterBottom>身元保証人</Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          ※日本人配偶者の情報をご記入ください。
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="氏名"
                              value={formData.guarantorName}
                              onChange={(e) => handleInputChange('guarantorName', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="職業"
                              value={formData.guarantorOccupation}
                              onChange={(e) => handleInputChange('guarantorOccupation', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="住所"
                              value={formData.guarantorAddress}
                              onChange={(e) => handleInputChange('guarantorAddress', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="電話番号"
                              value={formData.guarantorPhone}
                              onChange={(e) => handleInputChange('guarantorPhone', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="携帯電話番号"
                              value={formData.guarantorMobile}
                              onChange={(e) => handleInputChange('guarantorMobile', e.target.value)}
                            />
                          </Grid>
                        </Grid>
                      </Box>
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
                    onClick={handleSubmit}
                    size="large"
                    startIcon={<CheckCircleIcon />}
                  >
                    送信
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Paper>

        {/* 完了メッセージ */}
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="body2">
            <strong>重要事項：</strong><br />
            • このフォームは在留資格認定証明書交付申請用です<br />
            • 全ての必須項目にご記入ください<br />
            • 入力完了後、システムの管理者に通知されます
          </Typography>
        </Alert>
      </Box>
    </Container>
  )
}

export default CustomerForm