import { Outlet } from 'react-router-dom'

import NavBar from './components/NavBar'

const DashboardMasterLayout = () => {
  return (
    <div className='flex flex-col relative w-full h-full'>
      <div className='h-16 z-50'>
        <NavBar />
      </div>

      <div className='bg-[#F2F3F7] w-full md:pt-16 flex flex-grow z-10'>
        <div
          className='flex-none w-full pt-10 md:pt-0
          px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-20
          py-5'
        >
          {/* border-red-700 border-2 */}
          <div className='rounded w-full h-full pb-5'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardMasterLayout
