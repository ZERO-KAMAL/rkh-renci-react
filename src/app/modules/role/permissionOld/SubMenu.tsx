import { Switch } from '@mui/material'
import { FC, memo, ReactNode } from 'react'

interface Props {
  title: string
  children?: ReactNode
  checked: boolean
  onChecked: (e: any) => void
}

const SubMenu: FC<Props> = (props: Props) => {
  return (
    <div>
      <div className='w-full py-4 px-8 bg-white border-2 rounded-lg my-4'>
        <div>
          <div className='flex justify-between'>
            <h2 className='text-gray-500 text-md font-semibold mb-5'>{props.title}</h2>
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
    </div>
  )
}

export default memo(SubMenu)
