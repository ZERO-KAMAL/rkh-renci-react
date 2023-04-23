import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className='w-screen h-screen flex flex-row'>
      <div className='w-full lg:w-6/12 xl:w-4/12 2xl:w-4/12'>
        <header className='h-1/3 flex justify-center items-end'>
          <div className='bg-contain bg-no-repeat bg-center bg-company-logo-with-name w-3/5 h-3/5'></div>
        </header>
        <section className='h-2/3'>
          <Outlet />
        </section>
      </div>
      <div className='w-0 hidden lg:w-6/12 xl:w-8/12 2xl:w-8/12 lg:block'>
        <div className='w-full h-full bg-cover bg-no-repeat bg-center bg-company-photo-large'></div>
      </div>
    </div>
  )
}

export default AuthLayout
