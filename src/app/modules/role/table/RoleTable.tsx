import { MODULES, SUPERADMIN_ID } from 'app/constants/module-permission'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useCallback, useEffect } from 'react'

import { Role } from '../../../http/roles-modules/roleModule.model'
import {
  defParamsRole,
  fetchRoles,
  setRoleAction,
  setRolePermission,
} from '../../../http/roles-modules/roleModuleSlice'
import Loading from '../../location/component/Loading'

const isProdEnv = import.meta.env.PROD

const RoleTable = () => {
  // console.log(`RoleTable rendering.....`)
  const dispatch = useAppDispatch()
  const { dataTable, loadingRole, text } = useAppSelector((state) => state.roleModule)
  const { permissions, id } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  const canEditRoles = Boolean(
    permissions.find((a) => a.code === MODULES.SetupRolesAndModulesEditFunc.code)
  )

  const initFetch = useCallback(async () => {
    await dispatch(fetchRoles(defParamsRole))
  }, [dispatch])

  useEffect(() => {
    // console.log('use effect .....')
    initFetch()
  }, [text])

  // Action
  const editOnClick = (data: Role) => {
    // console.log(`role edit click...`)
    const ids: Array<number> = data.permissions.map((p) => p.id)
    // console.log(`ids => ${ids}`)
    dispatch(setRolePermission({ roleId: data.id, roleName: data.name, permissions: ids }))
    dispatch(setRoleAction(false))
  }
  console.log('canEditRoles: ', canEditRoles)

  return (
    <div>
      <div className='bg-white  rounded my-6 '>
        <table className='min-w-max w-full table-auto'>
          {/* Table Body */}
          <tbody className='text-gray-600 text-sm font-light'>
            <tr className='border-b border-gray-200'>
              <td className='py-3 px-6 text-left flex  justify-between items-center'>
                <span className='font-bold text-lg'>Role</span>
              </td>
            </tr>
            {dataTable &&
              dataTable.map((row) => {
                return (
                  <tr className='border-b border-gray-200' key={row.id}>
                    <td className='py-3 px-6 text-left flex  justify-between items-center'>
                      <span className='font-medium'>{row.name}</span>
                      {/* {id === 1 && row.id !== 1 && ( */}
                      <button
                        className='bg-[#F5F8FA] hover:font-bold rounded-lg hover:bg-[#E8FFF3] w-[70px] h-[40px] '
                        onClick={() => editOnClick(row)}
                      >
                        {(canEditRoles || id === 1) ? 'Edit' : 'View'}
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
      {loadingRole && <Loading />}
    </div>
  )
}

export default RoleTable
