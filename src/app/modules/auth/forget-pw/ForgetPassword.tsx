import Header from '../components/Header'
import WithForgetPassword from './hooks/WithForgetPassword'

const ForgetPassword = () => {
  return (
    <div className='flex flex-col h-full'>
      <Header name='Forget Password?' />
      <div className='mx-12 md:mx-16 lg:mx-20 text-sm'>
        <div className='text-center my-2'>
          <p>Please enter your email address</p>
          <p>to receive a verification code</p>
        </div>
      </div>
      <div className='mx-12 md:mx-16 lg:mx-20'>
        <WithForgetPassword />
      </div>
    </div>
  )
}

export default ForgetPassword
