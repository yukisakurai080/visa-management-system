import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  IconButton,
  Avatar,
  Divider,
  Stack,
  LinearProgress,
  Badge,
  Menu,
  MenuItem,
  Fab,
} from '@mui/material'
import {
  People as PeopleIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  MoreVert as MoreVertIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const stats = [
    {
      title: '登録外国人数',
      value: '1,234',
      change: '+12',
      changeType: 'increase',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      description: '前月比',
    },
    {
      title: '期限切れ間近',
      value: '45',
      change: '+8',
      changeType: 'increase',
      icon: <WarningIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      description: '30日以内',
    },
    {
      title: '今月の申請書',
      value: '89',
      change: '-5',
      changeType: 'decrease',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      description: '前月比',
    },
    {
      title: 'お問合せ件数',
      value: '23',
      change: '+15',
      changeType: 'increase',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
      description: '本日',
    },
  ]

  const visaStatusData = [
    { name: '技術・人文', value: 420, color: '#1976d2' },
    { name: '留学', value: 380, color: '#388e3c' },
    { name: '家族滞在', value: 210, color: '#f57c00' },
    { name: '永住者', value: 180, color: '#7b1fa2' },
    { name: 'その他', value: 44, color: '#d32f2f' },
  ]

  const monthlyData = [
    { month: '1月', applications: 45, renewals: 23 },
    { month: '2月', applications: 52, renewals: 31 },
    { month: '3月', applications: 48, renewals: 28 },
    { month: '4月', applications: 61, renewals: 35 },
    { month: '5月', applications: 55, renewals: 42 },
    { month: '6月', applications: 67, renewals: 38 },
  ]

  const expiryTrend = [
    { month: '1月', count: 12 },
    { month: '2月', count: 19 },
    { month: '3月', count: 25 },
    { month: '4月', count: 33 },
    { month: '5月', count: 28 },
    { month: '6月', count: 45 },
    { month: '7月', count: 38 },
  ]

  const urgentAlerts = [
    { 
      id: 1, 
      name: '田中 太郎', 
      expiry: '2024-02-15', 
      daysLeft: 5, 
      status: '緊急', 
      type: 'danger',
      visaType: '技術・人文知識・国際業務',
      avatar: 'T'
    },
    { 
      id: 2, 
      name: '佐藤 花子', 
      expiry: '2024-03-01', 
      daysLeft: 18, 
      status: '要注意', 
      type: 'warning',
      visaType: '留学',
      avatar: 'S'
    },
    { 
      id: 3, 
      name: 'Smith John', 
      expiry: '2024-03-15', 
      daysLeft: 32, 
      status: '準備中', 
      type: 'info',
      visaType: '技術・人文知識・国際業務',
      avatar: 'J'
    },
    { 
      id: 4, 
      name: '李 美麗', 
      expiry: '2024-02-28', 
      daysLeft: 12, 
      status: '確認中', 
      type: 'warning',
      visaType: '家族滞在',
      avatar: '李'
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'add_person',
      title: '新規外国人登録',
      description: '田中太郎様を登録しました',
      time: '2時間前',
      icon: <PeopleIcon />,
      color: '#1976d2'
    },
    {
      id: 2,
      type: 'generate_doc',
      title: '申請書生成',
      description: '在留期間更新許可申請書を生成',
      time: '4時間前',
      icon: <AssignmentIcon />,
      color: '#388e3c'
    },
    {
      id: 3,
      type: 'inquiry',
      title: 'お問合せ回答',
      description: 'お問合せフォームから申請書生成',
      time: '1日前',
      icon: <InfoIcon />,
      color: '#7b1fa2'
    },
    {
      id: 4,
      type: 'alert',
      title: 'アラート送信',
      description: '期限切れ通知を5名に送信',
      time: '1日前',
      icon: <NotificationsIcon />,
      color: '#f57c00'
    },
  ]

  const quickActions = [
    { title: '外国人登録', description: '新しい外国人を登録', color: '#1976d2', path: '/foreigners/new' },
    { title: '申請書生成', description: '申請書を一括生成', color: '#388e3c', path: '/applications' },
    { title: 'アラート送信', description: '期限切れ通知を送信', color: '#f57c00', path: '/' },
    { title: 'レポート出力', description: '統計レポートを生成', color: '#7b1fa2', path: '/' },
  ]

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          ダッシュボード
        </Typography>
        <Box display="flex" gap={1}>
          <Badge badgeContent={4} color="error">
            <IconButton color="primary">
              <NotificationsIcon />
            </IconButton>
          </Badge>
          <Button 
            variant="contained" 
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/foreigners/new')}
            size="large"
          >
            外国人新規登録
          </Button>
        </Box>
      </Box>
      
      {/* 統計カード */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {stat.changeType === 'increase' ? (
                      <ArrowUpwardIcon sx={{ fontSize: 16, color: '#388e3c' }} />
                    ) : (
                      <ArrowDownwardIcon sx={{ fontSize: 16, color: '#d32f2f' }} />
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ color: stat.changeType === 'increase' ? '#388e3c' : '#d32f2f' }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h4" component="div" sx={{ color: stat.color, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* 在留資格分布 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                在留資格分布
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={visaStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {visaStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 月別申請書統計 */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                月別申請書統計
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="applications" fill="#1976d2" name="新規申請" />
                  <Bar dataKey="renewals" fill="#388e3c" name="更新申請" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* 緊急アラート */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 500 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  期限切れアラート
                </Typography>
                <Chip 
                  label={`${urgentAlerts.length}件`} 
                  color="error" 
                  size="small" 
                />
              </Box>
              <List dense>
                {urgentAlerts.map((alert, index) => (
                  <Box key={alert.id}>
                    <ListItem sx={{ px: 0 }}>
                      <Avatar 
                        sx={{ 
                          mr: 2, 
                          bgcolor: alert.type === 'danger' ? '#d32f2f' : 
                                   alert.type === 'warning' ? '#f57c00' : '#1976d2',
                          width: 40,
                          height: 40
                        }}
                      >
                        {alert.avatar}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2">
                              {alert.name}
                            </Typography>
                            <Chip
                              label={`${alert.daysLeft}日`}
                              color={
                                alert.type === 'danger' ? 'error' :
                                alert.type === 'warning' ? 'warning' : 'info'
                              }
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {alert.visaType}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              期限: {alert.expiry}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < urgentAlerts.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                すべて表示
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* 最近の活動 & クイックアクション */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} sx={{ height: 500 }}>
            <Grid item xs={12}>
              <Card sx={{ height: 240 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    最近の活動
                  </Typography>
                  <List dense>
                    {recentActivities.slice(0, 3).map((activity) => (
                      <ListItem key={activity.id} sx={{ px: 0 }}>
                        <Avatar sx={{ mr: 2, bgcolor: activity.color, width: 32, height: 32 }}>
                          {activity.icon}
                        </Avatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {activity.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {activity.time}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ height: 240 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    クイックアクション
                  </Typography>
                  <Grid container spacing={1}>
                    {quickActions.map((action, index) => (
                      <Grid item xs={6} key={index}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => navigate(action.path)}
                          sx={{ 
                            height: 60, 
                            flexDirection: 'column',
                            borderColor: action.color,
                            color: action.color,
                            '&:hover': {
                              backgroundColor: `${action.color}10`,
                              borderColor: action.color,
                            }
                          }}
                        >
                          <Typography variant="caption" fontWeight="bold">
                            {action.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {action.description}
                          </Typography>
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* 期限切れトレンド */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                期限切れトレンド（7ヶ月間）
              </Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={expiryTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#f57c00" 
                    fill="#f57c00" 
                    fillOpacity={0.3}
                    name="期限切れ件数"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="新規登録"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
        onClick={() => navigate('/foreigners/new')}
      >
        <PersonAddIcon />
      </Fab>
    </Box>
  )
}

export default Dashboard
