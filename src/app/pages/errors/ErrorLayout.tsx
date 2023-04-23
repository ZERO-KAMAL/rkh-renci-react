import ReactIconBtn, { ColorsEnum } from 'app/components/button/ReactIconBtn'
import { Outlet, useNavigate } from 'react-router-dom'

const ErrorLayout = () => {
  const navigate = useNavigate()

  return (
    <div className='flex-col justify-center align-middle'>
      <img
        className='mx-auto'
        src='/assets/error-page/multitasking.svg'
        alt='image'
      />
      <div className='flex-row justify-center align-middle my-6'>
        <Outlet />
      </div>
      <div className='flex justify-center align-middle'>
        <ReactIconBtn
          name='Go to homepage'
          bgColor={ColorsEnum.green}
          onClick={() => {
            navigate('/', { replace: true })
          }}
        ></ReactIconBtn>
      </div>
      ,
    </div>
  )
}

export default ErrorLayout
