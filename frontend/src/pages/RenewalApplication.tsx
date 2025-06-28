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
  Refresh as RenewalIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'

interface RenewalApplicationData {
  id: number
  applicantName: string
  applicantNameKana: string
  nationality: string
  currentVisa: string
  currentExpiryDate: string
  requestedPeriod: string
  applicationDate: string
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  documentStatus: 'incomplete' | 'complete' | 'verified'
  expectedProcessingDays: number
  workplace: string
  renewalReason: string
  submissionDeadline: string
  priority: 'high' | 'normal' | 'low'
  isUrgent: boolean
}

const RenewalApplication = () => {
  const { category } = useParams<{ category: string }>()
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [createDialog, setCreateDialog] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const getCategoryInfo = (cat: string) => {
    switch (cat) {
      case 'tokutei-ginou':
        return { 
          title: '特定技能（更新）', 
          icon: <WorkIcon />, 
          color: '#1976d2',
          description: '特定技能在留資格の期間更新申請'
        }
      case 'work-visa':
        return { 
          title: '就労系（更新）', 
          icon: <BusinessIcon />, 
          color: '#388e3c',
          description: '就労系在留資格の期間更新申請'
        }
      case 'status-visa':
        return { 
          title: '身分系（更新）', 
          icon: <FamilyIcon />, 
          color: '#f57c00',
          description: '身分系在留資格の期間更新申請'
        }
      case 'non-work-visa':
        return { 
          title: '非就労系（更新）', 
          icon: <SchoolIcon />, 
          color: '#7b1fa2',
          description: '非就労系在留資格の期間更新申請'
        }
      default:
        return { 
          title: '在留期間更新申請', 
          icon: <RenewalIcon />, 
          color: '#757575',
          description: '在留期間更新許可申請'
        }
    }
  }

  const categoryInfo = getCategoryInfo(category || '')

  const [applications] = useState<RenewalApplicationData[]>([
    {
      id: 1,
      applicantName: 'スズキ・ハナコ',
      applicantNameKana: 'スズキ ハナコ',
      nationality: 'フィリピン',
      currentVisa: category === 'tokutei-ginou' ? '特定技能1号' : '技術・人文知識・国際業務',
      currentExpiryDate: '2024-03-31',
      requestedPeriod: '3年',
      applicationDate: '2024-01-15',
      status: 'under_review',
      documentStatus: 'complete',
      expectedProcessingDays: 30,
      workplace: '株式会社グローバルテック',
      renewalReason: '同一業務継続のため',
      submissionDeadline: '2024-02-15',
      priority: 'high',
      isUrgent: true,
    },
    {
      id: 2,
      applicantName: 'チェン・リー',
      applicantNameKana: 'チェン リー',
      nationality: '中国',
      currentVisa: category === 'tokutei-ginou' ? '特定技能1号' : '研究',
      currentExpiryDate: '2024-06-30',
      requestedPeriod: '1年',
      applicationDate: '2024-01-10',
      status: 'submitted',
      documentStatus: 'verified',
      expectedProcessingDays: 30,
      workplace: '国立大学法人東京大学',
      renewalReason: '研究継続のため',
      submissionDeadline: '2024-05-01',
      priority: 'normal',
      isUrgent: false,
    },
    {
      id: 3,
      applicantName: 'ガルシア・マリア',
      applicantNameKana: 'ガルシア マリア',
      nationality: 'ペルー',
      currentVisa: category === 'tokutei-ginou' ? '特定技能1号' : '日本人の配偶者等',
      currentExpiryDate: '2024-04-15',
      requestedPeriod: '3年',
      applicationDate: '2024-01-12',
      status: 'draft',
      documentStatus: 'incomplete',
      expectedProcessingDays: 20,
      workplace: '主婦',
      renewalReason: '家族生活継続のため',
      submissionDeadline: '2024-03-15',
      priority: 'normal',
      isUrgent: false,
    },
  ])

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = searchText === '' || 
        app.applicantName.includes(searchText) ||
        app.applicantNameKana.includes(searchText) ||
        app.workplace.includes(searchText)
      
      const matchesStatus = statusFilter === '' || app.status === statusFilter
      const matchesUrgent = !urgentOnly || app.isUrgent
      
      return matchesSearch && matchesStatus && matchesUrgent
    })
  }, [applications, searchText, statusFilter, urgentOnly])

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
            {params.row.isUrgent && (
              <WarningIcon sx={{ fontSize: 16, color: '#d32f2f', ml: 0.5 }} />
            )}
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
      field: 'currentVisa',
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
      field: 'currentExpiryDate',
      headerName: '現在の期限',
      width: 120,
      renderCell: (params) => {
        const expiryDate = new Date(params.value)
        const today = new Date()
        const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        return (
          <Box>
            <Typography variant="body2">
              {params.value}
            </Typography>
            <Typography 
              variant="caption" 
              color={diffDays < 30 ? 'error' : diffDays < 60 ? 'warning.main' : 'text.secondary'}
            >
              {diffDays >= 0 ? `あと${diffDays}日` : `${Math.abs(diffDays)}日経過`}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'requestedPeriod',
      headerName: '申請期間',
      width: 100,
    },
    {
      field: 'workplace',
      headerName: '勤務先',
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

  const createSteps = ['申請者情報', '更新詳細', '必要書類', '確認・提出']

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
                {applications.filter(a => a.isUrgent).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                緊急対応
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
                placeholder="申請者名、勤務先で検索"
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
            <Grid item xs={12} md={3}>
              <Button
                variant={urgentOnly ? "contained" : "outlined"}
                startIcon={<WarningIcon />}
                onClick={() => setUrgentOnly(!urgentOnly)}
                color={urgentOnly ? "error" : "primary"}
              >
                緊急のみ
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 期限間近アラート */}
      {filteredApplications.some(app => {
        const expiryDate = new Date(app.currentExpiryDate)
        const today = new Date()
        const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays < 60
      }) && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          在留期限が60日以内に切れる申請が{filteredApplications.filter(app => {
            const expiryDate = new Date(app.currentExpiryDate)
            const today = new Date()
            const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            return diffDays < 60
          }).length}件あります。
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
          getRowClassName={(params) => 
            params.row.isUrgent ? 'urgent-row' : ''
          }
          sx={{
            '& .urgent-row': {
              backgroundColor: '#fff3e0',
              '&:hover': {
                backgroundColor: '#ffe0b2',
              },
            },
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
                  <TextField fullWidth label="現在の在留資格" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="現在の在留期限" type="date" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="在留カード番号" />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth label="勤務先" />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                更新詳細
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>希望する在留期間</InputLabel>
                    <Select label="希望する在留期間">
                      <MenuItem value="6months">6ヶ月</MenuItem>
                      <MenuItem value="1year">1年</MenuItem>
                      <MenuItem value="3years">3年</MenuItem>
                      <MenuItem value="5years">5年</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>緊急度</InputLabel>
                    <Select label="緊急度">
                      <MenuItem value="normal">通常</MenuItem>
                      <MenuItem value="urgent">緊急</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="更新理由" multiline rows={3} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="活動内容・変更点" multiline rows={3} />
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
                  <ListItemText primary="在留期間更新許可申請書" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                  <ListItemText primary="パスポート及び在留カード" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ScheduleIcon color="warning" /></ListItemIcon>
                  <ListItemText primary="証明写真" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ScheduleIcon color="warning" /></ListItemIcon>
                  <ListItemText primary="在職証明書・契約書" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><ScheduleIcon color="warning" /></ListItemIcon>
                  <ListItemText primary="住民税納税証明書" />
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
                以下の内容で更新申請を提出します。
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

export default RenewalApplication