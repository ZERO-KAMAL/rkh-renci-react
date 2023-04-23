import { Area } from 'app/http/areas/area.model'
import {
  defParams,
  fetchAreaByLocationId,
  fetchAreas,
  setAreaStateClear,
} from 'app/http/areas/areaSlice'
import { Department } from 'app/http/departments/department.model'
import {
  defParamsDep,
  fetchDepartmentByAreaId,
  fetchDepartments,
  setDepartmentStateClear,
} from 'app/http/departments/departmentSlice'
// import {} from 'app/http/locations/location.model'
import { LocationDetailFormScheam } from 'app/http/location-datas/locationDetail.model'
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
  locationName: string | null
  areaName: string | null
  departmentName: string | null
  locationEnable: boolean
  showLocationSelectAll?: boolean
}

const LocationDetailCustomV2 = (data: Props) => {
  // console.log(`locationDetailCustomV2 => ${JSON.stringify(data)}`)

  const [activeLocation, setActiveLocation] = useState(false)
  const [activeArea, setActiveArea] = useState(false)
  const [activeDepartment, setActiveDepartment] = useState(false)
  const [location, setLocation] = useState<Location | any>()
  const [area, setArea] = useState<Area | any>()
  const [department, setDepartment] = useState<Department | any>()
  const dispatch = useAppDispatch()
  const { dataTable } = useAppSelector((state) => state.location)
  const { dataTableArea } = useAppSelector((state) => state.area)
  const { dataTableDep } = useAppSelector((state) => state.department)

  useEffect(() => {
    if (data.locationId > 0) {
      setLocation({ id: data.locationId, name: data.locationName })
      if (dataTableArea.length == 0) dispatch(fetchAreaByLocationId(data.locationId))
    }
    if (data.areaId > 0) {
      setArea({ id: data.areaId, name: data.areaName })
      if (dataTableDep.length == 0) dispatch(fetchDepartmentByAreaId({locId :data.locationId , areaId : data.areaId , text :''}))
    }
    if (data.departmentId > 0) setDepartment({ id: data.departmentId, name: data.departmentName })
  }, [data])

  const initialFetch = useCallback(async () => {
    await dispatch(fetchLocations(defParamsLoc))
  }, [])

  useEffect(() => {
    // console.log('location initialFetch ...')
    initialFetch()
  }, [])

  const locationOnChange = (val: any) => {
    // console.log(`location changes => ${JSON.stringify(dataTableArea)}`)
    data.updateLocationDetail({
      index: data.index,
      locationId: val.id,
      locationName: val.name,
      areaId: 0,
      areaName: '',
      departmentId: 0,
      departmentName: '',
      address: '',
    })
    setLocation(val)
    setArea(null)
    setDepartment(null)
  }

  const areaOnChange = (val: any) => {
    // console.log('area changes')
    data.updateLocationDetail({
      index: data.index,
      locationId: location ? location.id : 0,
      locationName: location ? location.name : '',
      areaId: val.id,
      areaName: val.name,
      departmentId: 0,
      departmentName: '',
      address: '',
    })
    setArea(val)
    setDepartment(null)
  }

  const departmentOnChange = (val: any) => {
    // console.log('department changes')
    setDepartment(val)
    data.updateLocationDetail({
      index: data.index,
      locationId: location ? location.id : 0,
      locationName: location ? location.name : '',
      areaId: area ? area.id : 0,
      areaName: area ? area.name : '',
      departmentId: val.id,
      departmentName: val.name,
      address: '',
    })
  }

  // case 'location':
  //         dispatch(fetchLocations({ ...defParamsLoc, text }))
  //         break
  //       case 'area':
  //         const locationId = id
  //         dispatch(fetchAreas({ ...defParams, locationId, text }))
  //         break
  //       case 'department':
  //         // const areaId = id
  //         dispatch(fetchDepartments({ ...defParamsDep, areaId: '', locationId: id, text }))
  //         break

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
        onClick={() => {
          if (data.locationEnable) {
            setActiveLocation((prevActive) => !prevActive)
            // dispatch(fetchAreas({ ...defParams, locationId: location?.id }))
          }
        }}
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
          setValue={locationOnChange}
          setLocation={() => {}}
          setArea={() => {}}
          setDepartment={() => {}}
          showSelectAll={data.showLocationSelectAll}
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
        onClick={() => {
          setActiveArea((prevActive) => !prevActive)
          // dispatch(fetchAreas({ ...defParams, locationId: location?.id }))
        }}
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
          setValue={areaOnChange}
          setLocation={() => {}}
          setArea={() => {}}
          setDepartment={() => {}}
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
        onClick={() => {
          setActiveDepartment((prevActive) => !prevActive)
          // dispatch(fetchDepartments({ ...defParamsDep, areaId: area?.id }))
        }}
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
          setValue={departmentOnChange}
          setLocation={() => {}}
          setArea={() => {}}
          setDepartment={() => {}}
        />
      )}
    </div>
  )
}

export default LocationDetailCustomV2
