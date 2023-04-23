import { Button } from '@mui/material'
import CustomSelectWithSearch from 'app/components/CustomSelectWithSearch'
import BackIconButton from 'app/components/button/BackIconButton'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { Area } from 'app/http/areas/area.model'
import { defParams, fetchAreaByLocationId, fetchAreaByLocationIdWithSearch, fetchAreas, setAreaStateClear } from 'app/http/areas/areaSlice'
import { Department } from 'app/http/departments/department.model'
import { defParamsDep, fetchDepartmentByAreaId, fetchDepartments, setDepartmentStateClear } from 'app/http/departments/departmentSlice'
import {
  nextStep,
  setArea,
  setDepartment,
  setLocation,
} from 'app/http/feedback-form/feedBackFormCreationSlice'
import { Location } from 'app/http/locations/location.model'
import { defParamsLoc, fetchLocations, setLocationStateClear } from 'app/http/locations/locationSlice'
import { useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import { FC, useCallback, useEffect, useState } from 'react'
import { IoCloseOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux'

interface Props {
  formId?: number
}

const AssignLocation: FC<Props> = ({ formId }) => {
  const { location, area, department } = useAppSelector((state) => state.feedbackFormCreation)

  const dispatch = useDispatch()

  const [areaSearchText, setAreaSearchText] = useState<string>("")
  const [depSearchText, setDepartmentSearchText] = useState<string>("")

  const { dataTable } = useAppSelector((state) => state.location)
  const locationData = dataTable?.map(({ id, name }) => ({ id, name }))
  const { dataTableArea: areaDataTable } = useAppSelector((state) => state.area)
  const areaData = areaDataTable?.map(({ id, name }) => ({ id, name }))
  const { dataTableDep } = useAppSelector((state) => state.department)
  const depData = dataTableDep?.map(({ id, name }) => ({ id, name }))

  const initialFetch = useCallback(async () => {
    await dispatch(fetchLocations(defParamsLoc) as any)
  }, [])

  useEffect(() => {
    // console.log('location initialFetch ...')
    initialFetch()
  }, [])

  const onLocSearch = (text: string) => {
    dispatch(fetchLocations({ ...defParamsLoc, text }) as any)
  }
  const onAreaSearch = (text: string) => {
    // const locationId = location?.id
    // if (locationId) dispatch(fetchAreaByLocationIdWithSearch({locationId, text }) as any)
    setAreaSearchText(text)
  }
  const onDepartmentSearch = (text: string) => {
    // const areaId = area?.id
    // const locId = location?.id
    // if (areaId && locId) dispatch(fetchDepartmentByAreaId({ locId, areaId, text }) as any)
    setDepartmentSearchText(text)
  }

  const locationOnChange = (val: Location | null) => {
    dispatch(setLocation(val))
    dispatch(setArea(null))
    dispatch(setDepartment(null))
    const locationId = val?.id
    if(locationId)
      dispatch(fetchAreaByLocationId(locationId) as any)
  }
  const areaOnChange = (val: Area | null) => {
    dispatch(setArea(val))
    dispatch(setDepartment(null))
    const areaId = val?.id as number
    const locId = location?.id
    if(locId && areaId)
      dispatch(fetchDepartmentByAreaId({locId , areaId}) as any)
  }
  const departmentOnChange = (val: Department | null) => {
    dispatch(setDepartment(val))
  }

  useEffect(()=> {
    dispatch(setLocationStateClear())
    dispatch(setAreaStateClear())
    dispatch(setDepartmentStateClear())
  }, [])

  return (
    <div>
      <div>
        <BackIconButton
          onClick={() => useHistory.replace(NAVIGATE_LINKS.FORMS.OVERVIEW)}
          iconSize={'22px'}
          iconColor={'#1BC5BD'}
          textSize={'20px'}
        />
      </div>
      <div className='w-full h-auto bg-white mt-4 rounded-xl'>
        <div className='flex items-center justify-between pt-[33px] max-md:pt-[20px] px-[65px] max-md:px-[20px] pb-[16px] border-b-[1px]'>
          <span className='text-[20px] font-semibold'>Assign location details to form</span>
          <IoCloseOutline
            size={'30px'}
            color='#0000008a'
            onClick={() => useHistory.replace(NAVIGATE_LINKS.FORMS.OVERVIEW)}
          />
        </div>
        <div className='px-[65px] max-md:px-[20px] py-[50px] max-md:py-[20px]'>
          <div>
            <p className='mb-3 text-lg font-medium'>
              Location<span className='text-[#FD3D00]'>*</span>{' '}
            </p>
            <CustomSelectWithSearch
              placeHolder={location?.name || 'Location'}
              data={locationData}
              setSelectedValue={locationOnChange}
              setSearch={onLocSearch}
              reset
              resetClicked={() => locationOnChange(null)}
              selectAll
            />
          </div>
          <div>
            <p className='mb-3 text-lg font-medium'> Area </p>
            <CustomSelectWithSearch
              placeHolder={area?.name || 'Area'}
              data={areaData}
              setSelectedValue={areaOnChange}
              setSearch={onAreaSearch}
              reset
              searchValue={areaSearchText}
              resetClicked={() => {areaOnChange(null); setDepartmentSearchText("")}}
              selectAll
              disabled={location?.id === 0}
            />
          </div>
          <div>
            <p className='mb-3 text-lg font-medium'> Department </p>
            <CustomSelectWithSearch
              placeHolder={department?.name || 'Department'}
              data={depData}
              setSelectedValue={departmentOnChange}
              setSearch={onDepartmentSearch}
              reset
              searchValue={depSearchText}
              resetClicked={() => {departmentOnChange(null); setDepartmentSearchText("")}}
              selectAll
              disabled={location?.id === 0 || area?.id === 0}
            />
          </div>
        </div>
        <div className='px-[65px] max-md:px-[20px] py-[32px] max-md:py-[20px] border-t-[1px] flex justify-end'>
          <Button
            variant='contained'
            className='bg-skin-navbar hover:bg-skin-navbar focus:bg-skin-navbar'
            disabled={location?.id === undefined}
            onClick={() => dispatch(nextStep())}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AssignLocation
