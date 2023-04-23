import { Button, Checkbox, TableSortLabel } from '@mui/material'
import LimitWithPagination from 'app/components/LimitWithPagination'
import Loading from 'app/components/Loading'
import { MODULES } from 'app/constants/module-permission'
import { setDeleteStatus, setLimit, setPage, setSelected } from 'app/http/feedback-form/feedBackFormSlice'
import { setOrder } from 'app/http/feedbacks/feedBackSlice'
import { useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import DeleteDialog from './DeleteDialog'
import FormDetails from './FormDetails'
import FormOptions from './FormOptions'

const tableHeaderList = [
  {
    id: 'title',
    lable: 'Form Title',
    sorting: true,
  },
  {
    id: 'locationName',
    lable: 'Location',
    sorting: true,
  },
  {
    id: 'area',
    lable: 'Area',
    sorting: false,
  },
  {
    id: 'department',
    lable: 'Department',
    sorting: false,
  },
  {
    id: 'createdAt',
    lable: 'Date Created',
    sorting: true,
  },
]

interface Props {
  sortDir: any
  sortBy: any
  readOnly?: boolean
  setSortOrder: (v: any) => void
}

const FormsTable: React.FC<Props> = ({ sortDir, sortBy, readOnly, setSortOrder }) => {
  const { page, limit, counts, dataTableFeedbackForm, loadingFeedbackForm, deleteStatus } =
    useAppSelector((state) => state.feedbackForm)
  const dispatch = useDispatch()
  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)
  const [menuId, setMenuId] = useState<number | null>(null)
  const [formId, setFormId] = useState<number | null>(null)
  const [deleteFormId, setDeleteFormId] = useState<Array<number> | undefined>(undefined)
  const [selectedFormId, setSelectedFormId] = useState<any>([])

  // Forms module permission
  const canFormAddEdit = Boolean(permissions.find((a) => a.code === MODULES.FormsEditFunc.code))
  const canFormDelete = Boolean(permissions.find((a) => a.code === MODULES.FormsDeleteFunc.code))

  const selectAll = (e: any) => {
    if (e.target.checked) setSelectedFormId(dataTableFeedbackForm.map((a: any) => a.id))
    else setSelectedFormId([])
  }
  const checkOnChange = (id: number) => {
    if (selectedFormId?.includes(id)) {
      // setSelectedFormId(selectedFormId?.splice(selectedFormId?.indexOf(id), 1))
      setSelectedFormId(selectedFormId?.filter((itemId: any) => itemId !== id))
    } else {
      setSelectedFormId([...selectedFormId, id])
    }
  }
  useEffect(() => {
    if (deleteStatus === 'success') {
      setSelectedFormId([])
    }
  }, [deleteStatus])

  useEffect(() => {
    if (!dataTableFeedbackForm.length) return
    const formIds = dataTableFeedbackForm.filter((item) => selectedFormId.includes(item!.id))
    dispatch(setSelected(formIds))
  }, [selectedFormId])

  return (
    <div className={`w-full h-auto bg-white mt-4 p-[24px] rounded-xl max-md:overflow-auto`}>
      {!readOnly && (
        <div className='w-full h-[52px] flex items-start justify-end'>
          {!readOnly && canFormDelete && selectedFormId.length !== 0 && (
            <Button
              variant='contained'
              className='bg-[#F1416C] hover:bg-[#F1416C] focus:bg-[#F1416C] normal-case'
              onClick={() => setDeleteFormId(selectedFormId)}
            >
              Delete Selected
            </Button>
          )}
        </div>
      )}
      <table className='table-auto w-full bg-transparent text-left'>
        <thead className='bg-[#F5F8FA] border-y'>
          <tr className='text-[#3F4254] font-medium text-base leading-normal'>
            <th className='py-3 px-3 text-left'>
              <Checkbox
                color='success'
                sx={{
                  color: '#A1A5B7',
                  '&.Mui-checked': {
                    color: '#2BA579',
                  },
                }}
                onChange={selectAll}
                checked={
                  selectedFormId?.length === dataTableFeedbackForm?.length &&
                  selectedFormId.length !== 0
                }
              />
            </th>
            {tableHeaderList.map((data: any, index: number) => {
              if (data.sorting) {
                return (
                  <th className='py-3 px-2 text-left ' key={index}>
                    <TableSortLabel
                      active={sortBy === data.id}
                      direction={sortDir}
                      sx={{ whiteSpace: 'nowrap' }}
                      onClick={() => {
                        setSortOrder({
                          sortDir: sortDir === 'asc' ? 'desc' : 'asc',
                          sortBy: data.id,
                        })
                      }}
                    >
                      {data.lable}
                    </TableSortLabel>
                  </th>
                )
              } else
                return (
                  <th className='py-3 px-2 text-left whitespace-nowrap' key={index}>
                    {' '}
                    {data.lable}{' '}
                  </th>
                )
            })}
            <th className='py-3 px-2 text-left'></th>
          </tr>
        </thead>
        <tbody className='text-gray-600 text-sm font-light'>
          {dataTableFeedbackForm &&
            dataTableFeedbackForm.map((data: any) => {
              return (
                <tr className='text-[#7E8299] text-base font-medium border-b' key={data.id}>
                  <td className='pl-3'>
                    <Checkbox
                      color='success'
                      sx={{
                        color: '#A1A5B7',
                        '&.Mui-checked': {
                          color: '#2BA579',
                        },
                      }}
                      onChange={() => checkOnChange(data.id)}
                      checked={selectedFormId ? selectedFormId?.includes(data.id) : false}
                    />
                  </td>
                  <td className='text-left py-3 px-2'>{data.title}</td>
                  <td className='text-left py-3 px-2'>{data.location}</td>
                  <td className='text-left py-3 px-2'>{data.area}</td>
                  <td className='text-left py-3 px-2'>{data.department}</td>
                  <td className='text-left py-3 px-2'>{data.createdDate}</td>
                  {!readOnly && (
                    <td className='text-left py-3 pr-3'>
                      <FormOptions
                        canFormDelete={canFormDelete}
                        canFormAddEdit={canFormAddEdit}
                        open={menuId === data.id}
                        onClick={() => setMenuId((prev) => (prev === data.id ? null : data.id))}
                        viewDetails={() => {
                          setFormId(data.id)
                          setMenuId(null)
                        }}
                        editClicked={() => useHistory.replace(`/forms/edit/${data.id}`)}
                        deleteClicked={() => {
                          setDeleteFormId([data.id])
                          setMenuId(null)
                        }}
                      />
                    </td>
                  )}
                </tr>
              )
            })}
        </tbody>
      </table>
      {loadingFeedbackForm && <Loading />}
      <div className='mt-4'>
        <LimitWithPagination
          limit={limit}
          setLimit={(v) => {
            dispatch(setLimit(v))
            dispatch(setPage(1))
          }}
          pageCount={Math.ceil(counts / limit) === 0 ? 1 : Math.ceil(counts / limit)}
          page={page}
          setPage={(v) => dispatch(setPage(v))}
        />
      </div>
      <FormDetails open={formId !== null} handleClose={() => setFormId(null)} formId={formId} />
      <DeleteDialog
        open={!!deleteFormId}
        handleClose={() => {
          setDeleteFormId(undefined)
          setTimeout(() => {
            dispatch(setDeleteStatus(''))
          }, 500)
        }}
        formId={deleteFormId}
        multiple
      />
    </div>
  )
}

export default FormsTable
