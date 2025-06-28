import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Grid,
  Chip,
  Card,
  CardContent,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  FamilyRestroom as FamilyIcon,
  Business as BusinessIcon,
  Flight as FlightIcon,
  Description as DescriptionIcon,
  Engineering as EngineeringIcon,
  Science as ScienceIcon,
  Restaurant as RestaurantIcon,
  MedicalServices as MedicalIcon,
  Gavel as LegalIcon,
  Computer as ComputerIcon,
  Article as ArticleIcon,
  Groups as GroupsIcon,
  PersonAdd as PersonAddIcon,
  AccountBalance as AccountBalanceIcon,
  Brush as BrushIcon,
  SportsEsports as SportsIcon,
  LocalHospital as HospitalIcon,
  HomeWork as HomeWorkIcon,
  Psychology as PsychologyIcon,
  ContentCopy as CopyIcon,
  Link as LinkIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material'

interface VisaCategory {
  name: string
  icon: React.ReactNode
  color: string
  visas: VisaType[]
}

interface VisaType {
  name: string
  code: string
  icon: React.ReactNode
  procedures: ProcedureType[]
  description: string
}

interface ProcedureType {
  name: string
  type: 'certificate' | 'change' | 'renewal' | 'acquisition'
  path: string
  available: boolean
}

