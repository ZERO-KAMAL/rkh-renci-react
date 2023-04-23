import ModuleHeader from 'app/components/ModuleHeader'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useEffect } from 'react'

import { setRoleAction } from '../../http/roles-modules/roleModuleSlice'
import RoleHeader from './component/RoleHeader'
import PermissionTableWrapper from './permission/PermissionTableWrapper'
import PermissionTable from './permissionOld/PermissionTableWrapper'
import RoleTableWrapper from './table/RoleTableWrapper'

const Role = () => {
  const { roleActive } = useAppSelector((state) => state.roleModule)
  const dispatch = useAppDispatch()
  useEffect(() => {
    return () => {
      dispatch(setRoleAction(true))
    }
  }, [])

  return (
    <div className='max-w-[1120px] w-full mx-auto mt-4'>
      {/* header */}
      {roleActive && <ModuleHeader header='Roles and Modules' />}
      {/* table */}
      {roleActive && <RoleTableWrapper />}
      {/* {!roleActive && <PermissionTable />} */}
      {!roleActive && <PermissionTableWrapper />}
    </div>
  )
}

export default Role
