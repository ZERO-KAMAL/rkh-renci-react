// import {setItemIdForUpdate} from '../../../features/location/locationSlice'
import { Dialog } from '@mui/material'
import {
  defParams,
  fetchAreas,
  setAreaActive,
  setAreaDisabled,
  setAreaStateClear,
} from 'app/http/areas/areaSlice'
import {
  defParamsDep,
  fetchDepartments,
  setDepartmentStateClear,
  setDisabledDep,
} from 'app/http/departments/departmentSlice'
import {
  createLocationDetails,
  setFormAddress,
  setFormClear,
  setFormLocationId,
  setItemIdForUpdate,
  setLocationSelectClear,
} from 'app/http/location-datas/locationDetailSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import AreaDropdown from '../component/AreaDropdown'
import DepartmentDropdown from '../component/DepartmentDropdown'
import Loading from '../component/Loading'

const LocationFormModal = () => {
  const dispatch = useAppDispatch()
  const { dataTable } = useAppSelector((state) => state.location)
  const { loading } = useAppSelector((state) => state.area)
  const { form, editData } = useAppSelector((state) => state.locationDetail)
  const [address, setAddress] = useState('')
  const [message, setMessage] = useState('')

  // const [locationDetailForEdit] = useState<LocationDetailStructure>({
  //   ...editData,
  //   locationName: editData?.locationName || '',
  //   areaName: editData?.areaName || '',
  //   departmentName: editData?.departmentName || '',
  //   address: editData?.address || '',
  // })

  useEffect(() => {
    // fetch location data
    // console.log(`load...`)
    if (editData) {
      // grab the related data
      // console.log('editData.....')
      dispatch(setAreaDisabled(false))
      dispatch(setDisabledDep(false))
      defParams.locationId = editData.locationId
      dispatch(fetchAreas(defParams))
      defParamsDep.areaId = editData.areaId
      dispatch(fetchDepartments(defParamsDep))
    }
    setAddress(form?.address!)
    return () => {
      // console.log('close effect')
      dispatch(setFormClear())
      dispatch(setAreaStateClear())
      dispatch(setDepartmentStateClear())
    }
  }, [])
  useEffect(() => {
    if (message) {
      // console.log('Notificaiton')
      if (message === 'success') {
        toast.success('Saving Successful', {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else {
        toast.error('Something was wrong.', {
          position: toast.POSITION.TOP_RIGHT,
        })
        setMessage('')
      }
    }
  }, [message])

  // Actions

  const initialize = () => {
    dispatch(setAreaActive(false))
    dispatch(setFormLocationId(0))
    dispatch(setAreaStateClear()) // disable true
    dispatch(setDepartmentStateClear())
  }

  const locSelectOnChange = (e: any) => {
    // console.log(e.target.value)
    const locId = Number(e.target.value)
    if (form?.locationId !== locId) {
      // console.log('Location Selected Change')
      dispatch(setLocationSelectClear('address'))
      dispatch(setAreaActive(false))
      dispatch(setFormLocationId(locId))
      dispatch(setAreaStateClear()) // disable true
      dispatch(setDepartmentStateClear())
      if (locId == 0) {
        // console.log('clear from process')
        dispatch(setAreaDisabled(true))
      } else {
        // get location id to do fetchAreas
        defParams.locationId = locId
        const locAddress = dataTable.filter((item) => item.id == locId).map((item) => item.address)
        // console.log(`locAddress => ${locAddress}`)
        setAddress(locAddress.toString())
        dispatch(setFormAddress(locAddress.toString()))
        dispatch(setAreaDisabled(false))
        dispatch(fetchAreas(defParams))

        // disabledArea && dispatch(setAreaDisabled(false))
      }
    }
  }
  const addressOnChange = (e: any) => {
    setAddress(e.target.value)
    dispatch(setFormAddress(e.target.value))
  }
  const handleOnClick = (e: any) => {
    e.preventDefault()
    // console.log(`save changes .....`)
    // console.log(`data => ${JSON.stringify(form)}`)
    // check edit or create new
    dispatch(createLocationDetails(form!)).then((data) => {
      // console.log(`callback data => ${JSON.stringify(data)}`)
      if (data.meta.requestStatus === 'fulfilled') {
        dispatch(setLocationSelectClear(null))
        initialize()
        setAddress('')
        setMessage('success')
        console.log(`Add Location Detail Saving Successful`)
        dispatch(setItemIdForUpdate(undefined))
      } else {
        setMessage('error')
      }
    })
  }

  const handleOnClose = () => {
    // console.log(`handleOnClose.....`)
    dispatch(setItemIdForUpdate(undefined))
  }

  return (
    <Dialog onClose={handleOnClose} open={true}>
      {loading && <Loading />}
      <div className='overflow-x-hidden mx-auto w-[440px]'>
        <div className='w-full max-w-md h-full md:h-auto '>
          {/* Modal content */}
          <div className='relative bg-white rounded-lg shadow'>
            <button
              type='button'
              className='absolute top-3 right-2.5 text-gray-400 bg-transparent
               hover:bg-gray-200 hover:text-gray-900 rounded-lg 
               text-sm p-1.5 ml-auto inline-flex items-center'
              data-modal-toggle='location-modal'
              onClick={() => {
                dispatch(setItemIdForUpdate(undefined))
              }}
            >
              <svg
                aria-hidden='true'
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                ></path>
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
            <div className='py-6 px-6 lg:px-8'>
              <h3 className='mb-4 text-xl font-medium text-gray-900'>
                {editData === null ? `Add New Location Data` : `Update Location Data`}
              </h3>
              {/* Form */}
              <form className='space-y-6' action='#'>
                {/* location dropdown */}
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900'>
                    Location
                  </label>
                  <select
                    name='location'
                    id='location'
                    value={form?.locationId!}
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                    placeholder='Location'
                    onChange={locSelectOnChange}
                    required
                  >
                    <option value='0'>Choose a location</option>
                    {dataTable &&
                      dataTable.map((loc) => <option value={loc.id}> {loc.name}</option>)}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900'>
                    Address
                  </label>
                  <input
                    type='text'
                    name='address'
                    value={address}
                    id='address'
                    placeholder='Address'
                    autoComplete='off'
                    className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
                    onChange={(e) => {
                      addressOnChange(e)
                    }}
                    disabled
                  />
                </div>
                {/* Custom Drop down */}
                {/* Area dropdown */}
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900'>
                    Area
                  </label>
                  <AreaDropdown />
                </div>

                {/* department dropdown */}
                <div>
                  <label className='block mb-2 text-sm font-medium text-gray-900 '>
                    Department
                  </label>
                  <DepartmentDropdown />
                </div>

                {/* Action Button */}
                <div className='flex justify-end items-center'>
                  <button
                    type='button'
                    className='text-gray-300 hover:text-gray-600 hover:font-bold '
                    onClick={() => {
                      dispatch(setItemIdForUpdate(undefined))
                    }}
                  >
                    Discard
                  </button>
                  <button
                    disabled={
                      form?.locationId && form.areaId && form.departmentId
                        ? false
                        : true
                    }
                    type='submit'
                    className='bg-[#2BA579] p-1 text-white rounded-md ml-3 
                     disabled:opacity-50'
                    onClick={handleOnClick}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default LocationFormModal
