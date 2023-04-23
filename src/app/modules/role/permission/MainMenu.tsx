import { Switch } from '@mui/material'
import { FC, ReactNode, memo } from 'react'

interface Props {
  title: string
  imgSrc: string
  children?: ReactNode
  checked: boolean
  disabled?: boolean
  onChecked: (e: any) => void
}

const MainMenu: FC<Props> = (props: Props) => {
  return (
    <div className='w-full py-4 px-8 bg-white rounded-lg my-8'>
      <div className='flex justify-between'>
        <h2 className='text-gray-800 text-lg font-semibold mb-5'>{props.title}</h2>
        <Switch
          disabled={props.disabled}
          checked={props.checked}
          onChange={(e) => props.onChecked(props.checked)}
          inputProps={{ 'aria-label': 'controlled' }}
          size='medium'
          className='mr-3'
        />
      </div>
      <div className='border-b bg-gray-200 mb-4'></div>
      {/* main content */}
      {props.children}
    </div>
  )
}

export default memo(MainMenu)
