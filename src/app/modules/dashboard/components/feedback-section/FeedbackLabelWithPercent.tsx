import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { memo } from 'react'
import { AiFillMail } from 'react-icons/ai'

interface IProps {
  color: string
  label: string
  numbers: [number, number]
}

const FeedbackLabelWithPercent: React.FC<IProps> = ({ color, label, numbers }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '5px',
      }}
    >
      <AiFillMail fontSize='35px' color={color} size={30} />
      &nbsp;
      <Box sx={{ marginLeft: '5%' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>{numbers[0]}%</Typography>&nbsp;
          <Typography sx={{ fontSize: '18px' }}>({numbers[1]})</Typography>
        </Box>
        <Typography sx={{ color: '#B5B5C3', fontSize: '15px' }}>{label}</Typography>
      </Box>
    </Box>
  )
}

export default memo(FeedbackLabelWithPercent)
