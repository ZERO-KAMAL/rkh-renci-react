import { Area } from 'app/http/areas/area.model'
import { Department } from 'app/http/departments/department.model'
// import {} from 'app/http/locations/location.model'
import { Location } from 'app/http/locations/location.model'
import { defParamsLoc, fetchLocations } from 'app/http/locations/locationSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import React, {
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  AiFillCaretDown,
  AiFillCaretUp,
  AiOutlineDelete,
  AiOutlineDown,
  AiOutlineSearch,
  AiOutlineUp,
} from 'react-icons/ai'
import { useDebounce } from 'usehooks-ts'

import CustomDropDownMenu from './CustomDropDownMenu'
import CustomDropDownMenuV2 from './CustomDropDownMenuV2'

type Props = {
  index: number
  locationId: number
  areaId: number
  departmentId: number
  handleRemoveClick: any
  updateLocationDetail: any
  titleHidden: boolean
}

const LocationDetailCustom = (data: Props) => {
  // console.log(`locationDetailCustom => ${JSON.stringify(data)}`)

  const [activeLocation, setActiveLocation] = useState(false)
  const [activeArea, setActiveArea] = useState(false)
  const [activeDepartment, setActiveDepartment] = useState(false)
  const [location, setLocation] = useState<Location | any>()
  const [area, setArea] = useState<Area | any>(null)
  const [department, setDepartment] = useState<Department | any>(null)
  const dispatch = useAppDispatch()
  const { dataTable } = useAppSelector((state) => state.location)
  const { dataTableArea } = useAppSelector((state) => state.area)
  const { dataTableDep } = useAppSelector((state) => state.department)

  const initialFetch = useCallback(async () => {
    await dispatch(fetchLocations(defParamsLoc))
  }, [])

  useEffect(() => {
    // index 999 is reset value
    // console.log(`reset change....${data.index}`)
    if (data.locationId === 0) {
      setLocation('')
      setArea('')
      setDepartment('')
      initialFetch()
    }
  }, [data])

  useEffect(() => {
    // console.log(`location changes => ${JSON.stringify(dataTableArea)}`)
    data.updateLocationDetail({
      index: data.index,
      locationId: location ? location.id : 0,
      areaId: area ? area.id : 0,
      departmentId: department ? department.id : 0,
      address: '',
    })
  }, [location])

  useEffect(() => {
    // console.log('area changes')
    data.updateLocationDetail({
      index: data.index,
      locationId: location ? location.id : 0,
      areaId: area ? area.id : 0,
      departmentId: department ? department.id : 0,
      address: '',
    })
  }, [area])

  useEffect(() => {
    // console.log('department changes')
    data.updateLocationDetail({
      index: data.index,
      locationId: location ? location.id : 0,
      areaId: area ? area.id : 0,
      departmentId: department ? department.id : 0,
      address: '',
    })
  }, [department])

  return (
    <div className='mt-5'>
      <div className={clsx('flex items-center mb-2 ', data.titleHidden && 'hidden')}>
        <span className='text-[#80808F] text-sm '> Location Detail </span>
        {/* index is zero hidden */}
        <div
          className={clsx(
            'hover:text-red-900 font-extrabold hover:cursor-pointer ',
            data.index === 0 && 'hidden'
          )}
          onClick={() => data.handleRemoveClick(data.index)}
        >
          <AiOutlineDelete size={20} />
        </div>
      </div>

      {/* location */}
      {data.titleHidden && (
        <label
          className='block mb-3 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-300 '
        >
          Location
        </label>
      )}
      <div
        className='bg-[#ECF0F3] 
                        w-full h-[45px] px-1
                        flex items-center justify-between rounded-lg mb-4
                        static  '
        onClick={() => setActiveLocation((prevActive) => !prevActive)}
      >
        <span className={clsx(`ml-2 text-sm text-[#A1A5B7]`)}>
          {location ? location.name : 'Location'}
        </span>
        {activeLocation ? (
          <AiFillCaretUp
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bold',
              marginRight: '5px',
            }}
          />
        ) : (
          <AiFillCaretDown
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bold',
              marginRight: '5px',
            }}
          />
        )}
      </div>
      {/* options */}
      {activeLocation && (
        <CustomDropDownMenuV2
          id={0}
          areaId={0}
          type={'location'}
          datas={dataTable}
          setActive={setActiveLocation}
          setValue={setLocation}
          setLocation={setLocation}
          setArea={setArea}
          setDepartment={setDepartment}
        />
      )}
      {/* area */}
      {data.titleHidden && (
        <label
          className='block mb-3 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-300 '
        >
          Area
        </label>
      )}
      <div
        className='bg-[#ECF0F3] 
                        w-full h-[45px] px-1
                        flex items-center justify-between rounded-lg mb-4 static'
        onClick={() => setActiveArea((prevActive) => !prevActive)}
      >
        <span className={clsx(`ml-2 text-sm text-[#80808F]`)}>{area ? area.name : 'Area'}</span>
        {activeArea ? (
          <AiFillCaretUp
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bold',
              marginRight: '5px',
            }}
          />
        ) : (
          <AiFillCaretDown
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bold',
              marginRight: '5px',
            }}
          />
        )}
      </div>
      {/* options */}
      {activeArea && (
        <CustomDropDownMenuV2
          id={location ? location.id : 0}
          areaId={0}
          type={'area'}
          datas={dataTableArea}
          setActive={setActiveArea}
          setValue={setArea}
          setLocation={setLocation}
          setArea={setArea}
          setDepartment={setDepartment}
        />
      )}
      {/* department */}
      {data.titleHidden && (
        <label
          className='block mb-3 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-300 '
        >
          Department
        </label>
      )}
      <div
        className='bg-[#ECF0F3] 
                        w-full h-[45px] px-1
                        flex items-center justify-between rounded-lg mb-4'
        onClick={() => setActiveDepartment((prevActive) => !prevActive)}
      >
        <span className={clsx(`ml-2 text-sm text-[#80808F]`)}>
          {department ? department.name : 'Department'}
        </span>
        {activeDepartment ? (
          <AiFillCaretUp
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bold',
              marginRight: '5px',
            }}
          />
        ) : (
          <AiFillCaretDown
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bold',
              marginRight: '5px',
            }}
          />
        )}
      </div>
      {/* options */}
      {activeDepartment && (
        <CustomDropDownMenuV2
          // id={area ? area.id : 0}
          id={location ? location.id : 0}
          areaId={area ? area.id : 0}
          type={'department'}
          datas={dataTableDep}
          setActive={setActiveDepartment}
          setValue={setDepartment}
          setLocation={setLocation}
          setArea={setArea}
          setDepartment={setDepartment}
        />
      )}
    </div>
  )
}

export default memo(LocationDetailCustom)
