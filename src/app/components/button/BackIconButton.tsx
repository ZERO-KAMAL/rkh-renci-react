import React from 'react'
import { FaArrowLeft } from 'react-icons/fa'

interface IProps {
  onClick: () => void
  iconSize?: string
  iconColor?: string
  textSize?: string
  textColor?: string
}

const BackIconButton: React.FC<IProps> = ({
  onClick,
  iconSize,
  iconColor,
  textSize,
  textColor,
}) => {
  return (
    <div className='inline-flex items-center cursor-pointer' onClick={onClick}>
      <FaArrowLeft size={iconSize} color={iconColor} />
      <span
        style={{ fontSize: textSize, color: textColor }}
        className='ml-[25px] max-md:ml-2 font-semibold'
      >
        Back
      </span>
    </div>
  )
}

export default BackIconButton
