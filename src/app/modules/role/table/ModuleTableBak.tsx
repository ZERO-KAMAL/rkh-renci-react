import { Button } from '@mui/material'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import { RolePermission } from '../../../http/roles-modules/roleModule.model'
import {
  createRolePermission,
  defParamsPermission,
  fetchPermission,
  setRoleAction,
  setSelectedById,
} from '../../../http/roles-modules/roleModuleSlice'
import IOSSwitch from '../component/Switch'

const ModuleTable = () => {
  console.log(`Module Table rendering.....`)

  const dispatch = useAppDispatch()
  const { roleId, roleName, permissionDataTable, selected } = useAppSelector(
    (state) => state.roleModule
  )

  const initFetch = useCallback(async () => {
    dispatch(fetchPermission(defParamsPermission))
  }, [])

  useEffect(() => {
    initFetch()
  }, [])

  // Action
  const saveOnClick = () => {
    const data: RolePermission = { roleId: roleId, permissionIds: selected }
    dispatch(createRolePermission(data)).then((data) => {
      // console.log(`data => ${JSON.stringify(data)}`)
      if (data.meta.requestStatus === 'fulfilled') {
        toast.success('Saving Successful', {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else {
        toast.error('Something was wrong.', {
          position: toast.POSITION.TOP_RIGHT,
        })
      }
    })
  }

  // useEffect(() => {
  //   console.log('permissionDataTable: ', permissionDataTable)
  //   console.log('ids: ', permissionDataTable?.map(item => item.id))
  // }, [permissionDataTable])

  const handleClick = () => {
    const getBracketsRegex = /\((.*?)\)/
    const permissionDt = _.cloneDeep(permissionDataTable)

    const result = _(permissionDt)
      .groupBy('module')
      .map((value, key) => {
        return {
          module: key,
          // id: value[0].id,
          items: _(value)
            .groupBy('name')
            .map((value, key) => {
              return {
                name: key,
                // id: value[0].id,
                items: _(value)
                  .groupBy('description')
                  .map((value, key) => {
                    return {
                      description: key,
                      id: value[0].id,
                    }
                  })
                  .value(),
              }
            })
            .value(),
        }
      })
      .value()

    // console.log('result: ', result)
  }

  return (
    <div className='bg-white shadow-md rounded  p-5 mt-5'>
      <span className='font-medium'>{roleName}</span>
      <Button type='button' onClick={handleClick}>
        Console Log
      </Button>
      <div className='bg-white  rounded my-6 '>
        <table className='min-w-max w-full table-auto'>
          {/* Table Body */}
          <tbody className='text-gray-600 text-sm font-light'>
            {permissionDataTable &&
              permissionDataTable.map((row) => {
                return (
                  <tr className='border-b border-gray-200' key={row.id}>
                    <td className='py-3  text-left flex  justify-between items-center'>
                      <div className='flex flex-col'>
                        <span className='text-sm font-bold'>{row.name}</span>
                        <span className='text-sm text-gray-400'>{row.description}</span>
                      </div>

                      <IOSSwitch
                        sx={{ m: 1 }}
                        defaultChecked={selected.includes(row.id)}
                        // defaultChecked
                        onChange={() => dispatch(setSelectedById(row.id))}
                      />
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        {/* Action Button */}
        <div className='flex justify-end items-center mt-3'>
          <button
            type='button'
            className='text-gray-300 hover:text-gray-600 hover:font-bold '
            onClick={() => dispatch(setRoleAction(true))}
          >
            Discard
          </button>
          <button
            type='submit'
            className='bg-[#2BA579] p-1 text-white rounded-md ml-3 
                     disabled:opacity-50'
            onClick={() => saveOnClick()}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModuleTable
