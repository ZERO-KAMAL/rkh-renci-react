import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import { Checkbox } from '@mui/material'
import { FC, memo, useRef } from 'react'

interface Props {
  title: string
  checked: boolean
  onChecked: (e: any) => void
}

const PermissionCard: FC<Props> = (props: Props) => {
  const checkboxRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className='bg-white rounded-md shadow-md border-l-4 border-green-600
        cursor-pointer p-3 h-full flex justify-center align-middle'
      onClick={() => checkboxRef?.current?.click()}
    >
      <p className='text-center my-auto'>{props.title}</p>
      <div>
        <Checkbox
          disableRipple
          inputRef={checkboxRef}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon />}
          checked={props.checked}
          onChange={(e) => props.onChecked(props.checked)}
        />
      </div>
    </div>
  )
}

export default memo(PermissionCard)
