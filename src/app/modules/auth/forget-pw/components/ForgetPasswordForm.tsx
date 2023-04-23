import BackIconButton from 'app/components/button/BackIconButton'
import LoadingButton from 'app/components/button/LoadingButton'
import { ColorsEnum } from 'app/components/button/ReactIconBtn'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { useHistory } from 'app/routing/AppRoutes'
import React, { FC } from 'react'

interface Props {
  formik: any
}

const ForgetPasswordForm: FC<Props> = (props: Props) => {

  return (
    <div className='h-full'>
      <section className='flex flex-col'>
        <label className='my-2 font-semibold text-sm text-skin-base'>Email</label>
        <input
          className='focus:outline-skin-primary h-12 px-3 bg-anti-flash-white rounded-lg text-sm text-skin-base text-opacity-75'
          {...props.formik.getFieldProps('email')}
        />
        {props.formik.touched.email && props.formik.errors.email && (
          <div className='text-red-600 text-sm'>
            <span role='alert'>{props.formik.errors.email}</span>
          </div>
        )}
      </section>
      <section className='flex flex-row justify-between my-12'>
        <BackIconButton
          onClick={() => useHistory.replace('/')}
          iconSize={'22px'}
          iconColor={'#1BC5BD'}
          textSize={'20px'}
        />
        <LoadingButton
          name={'Send'}
          loadingName={'Sending ...'}
          isLoading={props.formik.isSubmitting}
          onClick={props.formik.handleSubmit}
          className={ColorsEnum.green}
        />
      </section>
    </div>
  )
}

export default ForgetPasswordForm
