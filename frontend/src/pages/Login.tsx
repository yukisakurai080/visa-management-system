import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { useForm } from 'react-hook-form'

interface LoginForm {
  username: string
  password: string
}

const Login = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError('')
    
    try {
      // 仮のログイン処理
      if (data.username === 'admin' && data.password === 'password') {
        localStorage.setItem('token', 'dummy_token')
        navigate('/')
      } else {
        setError('ユーザー名またはパスワードが正しくありません')
      }
    } catch (err) {
      setError('ログインに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            在留資格管理システム
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
            ログイン
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="ユーザー名"
              autoComplete="username"
              autoFocus
              {...register('username', { required: 'ユーザー名は必須です' })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="パスワード"
              type="password"
              autoComplete="current-password"
              {...register('password', { required: 'パスワードは必須です' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>
          </Box>
          
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              デモ用ログイン情報：
            </Typography>
            <Typography variant="body2">
              ユーザー名: admin
            </Typography>
            <Typography variant="body2">
              パスワード: password
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default Login