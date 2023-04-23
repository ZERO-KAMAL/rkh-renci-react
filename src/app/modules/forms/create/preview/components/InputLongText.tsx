import { FC } from 'react'

interface IValue {
  fieldName: string
  text: string
  required: boolean
}
interface Props {
  id?: number
  type?: string
  value: IValue
}

const InputLongText: FC<Props> = ({ value }) => {
  return (
    <div className='w-full mb-5'>
      <p className='text-[14px] font-medium mb-3'>
        {value.fieldName}
        {value.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <textarea
        className='bg-[#ECF0F3] focus:outline-none rounded-md text-sm flex-1 p-4 w-full'
        placeholder={value.text !== '' ? value.text : 'Long Text'}
      ></textarea>
    </div>
  )
}

export default InputLongText
