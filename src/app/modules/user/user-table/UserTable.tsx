import { TableSortLabel, Tooltip } from '@mui/material'
import Loading from 'app/components/Loading'
import { MODULES } from 'app/constants/module-permission'
import UserConst from 'app/constants/user.const'
import { HeaderList, UserInfo, UserList, UserTableParams } from 'app/http/users/users.model'
import { useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import { FC, useEffect } from 'react'

interface Props {
  headerList: any[]
  onEdit: (item: any) => void
  onDelete: (id: number[]) => void

  tblOnSelect: (id: UserInfo) => void
  tblSetSelectAll: (ids: number[] | undefined) => void
  tblSortHandler: (sortBy: string) => void

  tblParams: UserTableParams

  usersTbl: UserList | undefined
  isLoading: boolean
}

const UserTable: FC<Props> = (props: Props) => {
  const { filterByRoleIds } = useAppSelector((state) => state.userTable)
  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  // Users module permission
  const canUsersEdit = Boolean(permissions.find((a) => a.code === MODULES.SetupUsersEditFunc.code))
  const canUsersDelete = Boolean(
    permissions.find((a) => a.code === MODULES.SetupUsersDeleteFunc.code)
  )

  const onSelectAll = () => {
    // console.log('handle select all: ', filterByRoleIds)
    if (!filterByRoleIds.length) {
      props.tblSetSelectAll([])
    } else {
      props.tblSetSelectAll(props.usersTbl?.rows?.map((item: any) => item.id))
    }
  }

  const truncate = (str: string, n: number) => {
    return str.length > n ? str.slice(0, n - 1) : str
  }

  return (
    <div id='users_table' className='overflow-auto'>
      <table className='table-auto w-full bg-transparent text-left'>
        {/* Table Header */}
        <thead className='bg-[#F5F8FA] border-y'>
          <tr className='text-gray-600 text-sm'>
            <th className='py-3 px-0 text-left'>
              <input
                id='checkbox'
                type='checkbox'
                className='w-5 h-5 ml-4'
                checked={props.tblParams.isAllSelected}
                onChange={onSelectAll}
              />
            </th>
            {props.headerList?.map((filed: HeaderList, index) => {
              if (filed.sorting) {
                return (
                  <th className='py-3 px-6 text-left font-semibold whitespace-nowrap' key={index}>
                    <TableSortLabel
                      active={props.tblParams.sortBy === filed.id}
                      direction={
                        props.tblParams.sortBy === filed.id ? props.tblParams.sortDir : 'asc'
                      }
                      onClick={() => {
                        props.tblSortHandler(filed.id as string)
                      }}
                    >
                      {filed.label}
                    </TableSortLabel>
                  </th>
                )
              } else {
                return (
                  <th key={index} className='py-3 px-6 text-left whitespace-nowrap font-semibold '>
                    {filed.label}
                  </th>
                )
              }
            })}
            {(canUsersEdit || canUsersDelete) && (
              <th className='min-w-150px font-semibold text-center'>Options</th>
            )}
          </tr>
        </thead>
        {/* begin::Table body */}
        <tbody className='bg-white text-sm font-md text-gray-600 '>
          {!props.isLoading ? (
            props.usersTbl &&
            props.usersTbl.rows.map((row: UserInfo, index: number) => {
              const isSuperadmin = row?.role?.code === UserConst.QSM_SUPERADMIN_CODE
              return (
                <tr key={index} className='border-b border-gray-200 hover:bg-gray-100'>
                  <td className='py-3 px-0 text-left'>
                    <input
                      type='checkbox'
                      className='w-5 h-5 ml-4'
                      checked={props.tblParams.selectedId.includes(row.id)}
                      onChange={() => props.tblOnSelect(row)}
                    />
                  </td>
                  <td className='py-3 px-6 text-left whitespace-nowrap'>
                    <div className='flex items-center'>
                      <span>
                        {row?.fullName
                          ? row?.fullName.length > 16
                            ? truncate(row.fullName, 16) + '...'
                            : row.fullName
                          : '-'}
                      </span>
                    </div>
                  </td>
                  <td className='py-3 px-6 text-left whitespace-nowrap'>
                    <div className='flex items-center'>
                      <span>{row.role?.name || '-'}</span>
                    </div>
                  </td>
                  <td className='py-3 px-6 text-left whitespace-nowrap'>
                    <div className='flex items-center'>
                      <span>
                        {row?.designation
                          ? row?.designation.length > 16
                            ? truncate(row.designation, 16) + '...'
                            : row.designation
                          : '-'}
                      </span>
                    </div>
                  </td>
                  <td className='py-3 px-6 text-left '>
                    {row?.locationDetailIds.length > 1 ? (
                      <Tooltip
                        title={
                          <>
                            {row?.locationDetailIds &&
                              row?.locationDetailIds.map((loc, idx) => (
                                <div className='flex flex-col' key={idx}>
                                  <span className='text-[#B5B5C3] text-sm font-bold'>
                                    {loc.location?.name}
                                  </span>
                                  <span className='text-[#B5B5C3] text-sm'>
                                    {loc.area?.name}
                                    <span className={clsx(!loc.department?.name && 'hidden')}>
                                      {' , '} {loc.department?.name}
                                    </span>
                                  </span>
                                </div>
                              ))}
                          </>
                        }
                      >
                        <div className='flex  gap-5'>
                          <div className='flex flex-col'>
                            <span className='text-[#7E8299]'>
                              {isSuperadmin
                                ? 'All Locations'
                                : row?.locationDetailIds[0]?.location?.name || ''}
                            </span>
                            <span className='text-[#B5B5C3] text-sm'>
                              {(!isSuperadmin && row?.locationDetailIds[0]?.area?.name) || ''}
                              {!isSuperadmin &&
                                row?.locationDetailIds[0]?.area?.name &&
                                row?.locationDetailIds[0]?.department?.name &&
                                ', '}
                              {(!isSuperadmin && row?.locationDetailIds[0]?.department?.name) || ''}
                            </span>
                            {/* <span className='text-[#B5B5C3]'>
                                {!isSuperadmin &&
                                  row?.locationDetailIds.length > 1 &&
                                  `multiple locations`}
                              </span> */}
                          </div>
                          <div
                            className='bg-[#E8FFF3] text-[#2BA579] 
                             w-[30px] h-[30px] rounded-md flex  font-bold items-center'
                          >
                            <span className='p-1'>
                              {'+'}
                              {row?.locationDetailIds.length - 1}
                            </span>
                          </div>
                        </div>
                      </Tooltip>
                    ) : (
                      <div className='flex flex-col'>
                        <span className='text-[#7E8299]'>
                          {isSuperadmin
                            ? 'All Locations'
                            : row?.locationDetailIds[0]?.location?.name || ''}
                        </span>
                        <span className='text-[#B5B5C3] text-sm'>
                          {(!isSuperadmin && row?.locationDetailIds[0]?.area?.name) || ''}
                          {!isSuperadmin &&
                            row?.locationDetailIds[0]?.area?.name &&
                            row?.locationDetailIds[0]?.department?.name &&
                            ', '}
                          {(!isSuperadmin && row?.locationDetailIds[0]?.department?.name) || ''}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Action */}
                  {(canUsersEdit || canUsersDelete) && (
                    <td className='py-3 px-6 text-center'>
                      <div className='flex item-center justify-center'>
                        {/* Edit */}
                        {canUsersEdit && (
                          <div
                            className='w-4 mr-4 transform hover:text-green-900 hover:scale-110 text-green-700'
                            onClick={() => props.onEdit(row)}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'
                              />
                            </svg>
                          </div>
                        )}

                        {/* Delete */}
                        {canUsersDelete && (
                          <div
                            className='w-4 mr-4 transform hover:text-green-900 hover:scale-110 text-green-700'
                            onClick={() => props.onDelete([row.id])}
                          >
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })
          ) : (
            <tr>
              <td>
                <Loading />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
