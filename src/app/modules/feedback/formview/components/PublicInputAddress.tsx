import { RestoreFocus } from '@dnd-kit/core/dist/components/Accessibility'
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
  data: IValue
  name?: string
  formik?: any
}

const PublicInputAddress: FC<Props> = ({ data, name, formik }) => {
  const {onChange, onBlur, value} = formik.getFieldProps(name)
  return (
    <div className='w-full mb-5' id={name}>
      <p className='text-[14px] font-medium mb-3'>
        Address
        {data.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <div style={{border: (formik.errors[name as string] && formik.touched[name as string]) ? "1px solid" : "", boxShadow: (formik.errors[name as string] && formik.touched[name as string]) ? "2px 2px 10px #ff2d55" : ""}}>
        <input
          className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm px-4 w-full'
          type='text'
          name={`${name}.street`}
          onChange={onChange}
          value={value?.street || ""}
          onBlur={onBlur}
          placeholder={data.street !== '' ? data.street : 'Street Address'}
        />
        <div className='flex gap-4 mt-4 max-md:flex-col'>
          <input
            className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 max-md:flex-none px-4'
            type='text'
            placeholder={data.unitNumber !== '' ? data.unitNumber : 'Unit/Apt Number'}
            name={`${name}.unit`}
            onChange={onChange}
            value={value?.unit || ""}
            onBlur={onBlur}
          />
          <input
            className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 max-md:flex-none px-4'
            type='text'
            placeholder={data.postalCode !== '' ? data.postalCode : 'Postal code'}
            name={`${name}.code`}
            onChange={onChange}
            value={value?.code || ""}
            onBlur={onBlur}
          />
        </div>
      </div>
      {(formik.errors[name as string] && formik.touched[name as string]) && (
        <div className='text-red-600 text-[12px] px-4 '>
          <span role='alert'>{formik.errors[name as string]?.street || formik.errors[name as string]?.code || formik.errors[name as string]?.unit}</span>
        </div>
      )}
    </div>
  )
}

export default PublicInputAddress