const InquiryForm = () => {
  const navigate = useNavigate()
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false)
  const [expandedVisa, setExpandedVisa] = useState<string | false>(false)
  const [urlDialog, setUrlDialog] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [selectedProcedure, setSelectedProcedure] = useState<{visa: string, procedure: string} | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCategoryChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? panel : false)
    setExpandedVisa(false) // Close visa accordion when category changes
  }

  const handleVisaChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedVisa(isExpanded ? panel : false)
  }

  const generateFormUrl = (visa: string, procedure: string) => {
    // URLを生成（実際の環境では適切なドメインを使用）
    const baseUrl = window.location.origin
    
    // 短期滞在の場合は専用のURLパターンを使用
    if (visa.includes('短期滞在')) {
      let shortStayType = ''
      if (visa.includes('親族訪問')) shortStayType = 'family-visit'
      else if (visa.includes('知人訪問')) shortStayType = 'friend-visit'
      else if (visa.includes('観光')) shortStayType = 'tourism'
      else if (visa.includes('商用')) shortStayType = 'business'
      
      const formId = `${shortStayType}-${Date.now()}`
      return `${baseUrl}/short-stay-form/${shortStayType}/${formId}`
    }
    
    // その他の在留資格は従来通り
    const formId = `${visa}-${procedure}-${Date.now()}`
    return `${baseUrl}/form/${formId}`
  }

  const handleProcedureClick = (visa: string, procedureName: string) => {
    const url = generateFormUrl(visa, procedureName)
    setGeneratedUrl(url)
    setSelectedProcedure({ visa, procedure: procedureName })
    setUrlDialog(true)
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(generatedUrl)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 3000)
    } catch (err) {
      console.error('URLのコピーに失敗しました:', err)
    }
  }

  const handleCloseDialog = () => {
    setUrlDialog(false)
    setGeneratedUrl('')
    setSelectedProcedure(null)
  }

  const getProcedureColor = (type: string) => {
    switch (type) {
      case 'certificate': return '#1976d2'
      case 'change': return '#388e3c'
      case 'renewal': return '#f57c00'
      case 'acquisition': return '#7b1fa2'
      default: return '#757575'
    }
  }

  const visaCategories: VisaCategory[] = [
    {
      name: '特定技能',
      icon: <WorkIcon />,
      color: '#1976d2',
      visas: [
        {
          name: '特定技能1号',
          code: 'tokutei-ginou-1',
          icon: <WorkIcon />,
          description: '特定の分野において相当程度の知識または経験を要する業務',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/tokutei-ginou', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-tokutei-ginou', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/tokutei-ginou', available: true },
          ]
        },
        {
          name: '特定技能2号',
          code: 'tokutei-ginou-2',
          icon: <WorkIcon />,
          description: '特定の分野において熟練した技能を要する業務',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/tokutei-ginou', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-tokutei-ginou', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/tokutei-ginou', available: true },
          ]
        }
      ]
    },
    {
      name: '就労系',
      icon: <BusinessIcon />,
      color: '#388e3c',
      visas: [
        {
          name: '技術・人文知識・国際業務',
          code: 'gijutsu-jinbun',
          icon: <ComputerIcon />,
          description: 'IT、会計、語学教師、通訳翻訳等の業務',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '高度専門職1号',
          code: 'kodo-senmon-1',
          icon: <ScienceIcon />,
          description: '高度な資質・能力を有する人材（ポイント制）',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '高度専門職2号',
          code: 'kodo-senmon-2',
          icon: <ScienceIcon />,
          description: '高度専門職1号で3年以上活動した者',
          procedures: [
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '経営・管理',
          code: 'keiei-kanri',
          icon: <AccountBalanceIcon />,
          description: '企業等の経営・管理業務',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '法律・会計業務',
          code: 'horitsu-kaikei',
          icon: <LegalIcon />,
          description: '外国法事務弁護士、外国公認会計士等',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '医療',
          code: 'iryo',
          icon: <MedicalIcon />,
          description: '医師、歯科医師、薬剤師、保健師、助産師、看護師',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '研究',
          code: 'kenkyu',
          icon: <ScienceIcon />,
          description: '政府関係機関や企業等の研究者',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '教育',
          code: 'kyoiku',
          icon: <SchoolIcon />,
          description: '小学校、中学校、高等学校等の語学教師等',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '技能',
          code: 'ginou',
          icon: <EngineeringIcon />,
          description: '外国料理の調理師、スポーツ指導者、航空機の操縦者等',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '企業内転勤',
          code: 'kigyo-nai-tenkin',
          icon: <BusinessIcon />,
          description: '外国の事業所からの転勤者',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '興行',
          code: 'kogyo',
          icon: <SportsIcon />,
          description: '演劇、演芸、演奏、スポーツ等の興行に係る活動',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '技能実習',
          code: 'ginou-jisshu',
          icon: <WorkIcon />,
          description: '技能実習生',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        }
      ]
    },
    {
      name: '身分系',
      icon: <FamilyIcon />,
      color: '#f57c00',
      visas: [
        {
          name: '永住者',
          code: 'eijusha',
          icon: <HomeWorkIcon />,
          description: '永住許可を受けた者',
          procedures: [
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/status-visa', available: true },
          ]
        },
        {
          name: '日本人の配偶者等',
          code: 'nihonjin-haigusha',
          icon: <FamilyIcon />,
          description: '日本人の配偶者・子・特別養子',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/status-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-status-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/status-visa', available: true },
            { name: '在留資格取得申請', type: 'acquisition', path: '/acquisition/status-visa', available: true },
          ]
        },
        {
          name: '永住者の配偶者等',
          code: 'eijusha-haigusha',
          icon: <FamilyIcon />,
          description: '永住者の配偶者及び本邦で出生した子',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/status-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-status-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/status-visa', available: true },
            { name: '在留資格取得申請', type: 'acquisition', path: '/acquisition/status-visa', available: true },
          ]
        },
        {
          name: '定住者',
          code: 'teijusha',
          icon: <GroupsIcon />,
          description: '法務大臣が特別な理由を考慮し一定の在留期間を指定して居住を認める者',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/status-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-status-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/status-visa', available: true },
            { name: '在留資格取得申請', type: 'acquisition', path: '/acquisition/status-visa', available: true },
          ]
        }
      ]
    },
    {
      name: '非就労系',
      icon: <SchoolIcon />,
      color: '#7b1fa2',
      visas: [
        {
          name: '留学',
          code: 'ryugaku',
          icon: <SchoolIcon />,
          description: '本邦の大学、高等専門学校、高等学校等の学生・生徒',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/non-work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-non-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/non-work-visa', available: true },
          ]
        },
        {
          name: '研修',
          code: 'kenshu',
          icon: <PsychologyIcon />,
          description: '本邦の公私の機関により受け入れられて行う研修',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/non-work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-non-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/non-work-visa', available: true },
          ]
        },
        {
          name: '家族滞在',
          code: 'kazoku-taizai',
          icon: <FamilyIcon />,
          description: '就労資格等で在留する外国人の扶養を受ける配偶者・子',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/non-work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-non-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/non-work-visa', available: true },
          ]
        },
        {
          name: '文化活動',
          code: 'bunka-katsudo',
          icon: <BrushIcon />,
          description: '収入を伴わない学術上又は芸術上の活動',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/non-work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-non-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/non-work-visa', available: true },
          ]
        },
        {
          name: '宗教',
          code: 'shukyo',
          icon: <ArticleIcon />,
          description: '外国の宗教団体により本邦に派遣された宗教家',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/non-work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-non-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/non-work-visa', available: true },
          ]
        }
      ]
    },
    {
      name: '短期滞在',
      icon: <FlightIcon />,
      color: '#d32f2f',
      visas: [
        {
          name: '短期滞在（親族訪問）',
          code: 'tanki-taizai-family',
          icon: <FamilyIcon />,
          description: '日本に住む親族を訪問する目的での短期滞在',
          procedures: [
            { name: 'ビザ申請書', type: 'certificate', path: '/short-stay/family-visit', available: true },
          ]
        },
        {
          name: '短期滞在（知人訪問）',
          code: 'tanki-taizai-friend',
          icon: <GroupsIcon />,
          description: '日本に住む知人・友人を訪問する目的での短期滞在',
          procedures: [
            { name: 'ビザ申請書', type: 'certificate', path: '/short-stay/friend-visit', available: true },
          ]
        },
        {
          name: '短期滞在（観光）',
          code: 'tanki-taizai-tourism',
          icon: <FlightIcon />,
          description: '観光・レジャー目的での短期滞在',
          procedures: [
            { name: 'ビザ申請書', type: 'certificate', path: '/short-stay/tourism', available: true },
          ]
        },
        {
          name: '短期滞在（商用）',
          code: 'tanki-taizai-business',
          icon: <BusinessIcon />,
          description: 'ビジネス・商談・会議等の商用目的での短期滞在',
          procedures: [
            { name: 'ビザ申請書', type: 'certificate', path: '/short-stay/business', available: true },
          ]
        }
      ]
    },
    {
      name: 'その他',
      icon: <DescriptionIcon />,
      color: '#757575',
      visas: [
        {
          name: '特定活動',
          code: 'tokutei-katsudo',
          icon: <PersonAddIcon />,
          description: '法務大臣が個々の外国人について特に指定する活動',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: true },
            { name: '在留資格変更申請', type: 'change', path: '/change/to-work-visa', available: true },
            { name: '在留期間更新申請', type: 'renewal', path: '/renewal/work-visa', available: true },
          ]
        },
        {
          name: '外交',
          code: 'gaikou',
          icon: <AccountBalanceIcon />,
          description: '日本国政府が接受する外国政府の外交使節団若しくは領事機関の構成員',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: false },
          ]
        },
        {
          name: '公用',
          code: 'koyo',
          icon: <AccountBalanceIcon />,
          description: '日本国政府の承認した外国政府若しくは国際機関の公務に従事する者',
          procedures: [
            { name: '認定証明書交付申請', type: 'certificate', path: '/certificate/work-visa', available: false },
          ]
        }
      ]
    }
  ]

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          在留資格入力フォーム一覧
        </Typography>
        <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
          お客様に適切な入力フォームを案内してください
        </Typography>

        <Grid container spacing={3}>
          {/* 左側：カテゴリ一覧 */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                在留資格カテゴリ
              </Typography>
              <List>
                {visaCategories.map((category) => (
                  <ListItemButton
                    key={category.name}
                    onClick={() => setExpandedCategory(expandedCategory === category.name ? false : category.name)}
                    sx={{ 
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: expandedCategory === category.name ? `${category.color}15` : 'transparent',
                      '&:hover': {
                        backgroundColor: `${category.color}25`,
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: category.color }}>
                      {category.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={category.name} 
                      secondary={`${category.visas.length}種類`}
                    />
                    <ExpandMoreIcon 
                      sx={{ 
                        transform: expandedCategory === category.name ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                      }} 
                    />
                  </ListItemButton>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* 右側：詳細表示 */}
          <Grid item xs={12} md={8}>
            {expandedCategory ? (
              <Paper elevation={2} sx={{ p: 3 }}>
                {visaCategories
                  .filter(cat => cat.name === expandedCategory)
                  .map(category => (
                    <Box key={category.name}>
                      <Box display="flex" alignItems="center" gap={2} mb={3}>
                        <Box sx={{ color: category.color }}>
                          {category.icon}
                        </Box>
                        <Typography variant="h5">
                          {category.name}在留資格
                        </Typography>
                        <Chip 
                          label={`${category.visas.length}種類`} 
                          color="primary" 
                          size="small" 
                        />
                      </Box>

                      {category.visas.map((visa) => (
                        <Accordion
                          key={visa.code}
                          expanded={expandedVisa === visa.code}
                          onChange={handleVisaChange(visa.code)}
                          sx={{ mb: 2 }}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Box sx={{ color: category.color }}>
                                {visa.icon}
                              </Box>
                              <Box>
                                <Typography variant="h6">
                                  {visa.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {visa.description}
                                </Typography>
                              </Box>
                            </Box>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography variant="subtitle2" gutterBottom>
                              利用可能な申請手続き：
                            </Typography>
                            <Grid container spacing={2}>
                              {visa.procedures.map((procedure) => (
                                <Grid item xs={12} sm={6} key={procedure.name}>
                                  <Card 
                                    sx={{ 
                                      height: '100%',
                                      opacity: procedure.available ? 1 : 0.5,
                                      cursor: procedure.available ? 'pointer' : 'not-allowed',
                                      '&:hover': procedure.available ? {
                                        boxShadow: 3,
                                        backgroundColor: `${getProcedureColor(procedure.type)}05`
                                      } : {}
                                    }}
                                    onClick={() => procedure.available && handleProcedureClick(visa.name, procedure.name)}
                                  >
                                    <CardContent sx={{ p: 2 }}>
                                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                                        <DescriptionIcon 
                                          sx={{ 
                                            color: getProcedureColor(procedure.type),
                                            fontSize: 20 
                                          }} 
                                        />
                                        <Typography variant="subtitle2">
                                          {procedure.name}
                                        </Typography>
                                      </Box>
                                      <Chip
                                        label={
                                          procedure.type === 'certificate' ? '認定' :
                                          procedure.type === 'change' ? '変更' :
                                          procedure.type === 'renewal' ? '更新' :
                                          '取得'
                                        }
                                        size="small"
                                        sx={{
                                          backgroundColor: getProcedureColor(procedure.type),
                                          color: 'white',
                                          fontSize: '0.7rem'
                                        }}
                                      />
                                      {!procedure.available && (
                                        <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                          この手続きは利用できません
                                        </Typography>
                                      )}
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                    </Box>
                  ))}
              </Paper>
            ) : (
              <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  在留資格カテゴリを選択してください
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  左側のリストから該当する在留資格のカテゴリを選択すると、詳細な在留資格一覧が表示されます。
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>

        {/* 緊急連絡先 */}
        <Box sx={{ mt: 4 }}>
          <Card sx={{ backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                お困りの場合
              </Typography>
              <Typography variant="body2" color="text.secondary">
                在留資格の選択にお困りの場合は、新規外国人登録から始めることをお勧めします。
                システムが最適な在留資格と手続きを自動で提案いたします。
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  startIcon={<PersonAddIcon />}
                  onClick={() => navigate('/foreigners/new')}
                >
                  外国人新規登録で自動判定
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* URL発行ダイアログ */}
      <Dialog open={urlDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <LinkIcon color="primary" />
            お客様用入力フォームURL
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            以下のURLをお客様にお送りください。お客様がフォームに入力完了すると、システムに通知されます。
          </Alert>
          
          {selectedProcedure && (
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                対象手続き
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedProcedure.visa} - {selectedProcedure.procedure}
              </Typography>
            </Box>
          )}

          <TextField
            fullWidth
            label="お客様用フォームURL"
            value={generatedUrl}
            variant="outlined"
            multiline
            rows={3}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleCopyUrl}
                    color="primary"
                    title="URLをコピー"
                  >
                    <CopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>重要事項：</strong>
              <br />
              • このURLは1回限り有効です
              <br />
              • お客様が入力完了後、システムの「入力完了済み」に表示されます
              <br />
              • URLの有効期限は7日間です
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            閉じる
          </Button>
          <Button 
            onClick={handleCopyUrl}
            variant="contained"
            startIcon={<CopyIcon />}
          >
            URLをコピー
          </Button>
        </DialogActions>
      </Dialog>

      {/* コピー成功通知 */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setCopySuccess(false)} 
          severity="success" 
          variant="filled"
          icon={<CheckIcon />}
        >
          URLをクリップボードにコピーしました！
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default InquiryForm