import { Checkbox } from '@mui/material'
import { FORM_FIELD_TYPE } from 'app/constants'
import { defParams, fetchAreas } from 'app/http/areas/areaSlice'
import { defParamsDep, fetchDepartments } from 'app/http/departments/departmentSlice'
import { fetchAppConstant } from 'app/http/feedbacks/feedBackSlice'
import { defParamsLoc, fetchLocations } from 'app/http/locations/locationSlice'
import { useAppSelector } from 'app/redux/store'
import { FC, useEffect, useState } from 'react'
import { GrFormDown, GrFormUp } from 'react-icons/gr'
import { useDispatch } from 'react-redux'

interface Props {
  value: any
  locationType: 'Location' | 'Area' | 'Department'
  onChange: (v: any) => void
  CBS?: boolean
}

const DropDownLocationField: FC<Props> = ({ value: prevValue, onChange, locationType, CBS }) => {
  const [dropDownOn, setDropDownOn] = useState(false)
  const [options, setOptions] = useState<any>(undefined)
  const [value, setValue] = useState({
    fieldName: locationType,
    text: '',
    options: options,
    required: true,
  })

  const dispatch = useDispatch()
  const {
    dataTable
  } = useAppSelector((state) => state.location)
  const {
    dataTableArea
  } = useAppSelector((state) => state.area)
  const {
    dataTableDep
  } = useAppSelector((state) => state.department)

  useEffect(()=> {
    if(dataTable && locationType === 'Location') {
      const locationData = dataTable?.map(({ id, name }) => ({ id, value: name }))
      setOptions(locationData as any)
      setValue({...value, options: locationData})
      onChange({...value, text: prevValue?.text || value.text, options: locationData})
    }
    else if(dataTableArea && locationType === 'Area') {
      let areaData = dataTableArea?.map(({ id, name }) => ({ id, value: name }))
      if(CBS) {
        areaData = areaData?.filter(f => f.value === 'Senior Care Centre')
      }
      setOptions(areaData as any)
      setValue({...value, options: areaData})
      onChange({...value, text: prevValue?.text || value.text, options: areaData})
    }
    else if(dataTableDep && locationType === 'Department') {
      const depData = dataTableDep?.map(({ id, name }) => ({ id, value: name }))
      setOptions(depData as any)
      setValue({...value, options: depData})
      onChange({...value, text: prevValue?.text || value.text, options: depData})
    }
  }, [dataTable, dataTableArea, dataTableDep])

  // console.log(prevValue)
  useEffect(() => {
    if (prevValue) {
      setValue(prevValue)
      setOptions(prevValue.options)
      onChange(prevValue)
    }
    else {
      if(locationType === 'Location') {
        dispatch(fetchLocations(defParamsLoc) as any)
      }
      else if(locationType === 'Area') {
        dispatch(fetchAreas(defParams) as any)
      }
      else if(locationType === 'Department') {
        dispatch(fetchDepartments(defParamsDep) as any)
      }
      onChange(value)
    }
  }, [])

  return (
    <div className='w-full bg-white py-[24px] max-md:py-[15px] px-[32px] max-md:px-[16px] disabled:bg-white h-auto'>
      <div className='text-[14px] font-medium mb-3 border-none outline-none w-full'>
        {locationType}
      </div>
      <div
        className='bg-[#ECF0F3] h-[40px] w-full focus:outline-none rounded-md text-sm flex-1 px-4 cursor-pointer flex justify-between items-center'
        onClick={() => setDropDownOn(!dropDownOn)}
      >
        <input
          type='text'
          className='text-[#A1A5B7] text-base font-normal leading-10 border-none outline-none bg-transparent w-full'
          value={value.text}
          placeholder={locationType === 'Area' ? 'Please select an area' : locationType === 'Location' ? 'Please select a location' : 'Please select a department'}
          onChange={(e: any) => {
            setValue({ ...value, text: e.target.value })
            onChange({ ...value, text: e.target.value })
          }}
        />
        {dropDownOn ? (
          <GrFormUp
            size={16}
            style={{
              color: '#A1A5B7',
              fontWeight: 'bold',
            }}
          />
        ) : (
          <GrFormDown
            size={16}
            style={{
              color: '#A1A5B7',
              fontWeight: 'bold',
            }}
          />
        )}
      </div>
      {dropDownOn && (
        <div className='w-full h-auto pt-[25px] px-[28px] z-10'>
          {options && options?.map((item: any, index: number) => {
            return (
              <div className='w-full border-none outline-none text-sm text-[#A1A5B7] font-medium pb-[22px]' key={index}>
                {item?.value}
              </div>
            )
          })}
        </div>
      )}
      <div className='flex mt-6'>
        <Checkbox
          color='success'
          sx={{
            p: '0',
            color: '#A1A5B7',
            '&.Mui-checked': {
              color: '#2BA579',
            },
          }}
          checked={value.required}
          disabled
        />
        <p className='text-base text-[#7E8299] ml-3 font-sm'>Compulsory Field</p>
      </div>
    </div>
  )
}

export default DropDownLocationField
