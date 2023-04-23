import { Button } from '@mui/material'
import { FC } from 'react'

interface Props {
  id?: number
  type?: string
  value: any
}

const InputButton: FC<Props> = ({ value }) => {
  return (
    <div className='w-full mb-5'>
      <Button
        variant='contained'
        className='bg-skin-navbar hover:bg-skin-navbar focus:bg-skin-navbar min-w-[130px]'
      >
        {value.length !== 0 ? value : 'Submit'}
      </Button>
    </div>
  )
}

export default InputButton
