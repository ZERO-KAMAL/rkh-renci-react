import { Area } from 'app/http/areas/area.model'
import { 
  defParams,
  fetchAreas,
  setAreaStateClear,
 } from 'app/http/areas/areaSlice'
import { Department } from 'app/http/departments/department.model'
import {
  defParamsDep,
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

type MenuProps = {
  id: number
  type: string
  datas: any | []
  setActive: any
  setValue: any
  setLocation: any
  setDepartment: any
  setArea: any
  showSelectAll?: boolean | true
}

const CustomDropDownMenu = ({
  id,
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
  const [searchText, setSearchText] = useState<string | undefined>(undefined)
  const debouncedText = useDebounce(searchText, 500)
  const dispatch = useAppDispatch()
  const { dataTableDep } = useAppSelector((state) => state.department)
  const { dataTableArea } = useAppSelector((state) => state.area)

  const initFetchArea = useCallback(
    async (id: number) => {
      // console.log('initFetchArea ....')
      const locationId = id
      const { page, limit, text, order } = defParams
      await dispatch(fetchAreas({ page, limit, locationId, text, order }))
    },
    [dispatch]
  )

  const initFetchDepartment = useCallback(
    async (id: number) => {
      // console.log('initDepartmentArea ....')
      const locationId = id
      await dispatch(fetchDepartments({ ...defParamsDep, locationId }))
    },
    [dispatch]
  )

  const fetchArea = async (id: number) => {
    // console.log('initFetchArea ....')
    const locationId = id
    const { page, limit, text, order } = defParams
    await dispatch(fetchAreas({ page, limit, locationId, text, order }))
  }

  useEffect(() => {
    switch (type) {
      case 'location':
        // clear area and department data
        setArea('')
        setDepartment('')
        // dispatch(fetchLocations({ ...defParamsLoc }))
        break
      case 'area':
        break
      case 'department':
        break
    }
    if (debouncedText !== undefined && searchText !== undefined) {
      //
      // console.log(`debounceTest => ${debouncedText}`)
      // console.log(`type => ${type}`)
      // console.log(`id => ${id}`)
      const text = debouncedText

      // console.log(`search => ${text}`)
      switch (type) {
        case 'location':
          dispatch(fetchLocations({ ...defParamsLoc, text }))
          break
        case 'area':
          const locationId = id
          dispatch(fetchAreas({ ...defParams, locationId, text }))
          break
        case 'department':
          // const areaId = id
          dispatch(fetchDepartments({ ...defParamsDep, areaId: '', locationId: id, text }))
          break
      }
    }
    return () => {
      // clear stage
      // dispatch(setAreaStateClear())
      // dispatch(setDepartmentStateClear())
    }
  }, [debouncedText])

  // actions
  const selectOnClick = (row: any) => {
    try {
      // console.log(`selected type ${type} => ${JSON.stringify(row)}`)
      switch (type) {
        case 'location':
          // if(row.id >0)
          fetchArea(row.id)
          break
        case 'area':
          // if(row.id >0)
          initFetchDepartment(row.locationId)
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
            setSearchText(e.target.value)
          }}
          autoComplete='off'
          required
        />
      </div>

      {/* data table */}
      <div className='m-4'>
        <table className='min-w-max w-full h-[50px] overflow-y-scroll'>
          {showSelectAll && (
            // <table className='min-w-max w-full table-auto' key={999}>
            <tbody key={999}>
              <tr
                className='border-b border-gray-100 h-[35px] hover:bg-green-50  '
                onClick={() => selectOnClick({ id: 0, name: 'Select All' })}
              >
                <td className='text-gray-500 text-sm hover:font-bold hover:rounded-lg'>
                  <span className='ml-4 w-full h-full '> Select All </span>
                </td>
              </tr>
            </tbody>
            // </table>
          )}
          {datas &&
            datas.map((row: any, index: number) => {
              return (
                // <table className='min-w-max w-full table-auto' key={index}>
                <tbody key={index}>
                  <tr
                    className='border-b border-gray-100 h-[35px] hover:bg-green-50 '
                    onClick={() => selectOnClick(row)}
                  >
                    <td className='text-gray-500 text-sm hover:font-bold hover:rounded-lg'>
                      <span className='ml-4 w-full h-full '> {row.name}</span>
                    </td>
                  </tr>
                </tbody>
                // </table>
              )
            })}
        </table>

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
export default CustomDropDownMenu
