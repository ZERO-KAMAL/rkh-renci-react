import { FC } from 'react'

interface IValue {
  fieldName: string
  email: string
  required: boolean
}
interface Props {
  id?: number
  type?: string
  value: IValue
}

const InputEmail: FC<Props> = ({ value }) => {
  return (
    <div className='w-full mb-5'>
      <p className='text-[14px] font-medium mb-3'>
        Email
        {value.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <input
        className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 px-4 w-full'
        type='email'
        placeholder={value.email !== '' ? value.email : 'Email'}
      />
    </div>
  )
}

export default InputEmail
