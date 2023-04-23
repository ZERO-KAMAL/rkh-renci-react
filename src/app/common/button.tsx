// MUI
import { Button } from '@mui/material'

const CustomButton = ({
  text,
  bgColor,
  textColor,
  styles,
  hover,
  type = 'button',
  onClick,
}: any) => {
  return (
    <Button
      className={`${bgColor ? bgColor : 'bg-[#2BA579]'} ${
        textColor ? textColor : 'text-white'
      } py-3 px-5 rounded-md text-sm font-semibold shadow-md ${
        hover ? hover : 'hover:bg-[#2BA579] hover:text-white hover:shadow-md'
      } ${styles}`}
      type={type}
      onClick={onClick}
    >
      {text}
    </Button>
  )
}

export default CustomButton
