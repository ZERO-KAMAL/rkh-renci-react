// import { setItemIdForUpdate } from "../../../features/location/locationSlice";
import { setItemIdForUpdate } from 'app/http/location-datas/locationDetailSlice'
import { useAppDispatch } from 'app/redux/store'
import React from 'react'
import { IoMdAdd } from 'react-icons/io'

const LocationHeader = () => {
  const dispatch = useAppDispatch()
  return (
    <div className=' flex justify-between pt-4 '>
      {/* title */}
      <h1 className='text-2xl text-black font-bold'>Location , Areas , Departments</h1>
      {/* add button */}
      <button
        className='w-[200px] h-[50px] bg-orange-300 rounded-lg font-bold text-white hover:bg-orange-500 p-1 flex items-center'
        onClick={() => {
          dispatch(setItemIdForUpdate(null))
        }}
      >
        <IoMdAdd size={20} /> Add Location Data
      </button>
    </div>
  )
}

export default LocationHeader
