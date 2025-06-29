import React, { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Paper,
  Grid,
  Chip,
  Alert
} from '@mui/material'

interface Coordinate {
  id: string
  fieldName: string
  x: number
  y: number
  page: number
  dataField: string
}

interface PDFCoordinatePickerProps {
  open: boolean
  onClose: () => void
  pdfUrl: string
  onSaveCoordinates: (coordinates: Coordinate[]) => void
}

const PDFCoordinatePicker: React.FC<PDFCoordinatePickerProps> = ({
  open,
  onClose,
  pdfUrl,
  onSaveCoordinates
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [coordinates, setCoordinates] = useState<Coordinate[]>([])
  const [currentField, setCurrentField] = useState('')
  const [currentDataField, setCurrentDataField] = useState('')
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.5)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string>('')

  const dataFields = [
    { key: 'family_name', label: '姓（英字）' },
    { key: 'given_name', label: '名（英字）' },
    { key: 'family_name_kana', label: '姓（カタカナ）' },
    { key: 'given_name_kana', label: '名（カタカナ）' },
    { key: 'gender', label: '性別' },
    { key: 'date_of_birth', label: '生年月日' },
    { key: 'nationality', label: '国籍' },
    { key: 'passport_number', label: 'パスポート番号' },
    { key: 'email', label: 'メールアドレス' },
    { key: 'phone_number', label: '電話番号' },
    { key: 'purpose_of_visit', label: '訪問目的' },
    { key: 'intended_arrival_date', label: '入国予定日' },
    { key: 'intended_departure_date', label: '出国予定日' }
  ]

  useEffect(() => {
    if (open && pdfUrl) {
      loadPDF()
    }
  }, [open, pdfUrl])

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(pdfDoc, currentPage)
    }
  }, [currentPage, pdfDoc, scale])

  const loadPDF = async () => {
    setIsLoading(true)
    setLoadError('')
    
    try {
      // PDF.jsを動的インポート
      const pdfjsLib = await import('pdfjs-dist')
      
      // Worker設定（バージョン5.3.31に合わせる）
      if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
        // 最新バージョンのWorkerを使用
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.3.31/build/pdf.worker.min.js`
        console.log('PDF.js version:', pdfjsLib.version || '5.3.31')
        console.log('Worker source:', pdfjsLib.GlobalWorkerOptions.workerSrc)
      }
      
      console.log('Loading PDF from:', pdfUrl)
      const loadingTask = pdfjsLib.getDocument(pdfUrl)
      const pdf = await loadingTask.promise
      console.log('PDF loaded successfully, pages:', pdf.numPages)
      
      setPdfDoc(pdf)
      await renderPage(pdf, currentPage)
      setIsLoading(false)
    } catch (error) {
      console.error('PDF loading failed:', error)
      setLoadError(`PDF読み込みエラー: ${error.message}`)
      setIsLoading(false)
    }
  }

  const renderPage = async (pdf: any, pageNum: number) => {
    try {
      console.log(`Rendering page ${pageNum}...`)
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale })
      
      const canvas = canvasRef.current
      if (!canvas) {
        console.error('Canvas ref not found')
        return
      }
      
      const context = canvas.getContext('2d')
      if (!context) {
        console.error('Canvas context not found')
        return
      }
      
      // キャンバスサイズを設定
      canvas.height = viewport.height
      canvas.width = viewport.width
      canvas.style.width = `${viewport.width}px`
      canvas.style.height = `${viewport.height}px`
      
      // 既存の描画をクリア
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      
      console.log('Starting page render...')
      await page.render(renderContext).promise
      console.log('Page rendered successfully')
    } catch (error) {
      console.error('Page rendering failed:', error)
      alert(`ページ描画エラー: ${error.message}`)
    }
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentField || !currentDataField) {
      alert('フィールド名とデータフィールドを選択してください')
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (event.clientX - rect.left) / scale
    const y = (event.clientY - rect.top) / scale

    const newCoordinate: Coordinate = {
      id: `${currentDataField}_${Date.now()}`,
      fieldName: currentField,
      x: Math.round(x),
      y: Math.round(y),
      page: currentPage,
      dataField: currentDataField
    }

    setCoordinates(prev => [...prev, newCoordinate])
    setCurrentField('')
  }

  const removeCoordinate = (id: string) => {
    setCoordinates(prev => prev.filter(coord => coord.id !== id))
  }

  const generateCode = () => {
    const codeString = `
// 自動生成されたPDF座標マッピング
const fillPdfWithCoordinates = async (data, pdfBytes) => {
  const { PDFDocument, rgb } = await import('pdf-lib')
  const pdfDoc = await PDFDocument.load(pdfBytes)
  
  ${coordinates.map(coord => `
  // ${coord.fieldName} (${dataFields.find(f => f.key === coord.dataField)?.label})
  if (data.${coord.dataField}) {
    const page${coord.page} = pdfDoc.getPage(${coord.page - 1})
    page${coord.page}.drawText(String(data.${coord.dataField}), {
      x: ${coord.x},
      y: ${coord.y},
      size: 10,
      color: rgb(0, 0, 0),
    })
  }`).join('')}
  
  return await pdfDoc.save()
}`

    return codeString
  }

  const handleSave = () => {
    onSaveCoordinates(coordinates)
    
    // 生成されたコードをコンソールに出力
    console.log('=== Generated PDF Coordinate Code ===')
    console.log(generateCode())
    
    alert(`${coordinates.length}個の座標を保存しました！\n生成されたコードはコンソールを確認してください。`)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>PDF座標ピッカー</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>使い方：</strong><br />
          1. 右側でフィールド名とデータ項目を選択<br />
          2. 左側のPDFの該当位置をクリック<br />
          3. 座標が自動登録されます<br />
          4. 全項目を設定したら「保存」ボタンを押してください
        </Alert>
        
        <Grid container spacing={2}>
          {/* PDF表示エリア */}
          <Grid item xs={8}>
            <Paper sx={{ p: 2, height: '600px', overflow: 'auto' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">PDF座標設定</Typography>
                <Box>
                  <Button 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                  >
                    前ページ
                  </Button>
                  <Chip label={`${currentPage}ページ`} sx={{ mx: 1 }} />
                  <Button 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pdfDoc || currentPage >= pdfDoc.numPages}
                  >
                    次ページ
                  </Button>
                </Box>
              </Box>
              {isLoading && (
                <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                  <Typography>PDF読み込み中...</Typography>
                </Box>
              )}
              
              {loadError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {loadError}
                </Alert>
              )}
              
              {!isLoading && !loadError && (
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  style={{ 
                    border: '1px solid #ddd', 
                    cursor: 'crosshair',
                    maxWidth: '100%',
                    display: pdfDoc ? 'block' : 'none'
                  }}
                />
              )}
              
              {!isLoading && !loadError && !pdfDoc && (
                <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                  <Typography>PDFが読み込まれていません</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* 設定エリア */}
          <Grid item xs={4}>
            <Paper sx={{ p: 2, height: '600px', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>座標設定</Typography>
              
              <TextField
                fullWidth
                label="フィールド名"
                value={currentField}
                onChange={(e) => setCurrentField(e.target.value)}
                sx={{ mb: 2 }}
                placeholder="例: 姓名欄、パスポート番号欄"
              />
              
              <Typography variant="subtitle2" gutterBottom>データ項目を選択:</Typography>
              <Box sx={{ mb: 2, maxHeight: 200, overflow: 'auto' }}>
                {dataFields.map(field => (
                  <Chip
                    key={field.key}
                    label={field.label}
                    onClick={() => setCurrentDataField(field.key)}
                    color={currentDataField === field.key ? 'primary' : 'default'}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>
                設定済み座標 ({coordinates.length}個):
              </Typography>
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {coordinates.map(coord => (
                  <ListItem key={coord.id} dense>
                    <ListItemText
                      primary={`${coord.fieldName}`}
                      secondary={`${dataFields.find(f => f.key === coord.dataField)?.label} - (${coord.x}, ${coord.y}) P${coord.page}`}
                    />
                    <Button 
                      size="small" 
                      onClick={() => removeCoordinate(coord.id)}
                      color="error"
                    >
                      削除
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>キャンセル</Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          disabled={coordinates.length === 0}
        >
          保存 ({coordinates.length}個の座標)
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default PDFCoordinatePicker