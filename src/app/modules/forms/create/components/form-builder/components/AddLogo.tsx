import { setLogo } from 'app/http/feedback-form/feedBackFormCreationSlice'
import { useAppSelector } from 'app/redux/store'
import { FC, useState } from 'react'
import { useDispatch } from 'react-redux'

const AddLogo: FC = () => {
  const { logo } = useAppSelector((state) => state.feedbackFormCreation)
  const dispatch = useDispatch()

  const fileChangedHandler = (event: any) => {
    dispatch(setLogo(event.target.files[0]))
  }

  return (
    <div className='flex justify-center items-center'>
      <input
        className='hidden'
        type='file'
        accept='image/*'
        name='image'
        id='upload_logo'
        onChange={fileChangedHandler}
      />
      {(!logo || typeof logo === 'string') && (
        <div className='relative flex w-full justify-center items-center border-t-2 border-dashed'>
          <label
            className='text-base text-[#7E8299] mt-[-13px] bg-[#F3F6F9] px-[15px] cursor-pointer'
            htmlFor={'upload_logo'}
          >
            + Add Your Logo
          </label>
        </div>
      )}
      {logo && typeof logo !== 'string' && (
        <figure className='max-w-[300px]'>
          <img src={URL.createObjectURL(logo)} alt='Img' />
        </figure>
      )}
    </div>
  )
}

export default AddLogo
