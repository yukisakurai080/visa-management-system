import React, { useState } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  Divider,
  Collapse,
  Badge,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  ContactMail as ContactMailIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
  Work as WorkIcon,
  Home as HomeIcon,
  Flight as FlightIcon,
  Business as BusinessIcon,
  Support as SupportIcon,
  Assessment as AssessmentIcon,
  Report as ReportIcon,
  ExpandLess,
  ExpandMore,
  School as SchoolIcon,
  Engineering as EngineeringIcon,
  FamilyRestroom as FamilyIcon,
  AccountBalance as PermanentIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material'

const drawerWidth = 260

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({})
  const [completedFormsCount, setCompletedFormsCount] = useState(5) // 仮の値、実際はAPIから取得
  const navigate = useNavigate()

  const menuStructure = [
    {
      id: 'dashboard',
      text: 'ダッシュボード',
      path: '/',
      icon: <DashboardIcon />,
      type: 'single'
    },
    {
      id: 'certificate-application',
      text: '在留資格認定証明書交付申請',
      icon: <DescriptionIcon />,
      type: 'group',
      children: [
        { text: '特定技能（認定）', path: '/certificate/tokutei-ginou', icon: <WorkIcon /> },
        { text: '就労系（認定）', path: '/certificate/work-visa', icon: <EngineeringIcon /> },
        { text: '身分系（認定）', path: '/certificate/status-visa', icon: <FamilyIcon /> },
        { text: '非就労系（認定）', path: '/certificate/non-work-visa', icon: <SchoolIcon /> },
        { text: '短期滞在（認定）', path: '/certificate/short-stay', icon: <FlightIcon /> },
      ]
    },
    {
      id: 'change-application',
      text: '在留資格変更許可申請',
      icon: <DescriptionIcon />,
      type: 'group',
      children: [
        { text: '特定技能への変更', path: '/change/to-tokutei-ginou', icon: <WorkIcon /> },
        { text: '就労系への変更', path: '/change/to-work-visa', icon: <EngineeringIcon /> },
        { text: '身分系への変更', path: '/change/to-status-visa', icon: <FamilyIcon /> },
        { text: '非就労系への変更', path: '/change/to-non-work-visa', icon: <SchoolIcon /> },
      ]
    },
    {
      id: 'renewal-application',
      text: '在留期間更新許可申請',
      icon: <DescriptionIcon />,
      type: 'group',
      children: [
        { text: '特定技能（更新）', path: '/renewal/tokutei-ginou', icon: <WorkIcon /> },
        { text: '就労系（更新）', path: '/renewal/work-visa', icon: <EngineeringIcon /> },
        { text: '身分系（更新）', path: '/renewal/status-visa', icon: <FamilyIcon /> },
        { text: '非就労系（更新）', path: '/renewal/non-work-visa', icon: <SchoolIcon /> },
      ]
    },
    {
      id: 'acquisition-application',
      text: '在留資格取得許可申請',
      icon: <DescriptionIcon />,
      type: 'group',
      children: [
        { text: '身分系（取得）', path: '/acquisition/status-visa', icon: <FamilyIcon /> },
        { text: 'その他（取得）', path: '/acquisition/others', icon: <AdminIcon /> },
      ]
    },
    {
      id: 'tokutei-ginou-management',
      text: '特定技能管理',
      icon: <BusinessIcon />,
      type: 'group',
      children: [
        { text: '特定技能ダッシュボード', path: '/tokutei-ginou', icon: <DashboardIcon /> },
        { text: '特定技能外国人管理', path: '/tokutei-ginou/workers', icon: <PeopleIcon /> },
        { text: '受入機関管理', path: '/receiving-organizations', icon: <BusinessIcon /> },
        { text: '登録支援機関管理', path: '/support-organizations', icon: <SupportIcon /> },
        { text: '支援記録管理', path: '/support-records', icon: <DescriptionIcon /> },
        { text: '技能評価管理', path: '/skill-evaluations', icon: <AssessmentIcon /> },
        { text: '報告書管理', path: '/reports', icon: <ReportIcon /> },
      ]
    },
    {
      id: 'applications',
      text: '申請書管理',
      path: '/applications',
      icon: <DescriptionIcon />,
      type: 'single'
    },
    {
      id: 'completed-forms',
      text: '入力完了済み',
      path: '/completed-forms',
      icon: <AssignmentIcon />,
      type: 'single',
      badge: completedFormsCount > 0 ? completedFormsCount : undefined
    },
  ]

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const handleGroupToggle = (groupId: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  const renderMenuItem = (item: any) => {
    if (item.type === 'single') {
      return (
        <ListItem key={item.id} disablePadding>
          <ListItemButton component={Link} to={item.path}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
            {item.badge && item.badge > 0 && (
              <Badge 
                badgeContent={item.badge} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.75rem',
                    minWidth: '20px',
                    height: '20px',
                  }
                }}
              />
            )}
          </ListItemButton>
        </ListItem>
      )
    } else if (item.type === 'group') {
      return (
        <Box key={item.id}>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleGroupToggle(item.id)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
              {openGroups[item.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          <Collapse in={openGroups[item.id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child: any, index: number) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton 
                    sx={{ pl: 4 }} 
                    component={Link} 
                    to={child.path}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {child.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={child.text} 
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      )
    }
    return null
  }

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          在留資格管理
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuStructure.map((item) => renderMenuItem(item))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/inquiry" target="_blank">
            <ListItemIcon><ContactMailIcon /></ListItemIcon>
            <ListItemText primary="お問合せフォーム" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            在留資格管理システム
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            ログアウト
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}