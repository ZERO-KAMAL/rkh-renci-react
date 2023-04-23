import LoadingButton from 'app/components/button/LoadingButton'
import { ColorsEnum } from 'app/components/button/ReactIconBtn'
import { FC, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

interface Props {
  formik: any
}

const ResetForm: FC<Props> = (props: Props) => {
  // Show or hide password
  const [passwordType, setPasswordType] = useState('password')
  const togglePassword = (event: any) => {
    event.preventDefault()
    passwordType === 'password' ? setPasswordType('text') : setPasswordType('password')
  }
  // Show or hide re-enter password
  const [passwordType2, setPasswordType2] = useState('password')
  const togglePassword2 = (event: any) => {
    event.preventDefault()
    passwordType2 === 'password' ? setPasswordType2('text') : setPasswordType2('password')
  }

  return (
    <div className='h-full mt-5'>
      <section className='flex flex-col'>
        <div className='my-2 font-semibold text-sm flex justify-between flex-wrap'>
          <label className='text-skin-base'>New Password</label>
        </div>
        <div
          className='h-12 relative flex align-middle
           bg-anti-flash-white rounded-lg text-skin-base text-opacity-75'
        >
          <input
            className='h-12 focus:outline-skin-primary pl-3 rounded-lg
           bg-anti-flash-white text-sm text-skin-base text-opacity-75 w-full'
            type={passwordType}
            autoComplete='on'
            {...props.formik.getFieldProps('password')}
          />
          <a href='#' onClick={togglePassword} className='absolute h-12 right-0 p-3'>
            {passwordType === 'password' ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </a>
        </div>
        {props.formik.touched.password && props.formik.errors.password && (
          <div className='text-red-600 text-sm'>
            <span role='alert'>{props.formik.errors.password}</span>
          </div>
        )}
      </section>
      <section className='flex flex-col my-4'>
        <div className='my-2 font-semibold text-sm flex justify-between flex-wrap'>
          <label className='text-skin-base'>Re-enter new Password</label>
        </div>
        <div
          className='h-12 relative flex align-middle
           bg-anti-flash-white rounded-lg text-skin-base text-opacity-75'
        >
          <input
            className='h-12 focus:outline-skin-primary pl-3 rounded-lg
           bg-anti-flash-white text-sm text-skin-base text-opacity-75 w-full'
            type={passwordType2}
            id='password'
            autoComplete='new-password'
            {...props.formik.getFieldProps('newPassword')}
          />
          <a href='#' onClick={togglePassword2} className='absolute h-12 right-0 p-3'>
            {passwordType2 === 'password' ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </a>
        </div>
        {props.formik.touched.newPassword && props.formik.errors.newPassword && (
          <div className='text-red-600 text-sm'>
            <span role='alert'>{props.formik.errors.newPassword}</span>
          </div>
        )}
      </section>
      <section className='flex justify-center align-middle w-full pt-4'>
        <LoadingButton
          name={'Submit'}
          loadingName={'Submitting'}
          isLoading={props.formik.isSubmitting}
          onClick={props.formik.handleSubmit}
          className={ColorsEnum.green}
        />
      </section>
    </div>
  )
}

export default ResetForm
