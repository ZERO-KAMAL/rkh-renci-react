import CustomSelectWithSearch from 'app/components/CustomSelectWithSearch'
import { Area } from 'app/http/areas/area.model'
import { defParams, fetchAreaByLocationId, fetchAreaByLocationIdWithSearch, fetchAreas, setAreaStateClear } from 'app/http/areas/areaSlice'
import { Department } from 'app/http/departments/department.model'
import { defParamsDep, fetchDepartmentByAreaId, fetchDepartments, setDepartmentStateClear } from 'app/http/departments/departmentSlice'
import { SortingType } from 'app/http/feedback-form/feedBackForm.model'
import { defParamsForm, fetchFeedbackForm } from 'app/http/feedback-form/feedBackFormSlice'
import { defParamsLoc, fetchLocations, setLocationStateClear } from 'app/http/locations/locationSlice'
import { useAppSelector } from 'app/redux/store'
import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { useDispatch } from 'react-redux'


interface Props {
  location:  any
  setLocation: (v: Location | null)=> void
  area: Area | null
  setArea: (v: Area | null)=> void
  department: Department | null
  setDepartment: (v: Department | null)=> void
  text: string
  setSearchValue: (v: string) => void
  order: SortingType
}

const FormsFilter:React.FC<Props> = ({location, setLocation, area, setArea, department, setDepartment, text, setSearchValue, order}) => {
  const dispatch = useDispatch()
  const { dataTable } = useAppSelector((state) => state.location)

  const [areaSearchText, setAreaSearchText] = useState<string>("")
  const [depSearchText, setDepartmentSearchText] = useState<string>("")

  const locationData = dataTable?.map(({ id, name }) => ({ id, name }))
  // @james[20221023 0305PM] => Just dataTalbe to dataTableArea in areaSlice
  const { dataTableArea: areaDataTable } = useAppSelector((state) => state.area)
  const areaData = areaDataTable?.filter(({name})=> name?.toLowerCase().includes(areaSearchText.toLowerCase())).map(({ id, name }) => ({ id, name }))
  const { dataTableDep } = useAppSelector((state) => state.department)
  const depData = dataTableDep?.filter(({name})=> name?.toLowerCase().includes(depSearchText.toLowerCase())).map(({ id, name }) => ({ id, name }))

  const { page, limit } = useAppSelector((state) => state.feedbackForm)

  const initialFetch = useCallback(async () => {
    await dispatch(fetchLocations(defParamsLoc) as any)
  }, [])

  useEffect(() => {
    // console.log('location initialFetch ...')
    initialFetch()
  }, [])

  const locationOnChange = (val: any) => {
    setLocation(val)
    setArea(null)
    setDepartment(null)
    const locationId = val?.id
    if(locationId) {
      dispatch(fetchAreaByLocationId(locationId) as any)
    }
  }
  const areaOnChange = (val: any) => {
    setArea(val)
    setDepartment(null)
    const areaId = val?.id
    const locId = location?.id
    if(areaId && locId) {
      dispatch(fetchDepartmentByAreaId({ locId, areaId }) as any)
    }
  }
  const depOnChange = (val: any) => {
    setDepartment(val)
  }

  const onLocSearch = (text: string) => {
    dispatch(fetchLocations({ ...defParamsLoc, text }) as any)
  }
  const onAreaSearch = (text: string) => {
    // const locationId = location?.id
    // if (locationId) dispatch(fetchAreaByLocationIdWithSearch({ locationId, text }) as any)
    setAreaSearchText(text)
  }
  const onDepartmentSearch = (text: string) => {
    // const areaId = area?.id
    // const locId = location?.id
    // if (areaId) dispatch(fetchDepartmentByAreaId({ locId, areaId, text }) as any)
    setDepartmentSearchText(text)
  }

  useEffect(() => {
    const locationId = location?.id
    const areaId = area?.id
    const departmentId = department?.id
    dispatch(
      fetchFeedbackForm({
        ...defParamsForm,
        text,
        locationId,
        areaId,
        departmentId,
        page,
        limit,
        order
      }) as any
    )
  }, [location, area, department, text, page, limit, order])

  return (
    <div className='w-full min-h-[140px] h-auto bg-white mt-4 p-[24px] rounded-xl'>
      <div className='flex flex-wrap h-full justify-between pt-5'>
        <div className='w-full md:w-full lg:w-1/5'>
          <div>
            <p className='mb-3  text-gray-400 text-md'> Location </p>
            <CustomSelectWithSearch
              placeHolder={location?.name || 'Location'}
              data={locationData}
              setSelectedValue={locationOnChange}
              setSearch={onLocSearch}
              reset
              resetClicked={() => locationOnChange(null)}
            />
          </div>
        </div>
        <div className='w-full md:w-full lg:w-1/5'>
          <div>
            <p className='mb-3  text-gray-400 text-md'> Area </p>
            <CustomSelectWithSearch
              placeHolder={area?.name || 'Area'}
              data={areaData}
              setSelectedValue={areaOnChange}
              setSearch={onAreaSearch}
              searchValue={areaSearchText}
              reset
              resetClicked={() => {areaOnChange(null); setAreaSearchText("")}}
            />
          </div>
        </div>
        <div className='w-full md:w-full lg:w-1/5'>
          <div>
            <p className='mb-3  text-gray-400 text-md'> Department </p>
            <CustomSelectWithSearch
              placeHolder={department?.name || 'Department'}
              data={depData}
              setSelectedValue={depOnChange}
              setSearch={onDepartmentSearch}
              searchValue={depSearchText}
              reset
              resetClicked={() => {depOnChange(null); setDepartmentSearchText("")}}
            />
          </div>
        </div>
        <div className='w-full md:w-full lg:w-1/3'>
          <div>
            <p className='mb-3  text-gray-400 text-md'> Search </p>
            <div className='w-full h-[40px] flex items-center bg-[#ECF0F3] rounded-lg pl-2'>
              <AiOutlineSearch size={20} />
              <input
                type='text'
                name='search'
                id='search'
                placeholder='Search by Form ID, location, area, department and more...'
                className='bg-[#ECF0F3] w-full h-full ml-2 focus:outline-none rounded-md text-sm'
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
                autoComplete='off'
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default FormsFilter
