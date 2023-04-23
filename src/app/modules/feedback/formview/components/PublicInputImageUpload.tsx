import { FC, useState } from 'react'
import { BsCardImage } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'

interface Props {
  id?: number
  type?: string
  data: any
  name: string
  setField: any
  value: any
  isError: boolean
}

const PublicInputImageUpload: FC<Props> = ({ data, name, setField, value, isError }) => {

  const fileChangedHandler = (event: any) => {
    setField(`${name}`, event.target.files[0])
  }
  const removeImage = () => {
    setField(`${name}`, "")
    const el:any = document.getElementById(name as string)
    el.value = ""
  }

  return (
    <div className='w-full mb-5'>
      <p className='text-[14px] font-medium mb-3'>
        {data.fieldName}
        {data.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <input
        className='hidden'
        type='file'
        accept='image/*'
        name='image'
        id={name}
        onChange={fileChangedHandler}
      />
      {!value && (
        <label htmlFor={name}>
          <div
            className='w-[184px] h-[113px] bg-[#ECF0F3] flex flex-col justify-center items-center cursor-pointer'
            style={{border: isError ? "1px solid" : "", boxShadow: isError ? "2px 2px 10px #ff2d55" : ""}}
          >
            <BsCardImage size={'30px'} className='text-skin-primary' />
            <span className='text-base font-medium text-[#A1A5B7] mt-2'>Take Photo</span>
          </div>
        </label>
      )}
      {value && (
        <figure className='w-[210px] h-[113px] relative'>
          <IoClose size={'25px'} color={'rgba(0, 0, 0, 0.54)'} className="absolute right-0 top-0 cursor-pointer" onClick={removeImage} />
          <img className='w-[184px] h-[113px] object-cover' src={URL.createObjectURL(value)} alt='Img' />
        </figure>
      )}
    </div>
  )
}

export default PublicInputImageUpload
