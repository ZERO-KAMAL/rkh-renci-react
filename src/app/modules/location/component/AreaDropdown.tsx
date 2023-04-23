import { Area, AreaFormSchema } from 'app/http/areas/area.model'
import {
  createArea,
  defParams,
  fetchAreas,
  setAreaActive,
  setAreaDisabled,
  setAreaId,
  setName,
} from 'app/http/areas/areaSlice'
import {
  defParamsDep,
  fetchDepartments,
  setActiveDep,
  setDepartmentStateClear,
  setDisabledDep,
} from 'app/http/departments/departmentSlice'
import { setFormAreaId, setFormLocationId } from 'app/http/location-datas/locationDetailSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineDown, AiOutlineSearch, AiOutlineUp } from 'react-icons/ai'
import { GrAdd } from 'react-icons/gr'
import { useDebounce } from 'usehooks-ts'

const AreaDropdown = () => {
  // const [active, setActive] = useState(false);
  const { editData, form } = useAppSelector((state) => state.locationDetail)
  const { disabledArea, active, name } = useAppSelector((state) => state.area)
  const { disabledDep } = useAppSelector((state) => state.department)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // check editData not null
    if (editData) dispatch(setName(editData.areaName))
    // dispatch(setDisabled(false))
  }, [])

  const handleToggleOnClick = () => {
    // if area is not disable just do toggle on off
    // disable false
    if (!disabledArea) {
      dispatch(setAreaActive(!active))
      dispatch(setActiveDep(false))
    } else {
      // disableArea also disable deparment
      dispatch(setAreaActive(false))
      dispatch(setDepartmentStateClear())
    }
  }

  return (
    <>
      <div
        className='w-full h-10  rounded-lg  pl-3 flex justify-between items-center bg-gray-50 border border-gray-300 text-gray-900 text-sm'
        onClick={() => {
          handleToggleOnClick()
        }}
      >
        {/* name from area */}
        {/* <span>{editData ? editData.areaName : name}</span> */}
        <span> {name} </span>
        {!active ? (
          <AiOutlineDown
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bold',
              marginRight: '5px',
            }}
          />
        ) : (
          <AiOutlineUp
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bolder',
              marginRight: '5px',
            }}
          />
        )}
      </div>

      {/* options */}
      {active && <AreaDropDownMenu />}
    </>
  )
}

const AreaDropDownMenu = () => {
  // get current defualt dataTable
  const dispatch = useAppDispatch()

  const { name, dataTableArea } = useAppSelector((state) => state.area)
  // const {} = useAppSelector((state) => state.department)
  const { form } = useAppSelector((state) => state.locationDetail)

  const [areaName, setAreaName] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const debouncedText = useDebounce(searchText, 500)

  useEffect(() => {
    let dispatchPromiss: any = null
    if (debouncedText !== undefined && searchText !== undefined) {
      // console.log(`debounceText => ${debouncedText}`)
      defParams.locationId = form?.locationId!
      defParams.text = debouncedText

      dispatchPromiss = dispatch(fetchAreas(defParams))
    }

    return () => {
      // Calcel previous request because new keyword was update.
      // if (dispatchPromiss) {
      //   console.log('Abort previous for value', debouncedText)
      // }
      dispatchPromiss?.abort()
    }
  }, [debouncedText, dispatch])

  const handleSelectArea = (item: Area) => {
    // console.log(`selected area => ${item.name}`)
    // console.log(`from id =>${form?.areaId}`)
    // console.log(`selected id =>${item.id}`)
    if (form?.areaId !== item.id) {
      dispatch(setName(item.name))
      dispatch(setFormAreaId(item.id))
      // Call Department Fetch data by LocationId
      // defParamsDep.areaId = item.id
      const locationId = form?.locationId!
      dispatch(setDisabledDep(false))
      dispatch(fetchDepartments({ ...defParamsDep, locationId }))
    }
    dispatch(setAreaActive(false))
  }

  // const createArea = useCallback(async () => {
  //   console.log('coming create area call back')
  //   const data: AreaFormSchema = {
  //     name: areaName,
  //     locationId: form?.locationId!,
  //   }
  //   console.log(`create new area => ${JSON.stringify(data)}`)
  //   await dispatch(createArea(data))
  // }, [dispatch])

  const handleAddArea = () => {
    try {
      // console.log('coming create area...')
      const data: AreaFormSchema = {
        name: areaName,
        locationId: form?.locationId!,
      }
      // console.log(`create new area => ${JSON.stringify(data)}`)
      dispatch(createArea(data))
      // initialize
      setAreaName('')
    } catch (err) {}
  }
  // const searchOnChange = (e: any) => {
  //   console.log(e.target.value)
  //   defParams.locationId = form?.locationId
  //   defParams.text = e.target.value
  //   dispatch(fetchAreas(defParams))
  // }

  return (
    <div
      className='
          bg-white border border-1 rounded-lg mt-2
          flex flex-col '
    >
      {/* search */}
      <div className='m-3 h-[40px] flex items-center bg-[#ECF0F3] rounded-xl   pl-2'>
        <AiOutlineSearch size={20} />
        <input
          type='text'
          name='search'
          id='search'
          placeholder='Search area'
          className='bg-[#ECF0F3] w-full h-full ml-2 focus:outline-none rounded-xl '
          onChange={(e) => {
            setSearchText(e.target.value)
          }}
        />
      </div>
      {/* add new area */}
      <div className='flex flex-col'>
        {/* add button */}
        <button
          type='button'
          className='text-gray-400 rounded-md ml-3 w-[100px] h-[50px] text-sm
          flex justify-start items-center  '
          disabled={areaName ? false : true}
          onClick={() => {
            handleAddArea()
          }}
        >
          <GrAdd size={15} />
          <span className='ml-2 hover:text-[gray] '>Add Area</span>
        </button>
      </div>
      <div className='ml-4 mb-2'>
        <input
          type='text'
          placeholder='Enter New Area'
          className='bg w-full h-[30px]  
          focus:outline-none text-green-600  border-b-2 '
          value={areaName}
          onChange={(e) => {
            setAreaName(e.target.value)
          }}
        />
      </div>

      {/* datas */}
      <ul
        className='py-1 text-sm text-gray-700
         overflow-y-auto h-[100px]
        '
      >
        {/* reset */}
        <li
          key={999}
          className='block py-2 px-4 hover:bg-gray-100'
          onClick={() => {
            handleSelectArea({ id: 0, name: 'Choose a area' })
          }}
        >
          <span>Reset</span>
        </li>
        {dataTableArea &&
          dataTableArea.map((item) => (
            <li
              key={item.id}
              className='block py-2 px-4 hover:bg-gray-100'
              onClick={() => {
                handleSelectArea(item)
              }}
            >
              <span> {item.name}</span>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default AreaDropdown
