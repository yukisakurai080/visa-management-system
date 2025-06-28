import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Alert,
  Chip,
  Divider,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  FamilyRestroom as FamilyIcon,
  Flight as FlightIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material'

interface ForeignerData {
  // 基本情報
  nameKanji: string
  nameKana: string
  nameEn: string
  nationality: string
  birthDate: string
  gender: string
  passportNumber: string
  
  // 現在の状況
  currentLocation: 'overseas' | 'in_japan'
  currentVisaType?: string
  currentVisaExpiry?: string
  residenceCardNumber?: string
  
  // 申請目的
  purpose: string
  desiredVisaType: string
  plannedActivities: string
  
  // 就労関連
  hasJobOffer: boolean
  employerName?: string
  jobType?: string
  salary?: string
  
  // 教育関連
  educationLevel: string
  schoolName?: string
  majorField?: string
  
  // 家族関連
  hasFamily: boolean
  familyInJapan?: boolean
  familyRelationship?: string
  
  // 技能関連
  hasSkillTest?: boolean
  skillTestType?: string
  hasJapaneseTest?: boolean
  japaneseLevel?: string
  
  // 滞在予定
  plannedStayPeriod: string
  plannedAddress?: string
}

const ForeignerRegistration = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [recommendedActions, setRecommendedActions] = useState<any[]>([])
  
  const [formData, setFormData] = useState<ForeignerData>({
    nameKanji: '',
    nameKana: '',
    nameEn: '',
    nationality: '',
    birthDate: '',
    gender: '',
    passportNumber: '',
    currentLocation: 'overseas',
    purpose: '',
    desiredVisaType: '',
    plannedActivities: '',
    hasJobOffer: false,
    educationLevel: '',
    hasFamily: false,
    plannedStayPeriod: '',
  })

  const steps = ['基本情報', '現在の状況', '申請目的', '詳細情報', '確認']

  const nationalities = [
    'ベトナム', '中国', 'フィリピン', 'インドネシア', 'ミャンマー',
    'タイ', 'ネパール', 'カンボジア', 'モンゴル', '韓国',
    'ブラジル', 'ペルー', 'インド', 'スリランカ', 'バングラデシュ',
  ]

  const visaTypes = [
    { value: 'tokutei-ginou-1', label: '特定技能1号', category: 'work' },
    { value: 'tokutei-ginou-2', label: '特定技能2号', category: 'work' },
    { value: 'ginou-jisshu', label: '技能実習', category: 'work' },
    { value: 'gijutsu-jinbun', label: '技術・人文知識・国際業務', category: 'work' },
    { value: 'tokutei-katsudo', label: '特定活動', category: 'work' },
    { value: 'kodo-senmon', label: '高度専門職', category: 'work' },
    { value: 'keiei-kanri', label: '経営・管理', category: 'work' },
    { value: 'kigyo-nai-tenkin', label: '企業内転勤', category: 'work' },
    { value: 'ginou', label: '技能', category: 'work' },
    { value: 'ryugaku', label: '留学', category: 'non-work' },
    { value: 'kenshu', label: '研修', category: 'non-work' },
    { value: 'bunka-katsudo', label: '文化活動', category: 'non-work' },
    { value: 'nihonjin-haigusha', label: '日本人の配偶者等', category: 'status' },
    { value: 'eijusha-haigusha', label: '永住者の配偶者等', category: 'status' },
    { value: 'teijusha', label: '定住者', category: 'status' },
    { value: 'eijusha', label: '永住者', category: 'status' },
    { value: 'tanki-taizai', label: '短期滞在', category: 'short' },
  ]

  const purposes = [
    '就労・仕事',
    '留学・研究',
    '家族との同居',
    '観光・短期訪問',
    '技能実習から特定技能への移行',
    '転職・職種変更',
    '永住申請準備',
  ]

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      analyzeAndRecommend()
      setShowConfirmDialog(true)
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleInputChange = (field: keyof ForeignerData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const analyzeAndRecommend = () => {
    const recommendations = []
    
    // 現在海外にいる場合
    if (formData.currentLocation === 'overseas') {
      if (formData.desiredVisaType?.includes('tokutei-ginou')) {
        recommendations.push({
          type: 'certificate',
          category: 'tokutei-ginou',
          title: '特定技能（認定証明書交付申請）',
          reason: '海外から特定技能で来日する場合',
          icon: <WorkIcon />,
          priority: 'high',
        })
      } else if (formData.purpose === '就労・仕事') {
        recommendations.push({
          type: 'certificate',
          category: 'work-visa',
          title: '就労系（認定証明書交付申請）',
          reason: '海外から就労目的で来日する場合',
          icon: <BusinessIcon />,
          priority: 'high',
        })
      } else if (formData.purpose === '留学・研究') {
        recommendations.push({
          type: 'certificate',
          category: 'non-work-visa',
          title: '非就労系（認定証明書交付申請）',
          reason: '海外から留学目的で来日する場合',
          icon: <SchoolIcon />,
          priority: 'high',
        })
      }
    } 
    // 既に日本にいる場合
    else {
      // 技能実習から特定技能への移行
      if (formData.currentVisaType === 'ginou-jisshu' && formData.desiredVisaType?.includes('tokutei-ginou')) {
        recommendations.push({
          type: 'change',
          category: 'to-tokutei-ginou',
          title: '特定技能への変更',
          reason: '技能実習から特定技能への移行',
          icon: <WorkIcon />,
          priority: 'high',
        })
        recommendations.push({
          type: 'special',
          category: 'tokutei-ginou-management',
          title: '特定技能外国人として登録',
          reason: '特定技能管理システムへの登録が必要',
          icon: <AssignmentIcon />,
          priority: 'medium',
        })
      }
      // 留学から就労への変更
      else if (formData.currentVisaType === 'ryugaku' && formData.purpose === '就労・仕事') {
        recommendations.push({
          type: 'change',
          category: 'to-work-visa',
          title: '就労系への変更',
          reason: '留学から就労への在留資格変更',
          icon: <BusinessIcon />,
          priority: 'high',
        })
      }
      // 在留期限が近い場合の更新
      else if (formData.currentVisaExpiry) {
        const expiryDate = new Date(formData.currentVisaExpiry)
        const today = new Date()
        const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDays < 90 && diffDays > 0) {
          const visaInfo = visaTypes.find(v => v.value === formData.currentVisaType)
          if (visaInfo) {
            recommendations.push({
              type: 'renewal',
              category: visaInfo.category === 'work' ? 'work-visa' : 
                        visaInfo.category === 'status' ? 'status-visa' : 
                        'non-work-visa',
              title: '在留期間更新申請',
              reason: `在留期限まで${diffDays}日（要更新）`,
              icon: <ScheduleIcon />,
              priority: diffDays < 30 ? 'high' : 'medium',
            })
          }
        }
      }
    }

    // 家族関連の申請
    if (formData.hasFamily && formData.familyInJapan) {
      if (formData.familyRelationship === 'spouse') {
        recommendations.push({
          type: 'certificate',
          category: 'status-visa',
          title: '身分系（家族滞在等）',
          reason: '家族との同居のため',
          icon: <FamilyIcon />,
          priority: 'medium',
        })
      }
    }

    // 短期滞在
    if (formData.purpose === '観光・短期訪問') {
      recommendations.push({
        type: 'certificate',
        category: 'short-stay',
        title: '短期滞在',
        reason: '観光・商用・親族訪問等',
        icon: <FlightIcon />,
        priority: 'high',
      })
    }

    setRecommendedActions(recommendations)
  }

  const getStepContent = (step: number) => {
    switch (step) {
      case 0: // 基本情報
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="氏名（漢字）"
                value={formData.nameKanji}
                onChange={(e) => handleInputChange('nameKanji', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="氏名（カナ）"
                value={formData.nameKana}
                onChange={(e) => handleInputChange('nameKana', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="氏名（英字）"
                value={formData.nameEn}
                onChange={(e) => handleInputChange('nameEn', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>国籍</InputLabel>
                <Select
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  label="国籍"
                >
                  {nationalities.map(nation => (
                    <MenuItem key={nation} value={nation}>{nation}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="生年月日"
                type="date"
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth required>
                <InputLabel>性別</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  label="性別"
                >
                  <MenuItem value="male">男性</MenuItem>
                  <MenuItem value="female">女性</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="パスポート番号"
                value={formData.passportNumber}
                onChange={(e) => handleInputChange('passportNumber', e.target.value)}
              />
            </Grid>
          </Grid>
        )

      case 1: // 現在の状況
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">現在の所在地</FormLabel>
                <RadioGroup
                  value={formData.currentLocation}
                  onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                >
                  <FormControlLabel value="overseas" control={<Radio />} label="海外（母国等）" />
                  <FormControlLabel value="in_japan" control={<Radio />} label="日本国内" />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            {formData.currentLocation === 'in_japan' && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>現在の在留資格</InputLabel>
                    <Select
                      value={formData.currentVisaType || ''}
                      onChange={(e) => handleInputChange('currentVisaType', e.target.value)}
                      label="現在の在留資格"
                    >
                      {visaTypes.map(visa => (
                        <MenuItem key={visa.value} value={visa.value}>
                          {visa.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="在留期限"
                    type="date"
                    value={formData.currentVisaExpiry || ''}
                    onChange={(e) => handleInputChange('currentVisaExpiry', e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="在留カード番号"
                    value={formData.residenceCardNumber || ''}
                    onChange={(e) => handleInputChange('residenceCardNumber', e.target.value)}
                  />
                </Grid>
              </>
            )}
          </Grid>
        )

      case 2: // 申請目的
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>来日・滞在の目的</InputLabel>
                <Select
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
                  label="来日・滞在の目的"
                >
                  {purposes.map(purpose => (
                    <MenuItem key={purpose} value={purpose}>{purpose}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>希望する在留資格</InputLabel>
                <Select
                  value={formData.desiredVisaType}
                  onChange={(e) => handleInputChange('desiredVisaType', e.target.value)}
                  label="希望する在留資格"
                >
                  {visaTypes.map(visa => (
                    <MenuItem key={visa.value} value={visa.value}>
                      <Box display="flex" alignItems="center" gap={1}>
                        {visa.label}
                        <Chip 
                          label={
                            visa.category === 'work' ? '就労系' :
                            visa.category === 'status' ? '身分系' :
                            visa.category === 'non-work' ? '非就労系' :
                            '短期'
                          }
                          size="small"
                          color={
                            visa.category === 'work' ? 'primary' :
                            visa.category === 'status' ? 'warning' :
                            visa.category === 'non-work' ? 'secondary' :
                            'default'
                          }
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="予定している活動内容"
                multiline
                rows={3}
                value={formData.plannedActivities}
                onChange={(e) => handleInputChange('plannedActivities', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>滞在予定期間</InputLabel>
                <Select
                  value={formData.plannedStayPeriod}
                  onChange={(e) => handleInputChange('plannedStayPeriod', e.target.value)}
                  label="滞在予定期間"
                >
                  <MenuItem value="15days">15日以内</MenuItem>
                  <MenuItem value="90days">90日以内</MenuItem>
                  <MenuItem value="6months">6ヶ月</MenuItem>
                  <MenuItem value="1year">1年</MenuItem>
                  <MenuItem value="3years">3年</MenuItem>
                  <MenuItem value="5years">5年</MenuItem>
                  <MenuItem value="permanent">永住希望</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )

      case 3: // 詳細情報
        return (
          <Grid container spacing={3}>
            {/* 就労関連 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                就労関連情報
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hasJobOffer}
                    onChange={(e) => handleInputChange('hasJobOffer', e.target.checked)}
                  />
                }
                label="内定・雇用契約がある"
              />
            </Grid>
            {formData.hasJobOffer && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="雇用主名"
                    value={formData.employerName || ''}
                    onChange={(e) => handleInputChange('employerName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="職種"
                    value={formData.jobType || ''}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="予定月給"
                    value={formData.salary || ''}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                  />
                </Grid>
              </>
            )}

            {/* 教育関連 */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                教育関連情報
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>最終学歴</InputLabel>
                <Select
                  value={formData.educationLevel}
                  onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                  label="最終学歴"
                >
                  <MenuItem value="elementary">小学校</MenuItem>
                  <MenuItem value="junior_high">中学校</MenuItem>
                  <MenuItem value="high_school">高等学校</MenuItem>
                  <MenuItem value="vocational">専門学校</MenuItem>
                  <MenuItem value="university">大学</MenuItem>
                  <MenuItem value="graduate">大学院</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 技能関連（特定技能の場合） */}
            {formData.desiredVisaType?.includes('tokutei-ginou') && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    技能・日本語能力
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.hasSkillTest || false}
                        onChange={(e) => handleInputChange('hasSkillTest', e.target.checked)}
                      />
                    }
                    label="技能試験合格済み"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.hasJapaneseTest || false}
                        onChange={(e) => handleInputChange('hasJapaneseTest', e.target.checked)}
                      />
                    }
                    label="日本語試験合格済み"
                  />
                </Grid>
                {formData.hasJapaneseTest && (
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>日本語レベル</InputLabel>
                      <Select
                        value={formData.japaneseLevel || ''}
                        onChange={(e) => handleInputChange('japaneseLevel', e.target.value)}
                        label="日本語レベル"
                      >
                        <MenuItem value="N5">N5</MenuItem>
                        <MenuItem value="N4">N4</MenuItem>
                        <MenuItem value="N3">N3</MenuItem>
                        <MenuItem value="N2">N2</MenuItem>
                        <MenuItem value="N1">N1</MenuItem>
                        <MenuItem value="JFT-Basic">JFT-Basic</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
              </>
            )}

            {/* 家族関連 */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                家族関連情報
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hasFamily}
                    onChange={(e) => handleInputChange('hasFamily', e.target.checked)}
                  />
                }
                label="家族がいる"
              />
            </Grid>
            {formData.hasFamily && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.familyInJapan || false}
                        onChange={(e) => handleInputChange('familyInJapan', e.target.checked)}
                      />
                    }
                    label="家族が日本にいる"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>家族の関係</InputLabel>
                    <Select
                      value={formData.familyRelationship || ''}
                      onChange={(e) => handleInputChange('familyRelationship', e.target.value)}
                      label="家族の関係"
                    >
                      <MenuItem value="spouse">配偶者</MenuItem>
                      <MenuItem value="child">子</MenuItem>
                      <MenuItem value="parent">親</MenuItem>
                      <MenuItem value="sibling">兄弟姉妹</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        )

      case 4: // 確認
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              登録内容を確認してください。登録後、システムが最適な申請手続きを提案します。
            </Alert>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      基本情報
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText primary="氏名" secondary={`${formData.nameKanji} (${formData.nameKana})`} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="国籍" secondary={formData.nationality} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="生年月日" secondary={formData.birthDate} />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      申請情報
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemText 
                          primary="現在地" 
                          secondary={formData.currentLocation === 'overseas' ? '海外' : '日本国内'} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="目的" 
                          secondary={formData.purpose} 
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText 
                          primary="希望在留資格" 
                          secondary={visaTypes.find(v => v.value === formData.desiredVisaType)?.label} 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )

      default:
        return 'Unknown step'
    }
  }

  const handleConfirmRegistration = () => {
    // ここで実際の登録処理を行う
    // 推奨される申請ページへ遷移
    if (recommendedActions.length > 0) {
      const primaryAction = recommendedActions[0]
      if (primaryAction.type === 'certificate') {
        navigate(`/certificate/${primaryAction.category}`)
      } else if (primaryAction.type === 'change') {
        navigate(`/change/${primaryAction.category}`)
      } else if (primaryAction.type === 'renewal') {
        navigate(`/renewal/${primaryAction.category}`)
      } else if (primaryAction.type === 'special' && primaryAction.category === 'tokutei-ginou-management') {
        navigate('/tokutei-ginou/workers/new')
      }
    } else {
      navigate('/')
    }
  }

  return (
    <Box>
      <Box mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          外国人新規登録
        </Typography>
        <Typography variant="body2" color="text.secondary">
          外国人の情報を登録すると、最適な申請手続きを自動的に提案します
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        {getStepContent(activeStep)}
      </Paper>

      <Box display="flex" justifyContent="space-between">
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          戻る
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
        >
          {activeStep === steps.length - 1 ? '登録して申請を開始' : '次へ'}
        </Button>
      </Box>

      {/* 確認ダイアログ */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          推奨される申請手続き
        </DialogTitle>
        <DialogContent>
          <Alert severity="success" sx={{ mb: 2 }}>
            {formData.nameKanji}さんの情報を分析しました。以下の申請手続きが必要です。
          </Alert>
          
          <List>
            {recommendedActions.map((action, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  {action.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      {action.title}
                      {action.priority === 'high' && (
                        <Chip label="優先" color="error" size="small" />
                      )}
                    </Box>
                  }
                  secondary={action.reason}
                />
              </ListItem>
            ))}
          </List>

          {recommendedActions.length === 0 && (
            <Alert severity="info">
              現在、特定の申請は必要ありません。情報は登録されました。
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>
            キャンセル
          </Button>
          <Button variant="contained" onClick={handleConfirmRegistration}>
            登録して申請を開始
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ForeignerRegistration