import LoadingButton from 'app/components/button/LoadingButton'
import { ColorsEnum } from 'app/components/button/ReactIconBtn'
import { FC, useState } from 'react'
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { Link } from 'react-router-dom'

import NAVIGATE_LINKS from '../../../../constants/router-links'

interface Props {
  formik: any
}

const LoginForm: FC<Props> = (props: Props) => {
  // Show or hide passwords
  const [passwordType, setPasswordType] = useState('password')
  const togglePassword = (event: any) => {
    event.preventDefault()
    passwordType === 'password' ? setPasswordType('text') : setPasswordType('password')
  }

  // on enter shortcut to submit form
  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      props.formik.handleSubmit()
    }
  }

  return (
    <form>
      <div className='h-full'>
        <section className='flex flex-col'>
          <label className='my-2 font-semibold text-sm text-skin-base'>Email</label>
          <input
            id='email'
            className='focus:outline-skin-primary h-12 px-3 bg-anti-flash-white rounded-lg text-sm text-skin-base text-opacity-75'
            {...props.formik.getFieldProps('email')}
          />
          {props.formik.touched.email && props.formik.errors.email && (
            <div className='text-red-600 text-sm'>
              <span role='alert'>{props.formik.errors.email}</span>
            </div>
          )}
        </section>
        <section className='flex flex-col my-4'>
          <div className='my-2 font-semibold text-sm flex justify-between flex-wrap'>
            <label className='text-skin-base'>Password</label>
            <Link
              tabIndex={-1}
              className='mr-1 text-skin-primary hover:text-opacity-90'
              to={NAVIGATE_LINKS.AUTH.FORGET_PASSWORD}
              style={{}}
            >
              Forgot Password ?
            </Link>
          </div>
          <div
            className='h-12 relative flex align-middle
           bg-anti-flash-white rounded-lg text-skin-base text-opacity-75'
          >
            <input
              id='password'
              className='h-12 focus:outline-skin-primary pl-3 rounded-lg
           bg-anti-flash-white text-sm text-skin-base text-opacity-75 w-full'
              type={passwordType}
              autoComplete={'on'}
              onKeyUp={onKeyUp}
              {...props.formik.getFieldProps('password')}
            />
            <a href='#' onClick={togglePassword} className='absolute h-12 right-0 p-3' tabIndex={-1}>
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
        <section className='flex justify-center align-middle w-full pt-4'>
          <LoadingButton
            name={'Log in'}
            loadingName={'Logging in ...'}
            isLoading={props.formik.isSubmitting}
            onClick={props.formik.handleSubmit}
            className={ColorsEnum.green}
          />
        </section>
      </div>
    </form>
  )
}

export default LoginForm
