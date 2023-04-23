import { FC } from 'react'

interface IValue {
  fieldName: string
  email: string
  required: boolean
}
interface Props {
  id?: number
  type?: string
  data: IValue
  onChange: any
  onBlur: any
  name: string
  value: string
  isError: boolean
}

const PublicInputEmail: FC<Props> = ({ data, onChange, onBlur, name, value, isError }) => {
  return (
    <div className='w-full mb-5' id={name}>
      <p className='text-[14px] font-medium mb-3'>
        Email
        {data.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <input
        className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 px-4 w-full'
        type='email'
        style={{border: isError ? "1px solid" : "", boxShadow: isError ? "2px 2px 10px #ff2d55" : ""}}
        placeholder={data.email !== '' ? data.email : 'Email'}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
    </div>
  )
}

export default PublicInputEmail
