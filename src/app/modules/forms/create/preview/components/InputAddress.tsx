import { FC } from 'react'

interface IValue {
  fieldName?: string
  street: string
  unitNumber: string
  postalCode: string
  required: boolean
}
interface Props {
  id?: number
  type?: string
  value: IValue
}

const InputAddress: FC<Props> = ({ value }) => {
  return (
    <div className='w-full mb-5'>
      <p className='text-[14px] font-medium mb-3'>
        Address
        {value.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <input
        className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm px-4 w-full'
        type='text'
        placeholder={value.street !== '' ? value.street : 'Street Address'}
      />
      <div className='flex gap-4 mt-4 max-md:flex-col'>
        <input
          className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 max-md:flex-none px-4'
          type='text'
          placeholder={value.unitNumber !== '' ? value.unitNumber : 'Unit/Apt Number'}
        />
        <input
          className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 max-md:flex-none px-4'
          type='text'
          placeholder={value.postalCode !== '' ? value.postalCode : 'Postal code'}
        />
      </div>
    </div>
  )
}

export default InputAddress
