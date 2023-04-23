import { Button } from '@mui/material'
import { FC, useEffect, useState } from 'react'

interface Props {
  value: any
  onChange: (v: any) => void
}

const ButtonField: FC<Props> = ({ value: prevValue, onChange }) => {
  const [value, setValue] = useState('Submit')

  const onChangeValue = (e: any) => {
    setValue(e.target.value)
    onChange({ value: e.target.value })
  }

  useEffect(() => {
    if (prevValue) setValue(prevValue)
    else onChange(value)
  }, [])

  return (
    <div className='w-full p-4'>
      <Button
        variant='contained'
        disableRipple
        disableElevation
        disableFocusRipple
        disableTouchRipple
        className='bg-skin-navbar hover:bg-skin-navbar focus:bg-skin-navbar min-w-[130px]'
      >
        <input
          type='text'
          className='text-[14px] text-white font-medium bg-transparent border-none outline-none w-full text-center'
          value={value}
          onChange={onChangeValue}
        />
      </Button>
    </div>
  )
}

export default ButtonField
