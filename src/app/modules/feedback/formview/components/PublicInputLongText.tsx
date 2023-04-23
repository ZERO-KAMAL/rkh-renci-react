import { FC } from 'react'

interface IValue {
  fieldName: string
  text: string
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

const PublicInputLongText: FC<Props> = ({ data, name, onChange, onBlur, value, isError }) => {
  return (
    <div className='w-full mb-5' id={name}>
      <p className='text-[14px] font-medium mb-3'>
        {data.fieldName}
        {data.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <textarea
        className='bg-[#ECF0F3] focus:outline-none rounded-md text-sm flex-1 p-4 w-full'
        style={{border: isError ? "1px solid" : "", boxShadow: isError ? "2px 2px 10px #ff2d55" : ""}}
        placeholder={data.text !== '' ? data.text : 'Long Text'}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      ></textarea>
    </div>
  )
}

export default PublicInputLongText
