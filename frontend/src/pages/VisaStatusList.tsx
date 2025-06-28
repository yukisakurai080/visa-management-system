import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material'

const VisaStatusList = () => {
  const visaStatuses = [
    {
      id: 1,
      code: 'engineer',
      name: '技術・人文知識・国際業務',
      nameEn: 'Engineer/Specialist in Humanities/International Services',
      category: '就労資格',
      maxPeriod: '5年、3年、1年又は3月',
      workPermitted: true,
    },
    {
      id: 2,
      code: 'student',
      name: '留学',
      nameEn: 'Student',
      category: '非就労資格',
      maxPeriod: '4年3月、4年、3年3月等',
      workPermitted: false,
    },
    {
      id: 3,
      code: 'spouse_japanese',
      name: '日本人の配偶者等',
      nameEn: 'Spouse or Child of Japanese National',
      category: '居住資格',
      maxPeriod: '5年、3年、1年又は6月',
      workPermitted: true,
    },
    {
      id: 4,
      code: 'permanent_resident',
      name: '永住者',
      nameEn: 'Permanent Resident',
      category: '居住資格',
      maxPeriod: '無期限',
      workPermitted: true,
    },
    {
      id: 5,
      code: 'temporary_visitor',
      name: '短期滞在',
      nameEn: 'Temporary Visitor',
      category: '非就労資格',
      maxPeriod: '90日、30日又は15日',
      workPermitted: false,
    },
  ]

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '就労資格':
        return 'primary'
      case '非就労資格':
        return 'secondary'
      case '居住資格':
        return 'success'
      default:
        return 'default'
    }
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        在留資格一覧
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>コード</TableCell>
              <TableCell>名称（日本語）</TableCell>
              <TableCell>名称（英語）</TableCell>
              <TableCell>カテゴリ</TableCell>
              <TableCell>最大在留期間</TableCell>
              <TableCell>就労可否</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visaStatuses.map((visa) => (
              <TableRow key={visa.id} hover>
                <TableCell>{visa.code}</TableCell>
                <TableCell>{visa.name}</TableCell>
                <TableCell sx={{ fontSize: '0.85rem' }}>{visa.nameEn}</TableCell>
                <TableCell>
                  <Chip
                    label={visa.category}
                    color={getCategoryColor(visa.category) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{visa.maxPeriod}</TableCell>
                <TableCell>
                  <Chip
                    label={visa.workPermitted ? '可' : '不可'}
                    color={visa.workPermitted ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default VisaStatusList