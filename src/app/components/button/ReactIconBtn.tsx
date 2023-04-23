import { FC } from 'react'

export enum ColorsEnum {
  green = 'bg-skin-button-primary',
  orange = 'bg-skin-button-secondary',
  red = 'bg-skin-button-danger',
}
type ValueOf<T> = T[keyof T]
type BtnColor = ValueOf<ColorsEnum>

interface Props {
  name: string
  icon?: JSX.Element
  bgColor?: BtnColor
  onClick?: () => void
}

const ReactIconBtn: FC<Props> = (props: Props) => {
  return (
    <button
      className={`focus:outline-none hover:opacity-80 font-medium 
      rounded-lg text-sm px-3 py-2.5 text-white flex items-center
      grow-0 whitespace-nowrap
      ${props.bgColor}`}
      onClick={props.onClick}
    >
      <div className='mr-1'>{props.icon}</div>
      {props.name}
    </button>
  )
}

export default ReactIconBtn
