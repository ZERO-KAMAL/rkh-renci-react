import { Department, DepartmentFormSchema } from 'app/http/departments/department.model'
import {
  createDepartment,
  defParamsDep,
  fetchDepartments,
  setActiveDep,
  setDisabledDep,
  setNameDep,
} from 'app/http/departments/departmentSlice'
import {
  setFormAreaId,
  setFormDepartmentId,
  setFormLocationId,
} from 'app/http/location-datas/locationDetailSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import React, { useEffect, useState } from 'react'
import { AiOutlineDown, AiOutlineSearch, AiOutlineUp } from 'react-icons/ai'
import { GrAdd } from 'react-icons/gr'
import { useDebounce } from 'usehooks-ts'

const DepartmentDropdown = () => {
  // const [active, setActive] = useState(false);
  const { editData } = useAppSelector((state) => state.locationDetail)
  const { disabledDep, activeDep, name } = useAppSelector((state) => state.department)
  const dispatch = useAppDispatch()

  useEffect(() => {
    // check editData not null
    if (editData) dispatch(setNameDep(editData.departmentName))
    // dispatch(setDisabled(false))
  }, [])

  return (
    <>
      <div
        className='w-full h-10  rounded-lg  pl-3 flex justify-between  items-center  
                    bg-gray-50 border border-gray-300 text-gray-900 text-sm'
        onClick={() => {
          if (!disabledDep) dispatch(setActiveDep(!activeDep))
          // else  {
          //   dispatch(setActiveDep(false))
          // }
        }}
      >
        {/* name from area */}
        {/* <span>{editData ? editData.areaName : name}</span> */}
        <span> {name} </span>
        {!activeDep ? (
          <AiOutlineDown
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bolder',
              fontSize: '3px',
              marginRight: '5px',
            }}
          />
        ) : (
          <AiOutlineUp
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bolder',
              fontSize: '3px',
              marginRight: '5px',
            }}
          />
        )}
      </div>
      {/* options */}
      {activeDep && <DepartmentDropDownMenu />}
    </>
  )
}

const DepartmentDropDownMenu = () => {
  // get current defualt dataTable
  const dispatch = useAppDispatch()
  const { name, activeDep, dataTableDep } = useAppSelector((state) => state.department)
  const { form } = useAppSelector((state) => state.locationDetail)
  const [departmentName, setDepartmentName] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')
  const debouncedText = useDebounce(searchText, 500)

  useEffect(() => {
    if (debouncedText !== undefined && searchText !== undefined) {
      // console.log(`debounceText => ${debouncedText}`)
      // defParamsDep.areaId = form?.areaId!
      defParamsDep.locationId = form?.locationId!
      defParamsDep.text = debouncedText
      dispatch(fetchDepartments(defParamsDep))
    }
  }, [debouncedText])

  const handleSelectDepartment = (item: Department) => {
    // console.log(`selected department => ${item.name}`)
    // console.log(`from id =>${form?.departmentId}`)
    // console.log(`selected id =>${item.id}`)
    if (form?.departmentId !== item.id) {
      dispatch(setNameDep(item.name))
      dispatch(setFormDepartmentId(item.id))
    }
    if (activeDep) dispatch(setActiveDep(false))
  }
  const handleAddDepartment = () => {
    try {
      // console.log('coming create department...')
      const data: DepartmentFormSchema = {
        name: departmentName,
        locationId: form?.locationId!,
      }
      // console.log(`create new department => ${JSON.stringify(data)}`)
      dispatch(createDepartment(data))
      // initialize
      setDepartmentName('')
    } catch (err) {}
  }

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
          placeholder='Search department'
          className='bg-[#ECF0F3] w-full h-full ml-2 focus:outline-none rounded-xl '
          onChange={(e) => {
            setSearchText(e.target.value)
          }}
        />
      </div>
      {/* add new department */}
      <div className='flex flex-col'>
        {/* add button */}
        <button
          type='button'
          className='text-gray-400 rounded-md ml-3 w-[200px] h-[50px] text-sm
          flex justify-start items-center  '
          disabled={departmentName ? false : true}
          onClick={() => {
            handleAddDepartment()
          }}
        >
          <GrAdd size={15} />
          <span className='ml-2 hover:text-[gray] '>Add Department</span>
        </button>
      </div>
      <div className='ml-4 mb-2'>
        <input
          type='text'
          value={departmentName}
          placeholder='Enter New Department'
          className='bg w-full h-[30px]  
          focus:outline-none text-green-600  border-b-2 '
          onChange={(e) => {
            setDepartmentName(e.target.value)
          }}
        />
      </div>

      {/* datas */}
      <ul
        className='py-1 text-sm text-gray-700
         overflow-y-auto h-[100px]
        '
      >
         <li
              key={999}
              className='block py-2 px-4 hover:bg-gray-100'
              onClick={() => {
                handleSelectDepartment({id: 0 , name : "Choose a department"})
              }}
            >
              <span>Reset</span>
            </li>
        {dataTableDep &&
          dataTableDep.map((item: any) => (
            <li
              key={item.id}
              className='block py-2 px-4 hover:bg-gray-100'
              onClick={() => {
                handleSelectDepartment(item)
              }}
            >
              <span> {item.name}</span>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default DepartmentDropdown
