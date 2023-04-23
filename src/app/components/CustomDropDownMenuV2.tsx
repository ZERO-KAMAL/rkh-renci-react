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
  fetchDepartments,
  setDepartmentStateClear,
  fetchDepartmentByAreaId,
} from 'app/http/departments/departmentSlice'
import { fetchfeedbackFormDetails } from 'app/http/feedback-form/feedBackFormSlice'
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

type MenuProps = {
  id: number,
  areaId : number,
  type: string
  datas: any | []
  setActive: any
  setValue: any
  setLocation: any
  setDepartment: any
  setArea: any
  showSelectAll?: boolean | true
}

const CustomDropDownMenuV2 = ({
  id,
  areaId,
  type,
  datas,
  setActive,
  setValue,
  setLocation,
  setDepartment,
  setArea,
  showSelectAll = true,
}: MenuProps) => {
  // console.log(`Assign type => ${type}_${id} => ${JSON.stringify(datas)}`)
  const [searchText, setSearchText] = useState<string>('')
  const debouncedText = useDebounce(searchText, 500)
  const dispatch = useAppDispatch()
  // const { dataTableDep } = useAppSelector((state) => state.department)
  // const { dataTableArea } = useAppSelector((state) => state.area)

  const initFetchArea = useCallback(
    async (id: number) => {
      // console.log('initFetchArea ....')
      await dispatch(fetchAreaByLocationId(id))
    },
    [dispatch]
  )

  const initFetchDepartment = useCallback(
    async ( areaId : number) => {
      // console.log(`initDepartmentArea ... loationId_${id}...areaId_${areaId}`)
      const  locId = id
      await dispatch(fetchDepartmentByAreaId({ locId , areaId }))
    },
    [dispatch]
  )

  // useEffect(()=>{
     
  //     console.log(`type => ${type} search => ${debouncedText}`)
  // },[debouncedText])

  

  // actions
  const selectOnClick = (row: any) => {
    try {
      // console.log(`selected type ${type} => ${JSON.stringify(row)}`)
      switch (type) {
        case 'location':
          // if(row.id >0)
          initFetchArea(row.id)
          break
        case 'area':
          // if(row.id >0)
           
           initFetchDepartment(row.id)
          break
      }
      setValue({ id: row.id, name: row.name })
      setActive(false)
    } catch (error) {}
  }
  // const selectOnClick = useCallback((row : any) =>{
  //   console.log(`selected => ${JSON.stringify(row)}`)
  //   setActive(false)
  // },[])

  return (
    <div
      className='relative w-full h-auto
          bg-white border rounded-lg '
    >
      {/* search bar */}
      <div className='bg-[#ECF0F3] m-4 h-[40px] rounded-lg flex items-center'>
        <AiOutlineSearch size={20} style={{ marginLeft: '10px' }} />
        <input
          type='text'
          name='search'
          id='search'
          placeholder='Search'
          className='bg-[#ECF0F3] w-full h-full ml-2 focus:outline-none rounded-lg '
          onChange={(e) => {
            setSearchText(e.target.value.toLocaleLowerCase())
          }}
          autoComplete='off'
          required
        />
      </div>

      {/* data table */}
      <div className='m-4'>
        {showSelectAll && (
          <table className='min-w-max w-full table-auto' key={999}>
            <tbody>
              <tr
                className='border-b border-gray-100 h-[35px] hover:bg-green-50  '
                onClick={() => selectOnClick({ id: 0, name: 'Select All' })}
              >
                <td className='text-gray-500 text-sm hover:font-bold hover:rounded-lg'>
                  <span className='ml-4 w-full h-full '> Select All </span>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {datas &&
          datas.filter((data : any) => data.name.toLowerCase().includes(debouncedText)).map((row: any, index: number) => {
            return (
              <table className='min-w-max w-full table-auto' key={index}>
                <tbody>
                  <tr
                    className='border-b border-gray-100 h-[35px] hover:bg-green-50  '
                    onClick={() => selectOnClick(row)}
                  >
                    <td className='text-gray-500 text-sm hover:font-bold hover:rounded-lg'>
                      <span className='ml-4 w-full h-full '> {row.name}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            )
          })}
        {/* {dataTableArea &&
          dataTableArea.map((row: any) => {
            return (
              <table className='min-w-max w-full table-auto'>
                <tr
                  className='border-b border-gray-100 h-[35px] hover:bg-green-50  '
                  onClick={() => selectOnClick(row)}
                >
                  <td className='text-gray-500 text-sm hover:font-bold hover:rounded-lg'>
                    <span className='ml-4 w-full h-full '> {row.name}</span>
                  </td>
                </tr>
              </table>
            )
          })}
        {dataTableDep &&
          dataTableDep.map((row: any) => {
            return (
              <table className='min-w-max w-full table-auto '>
                <tr
                  className='border-b border-gray-100 h-[35px] hover:bg-green-50  '
                  onClick={() => selectOnClick(row)}
                >
                  <td className='text-gray-500 text-sm hover:font-bold hover:rounded-lg'>
                    <span className='ml-4 w-full h-full '> {row.name}</span>
                  </td>
                </tr>
              </table>
            )
          })} */}
      </div>
    </div>
  )
}
export default CustomDropDownMenuV2
