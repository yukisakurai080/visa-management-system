import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Button,
  IconButton,
  Avatar,
  Divider,
  Stack,
  LinearProgress,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
} from '@mui/material'
import {
  People as PeopleIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Support as SupportIcon,
  Assessment as AssessmentIcon,
  Language as LanguageIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
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

const TokuteiGinouDashboard = () => {
  const stats = [
    {
      title: '特定技能外国人数',
      value: '2,847',
      change: '+156',
      changeType: 'increase',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      description: '前月比',
    },
    {
      title: '技能実習からの移行',
      value: '1,623',
      change: '+89',
      changeType: 'increase',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: '#388e3c',
      description: '今月',
    },
    {
      title: '受入機関数',
      value: '1,247',
      change: '+23',
      changeType: 'increase',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      color: '#f57c00',
      description: '登録済み',
    },
    {
      title: '支援実施記録',
      value: '3,521',
      change: '+342',
      changeType: 'increase',
      icon: <SupportIcon sx={{ fontSize: 40 }} />,
      color: '#7b1fa2',
      description: '今月',
    },
  ]

  const businessCategoryData = [
    { name: '介護', value: 520, color: '#1976d2' },
    { name: '建設', value: 410, color: '#388e3c' },
    { name: '飲食料品製造', value: 380, color: '#f57c00' },
    { name: '外食業', value: 340, color: '#7b1fa2' },
    { name: '農業', value: 290, color: '#d32f2f' },
    { name: 'その他', value: 907, color: '#757575' },
  ]

  const skillTestResults = [
    { month: '1月', passed: 145, failed: 23 },
    { month: '2月', passed: 167, failed: 31 },
    { month: '3月', passed: 189, failed: 28 },
    { month: '4月', passed: 201, failed: 35 },
    { month: '5月', passed: 178, failed: 42 },
    { month: '6月', passed: 223, failed: 38 },
  ]

  const supportActivities = [
    {
      id: 1,
      worker: '田中太郎',
      activity: '日本語学習支援',
      date: '2024-01-20',
      status: '完了',
      type: 'language',
      supporter: '山田支援員',
    },
    {
      id: 2,
      worker: '李美麗',
      activity: '住居確保支援',
      date: '2024-01-19',
      status: '進行中',
      type: 'housing',
      supporter: '佐藤支援員',
    },
    {
      id: 3,
      worker: 'グエン・ミン',
      activity: '技能評価',
      date: '2024-01-18',
      status: '予定',
      type: 'skill',
      supporter: '鈴木評価員',
    },
    {
      id: 4,
      worker: '陳志強',
      activity: '生活相談',
      date: '2024-01-17',
      status: '完了',
      type: 'consultation',
      supporter: '高橋相談員',
    },
  ]

  const urgentTasks = [
    {
      id: 1,
      title: '技能試験期限間近',
      description: '5名の外国人の技能試験期限が1ヶ月以内',
      priority: 'high',
      dueDate: '2024-02-15',
      count: 5,
    },
    {
      id: 2,
      title: '支援計画更新',
      description: '12件の支援計画の更新が必要',
      priority: 'medium',
      dueDate: '2024-02-20',
      count: 12,
    },
    {
      id: 3,
      title: '四半期報告書',
      description: '受入機関への四半期報告書作成',
      priority: 'high',
      dueDate: '2024-01-31',
      count: 8,
    },
  ]

  const quickActions = [
    { title: '特定技能者登録', description: '新しい特定技能外国人を登録', color: '#1976d2' },
    { title: '支援記録入力', description: '支援実施記録を入力', color: '#388e3c' },
    { title: '技能評価登録', description: '技能試験結果を登録', color: '#f57c00' },
    { title: '報告書生成', description: '各種報告書を自動生成', color: '#7b1fa2' },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'language': return <LanguageIcon />
      case 'housing': return <BusinessIcon />
      case 'skill': return <AssessmentIcon />
      case 'consultation': return <SupportIcon />
      default: return <ScheduleIcon />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'language': return '#1976d2'
      case 'housing': return '#388e3c'
      case 'skill': return '#f57c00'
      case 'consultation': return '#7b1fa2'
      default: return '#757575'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#d32f2f'
      case 'medium': return '#f57c00'
      case 'low': return '#388e3c'
      default: return '#757575'
    }
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            特定技能管理ダッシュボード
          </Typography>
          <Typography variant="body2" color="text.secondary">
            特定技能外国人総数: {stats[0].value}名 | 受入機関: {stats[2].value}機関 | 
            今月の支援活動: {stats[3].value}件
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Badge badgeContent={urgentTasks.length} color="error">
            <IconButton color="primary">
              <WarningIcon />
            </IconButton>
          </Badge>
          <Button variant="contained" startIcon={<PeopleIcon />}>
            クイックアクション
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
        {/* 業務区分別分布 */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                業務区分別分布
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={businessCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {businessCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* 技能試験結果推移 */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                技能試験結果推移
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={skillTestResults}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="passed" fill="#388e3c" name="合格" />
                  <Bar dataKey="failed" fill="#d32f2f" name="不合格" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* 緊急タスク */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 500 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  緊急対応事項
                </Typography>
                <Chip 
                  label={`${urgentTasks.length}件`} 
                  color="error" 
                  size="small" 
                />
              </Box>
              <List dense>
                {urgentTasks.map((task, index) => (
                  <Box key={task.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Badge badgeContent={task.count} color="error">
                          <WarningIcon sx={{ color: getPriorityColor(task.priority) }} />
                        </Badge>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle2">
                              {task.title}
                            </Typography>
                            <Chip
                              label={task.priority === 'high' ? '緊急' : '重要'}
                              color={task.priority === 'high' ? 'error' : 'warning'}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {task.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              期限: {task.dueDate}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < urgentTasks.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
              <Button fullWidth variant="outlined" sx={{ mt: 2 }}>
                すべて表示
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* 最近の支援活動 */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} sx={{ height: 500 }}>
            <Grid item xs={12}>
              <Card sx={{ height: 240 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    最近の支援活動
                  </Typography>
                  <List dense>
                    {supportActivities.slice(0, 3).map((activity) => (
                      <ListItem key={activity.id} sx={{ px: 0 }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: getActivityColor(activity.type), 
                            width: 32, 
                            height: 32 
                          }}
                        >
                          {getActivityIcon(activity.type)}
                        </Avatar>
                        <ListItemText
                          primary={activity.activity}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                対象: {activity.worker} | 担当: {activity.supporter}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {activity.date} | {activity.status}
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

      {/* アラート */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>特定技能制度に関する重要なお知らせ:</strong> 
              令和6年度の制度改正により、新しい報告要件が追加されました。
              詳細は「制度改正情報」ページでご確認ください。
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  )
}

export default TokuteiGinouDashboard