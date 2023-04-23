import { Checkbox } from '@mui/material'
import { FC, memo, useRef } from 'react'
import { RiFilePaper2Line } from 'react-icons/ri'

interface Props {
  title: string
  checked: boolean
  disabled?: boolean
  onChecked: (e: any) => void
}

const PermissionCard: FC<Props> = (props: Props) => {
  const checkboxRef = useRef<HTMLInputElement>(null)
  return (
    <div
      className='bg-white rounded-md  
        cursor-pointer h-full flex justify-left align-middle my-3 md:my-0'
      onClick={() => checkboxRef?.current?.click()}
    >
      <Checkbox
        disabled={props.disabled}
        disableRipple
        inputRef={checkboxRef}
        icon={<div className='w-5 h-5 ml-0.5 mt-1 mr-0.5 bg-[#ECF0F3] rounded'></div>}
        // icon={<RadioButtonUncheckedIcon />}
        // checkedIcon={<CheckCircleIcon />}
        checked={props.checked}
        onChange={(e) => props.onChecked(props.checked)}
      />
      <p className={`text-left my-auto font-medium ${!props.checked ? 'text-[#7E8299]' : ''}`}>
        {props.title}
      </p>
      {props.title.toLowerCase().includes('page') && (
        <span
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'start' }}
          className='mx-3'
        >
          <RiFilePaper2Line />
        </span>
      )}
    </div>
  )
}

export default memo(PermissionCard)
