import { Switch } from '@mui/material'
import { FC, memo, ReactNode } from 'react'

interface Props {
  title: string
  imgSrc: string
  children?: ReactNode
  checked: boolean
  onChecked: (e: any) => void
}

const MainMenu: FC<Props> = (props: Props) => {
  return (
    <div className='w-full py-4 px-8 bg-white border-2 border-green-800 rounded-lg my-20'>
      <div className='flex justify-center md:justify-end -mt-16'>
        <img
          className='w-20 h-20 object-contain rounded-full border-2 border-green-800 p-1'
          src={props.imgSrc}
          alt='dashboard'
        />
      </div>
      <div>
        <div className='flex justify-between'>
          <h2 className='text-gray-800 text-xl font-semibold mb-5'>{props.title}</h2>
          <Switch
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
    </div>
  )
}

export default memo(MainMenu)
