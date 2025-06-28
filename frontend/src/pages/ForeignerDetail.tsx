import { useParams } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button,
  Divider,
} from '@mui/material'
import {
  Edit as EditIcon,
  Print as PrintIcon,
  Email as EmailIcon,
} from '@mui/icons-material'

const ForeignerDetail = () => {
  const { id } = useParams<{ id: string }>()
  
  const foreigner = {
    id: 1,
    lastName: '田中',
    firstName: '太郎',
    lastNameKana: 'タナカ',
    firstNameKana: 'タロウ',
    lastNameEn: 'TANAKA',
    firstNameEn: 'TARO',
    gender: '男性',
    dateOfBirth: '1990-05-15',
    nationality: '中国',
    passportNumber: 'AB1234567',
    residenceCardNumber: 'CD9876543',
    currentVisaStatus: '技術・人文知識・国際業務',
    visaExpiryDate: '2024-03-15',
    address: '東京都渋谷区1-1-1',
    phoneNumber: '090-1234-5678',
    email: 'tanaka@example.com',
    employerName: '株式会社サンプル',
    notes: '特記事項なし',
  }

  const getExpiryStatus = (expiryDate: string) => {
    const date = new Date(expiryDate)
    const today = new Date()
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) return { color: 'error' as const, text: '緊急' }
    if (diffDays < 60) return { color: 'warning' as const, text: '注意' }
    return { color: 'success' as const, text: '正常' }
  }

  const expiryStatus = getExpiryStatus(foreigner.visaExpiryDate)

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          外国人詳細情報
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            sx={{ mr: 1 }}
          >
            編集
          </Button>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            sx={{ mr: 1 }}
          >
            申請書生成
          </Button>
          <Button
            variant="outlined"
            startIcon={<EmailIcon />}
          >
            通知送信
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                基本情報
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    氏名（漢字）
                  </Typography>
                  <Typography variant="body1">
                    {foreigner.lastName} {foreigner.firstName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    氏名（フリガナ）
                  </Typography>
                  <Typography variant="body1">
                    {foreigner.lastNameKana} {foreigner.firstNameKana}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    氏名（英字）
                  </Typography>
                  <Typography variant="body1">
                    {foreigner.lastNameEn} {foreigner.firstNameEn}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    生年月日
                  </Typography>
                  <Typography variant="body1">
                    {foreigner.dateOfBirth}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    性別
                  </Typography>
                  <Typography variant="body1">
                    {foreigner.gender}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    国籍
                  </Typography>
                  <Typography variant="body1">
                    {foreigner.nationality}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                在留情報
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  在留資格
                </Typography>
                <Typography variant="body1">
                  {foreigner.currentVisaStatus}
                </Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  有効期限
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body1">
                    {foreigner.visaExpiryDate}
                  </Typography>
                  <Chip
                    label={expiryStatus.text}
                    color={expiryStatus.color}
                    size="small"
                  />
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  在留カード番号
                </Typography>
                <Typography variant="body1">
                  {foreigner.residenceCardNumber}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                連絡先情報
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    住所
                  </Typography>
                  <Typography variant="body1">
                    {foreigner.address}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    電話番号
                  </Typography>
                  <Typography variant="body1">
                    {foreigner.phoneNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="body2" color="text.secondary">
                    メールアドレス
                  </Typography>
                  <Typography variant="body1">
                    {foreigner.email}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                    勤務先
                  </Typography>
                  <Typography variant="body1">
                    {foreigner.employerName}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                備考
              </Typography>
              <Typography variant="body1">
                {foreigner.notes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ForeignerDetail