import LimitWithPagination from 'app/components/LimitWithPagination'
import { MODULES } from 'app/constants/module-permission'
import UserConst from 'app/constants/user.const'
import { defParamsRole, fetchRoles } from 'app/http/roles-modules/roleModuleSlice'
import { userTableSlice } from 'app/http/users/userTableSlice'
import { UserInfo, UserList } from 'app/http/users/users.model'
import UserService from 'app/http/users/usersService'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useCallback, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { toast } from 'react-toastify'
import { useDebounce } from 'usehooks-ts'

import DeleteDialog from '../../../components/dialog/DeleteDialog'
import Searchbar from './Searchbar'
import UserTable from './UserTable'

const UserTableWrapper = () => {
  const headerList = UserConst.HEADER_LIST
  const dispatch = useAppDispatch()
  const [searchText, setSearchText] = useState('')
  const debouncedText = useDebounce(searchText, 500)
  const { table, locationId, filterByRoleIds } = useAppSelector((state) => state.userTable)
  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)
  const canUsersDelete = Boolean(
    permissions.find((a) => a.code === MODULES.SetupUsersDeleteFunc.code)
  )

  // Fetch users table
  const {
    refetch: refetchUsers,
    data: usersTbl,
    isLoading,
  } = UserService.getByFilter(
    table,
    // Auto refetch dependencies
    [
      table.page,
      table.limit,
      table.sortBy,
      table.sortDir,
      debouncedText,
      locationId,
      filterByRoleIds,
    ],
    // Optional: Query params
    {
      text: debouncedText,
      locationId: locationId,
      roleIds: filterByRoleIds,
    }
  )

  // Fetch role tables once on mount
  const { dataTable: roleTbl } = useAppSelector((state) => state.roleModule)
  const initFetch = useCallback(async () => {
    await dispatch(fetchRoles(defParamsRole))
  }, [dispatch])
  useEffect(() => {
    initFetch()
  }, [])

  // Merge users and role table
  // We did not getByRoleId for each users
  const [usersRoleTbl, setUsersRoleTbl] = useState<UserList>()
  useEffect(() => {
    if (!roleTbl && !usersTbl) return
    if (!roleTbl) {
      setUsersRoleTbl(usersTbl?.data)
      return
    }
    const mergedUsers: UserInfo[] = []
    usersTbl?.data.rows.forEach((users) => {
      const role = roleTbl.find((role: any) => role.id === users.roleId)
      const userRow = { ...users }
      userRow.role = role
      mergedUsers.push(userRow)
    })
    setUsersRoleTbl({ count: usersTbl?.data.count || 0, rows: mergedUsers })
  }, [roleTbl, usersTbl])

  const onDelete = async (deletedIds: number[]) => {
    try {
      await UserService.deleteUser(deletedIds)
      toast.success('Deleted successfully')
      dispatch(
        userTableSlice.actions.tblSetSelectMulti({
          ids: table.selectedId.filter((itemId) => !deletedIds.includes(itemId)),
          toggleAllSelected: false,
        })
      )
      refetchUsers()
      return true
    } catch (err: any) {
      toast.error(`Error ${err?.status}! ${err?.data?.message}`)
    }
  }

  const onDeleteConfimDialog = (deletedIds: number[]) => {
    const node = ReactDOM.createRoot(document.createElement('div'))
    node.render(
      <DeleteDialog
        open={true}
        isLoading={false}
        onSubmit={() => {
          onDelete(deletedIds)
          node.unmount()
        }}
        onClose={() => node.unmount()}
      />
    )
    return () => {
      node.unmount()
    }
  }

  const onDeleteMultiple = () => {
    // console.log('handle delete: ', table.selectedId)
    onDeleteConfimDialog(table.selectedId)
  }

  const onEdit = (item: UserInfo) => {
    dispatch(
      userTableSlice.actions.setTable({
        modalData: item,
        showModal: true,
      })
    )
  }

  const onSearch = (text: string) => {
    setSearchText(text)
    dispatch(userTableSlice.actions.setTable({ page: 1 }))
  }

  return (
    <>
      <div
        id='tbl-container'
        className='flex flex-col justify-between h-full w-full my-auto overflow-hidden'
      >
        <div className='flex flex-col h-[calc(100%-3rem)] w-full bg-white rounded-lg'>
          <Searchbar
            canUsersDelete={canUsersDelete}
            setSearchText={onSearch}
            selectedRows={table.selectedId}
            onDeleteMultiple={onDeleteMultiple}
          />
          <hr id='line-break' className='h-px bg-gray-300 border-1'></hr>
          <UserTable
            headerList={headerList}
            onEdit={onEdit}
            onDelete={onDeleteConfimDialog}
            tblOnSelect={(id: UserInfo) => {
              dispatch(userTableSlice.actions.tblOnSelect(id))
            }}
            tblSetSelectAll={(ids: number[] | undefined) => {
              dispatch(
                userTableSlice.actions.tblSetSelectMulti({ ids: ids, toggleAllSelected: true })
              )
            }}
            tblSortHandler={(sortBy: string) => {
              dispatch(userTableSlice.actions.tblSortHandler(sortBy))
            }}
            usersTbl={usersRoleTbl}
            isLoading={isLoading}
            tblParams={table}
          />
        </div>
        <div className='pt-5 bg-white'>
          <LimitWithPagination
            limit={table.limit}
            setLimit={(newLimit) =>
              dispatch(userTableSlice.actions.setTable({ limit: newLimit, page: 1 }))
            }
            pageCount={
              usersRoleTbl
                ? Math.ceil(usersRoleTbl?.count / table.limit) === 0
                  ? 1
                  : Math.ceil(usersRoleTbl?.count / table.limit)
                : 0
            }
            page={table.page}
            setPage={(newPage) => {
              dispatch(userTableSlice.actions.setTable({ page: newPage }))
            }}
          />
        </div>
      </div>
    </>
  )
}

export default UserTableWrapper
