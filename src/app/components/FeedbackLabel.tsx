import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { BsFillCircleFill } from 'react-icons/bs'

interface IProps {
  color: string
  label: string
  selected: boolean
  onClick?: () => void
}

const FeedbackLabel: React.FC<IProps> = ({ color, label, selected, onClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '5px',
        cursor: 'pointer',
        my: '5px',
        borderBottom: '1px solid #cecece',
        bgcolor: selected ? '#e5e7eb' : null,
      }}
      onClick={onClick}
    >
      <BsFillCircleFill color={color} />
      &nbsp;&nbsp;&nbsp;
      <Typography>{label}</Typography>
    </Box>
  )
}

export default FeedbackLabel
