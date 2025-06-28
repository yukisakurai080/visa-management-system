import { useState, useMemo } from 'react'
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
  Checkbox,
  FormControlLabel,
  Stack,
  Tooltip,
  Badge,
  Collapse,
  Alert,
  Tab,
  Tabs,
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
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Assessment as AssessmentIcon,
  Language as LanguageIcon,
  Support as SupportIcon,
  Business as BusinessIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface TokuteiGinouWorkerData {
  id: number
  name: string
  nameKana: string
  nameEn: string
  nationality: string
  tokuteiGinouType: '1' | '2'
  businessCategory: string
  receivingOrganization: string
  supportOrganization: string
  skillTestStatus: 'passed' | 'pending' | 'expired'
  japaneseTestStatus: 'passed' | 'pending' | 'expired'
  contractStartDate: string
  contractEndDate: string
  visaExpiryDate: string
  monthlySalary: number
  workplace: string
  accommodationType: string
  status: 'active' | 'on_leave' | 'transferred' | 'returned'
  fromTechnicalIntern: boolean
  supportPlanStatus: 'current' | 'needs_update' | 'expired'
  urgent: boolean
}

const TokuteiGinouWorkerList = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [businessCategoryFilter, setBusinessCategoryFilter] = useState('')
  const [tokuteiGinouTypeFilter, setTokuteiGinouTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [technicalInternOnly, setTechnicalInternOnly] = useState(false)
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
  const [showFilters, setShowFilters] = useState(false)
  const [bulkActionDialog, setBulkActionDialog] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  const [workers] = useState<TokuteiGinouWorkerData[]>([
    {
      id: 1,
      name: 'グエン・ミン・フオン',
      nameKana: 'グエン ミン フオン',
      nameEn: 'NGUYEN MINH PHUONG',
      nationality: 'ベトナム',
      tokuteiGinouType: '1',
      businessCategory: '介護',
      receivingOrganization: '社会福祉法人あおぞら',
      supportOrganization: '株式会社グローバルサポート',
      skillTestStatus: 'passed',
      japaneseTestStatus: 'passed',
      contractStartDate: '2023-04-01',
      contractEndDate: '2026-03-31',
      visaExpiryDate: '2026-03-31',
      monthlySalary: 180000,
      workplace: '特別養護老人ホームあおぞら園',
      accommodationType: 'company_dormitory',
      status: 'active',
      fromTechnicalIntern: true,
      supportPlanStatus: 'current',
      urgent: false,
    },
    {
      id: 2,
      name: 'リ・シャオミン',
      nameKana: 'リ シャオミン',
      nameEn: 'LI XIAOMING',
      nationality: '中国',
      tokuteiGinouType: '1',
      businessCategory: '建設',
      receivingOrganization: '大成建設株式会社',
      supportOrganization: '一般社団法人建設業支援機構',
      skillTestStatus: 'passed',
      japaneseTestStatus: 'pending',
      contractStartDate: '2023-06-01',
      contractEndDate: '2026-05-31',
      visaExpiryDate: '2024-02-28',
      monthlySalary: 220000,
      workplace: '東京都心再開発現場',
      accommodationType: 'rental',
      status: 'active',
      fromTechnicalIntern: false,
      supportPlanStatus: 'needs_update',
      urgent: true,
    },
    {
      id: 3,
      name: 'スリ・デウィ',
      nameKana: 'スリ デウィ',
      nameEn: 'SRI DEWI',
      nationality: 'インドネシア',
      tokuteiGinouType: '1',
      businessCategory: '飲食料品製造業',
      receivingOrganization: '明治食品工業株式会社',
      supportOrganization: '協同組合アジア人材支援センター',
      skillTestStatus: 'passed',
      japaneseTestStatus: 'passed',
      contractStartDate: '2023-02-01',
      contractEndDate: '2026-01-31',
      visaExpiryDate: '2026-01-31',
      monthlySalary: 165000,
      workplace: '千葉工場',
      accommodationType: 'company_dormitory',
      status: 'active',
      fromTechnicalIntern: true,
      supportPlanStatus: 'current',
      urgent: false,
    },
    {
      id: 4,
      name: 'ピョー・チョー・ミン',
      nameKana: 'ピョー チョー ミン',
      nameEn: 'PYO CHO MIN',
      nationality: 'ミャンマー',
      tokuteiGinouType: '2',
      businessCategory: '介護',
      receivingOrganization: '医療法人仁愛会',
      supportOrganization: '',
      skillTestStatus: 'passed',
      japaneseTestStatus: 'passed',
      contractStartDate: '2021-04-01',
      contractEndDate: '2029-03-31',
      visaExpiryDate: '2029-03-31',
      monthlySalary: 250000,
      workplace: '仁愛病院',
      accommodationType: 'own',
      status: 'active',
      fromTechnicalIntern: true,
      supportPlanStatus: 'current',
      urgent: false,
    },
  ])

  const filteredWorkers = useMemo(() => {
    return workers.filter(worker => {
      const matchesSearch = searchText === '' || 
        worker.name.includes(searchText) ||
        worker.nameKana.includes(searchText) ||
        worker.nameEn.includes(searchText) ||
        worker.receivingOrganization.includes(searchText)
      
      const matchesBusinessCategory = businessCategoryFilter === '' || worker.businessCategory === businessCategoryFilter
      const matchesTokuteiGinouType = tokuteiGinouTypeFilter === '' || worker.tokuteiGinouType === tokuteiGinouTypeFilter
      const matchesStatus = statusFilter === '' || worker.status === statusFilter
      const matchesUrgent = !urgentOnly || worker.urgent
      const matchesTechnicalIntern = !technicalInternOnly || worker.fromTechnicalIntern
      
      return matchesSearch && matchesBusinessCategory && matchesTokuteiGinouType && 
             matchesStatus && matchesUrgent && matchesTechnicalIntern
    })
  }, [workers, searchText, businessCategoryFilter, tokuteiGinouTypeFilter, statusFilter, urgentOnly, technicalInternOnly])

  const getTestStatusInfo = (status: string) => {
    switch (status) {
      case 'passed':
        return { label: '合格', color: 'success' as const, icon: <CheckCircleIcon /> }
      case 'pending':
        return { label: '未受験', color: 'warning' as const, icon: <WarningIcon /> }
      case 'expired':
        return { label: '期限切れ', color: 'error' as const, icon: <WarningIcon /> }
      default:
        return { label: '不明', color: 'default' as const, icon: <WarningIcon /> }
    }
  }

  const getSupportPlanStatusInfo = (status: string) => {
    switch (status) {
      case 'current':
        return { label: '最新', color: 'success' as const }
      case 'needs_update':
        return { label: '要更新', color: 'warning' as const }
      case 'expired':
        return { label: '期限切れ', color: 'error' as const }
      default:
        return { label: '不明', color: 'default' as const }
    }
  }

  const getAccommodationType = (type: string) => {
    switch (type) {
      case 'company_dormitory': return '会社寮'
      case 'rental': return '賃貸住宅'
      case 'own': return '自己所有'
      case 'other': return 'その他'
      default: return '不明'
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
      field: 'photo',
      headerName: '写真',
      width: 80,
      renderCell: (params) => (
        <Avatar sx={{ width: 32, height: 32 }}>
          {params.row.name.charAt(0)}
        </Avatar>
      ),
    },
    {
      field: 'name',
      headerName: '氏名',
      width: 160,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.nameKana}
          </Typography>
          {params.row.fromTechnicalIntern && (
            <Chip label="技実" size="small" color="info" sx={{ ml: 0.5, fontSize: '0.6rem' }} />
          )}
        </Box>
      ),
    },
    {
      field: 'tokuteiGinouType',
      headerName: '号',
      width: 60,
      renderCell: (params) => (
        <Chip
          label={`${params.value}号`}
          color={params.value === '2' ? 'secondary' : 'primary'}
          size="small"
        />
      ),
    },
    {
      field: 'businessCategory',
      headerName: '業務区分',
      width: 120,
    },
    {
      field: 'receivingOrganization',
      headerName: '受入機関',
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Typography variant="body2" noWrap>
            {params.value}
          </Typography>
        </Tooltip>
      ),
    },
    {
      field: 'skillTest',
      headerName: '技能試験',
      width: 100,
      renderCell: (params) => {
        const status = getTestStatusInfo(params.row.skillTestStatus)
        return (
          <Chip
            label={status.label}
            color={status.color}
            size="small"
            icon={status.icon}
          />
        )
      },
    },
    {
      field: 'japaneseTest',
      headerName: '日本語試験',
      width: 110,
      renderCell: (params) => {
        const status = getTestStatusInfo(params.row.japaneseTestStatus)
        return (
          <Chip
            label={status.label}
            color={status.color}
            size="small"
            icon={status.icon}
          />
        )
      },
    },
    {
      field: 'contractEndDate',
      headerName: '契約期限',
      width: 120,
      renderCell: (params) => {
        const date = new Date(params.value)
        const today = new Date()
        const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        return (
          <Box>
            <Typography variant="body2">
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {diffDays >= 0 ? `あと${diffDays}日` : `${Math.abs(diffDays)}日経過`}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'supportPlan',
      headerName: '支援計画',
      width: 100,
      renderCell: (params) => {
        const status = getSupportPlanStatusInfo(params.row.supportPlanStatus)
        return (
          <Chip
            label={status.label}
            color={status.color}
            size="small"
          />
        )
      },
    },
    {
      field: 'monthlySalary',
      headerName: '月給',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2">
          ¥{params.value.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 200,
      renderCell: (params) => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="詳細表示">
            <IconButton
              size="small"
              onClick={() => navigate(`/tokutei-ginou/workers/${params.id}`)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="編集">
            <IconButton
              size="small"
              onClick={() => navigate(`/tokutei-ginou/workers/${params.id}/edit`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="支援記録">
            <IconButton size="small">
              <SupportIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="技能評価">
            <IconButton size="small">
              <AssessmentIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const clearFilters = () => {
    setSearchText('')
    setBusinessCategoryFilter('')
    setTokuteiGinouTypeFilter('')
    setStatusFilter('')
    setUrgentOnly(false)
    setTechnicalInternOnly(false)
  }

  const businessCategories = ['介護', '建設', '飲食料品製造業', '外食業', '農業', 'ビルクリーニング']

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            特定技能外国人管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            総数: {workers.length}名 | 1号: {workers.filter(w => w.tokuteiGinouType === '1').length}名 | 
            2号: {workers.filter(w => w.tokuteiGinouType === '2').length}名 | 
            技能実習移行: {workers.filter(w => w.fromTechnicalIntern).length}名
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            disabled={selectedRows.length === 0}
            onClick={() => setBulkActionDialog(true)}
          >
            一括操作 ({selectedRows.length})
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/tokutei-ginou/workers/new')}
          >
            新規登録
          </Button>
        </Box>
      </Box>

      {/* 検索・フィルター */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="氏名、受入機関名で検索"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchText && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchText('')}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={urgentOnly}
                    onChange={(e) => setUrgentOnly(e.target.checked)}
                    color="error"
                  />
                }
                label="緊急のみ"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={technicalInternOnly}
                    onChange={(e) => setTechnicalInternOnly(e.target.checked)}
                    color="info"
                  />
                }
                label="技実移行のみ"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant={showFilters ? "contained" : "outlined"}
                startIcon={<FilterIcon />}
                onClick={() => setShowFilters(!showFilters)}
                endIcon={showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              >
                詳細フィルター
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                onClick={clearFilters}
                disabled={!searchText && !businessCategoryFilter && !tokuteiGinouTypeFilter && !statusFilter && !urgentOnly && !technicalInternOnly}
              >
                クリア
              </Button>
            </Grid>
          </Grid>
          
          <Collapse in={showFilters}>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>業務区分</InputLabel>
                  <Select
                    value={businessCategoryFilter}
                    onChange={(e) => setBusinessCategoryFilter(e.target.value)}
                    label="業務区分"
                  >
                    <MenuItem value="">すべて</MenuItem>
                    {businessCategories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>特定技能</InputLabel>
                  <Select
                    value={tokuteiGinouTypeFilter}
                    onChange={(e) => setTokuteiGinouTypeFilter(e.target.value)}
                    label="特定技能"
                  >
                    <MenuItem value="">すべて</MenuItem>
                    <MenuItem value="1">1号</MenuItem>
                    <MenuItem value="2">2号</MenuItem>
                  </Select>
                </FormControl>
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
                    <MenuItem value="active">活動中</MenuItem>
                    <MenuItem value="on_leave">休暇中</MenuItem>
                    <MenuItem value="transferred">転職</MenuItem>
                    <MenuItem value="returned">帰国</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Collapse>
        </CardContent>
      </Card>

      {/* 緊急アラート */}
      {filteredWorkers.some(worker => worker.urgent) && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small">
              対応状況確認
            </Button>
          }
        >
          緊急対応が必要な特定技能外国人が{filteredWorkers.filter(w => w.urgent).length}名います。
        </Alert>
      )}
      
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredWorkers}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={setSelectedRows}
          rowSelectionModel={selectedRows}
          components={{
            Toolbar: CustomToolbar,
          }}
          getRowClassName={(params) => 
            params.row.urgent ? 'urgent-row' : ''
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

      {/* 一括操作ダイアログ */}
      <Dialog open={bulkActionDialog} onClose={() => setBulkActionDialog(false)}>
        <DialogTitle>一括操作</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            {selectedRows.length}名の特定技能外国人に対して実行する操作を選択してください：
          </Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Button startIcon={<SupportIcon />} fullWidth variant="outlined">
              支援計画更新通知
            </Button>
            <Button startIcon={<AssessmentIcon />} fullWidth variant="outlined">
              技能評価記録入力
            </Button>
            <Button startIcon={<ExportIcon />} fullWidth variant="outlined">
              データエクスポート
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>キャンセル</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TokuteiGinouWorkerList