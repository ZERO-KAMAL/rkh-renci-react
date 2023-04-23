import React from 'react'

const Error500 = () => {
  return (
    <>
      <div className='flex-col justify-center align-middle'>
        <div className='text-2xl font-bold text-center'>We are sorry ...</div>
        <div className='mt-6 text-gray-400 font-medium text-center'>
          Server is under maintenace.
        </div>
        <div className='text-gray-400 font-medium text-center'>Please try again later.</div>
      </div>
    </>
  )
}

export default Error500
