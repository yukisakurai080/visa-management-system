import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  Box,
  Button,
  Paper,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Avatar,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from '@mui/material'
import { 
  DataGrid, 
  GridColDef, 
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Error as ErrorIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  FamilyRestroom as FamilyIcon,
  Business as BusinessIcon,
  Flight as FlightIcon,
} from '@mui/icons-material'

interface CertificateApplicationData {
  id: number
  applicantName: string
  applicantNameKana: string
  nationality: string
  visaCategory: string
  applicationDate: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  documentStatus: 'incomplete' | 'complete' | 'verified'
  expectedProcessingDays: number
  invitingOrganization?: string
  purpose: string
  stayDuration: string
  submissionDeadline: string
  priority: 'high' | 'normal' | 'low'
}

const CertificateApplication = () => {
  const { category } = useParams<{ category: string }>()
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [createDialog, setCreateDialog] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case 'tokutei-ginou':
        return { 
          title: '特定技能（認定）', 
          icon: <WorkIcon />, 
          color: '#1976d2',
          description: '特定技能外国人の在留資格認定証明書交付申請'
        }
      case 'work-visa':
        return { 
          title: '就労系（認定）', 
          icon: <BusinessIcon />, 
          color: '#388e3c',
          description: '就労系在留資格の認定証明書交付申請'
        }
      case 'status-visa':
        return { 
          title: '身分系（認定）', 
          icon: <FamilyIcon />, 
          color: '#f57c00',
          description: '身分系在留資格の認定証明書交付申請'
        }
      case 'non-work-visa':
        return { 
          title: '非就労系（認定）', 
          icon: <SchoolIcon />, 
          color: '#7b1fa2',
          description: '非就労系在留資格の認定証明書交付申請'
        }
      case 'short-stay':
        return { 
          title: '短期滞在（認定）', 
          icon: <FlightIcon />, 
          color: '#d32f2f',
          description: '短期滞在の認定証明書交付申請'
        }
      default:
        return { 
          title: '認定証明書交付申請', 
          icon: <WorkIcon />, 
          color: '#757575',
          description: '在留資格認定証明書交付申請'
        }
    }
  }

  const categoryInfo = getCategoryInfo(category || '')

  const [applications] = useState<CertificateApplicationData[]>([
    {
      id: 1,
      applicantName: 'グエン・ミン・フオン',
      applicantNameKana: 'グエン ミン フオン',
      nationality: 'ベトナム',
      visaCategory: category === 'tokutei-ginou' ? '特定技能1号' : '技術・人文知識・国際業務',
      applicationDate: '2024-01-15',
      status: 'under_review',
      documentStatus: 'complete',
      expectedProcessingDays: 45,
      invitingOrganization: '株式会社グローバルテック',
      purpose: 'システム開発業務',
      stayDuration: '3年',
      submissionDeadline: '2024-02-15',
      priority: 'high',
    },
    {
      id: 2,
      applicantName: 'リ・シャオミン',
      applicantNameKana: 'リ シャオミン',
      nationality: '中国',
      visaCategory: category === 'tokutei-ginou' ? '特定技能1号' : '研究',
      applicationDate: '2024-01-10',
      status: 'submitted',
      documentStatus: 'verified',
      expectedProcessingDays: 30,
      invitingOrganization: '国立大学法人東京大学',
      purpose: 'AI研究',
      stayDuration: '1年',
      submissionDeadline: '2024-02-10',
      priority: 'normal',
    },
    {
      id: 3,
      applicantName: 'スリ・デウィ',
      applicantNameKana: 'スリ デウィ',
      nationality: 'インドネシア',
      visaCategory: category === 'tokutei-ginou' ? '特定技能1号' : '留学',
      applicationDate: '2024-01-12',
      status: 'draft',
      documentStatus: 'incomplete',
      expectedProcessingDays: 60,
      invitingOrganization: '早稲田大学',
      purpose: '大学院進学',
      stayDuration: '2年',
      submissionDeadline: '2024-03-01',
      priority: 'normal',
    },
  ])

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = searchText === '' || 
        app.applicantName.includes(searchText) ||
        app.applicantNameKana.includes(searchText) ||
        app.invitingOrganization?.includes(searchText)
      
      const matchesStatus = statusFilter === '' || app.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [applications, searchText, statusFilter])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'draft':
        return { label: '下書き', color: 'default' as const, icon: <EditIcon /> }
      case 'submitted':
        return { label: '提出済み', color: 'info' as const, icon: <SendIcon /> }
      case 'under_review':
        return { label: '審査中', color: 'warning' as const, icon: <ScheduleIcon /> }
      case 'approved':
        return { label: '許可', color: 'success' as const, icon: <CheckCircleIcon /> }
      case 'rejected':
        return { label: '不許可', color: 'error' as const, icon: <ErrorIcon /> }
      default:
        return { label: '不明', color: 'default' as const, icon: <ErrorIcon /> }
    }
  }

  const getDocumentStatusInfo = (status: string) => {
    switch (status) {
      case 'incomplete':
        return { label: '書類不備', color: 'error' as const }
      case 'complete':
        return { label: '書類完備', color: 'success' as const }
      case 'verified':
        return { label: '確認済み', color: 'info' as const }
      default:
        return { label: '不明', color: 'default' as const }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#d32f2f'
      case 'normal': return '#1976d2'
      case 'low': return '#388e3c'
      default: return '#757575'
    }
  }

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  )

  const columns: GridColDef[] = [
    {
      field: 'priority',
      headerName: '優先度',
      width: 80,
      renderCell: (params) => (
        <Box 
          sx={{ 
            width: 8, 
            height: 32, 
            backgroundColor: getPriorityColor(params.value),
            borderRadius: 1
          }} 
        />
      ),
    },
    {
      field: 'applicantName',
      headerName: '申請者',
      width: 160,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.applicantNameKana}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'nationality',
      headerName: '国籍',
      width: 100,
    },
    {
      field: 'visaCategory',
      headerName: '在留資格',
      width: 180,
      renderCell: (params) => (
        <Chip
          label={params.value}
          variant="outlined"
          size="small"
          sx={{ color: categoryInfo.color, borderColor: categoryInfo.color }}
        />
      ),
    },
    {
      field: 'invitingOrganization',
      headerName: '招へい機関',
      width: 200,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'ステータス',
      width: 120,
      renderCell: (params) => {
        const statusInfo = getStatusInfo(params.value)
        return (
          <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
            icon={statusInfo.icon}
          />
        )
      },
    },
    {
      field: 'documentStatus',
      headerName: '書類状況',
      width: 120,
      renderCell: (params) => {
        const docStatusInfo = getDocumentStatusInfo(params.value)
        return (
          <Chip
            label={docStatusInfo.label}
            color={docStatusInfo.color}
            size="small"
          />
        )
      },
    },
    {
      field: 'expectedProcessingDays',
      headerName: '処理予定',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value}日
        </Typography>
      ),
    },
    {
      field: 'submissionDeadline',
      headerName: '提出期限',
      width: 120,
      renderCell: (params) => {
        const deadline = new Date(params.value)
        const today = new Date()
        const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        return (
          <Box>
            <Typography variant="body2">
              {params.value}
            </Typography>
            <Typography 
              variant="caption" 
              color={diffDays < 7 ? 'error' : diffDays < 14 ? 'warning.main' : 'text.secondary'}
            >
              {diffDays >= 0 ? `あと${diffDays}日` : `${Math.abs(diffDays)}日経過`}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 200,
      renderCell: (params) => (
        <Box display="flex" gap={0.5}>
          <IconButton size="small">
            <ViewIcon />
          </IconButton>
          <IconButton size="small">
            <EditIcon />
          </IconButton>
          <IconButton size="small">
            <PrintIcon />
          </IconButton>
          {params.row.status === 'draft' && (
            <IconButton size="small">
              <SendIcon />
            </IconButton>
          )}
        </Box>
      ),
    },
  ]

  const createSteps = ['申請者情報', '在留資格詳細', '必要書類', '確認・提出']

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{ color: categoryInfo.color }}>
            {categoryInfo.icon}
          </Box>
          <Box>
            <Typography variant="h4" component="h1">
              {categoryInfo.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {categoryInfo.description}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            disabled={selectedRows.length === 0}
          >
            一括操作 ({selectedRows.length})
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialog(true)}
          >
            新規申請
          </Button>
        </Box>
      </Box>

      {/* 統計カード */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color={categoryInfo.color}>
                {applications.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                総申請数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {applications.filter(a => a.status === 'under_review').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                審査中
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {applications.filter(a => a.status === 'approved').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                許可済み
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="error.main">
                {applications.filter(a => new Date(a.submissionDeadline) < new Date()).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                期限切れ
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 検索・フィルター */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="申請者名、招へい機関名で検索"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>ステータス</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="ステータス"
                >
                  <MenuItem value="">すべて</MenuItem>
                  <MenuItem value="draft">下書き</MenuItem>
                  <MenuItem value="submitted">提出済み</MenuItem>
                  <MenuItem value="under_review">審査中</MenuItem>
                  <MenuItem value="approved">許可</MenuItem>
                  <MenuItem value="rejected">不許可</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 期限切れアラート */}
      {filteredApplications.some(app => new Date(app.submissionDeadline) < new Date()) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          提出期限を過ぎた申請が{filteredApplications.filter(app => new Date(app.submissionDeadline) < new Date()).length}件あります。
        </Alert>
      )}
      
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredApplications}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={setSelectedRows}
          rowSelectionModel={selectedRows}
          components={{
            Toolbar: CustomToolbar,
          }}
        />
      </Paper>

      {/* 新規申請ダイアログ */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>{categoryInfo.title} - 新規申請</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            {createSteps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                申請者基本情報
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="氏名（漢字）" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="氏名（カナ）" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="氏名（英字）" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="国籍" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="生年月日" type="date" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>性別</InputLabel>
                    <Select label="性別">
                      <MenuItem value="male">男性</MenuItem>
                      <MenuItem value="female">女性</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                在留資格詳細
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="申請する在留資格" value={categoryInfo.title} disabled />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="在留期間" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="招へい機関名" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="活動内容・目的" multiline rows={3} />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                必要書類チェック
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="在留資格認定証明書交付申請書" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="パスポートのコピー" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ScheduleIcon color="warning" /></ListItemIcon>
                  <ListItemText primary="証明写真" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ScheduleIcon color="warning" /></ListItemIcon>
                  <ListItemText primary="招へい理由書" />
                </ListItem>
              </List>
            </Box>
          )}

          {activeStep === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                申請内容確認
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                以下の内容で申請を提出します。
              </Alert>
              <Typography variant="body2">
                申請内容の確認画面がここに表示されます。
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>キャンセル</Button>
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(activeStep - 1)}>戻る</Button>
          )}
          {activeStep < createSteps.length - 1 ? (
            <Button variant="contained" onClick={() => setActiveStep(activeStep + 1)}>
              次へ
            </Button>
          ) : (
            <Button variant="contained" startIcon={<SendIcon />}>
              申請提出
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CertificateApplication