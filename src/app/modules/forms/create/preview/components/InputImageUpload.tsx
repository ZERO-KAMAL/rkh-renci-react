import { FC, useState } from 'react'
import { BsCardImage } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'

interface Props {
  id?: number
  type?: string
  name?: string
  value: any
}

const InputImageUpload: FC<Props> = ({ value, name }) => {
  const [image, setImage] = useState<any>(undefined)

  const fileChangedHandler = (event: any) => {
    setImage(event.target.files[0])
  }

  const removeImage = () => {
    setImage(undefined)
    const el:any = document.getElementById(name as string)
    el.value = ""
  }

  return (
    <div className='w-full mb-5'>
      <p className='text-[14px] font-medium mb-3'>
        {value.fieldName}
        {value.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <input
        className='hidden'
        type='file'
        accept='image/*'
        name='image'
        id={name}
        onChange={fileChangedHandler}
      />
      {!image && (
        <label htmlFor={name}>
          <div className='w-[184px] h-[113px] bg-[#ECF0F3] flex flex-col justify-center items-center cursor-pointer'>
            <BsCardImage size={'30px'} className='text-skin-primary' />
            <span className='text-base font-medium text-[#A1A5B7] mt-2'>Take Photo</span>
          </div>
        </label>
      )}
      {image && (
        <figure className='w-[210px] h-[113px] relative'>
          <IoClose size={'25px'} color={'rgba(0, 0, 0, 0.54)'} className="absolute right-0 top-0 cursor-pointer" onClick={removeImage} />
          <img className='w-[184px] h-[113px] object-cover' src={URL.createObjectURL(image)} alt='Img' />
        </figure>
      )}
    </div>
  )
}

export default InputImageUpload
