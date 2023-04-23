import { FC } from 'react'

interface IValue {
  fieldName: string
  contact: string
  required: boolean
}
interface Props {
  id?: number
  type?: string
  data: IValue
  name: string
  onChange: any
  onBlur: any
  value: string
  isError: boolean
}

const PublicInputContactNumber: FC<Props> = ({ data, name, onChange, onBlur, value, isError }) => {
  return (
    <div className='w-full mb-5' id={name}>
      <p className='text-[14px] font-medium mb-3'>
        Contact Number
        {data.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <input
        className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 px-4 w-full'
        style={{border: isError ? "1px solid" : "", boxShadow: isError ? "2px 2px 10px #ff2d55" : ""}}
        type='text'
        placeholder={data.contact !== '' ? data.contact : 'Enter Contact Number'}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
    </div>
  )
}

export default PublicInputContactNumber
