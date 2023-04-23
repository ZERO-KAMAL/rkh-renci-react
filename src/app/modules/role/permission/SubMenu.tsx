import { Switch } from '@mui/material'
import { FC, ReactNode, memo } from 'react'

interface Props {
  title: string
  children?: ReactNode
  disabled?: boolean
  checked: boolean
  onChecked: (e: any) => void
}

const SubMenu: FC<Props> = (props: Props) => {
  return (
    <div className='ml-3 mt-3'>
      <div className='flex justify-between'>
        <h2 className='text-gray-800 text-md font-semibold ml-2'>{props.title}</h2>
        <Switch
          disabled={props.disabled}
          checked={props.checked}
          onChange={(e) => props.onChecked(props.checked)}
          inputProps={{ 'aria-label': 'controlled' }}
          size='medium'
          className='mr-3'
        />
      </div>
      {/* main content */}
      {props.children}
    </div>
  )
}

export default memo(SubMenu)
