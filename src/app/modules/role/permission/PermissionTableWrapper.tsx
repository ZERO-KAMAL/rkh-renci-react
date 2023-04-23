import { LoadingButton } from '@mui/lab'
import { Switch } from '@mui/material'
import BackIconButton from 'app/components/button/BackIconButton'
import { MODULES, SUPERADMIN_ID } from 'app/constants/module-permission'
import { PERMISSIONS, Permission, SubModule } from 'app/constants/module-setupPermission'
import { RolePermission } from 'app/http/roles-modules/roleModule.model'
import {
  createRolePermission,
  defParamsPermission,
  fetchPermission,
  setRoleAction,
} from 'app/http/roles-modules/roleModuleSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import _ from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

import MainMenu from './MainMenu'
import PermissionCard from './PermissionCard'
import SubMenu from './SubMenu'

const PermissionTableWrapper = () => {
  const [permission, setPermission] = useState<string[]>([])

  const dispatch = useAppDispatch()

  const { roleId, roleName, permissionDataTable, selected } = useAppSelector(
    (state) => state.roleModule
  )

  const { permissions, id } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  const canEditRoles = Boolean(
    permissions.find((a) => a.code === MODULES.SetupRolesAndModulesEditFunc.code)
  ) || id === 1

  const initFetch = useCallback(async () => {
    dispatch(fetchPermission(defParamsPermission))
  }, [])

  useEffect(() => {
    initFetch()
  }, [])

  useEffect(() => {
    const selectedPerm = permissionDataTable
      .filter((item) => selected.includes(item.id))
      .map((item) => item.code)
    setPermission(selectedPerm)
  }, [permissionDataTable])

  const handleSelectAll = (selectedItems: string[]) => {
    const remove = selectedItems.every((item) => permission.includes(item))
    selectedItems.forEach((selected) => {
      if (remove) {
        setPermission((prevState) => prevState.filter((permission) => permission != selected))
      } else {
        setPermission((prevState) => [...prevState, selected])
      }
    })
  }

  const handleSelect = (selectedItems: string[]) => {
    selectedItems.forEach((selected) => {
      if (permission.includes(selected)) {
        setPermission((prevState) => prevState.filter((permission) => permission != selected))
      } else {
        setPermission((prevState) => [...prevState, selected])
      }
    })
  }

  const saveOnClick = () => {
    const selectedIds = permissionDataTable
      .filter((item) => permission.includes(item.code))
      .map((item) => item.id)
    if (roleId === SUPERADMIN_ID && selectedIds.length === 0) {
      toast.error('You are not allowed to turn off all permissions of superadmin!')
      return
    }
    const data: RolePermission = { roleId: roleId, permissionIds: selectedIds }
    dispatch(createRolePermission(data)).then((data) => {
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

  useEffect(() => {
    console.log('permission: ', permission)
  }, [permission])

  return (
    <>
      <BackIconButton
        onClick={() => {
          dispatch(setRoleAction(true))
        }}
        iconSize={'22px'}
        iconColor={'#1BC5BD'}
        textSize={'20px'}
      />
      <div className='flex justify-between ml-0 md:ml-8 mt-8 flex-wrap'>
        <div>
          <span className='text-gray-800 text-lg font-semibold'>{roleName}</span>
          <Switch
            disabled={!canEditRoles}
            checked={permissionDataTable
              .map((item) => item.code)
              .some((item) => permission.includes(item))}
            onChange={(e) => handleSelectAll(permissionDataTable.map((item) => item.code))}
            inputProps={{ 'aria-label': 'controlled' }}
            size='medium'
            // className='mr-3'
          />
        </div>
        {canEditRoles && (
          <LoadingButton
            variant='contained'
            className='bg-skin-navbar hover:bg-skin-navbar focus:bg-skin-navbar normal-case ml-auto'
            onClick={() => saveOnClick()}
            loading={false}
            loadingPosition='center'
          >
            Save Changes
          </LoadingButton>
        )}
      </div>

      {roleId === SUPERADMIN_ID && (
        <p className='ml-0 md:ml-8 text-[#7E8299] font-medium pt-4 md:pt-0'>
          Superadmins are allowed to see all pages regardless of permissions
        </p>
      )}
      <span className='border-b border-gray-600' />

      {PERMISSIONS.map((perm: Permission, idx: any) => (
        <div key={idx}>
          <MainMenu
            title={perm.module}
            imgSrc={''}
            disabled={!canEditRoles}
            checked={perm.items
              .concat(perm.subModule.flatMap((x) => x.items))
              .some((item) => permission.includes(item))}
            onChecked={() => {
              const modules = perm.items
              const subModules = perm.subModule.flatMap((x) => x.items) as string[]
              handleSelectAll(modules.concat(subModules))
            }}
          >
            {/* no submodules, note: permission card is reused */}
            {perm.items.map((moduleCode: string, idx: any) => (
              <PermissionCard
                title={
                  permissionDataTable.find((item) => item.code === moduleCode)?.description ||
                  `${moduleCode} (DB Missing Module Code)`
                }
                disabled={!canEditRoles}
                checked={permission.includes(moduleCode)}
                onChecked={(e) => {
                  handleSelect([moduleCode])
                }}
              />
            ))}
            {/* with submodules, note: permission card is reused */}
            {perm.subModule.map((subModule: SubModule, idx: any) => (
              <>
                <SubMenu
                  title={subModule.name}
                  disabled={!canEditRoles}
                  checked={subModule.items.some((item) => permission.includes(item))}
                  onChecked={() => {
                    handleSelectAll(subModule.items)
                  }}
                >
                  {subModule.items.map((moduleCode: string, idx: any) => (
                    <PermissionCard
                      title={
                        permissionDataTable.find((item) => item.code === moduleCode)?.description ||
                        `${moduleCode} (DB Missing Module Code)`
                      }
                      disabled={!canEditRoles}
                      checked={permission.includes(moduleCode)}
                      onChecked={(e) => {
                        handleSelect([moduleCode])
                      }}
                    />
                  ))}
                </SubMenu>
                {idx !== perm.subModule.length - 1 && (
                  <div className='border-b bg-gray-200 my-4 ml-4'></div>
                )}
              </>
            ))}
          </MainMenu>
        </div>
      ))}
    </>
  )
}

export default PermissionTableWrapper
