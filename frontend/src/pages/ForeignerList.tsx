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
  Menu,
  MenuList,
  ListItemIcon,
  ListItemText,
  Collapse,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Stack,
  Tooltip,
  Badge,
} from '@mui/material'
import { 
  DataGrid, 
  GridColDef, 
  GridRowSelectionModel,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Print as PrintIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Work as WorkIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

interface ForeignerData {
  id: number
  name: string
  nameKana: string
  nameEn: string
  nationality: string
  visaStatus: string
  expiryDate: string
  residenceCard: string
  gender: string
  age: number
  phone: string
  email: string
  address: string
  employer: string
  photo?: string
  urgent: boolean
}

const ForeignerList = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [nationalityFilter, setNationalityFilter] = useState('')
  const [visaStatusFilter, setVisaStatusFilter] = useState('')
  const [urgentOnly, setUrgentOnly] = useState(false)
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [bulkActionDialog, setBulkActionDialog] = useState(false)

  const [rows] = useState<ForeignerData[]>([
    {
      id: 1,
      name: '田中太郎',
      nameKana: 'タナカタロウ',
      nameEn: 'TANAKA TARO',
      nationality: '中国',
      visaStatus: '技術・人文知識・国際業務',
      expiryDate: '2024-02-15',
      residenceCard: 'AB1234567',
      gender: '男性',
      age: 28,
      phone: '090-1234-5678',
      email: 'tanaka@example.com',
      address: '東京都渋谷区1-1-1',
      employer: '株式会社サンプル',
      urgent: true,
    },
    {
      id: 2,
      name: '佐藤花子',
      nameKana: 'サトウハナコ',
      nameEn: 'SATO HANAKO',
      nationality: '韓国',
      visaStatus: '留学',
      expiryDate: '2024-05-20',
      residenceCard: 'CD2345678',
      gender: '女性',
      age: 22,
      phone: '090-2345-6789',
      email: 'sato@example.com',
      address: '東京都新宿区2-2-2',
      employer: '東京大学',
      urgent: false,
    },
    {
      id: 3,
      name: 'Smith John',
      nameKana: 'スミス ジョン',
      nameEn: 'SMITH JOHN',
      nationality: 'アメリカ',
      visaStatus: '教育',
      expiryDate: '2024-03-10',
      residenceCard: 'EF3456789',
      gender: '男性',
      age: 35,
      phone: '090-3456-7890',
      email: 'john@example.com',
      address: '東京都港区3-3-3',
      employer: '国際学院',
      urgent: true,
    },
    {
      id: 4,
      name: '李美麗',
      nameKana: 'リビレイ',
      nameEn: 'LI MEILI',
      nationality: '中国',
      visaStatus: '家族滞在',
      expiryDate: '2024-08-15',
      residenceCard: 'GH4567890',
      gender: '女性',
      age: 30,
      phone: '090-4567-8901',
      email: 'li@example.com',
      address: '東京都世田谷区4-4-4',
      employer: '-',
      urgent: false,
    },
  ])

  const filteredRows = useMemo(() => {
    return rows.filter(row => {
      const matchesSearch = searchText === '' || 
        row.name.includes(searchText) ||
        row.nameKana.includes(searchText) ||
        row.nameEn.includes(searchText) ||
        row.residenceCard.includes(searchText)
      
      const matchesNationality = nationalityFilter === '' || row.nationality === nationalityFilter
      const matchesVisaStatus = visaStatusFilter === '' || row.visaStatus === visaStatusFilter
      const matchesUrgent = !urgentOnly || row.urgent
      
      return matchesSearch && matchesNationality && matchesVisaStatus && matchesUrgent
    })
  }, [rows, searchText, nationalityFilter, visaStatusFilter, urgentOnly])

  const getExpiryStatus = (expiryDate: string) => {
    const date = new Date(expiryDate)
    const today = new Date()
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return { color: 'error' as const, text: '期限切れ', days: diffDays }
    if (diffDays < 30) return { color: 'error' as const, text: '緊急', days: diffDays }
    if (diffDays < 60) return { color: 'warning' as const, text: '要注意', days: diffDays }
    return { color: 'success' as const, text: '正常', days: diffDays }
  }

  const CustomToolbar = () => (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
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
      width: 150,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.row.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.nameKana}
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
      field: 'visaStatus',
      headerName: '在留資格',
      width: 200,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <Chip
            label={params.value.length > 12 ? `${params.value.slice(0, 12)}...` : params.value}
            variant="outlined"
            size="small"
          />
        </Tooltip>
      ),
    },
    {
      field: 'expiryDate',
      headerName: '有効期限',
      width: 140,
      renderCell: (params) => {
        const status = getExpiryStatus(params.value)
        return (
          <Box>
            <Chip
              label={params.value}
              color={status.color}
              size="small"
              icon={status.color === 'error' ? <WarningIcon /> : undefined}
            />
            <Typography variant="caption" display="block" color="text.secondary">
              {status.days >= 0 ? `あと${status.days}日` : `${Math.abs(status.days)}日経過`}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'residenceCard',
      headerName: '在留カード',
      width: 120,
    },
    {
      field: 'contact',
      headerName: '連絡先',
      width: 100,
      renderCell: (params) => (
        <Box display="flex" gap={0.5}>
          <Tooltip title={`電話: ${params.row.phone}`}>
            <IconButton size="small">
              <PhoneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`メール: ${params.row.email}`}>
            <IconButton size="small">
              <EmailIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="詳細表示">
            <IconButton
              size="small"
              onClick={() => navigate(`/foreigners/${params.id}`)}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="編集">
            <IconButton
              size="small"
              onClick={() => navigate(`/foreigners/${params.id}/edit`)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="申請書生成">
            <IconButton
              size="small"
              onClick={() => console.log('申請書生成', params.id)}
            >
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  const clearFilters = () => {
    setSearchText('')
    setNationalityFilter('')
    setVisaStatusFilter('')
    setUrgentOnly(false)
  }

  const uniqueNationalities = [...new Set(rows.map(row => row.nationality))]
  const uniqueVisaStatuses = [...new Set(rows.map(row => row.visaStatus))]

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            外国人管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            登録者数: {rows.length}名 | 期限切れ間近: {rows.filter(r => r.urgent).length}名
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
            onClick={() => navigate('/foreigners/new')}
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
                placeholder="氏名、フリガナ、在留カード番号で検索"
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
                disabled={!searchText && !nationalityFilter && !visaStatusFilter && !urgentOnly}
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
                  <InputLabel>国籍</InputLabel>
                  <Select
                    value={nationalityFilter}
                    onChange={(e) => setNationalityFilter(e.target.value)}
                    label="国籍"
                  >
                    <MenuItem value="">すべて</MenuItem>
                    {uniqueNationalities.map((nationality) => (
                      <MenuItem key={nationality} value={nationality}>
                        {nationality}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>在留資格</InputLabel>
                  <Select
                    value={visaStatusFilter}
                    onChange={(e) => setVisaStatusFilter(e.target.value)}
                    label="在留資格"
                  >
                    <MenuItem value="">すべて</MenuItem>
                    {uniqueVisaStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Collapse>
        </CardContent>
      </Card>

      {/* 期限切れアラート */}
      {filteredRows.some(row => row.urgent) && (
        <Alert 
          severity="warning" 
          sx={{ mb: 2 }}
          action={
            <Button color="inherit" size="small">
              一括通知送信
            </Button>
          }
        >
          期限切れ間近の外国人が{filteredRows.filter(r => r.urgent).length}名います。
        </Alert>
      )}
      
      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredRows}
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
            {selectedRows.length}名の外国人に対して実行する操作を選択してください：
          </Typography>
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Button startIcon={<EmailIcon />} fullWidth variant="outlined">
              期限切れ通知メール送信
            </Button>
            <Button startIcon={<PrintIcon />} fullWidth variant="outlined">
              申請書一括生成
            </Button>
            <Button startIcon={<ExportIcon />} fullWidth variant="outlined">
              CSVエクスポート
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkActionDialog(false)}>キャンセル</Button>
        </DialogActions>
      </Dialog>

      {/* アクションメニュー */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem>
          <ListItemIcon><EmailIcon /></ListItemIcon>
          <ListItemText>メール送信</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon><PrintIcon /></ListItemIcon>
          <ListItemText>申請書生成</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon><DeleteIcon /></ListItemIcon>
          <ListItemText>削除</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default ForeignerList