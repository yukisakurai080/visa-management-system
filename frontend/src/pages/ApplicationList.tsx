import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Paper,
  Typography,
  IconButton,
  Card,
  CardContent,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  Badge,
  LinearProgress,
  Stack,
  Alert,
  Tab,
  Tabs,
  Avatar,
  InputAdornment,
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
  Download as DownloadIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as PendingIcon,
  Description as DocumentIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  GetApp as ExportIcon,
  PlayArrow as GenerateIcon,
  Settings as SettingsIcon,
  PersonAdd as PersonAddIcon,
  Clear as ClearIcon,
} from '@mui/icons-material'

interface ApplicationData {
  id: number
  applicantName: string
  applicantId: number
  templateName: string
  templateId: number
  category: string
  generatedDate: string
  status: 'draft' | 'pending' | 'completed' | 'error'
  filePath?: string
  notes?: string
  priority: 'high' | 'normal' | 'low'
  dueDate: string
  progress: number
}

interface Template {
  id: number
  name: string
  category: string
  description: string
  fields: string[]
  estimatedTime: string
}

const ApplicationList = () => {
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
  const [createDialog, setCreateDialog] = useState(false)
  const [previewDialog, setPreviewDialog] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<ApplicationData | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedApplicant, setSelectedApplicant] = useState('')
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [activeStep, setActiveStep] = useState(0)

  const [applications] = useState<ApplicationData[]>([
    {
      id: 1,
      applicantName: '田中太郎',
      applicantId: 1,
      templateName: '在留期間更新許可申請書',
      templateId: 1,
      category: '在留資格関連',
      generatedDate: '2024-01-15',
      status: 'completed',
      filePath: '/files/tanaka_extension.pdf',
      notes: '通常の更新申請',
      priority: 'normal',
      dueDate: '2024-02-15',
      progress: 100,
    },
    {
      id: 2,
      applicantName: '佐藤花子',
      applicantId: 2,
      templateName: '資格外活動許可申請書',
      templateId: 2,
      category: '資格外活動',
      generatedDate: '2024-01-10',
      status: 'pending',
      filePath: '/files/sato_work_permit.pdf',
      notes: 'アルバイト許可申請',
      priority: 'high',
      dueDate: '2024-01-25',
      progress: 75,
    },
    {
      id: 3,
      applicantName: 'Smith John',
      applicantId: 3,
      templateName: '在留資格変更許可申請書',
      templateId: 3,
      category: '在留資格関連',
      generatedDate: '2024-01-12',
      status: 'draft',
      notes: '留学から技術・人文知識・国際業務への変更',
      priority: 'high',
      dueDate: '2024-02-01',
      progress: 30,
    },
    {
      id: 4,
      applicantName: '李美麗',
      applicantId: 4,
      templateName: '再入国許可申請書',
      templateId: 4,
      category: '出入国関連',
      generatedDate: '2024-01-08',
      status: 'error',
      notes: '書類不備のため再作成が必要',
      priority: 'normal',
      dueDate: '2024-01-30',
      progress: 0,
    },
  ])

  const [templates] = useState<Template[]>([
    {
      id: 1,
      name: '在留期間更新許可申請書',
      category: '在留資格関連',
      description: '現在の在留資格で在留期間を延長する申請',
      fields: ['氏名', '生年月日', '国籍', '在留資格', '在留期間', '活動内容'],
      estimatedTime: '15分',
    },
    {
      id: 2,
      name: '資格外活動許可申請書',
      category: '資格外活動',
      description: 'アルバイト等の資格外活動を行うための申請',
      fields: ['氏名', '生年月日', '活動内容', '勤務先', '労働時間'],
      estimatedTime: '10分',
    },
    {
      id: 3,
      name: '在留資格変更許可申請書',
      category: '在留資格関連',
      description: '別の在留資格に変更するための申請',
      fields: ['氏名', '生年月日', '現在の在留資格', '変更希望資格', '変更理由'],
      estimatedTime: '20分',
    },
    {
      id: 4,
      name: '再入国許可申請書',
      category: '出入国関連',
      description: '日本を一時的に離れる際の再入国許可申請',
      fields: ['氏名', '生年月日', '出国予定日', '帰国予定日', '渡航先'],
      estimatedTime: '10分',
    },
  ])

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = searchText === '' || 
        app.applicantName.includes(searchText) ||
        app.templateName.includes(searchText)
      
      const matchesStatus = statusFilter === '' || app.status === statusFilter
      const matchesCategory = categoryFilter === '' || app.category === categoryFilter
      
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [applications, searchText, statusFilter, categoryFilter])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: '完成', color: 'success' as const, icon: <CheckCircleIcon /> }
      case 'pending':
        return { label: '処理中', color: 'warning' as const, icon: <PendingIcon /> }
      case 'draft':
        return { label: '下書き', color: 'info' as const, icon: <EditIcon /> }
      case 'error':
        return { label: 'エラー', color: 'error' as const, icon: <ErrorIcon /> }
      default:
        return { label: '不明', color: 'default' as const, icon: <ScheduleIcon /> }
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
      width: 150,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
            {params.value.charAt(0)}
          </Avatar>
          <Typography variant="body2">
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'templateName',
      headerName: '申請書種類',
      width: 250,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {params.value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.category}
          </Typography>
        </Box>
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
      field: 'progress',
      headerName: '進捗',
      width: 120,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <LinearProgress 
            variant="determinate" 
            value={params.value} 
            sx={{ mb: 0.5 }}
          />
          <Typography variant="caption" color="text.secondary">
            {params.value}%
          </Typography>
        </Box>
      ),
    },
    {
      field: 'dueDate',
      headerName: '期限',
      width: 120,
      renderCell: (params) => {
        const dueDate = new Date(params.value)
        const today = new Date()
        const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        const isOverdue = diffDays < 0
        const isUrgent = diffDays <= 3 && diffDays >= 0
        
        return (
          <Box>
            <Typography 
              variant="body2" 
              color={isOverdue ? 'error' : isUrgent ? 'warning.main' : 'text.primary'}
            >
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isOverdue ? `${Math.abs(diffDays)}日経過` : `あと${diffDays}日`}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'generatedDate',
      headerName: '作成日',
      width: 120,
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 200,
      renderCell: (params) => (
        <Box display="flex" gap={0.5}>
          <Tooltip title="プレビュー">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedApplication(params.row)
                setPreviewDialog(true)
              }}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="編集">
            <IconButton size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
          {params.row.status === 'completed' && (
            <Tooltip title="ダウンロード">
              <IconButton
                size="small"
                onClick={() => console.log('ダウンロード:', params.row.filePath)}
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="印刷">
            <IconButton size="small">
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="送信">
            <IconButton size="small" disabled={params.row.status !== 'completed'}>
              <SendIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  const createSteps = ['テンプレート選択', '申請者選択', '確認・生成']

  const uniqueCategories = [...new Set(applications.map(app => app.category))]

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            申請書管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            総件数: {applications.length}件 | 完成: {applications.filter(a => a.status === 'completed').length}件 | 
            処理中: {applications.filter(a => a.status === 'pending').length}件
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<ExportIcon />}
            disabled={selectedRows.length === 0}
          >
            一括操作 ({selectedRows.length})
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
          >
            テンプレート管理
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialog(true)}
          >
            新規作成
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
                placeholder="申請者名、申請書種類で検索"
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
              <FormControl fullWidth>
                <InputLabel>ステータス</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="ステータス"
                >
                  <MenuItem value="">すべて</MenuItem>
                  <MenuItem value="completed">完成</MenuItem>
                  <MenuItem value="pending">処理中</MenuItem>
                  <MenuItem value="draft">下書き</MenuItem>
                  <MenuItem value="error">エラー</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>カテゴリ</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="カテゴリ"
                >
                  <MenuItem value="">すべて</MenuItem>
                  {uniqueCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 期限切れアラート */}
      {filteredApplications.some(app => new Date(app.dueDate) < new Date()) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          期限を過ぎた申請書が{filteredApplications.filter(app => new Date(app.dueDate) < new Date()).length}件あります。
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

      {/* 新規作成ダイアログ */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>新規申請書作成</DialogTitle>
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
                申請書テンプレートを選択
              </Typography>
              <Grid container spacing={2}>
                {templates.map((template) => (
                  <Grid item xs={12} md={6} key={template.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedTemplate === template.id.toString() ? 2 : 1,
                        borderColor: selectedTemplate === template.id.toString() ? 'primary.main' : 'grey.300',
                      }}
                      onClick={() => setSelectedTemplate(template.id.toString())}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {template.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {template.description}
                        </Typography>
                        <Chip label={template.category} size="small" sx={{ mr: 1 }} />
                        <Chip label={`所要時間: ${template.estimatedTime}`} size="small" />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                申請者を選択
              </Typography>
              <FormControl fullWidth>
                <InputLabel>申請者</InputLabel>
                <Select
                  value={selectedApplicant}
                  onChange={(e) => setSelectedApplicant(e.target.value)}
                  label="申請者"
                >
                  <MenuItem value="1">田中太郎</MenuItem>
                  <MenuItem value="2">佐藤花子</MenuItem>
                  <MenuItem value="3">Smith John</MenuItem>
                  <MenuItem value="4">李美麗</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                申請書生成の確認
              </Typography>
              <Alert severity="info" sx={{ mb: 2 }}>
                以下の内容で申請書を生成します。
              </Alert>
              <List>
                <ListItem>
                  <ListItemIcon><DocumentIcon /></ListItemIcon>
                  <ListItemText 
                    primary="テンプレート" 
                    secondary={templates.find(t => t.id.toString() === selectedTemplate)?.name}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><PersonAddIcon /></ListItemIcon>
                  <ListItemText 
                    primary="申請者" 
                    secondary={`申請者ID: ${selectedApplicant}`}
                  />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>キャンセル</Button>
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(activeStep - 1)}>戻る</Button>
          )}
          {activeStep < createSteps.length - 1 ? (
            <Button 
              variant="contained" 
              onClick={() => setActiveStep(activeStep + 1)}
              disabled={
                (activeStep === 0 && !selectedTemplate) ||
                (activeStep === 1 && !selectedApplicant)
              }
            >
              次へ
            </Button>
          ) : (
            <Button 
              variant="contained" 
              startIcon={<GenerateIcon />}
              onClick={() => {
                console.log('申請書生成開始')
                setCreateDialog(false)
                setActiveStep(0)
                setSelectedTemplate('')
                setSelectedApplicant('')
              }}
            >
              生成開始
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* プレビューダイアログ */}
      <Dialog open={previewDialog} onClose={() => setPreviewDialog(false)} maxWidth="lg" fullWidth>
        <DialogTitle>申請書プレビュー</DialogTitle>
        <DialogContent>
          {selectedApplication && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedApplication.templateName}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                申請者: {selectedApplication.applicantName}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box 
                sx={{ 
                  height: 400, 
                  border: '1px solid #ccc', 
                  borderRadius: 1, 
                  p: 2,
                  backgroundColor: '#f9f9f9'
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  申請書のプレビューがここに表示されます
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog(false)}>閉じる</Button>
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            ダウンロード
          </Button>
          <Button variant="contained" startIcon={<PrintIcon />}>
            印刷
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ApplicationList