import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Step,
  Stepper,
  StepLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  DriveFileMove as MoveIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  FamilyRestroom as FamilyIcon,
  School as SchoolIcon,
  Flight as FlightIcon,
  Engineering as EngineeringIcon,
  AccountBalance as PermanentIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material'

interface CompletedForm {
  id: number
  formId: string
  applicantName: string
  applicantNameKana: string
  visaType: string
  procedureType: string
  submittedDate: string
  status: 'completed' | 'reviewed' | 'processed'
  reviewedBy?: string
  nationality: string
  email: string
}

interface ProcedureType {
  id: string
  name: string
  icon: React.ReactNode
  categories: CategoryType[]
}

interface CategoryType {
  id: string
  name: string
  icon: React.ReactNode
  path: string
}

const CompletedForms = () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([])
  const [moveDialog, setMoveDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [moveStep, setMoveStep] = useState(0)
  const [selectedProcedure, setSelectedProcedure] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [detailDialog, setDetailDialog] = useState(false)
  const [selectedFormDetail, setSelectedFormDetail] = useState<any>(null)

  // 手続き・カテゴリのマスターデータ
  const procedureTypes: ProcedureType[] = [
    {
      id: 'certificate',
      name: '在留資格認定証明書交付申請',
      icon: <DescriptionIcon />,
      categories: [
        { id: 'tokutei-ginou', name: '特定技能', icon: <WorkIcon />, path: '/certificate/tokutei-ginou' },
        { id: 'work-visa', name: '就労系', icon: <EngineeringIcon />, path: '/certificate/work-visa' },
        { id: 'status-visa', name: '身分系', icon: <FamilyIcon />, path: '/certificate/status-visa' },
        { id: 'non-work-visa', name: '非就労系', icon: <SchoolIcon />, path: '/certificate/non-work-visa' },
        { id: 'short-stay', name: '短期滞在', icon: <FlightIcon />, path: '/certificate/short-stay' },
      ]
    },
    {
      id: 'change',
      name: '在留資格変更許可申請',
      icon: <DescriptionIcon />,
      categories: [
        { id: 'to-tokutei-ginou', name: '特定技能への変更', icon: <WorkIcon />, path: '/change/to-tokutei-ginou' },
        { id: 'to-work-visa', name: '就労系への変更', icon: <EngineeringIcon />, path: '/change/to-work-visa' },
        { id: 'to-status-visa', name: '身分系への変更', icon: <FamilyIcon />, path: '/change/to-status-visa' },
        { id: 'to-non-work-visa', name: '非就労系への変更', icon: <SchoolIcon />, path: '/change/to-non-work-visa' },
      ]
    },
    {
      id: 'renewal',
      name: '在留期間更新許可申請',
      icon: <DescriptionIcon />,
      categories: [
        { id: 'tokutei-ginou', name: '特定技能（更新）', icon: <WorkIcon />, path: '/renewal/tokutei-ginou' },
        { id: 'work-visa', name: '就労系（更新）', icon: <EngineeringIcon />, path: '/renewal/work-visa' },
        { id: 'status-visa', name: '身分系（更新）', icon: <FamilyIcon />, path: '/renewal/status-visa' },
        { id: 'non-work-visa', name: '非就労系（更新）', icon: <SchoolIcon />, path: '/renewal/non-work-visa' },
      ]
    },
    {
      id: 'acquisition',
      name: '在留資格取得許可申請',
      icon: <DescriptionIcon />,
      categories: [
        { id: 'status-visa', name: '身分系（取得）', icon: <FamilyIcon />, path: '/acquisition/status-visa' },
        { id: 'others', name: 'その他（取得）', icon: <AdminIcon />, path: '/acquisition/others' },
      ]
    }
  ]

  // 実際のデータ
  const [completedForms, setCompletedForms] = useState<CompletedForm[]>([
    {
      id: 1,
      formId: '日本人の配偶者等-認定証明書交付申請-1709280123',
      applicantName: 'スミス・ジョン',
      applicantNameKana: 'スミス ジョン',
      visaType: '日本人の配偶者等',
      procedureType: '認定証明書交付申請',
      submittedDate: '2024-06-28',
      status: 'completed',
      nationality: 'アメリカ',
      email: 'john.smith@example.com',
    },
    {
      id: 2,
      formId: '特定技能1号-認定証明書交付申請-1709280124',
      applicantName: 'グエン・ミン・フオン',
      applicantNameKana: 'グエン ミン フオン',
      visaType: '特定技能1号',
      procedureType: '認定証明書交付申請',
      submittedDate: '2024-06-28',
      status: 'reviewed',
      reviewedBy: '田中太郎',
      nationality: 'ベトナム',
      email: 'nguyen.minh@example.com',
    },
    {
      id: 3,
      formId: '技術・人文知識・国際業務-変更許可申請-1709280125',
      applicantName: 'リー・シャオミン',
      applicantNameKana: 'リー シャオミン',
      visaType: '技術・人文知識・国際業務',
      procedureType: '在留資格変更許可申請',
      submittedDate: '2024-06-27',
      status: 'processed',
      reviewedBy: '佐藤花子',
      nationality: '中国',
      email: 'li.xiaoming@example.com',
    },
    {
      id: 4,
      formId: '留学-認定証明書交付申請-1709280126',
      applicantName: 'パク・ジヒョン',
      applicantNameKana: 'パク ジヒョン',
      visaType: '留学',
      procedureType: '認定証明書交付申請',
      submittedDate: '2024-06-27',
      status: 'completed',
      nationality: '韓国',
      email: 'park.jihyun@example.com',
    },
    {
      id: 5,
      formId: '家族滞在-認定証明書交付申請-1709280127',
      applicantName: 'タナカ・マリア',
      applicantNameKana: 'タナカ マリア',
      visaType: '家族滞在',
      procedureType: '認定証明書交付申請',
      submittedDate: '2024-06-26',
      status: 'reviewed',
      reviewedBy: '山田次郎',
      nationality: 'フィリピン',
      email: 'maria.tanaka@example.com',
    },
  ])
  const [isLoading, setIsLoading] = useState(true)

  // APIからデータを取得
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const result = await api.getApplications()
        if (result.success && result.data) {
          // APIデータをCompletedForm形式に変換
          const formattedData = result.data.map((item: any) => ({
            id: item.id,
            formId: item.form_id,
            applicantName: `${item.family_name} ${item.given_name}`,
            applicantNameKana: `${item.family_name_kana || ''} ${item.given_name_kana || ''}`.trim(),
            visaType: getVisaTypeLabel(item.application_type),
            procedureType: 'ビザ申請書',
            submittedDate: new Date(item.created_at).toLocaleDateString('ja-JP'),
            status: item.status || 'completed',
            nationality: item.nationality || '',
            email: item.email || '',
          }))
          setCompletedForms(formattedData)
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchApplications()
  }, [])

  // ビザタイプのラベル変換
  const getVisaTypeLabel = (type: string) => {
    switch (type) {
      case 'family-visit': return '短期滞在（親族訪問）'
      case 'friend-visit': return '短期滞在（知人訪問）'
      case 'tourism': return '短期滞在（観光）'
      case 'business': return '短期滞在（商用）'
      default: return type
    }
  }

  // 移動・削除のハンドラー
  const handleMoveClick = () => {
    if (selectedRows.length === 0) return
    setMoveDialog(true)
    setMoveStep(0)
    setSelectedProcedure('')
    setSelectedCategory('')
  }

  const handleDeleteClick = () => {
    if (selectedRows.length === 0) return
    setDeleteDialog(true)
  }

  const handleProcedureSelect = (procedureId: string) => {
    setSelectedProcedure(procedureId)
    setMoveStep(1)
  }

  const handleCategorySelect = (categoryId: string, path: string) => {
    setSelectedCategory(categoryId)
    // 実際の移動処理（ここではナビゲート）
    setMoveDialog(false)
    navigate(path)
  }

  const handleDelete = () => {
    // 実際の削除処理をここに実装
    console.log('削除対象:', selectedRows)
    setDeleteDialog(false)
    setSelectedRows([])
    // alert('選択されたフォームを削除しました')
  }

  const handleMoveCancel = () => {
    setMoveDialog(false)
    setMoveStep(0)
    setSelectedProcedure('')
    setSelectedCategory('')
  }

  const handleMoveBack = () => {
    setMoveStep(0)
    setSelectedProcedure('')
  }

  // 詳細表示のハンドラー
  const handleViewDetail = async (formId: number) => {
    try {
      const result = await api.getApplicationDetail(formId)
      if (result.success) {
        setSelectedFormDetail(result.data)
        setDetailDialog(true)
      }
    } catch (error) {
      console.error('Failed to fetch detail:', error)
      alert('詳細情報の取得に失敗しました')
    }
  }

  const handleDetailClose = () => {
    setDetailDialog(false)
    setSelectedFormDetail(null)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: '入力完了', color: 'info' as const, icon: <CheckCircleIcon /> }
      case 'reviewed':
        return { label: '確認済み', color: 'warning' as const, icon: <ScheduleIcon /> }
      case 'processed':
        return { label: '処理完了', color: 'success' as const, icon: <CheckCircleIcon /> }
      default:
        return { label: '不明', color: 'default' as const, icon: <CheckCircleIcon /> }
    }
  }

  const getVisaTypeColor = (visaType: string) => {
    switch (visaType) {
      case '特定技能1号':
      case '特定技能2号':
        return '#1976d2'
      case '技術・人文知識・国際業務':
      case '研究':
      case '経営・管理':
        return '#388e3c'
      case '日本人の配偶者等':
      case '永住者の配偶者等':
      case '定住者':
        return '#f57c00'
      case '留学':
      case '研修':
      case '家族滞在':
        return '#7b1fa2'
      default:
        return '#757575'
    }
  }

  const filteredForms = completedForms.filter(form => {
    const matchesSearch = searchText === '' || 
      form.applicantName.includes(searchText) ||
      form.applicantNameKana.includes(searchText) ||
      form.formId.includes(searchText)
    
    const matchesStatus = statusFilter === '' || form.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const columns: GridColDef[] = [
    {
      field: 'applicantName',
      headerName: '申請者',
      width: 180,
      renderCell: (params) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.8rem' }}>
            <PersonIcon />
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="bold">
              {params.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.applicantNameKana}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'nationality',
      headerName: '国籍',
      width: 100,
    },
    {
      field: 'visaType',
      headerName: '在留資格',
      width: 200,
      renderCell: (params) => (
        <Chip
          label={params.value}
          variant="outlined"
          size="small"
          sx={{ 
            color: getVisaTypeColor(params.value), 
            borderColor: getVisaTypeColor(params.value),
            fontWeight: 'bold'
          }}
        />
      ),
    },
    {
      field: 'procedureType',
      headerName: '手続き種別',
      width: 180,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'submittedDate',
      headerName: '入力完了日',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
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
      field: 'reviewedBy',
      headerName: '担当者',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '操作',
      width: 150,
      renderCell: (params) => (
        <Box display="flex" gap={0.5}>
          <IconButton 
            size="small" 
            title="詳細表示"
            onClick={() => handleViewDetail(params.row.id)}
          >
            <ViewIcon />
          </IconButton>
          <IconButton size="small" title="ダウンロード">
            <DownloadIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <AssignmentIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          <Box>
            <Typography variant="h4" component="h1">
              入力完了済みフォーム
            </Typography>
            <Typography variant="body2" color="text.secondary">
              お客様から送信された申請フォームの一覧
            </Typography>
          </Box>
        </Box>
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            startIcon={<MoveIcon />}
            onClick={handleMoveClick}
            disabled={selectedRows.length === 0}
            color="primary"
          >
            移動 ({selectedRows.length})
          </Button>
          <Button
            variant="contained"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
            disabled={selectedRows.length === 0}
            color="error"
          >
            削除 ({selectedRows.length})
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            disabled={filteredForms.length === 0}
          >
            一括ダウンロード
          </Button>
        </Box>
      </Box>

      {/* 統計カード */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary.main">
                {completedForms.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                総入力完了数
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="info.main">
                {completedForms.filter(f => f.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                未確認
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="warning.main">
                {completedForms.filter(f => f.status === 'reviewed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                確認済み
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="success.main">
                {completedForms.filter(f => f.status === 'processed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                処理完了
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
                placeholder="申請者名、フォームIDで検索"
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
                  <MenuItem value="completed">入力完了</MenuItem>
                  <MenuItem value="reviewed">確認済み</MenuItem>
                  <MenuItem value="processed">処理完了</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={filteredForms}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={setSelectedRows}
        />
      </Paper>

      {/* 注意事項 */}
      <Card sx={{ mt: 3, bgcolor: 'grey.50' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            フォーム管理について
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • お客様が入力完了したフォームは自動的にこちらに表示されます<br />
            • 各フォームの内容確認後、ステータスを「確認済み」に変更してください<br />
            • 必要な書類準備や申請手続きが完了したら「処理完了」に変更してください<br />
            • フォームデータは安全に保管され、必要に応じてダウンロード可能です
          </Typography>
        </CardContent>
      </Card>

      {/* 移動ダイアログ */}
      <Dialog open={moveDialog} onClose={handleMoveCancel} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <MoveIcon color="primary" />
            フォームの移動
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            選択されたフォーム（{selectedRows.length}件）を指定した申請種別に移動します。
          </Alert>

          <Stepper activeStep={moveStep} sx={{ mb: 3 }}>
            <Step>
              <StepLabel>手続き種別を選択</StepLabel>
            </Step>
            <Step>
              <StepLabel>カテゴリを選択</StepLabel>
            </Step>
          </Stepper>

          {moveStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                手続き種別を選択してください
              </Typography>
              <List>
                {procedureTypes.map((procedure) => (
                  <ListItem key={procedure.id} disablePadding>
                    <ListItemButton 
                      onClick={() => handleProcedureSelect(procedure.id)}
                      sx={{ 
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'white',
                        }
                      }}
                    >
                      <ListItemIcon>
                        {procedure.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={procedure.name}
                        secondary={`${procedure.categories.length}カテゴリ`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {moveStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                カテゴリを選択してください
              </Typography>
              {procedureTypes
                .filter(p => p.id === selectedProcedure)
                .map(procedure => (
                  <List key={procedure.id}>
                    {procedure.categories.map((category) => (
                      <ListItem key={category.id} disablePadding>
                        <ListItemButton 
                          onClick={() => handleCategorySelect(category.id, category.path)}
                          sx={{ 
                            borderRadius: 1,
                            mb: 1,
                            '&:hover': {
                              backgroundColor: 'success.light',
                              color: 'white',
                            }
                          }}
                        >
                          <ListItemIcon>
                            {category.icon}
                          </ListItemIcon>
                          <ListItemText primary={category.name} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMoveCancel}>キャンセル</Button>
          {moveStep === 1 && (
            <Button onClick={handleMoveBack}>戻る</Button>
          )}
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <DeleteIcon color="error" />
            フォームの削除確認
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            選択されたフォーム（{selectedRows.length}件）を削除します。
            この操作は取り消すことができません。
          </Alert>
          <Typography variant="body2">
            削除対象のフォーム：
          </Typography>
          <Box sx={{ mt: 1, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            {filteredForms
              .filter(form => selectedRows.includes(form.id))
              .map(form => (
                <Typography key={form.id} variant="body2">
                  • {form.applicantName} ({form.visaType})
                </Typography>
              ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>キャンセル</Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
          >
            削除実行
          </Button>
        </DialogActions>
      </Dialog>

      {/* 詳細表示ダイアログ */}
      <Dialog open={detailDialog} onClose={handleDetailClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <ViewIcon color="primary" />
            申請内容詳細
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedFormDetail && (
            <Box>
              {/* 基本情報 */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    申請者基本情報
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">フォームID</Typography>
                      <Typography variant="body1">{selectedFormDetail.form_id}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">申請タイプ</Typography>
                      <Typography variant="body1">{getVisaTypeLabel(selectedFormDetail.application_type)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">氏名（英字）</Typography>
                      <Typography variant="body1">
                        {selectedFormDetail.family_name} {selectedFormDetail.given_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">氏名（カタカナ）</Typography>
                      <Typography variant="body1">
                        {selectedFormDetail.family_name_kana} {selectedFormDetail.given_name_kana}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">性別</Typography>
                      <Typography variant="body1">{selectedFormDetail.gender || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">生年月日</Typography>
                      <Typography variant="body1">{selectedFormDetail.date_of_birth || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">国籍</Typography>
                      <Typography variant="body1">{selectedFormDetail.nationality || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">パスポート番号</Typography>
                      <Typography variant="body1">{selectedFormDetail.passport_number || '-'}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* 連絡先情報 */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    連絡先情報
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">メールアドレス</Typography>
                      <Typography variant="body1">{selectedFormDetail.email || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">電話番号</Typography>
                      <Typography variant="body1">{selectedFormDetail.phone_number || '-'}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* 渡航情報 */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    渡航情報
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">訪問目的</Typography>
                      <Typography variant="body1">{selectedFormDetail.purpose_of_visit || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">入国予定日</Typography>
                      <Typography variant="body1">{selectedFormDetail.intended_arrival_date || '-'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">出国予定日</Typography>
                      <Typography variant="body1">{selectedFormDetail.intended_departure_date || '-'}</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* システム情報 */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    システム情報
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">申請日時</Typography>
                      <Typography variant="body1">
                        {new Date(selectedFormDetail.created_at).toLocaleString('ja-JP')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">ステータス</Typography>
                      <Chip 
                        label={getStatusInfo(selectedFormDetail.status).label}
                        color={getStatusInfo(selectedFormDetail.status).color}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose}>閉じる</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            PDF出力
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CompletedForms