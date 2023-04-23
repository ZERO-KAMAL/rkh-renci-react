import { FC } from 'react'

interface IValue {
  fieldName: string
  name: string
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

const PublicInputFullName: FC<Props> = ({ data, onChange, onBlur, name, value, isError}) => {
  return (
    <div className='w-full mb-5' id={name}>
      <p className='text-[14px] font-medium mb-3'>
        Full Name
        {data.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <input
        className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 px-4 w-full'
        type='text'
        style={{border: isError ? "1px solid" : "", boxShadow: isError ? "2px 2px 10px #ff2d55" : ""}}
        name={name}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
        placeholder={data.name !== '' ? data.name : 'Full Name'}
      />
      
    </div>
  )
}

export default PublicInputFullName
