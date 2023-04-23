import React from 'react'

import Header from '../components/Header'
import WithResetForm from './hooks/WithResetForm'

const ResetPassword = () => {
  return (
    <div className='flex flex-col h-full'>
      <Header name='Enter your new password' />
      <div className='mx-12 md:mx-16 lg:mx-20'>
        <WithResetForm />
      </div>
    </div>
  )
}

export default ResetPassword
