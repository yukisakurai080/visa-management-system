import React, { useState, useRef, useEffect } from 'react'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
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
  const [useReactPdf, setUseReactPdf] = useState(true)
  const [numPages, setNumPages] = useState<number>(0)

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
    // React-PDFのWorker設定
    const setupReactPdfWorker = async () => {
      try {
        const { pdfjs } = await import('react-pdf')
        
        // 複数のWorker URLを試行
        const workerUrls = [
          `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
          `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`
        ]
        
        pdfjs.GlobalWorkerOptions.workerSrc = workerUrls[0]
        console.log('React-PDF Worker configured:', pdfjs.GlobalWorkerOptions.workerSrc)
        console.log('PDF.js version:', pdfjs.version)
      } catch (error) {
        console.error('React-PDF Worker setup failed:', error)
      }
    }
    
    if (open && pdfUrl) {
      setupReactPdfWorker()
      
      if (!useReactPdf) {
        loadPDF()
      } else {
        setIsLoading(true)
        console.log('Using React-PDF for rendering')
        console.log('PDF URL:', pdfUrl)
        
        // タイムアウト処理（30秒後にエラー表示）
        setTimeout(() => {
          if (isLoading) {
            console.warn('PDF loading timeout after 30 seconds')
            setLoadError('PDF読み込みがタイムアウトしました（30秒）')
            setIsLoading(false)
          }
        }, 30000)
      }
    }
  }, [open, pdfUrl, useReactPdf])

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
      
      // Worker設定をスキップして、直接React-PDFを使用
      console.log('Skipping PDF.js worker setup, using React-PDF directly')
      throw new Error('PDF.js worker issues, switching to React-PDF')
      
      console.log('Loading PDF from:', pdfUrl)
      
      // PDF読み込み設定（Workerエラー回避）
      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        // Workerが使用できない場合の設定
        disableWorker: false,
        verbosity: 0, // ログレベルを下げる
      })
      
      const pdf = await loadingTask.promise
      console.log('PDF loaded successfully, pages:', pdf.numPages)
      
      setPdfDoc(pdf)
      await renderPage(pdf, currentPage)
      setIsLoading(false)
    } catch (error) {
      console.error('PDF loading failed:', error)
      setLoadError(`PDF読み込みエラー: ${error.message}`)
      setIsLoading(false)
      
      // フォールバック: React-PDFを使用
      console.log('Falling back to React-PDF...')
      setUseReactPdf(true)
    }
  }

  // React-PDF用のハンドラー
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
    setLoadError('')
    console.log('React-PDF loaded successfully, pages:', numPages)
  }

  const onDocumentLoadError = (error: any) => {
    console.error('React-PDF loading failed:', error)
    setLoadError(`React-PDF読み込みエラー: ${error?.message || 'Unknown error'}`)
    setIsLoading(false)
  }

  // ページ読み込み成功
  const onPageLoadSuccess = () => {
    console.log('Page loaded successfully')
  }

  // ページ読み込みエラー
  const onPageLoadError = (error: any) => {
    console.error('Page loading failed:', error)
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

  // React-PDF用のクリックハンドラー
  const handleReactPdfClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!currentField || !currentDataField) {
      alert('フィールド名とデータフィールドを選択してください')
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left)
    const y = (event.clientY - rect.top)

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
                    disabled={(!pdfDoc || currentPage >= pdfDoc.numPages) && (!useReactPdf || currentPage >= numPages)}
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
              
              {!isLoading && !loadError && !useReactPdf && (
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

              {!isLoading && !loadError && useReactPdf && (
                <div
                  onClick={handleReactPdfClick}
                  style={{
                    border: '1px solid #ddd',
                    cursor: 'crosshair',
                    maxWidth: '100%'
                  }}
                >
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={<div style={{ padding: '20px', textAlign: 'center' }}>React-PDF読み込み中...</div>}
                    error={<div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>PDF読み込みに失敗しました</div>}
                    noData={<div style={{ padding: '20px', textAlign: 'center' }}>PDFデータがありません</div>}
                    options={{
                      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
                      cMapPacked: true,
                      standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/',
                    }}
                  >
                    <Page 
                      pageNumber={currentPage}
                      scale={scale}
                      onLoadSuccess={onPageLoadSuccess}
                      onLoadError={onPageLoadError}
                      loading={<div style={{ padding: '20px', textAlign: 'center' }}>ページ読み込み中...</div>}
                      error={<div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>ページ読み込み失敗</div>}
                      noData={<div style={{ padding: '20px', textAlign: 'center' }}>ページデータがありません</div>}
                    />
                  </Document>
                </div>
              )}
              
              {!isLoading && !loadError && !pdfDoc && !useReactPdf && (
                <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                  <Typography>PDFが読み込まれていません</Typography>
                </Box>
              )}

              {/* iframe fallback */}
              {loadError && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    iframe表示（フォールバック）:
                  </Typography>
                  <iframe
                    src={pdfUrl}
                    width="100%"
                    height="500px"
                    style={{ border: '1px solid #ddd' }}
                    title="PDF Fallback"
                  />
                  <Typography variant="caption" color="text.secondary">
                    ※ iframe表示では座標取得機能は使用できません
                  </Typography>
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