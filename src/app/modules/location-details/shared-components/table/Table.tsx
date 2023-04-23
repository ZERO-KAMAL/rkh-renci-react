import { Checkbox, TableSortLabel } from '@mui/material'
import LimitWithPagination from 'app/components/LimitWithPagination'
import Loading from 'app/components/Loading'
import { FC, useEffect, useState } from 'react'

import { HeaderList } from '../../location/model/tableHeader'
import Searchbar from './Searchbar'

interface Props {
  headers: any[]
  dataTable: any[]
  isFetching: boolean
  counts: number
  limit: number
  page: number
  sortBy: string | null
  sortDir: 'asc' | 'desc' | undefined
  canEdit: boolean
  canDelete: boolean

  setPage: (page: number) => void
  setLimit: (limit: number) => void
  setSortBy: (sortBy: string) => void
  onEdit: (data: any) => void
  onDelete: (ids: number[]) => void
  setSearchText: (text: string) => void
}

const Table: FC<Props> = (props: Props) => {
  const {
    headers,
    dataTable,
    isFetching,
    counts,
    limit,
    page,
    sortBy,
    sortDir,
    canEdit,
    canDelete,
    setPage,
    setLimit,
    setSortBy,
    onEdit,
    onDelete,
    setSearchText,
  } = props

  const [selectedFormId, setSelectedFormId] = useState<number[]>([])
  const selectAll = (e: any) => {
    if (e.target.checked) setSelectedFormId(dataTable.map((a: any) => a.id))
    else setSelectedFormId([])
  }

  const checkOnChange = (id: number) => {
    if (selectedFormId?.includes(id)) {
      setSelectedFormId(selectedFormId?.filter((itemId) => itemId !== id))
    } else {
      setSelectedFormId([...selectedFormId, id])
    }
  }

  useEffect(() => {
    console.log('selectedFormId: ', selectedFormId)
  }, [selectedFormId])

  return (
    <div className='w-full h-auto bg-white mt-4 p-[24px] rounded-xl max-md:overflow-auto'>
      <Searchbar
        selectedFormId={selectedFormId}
        setSearchText={setSearchText}
        showDeleteBtn={selectedFormId.length > 0 && props.canDelete}
        onDelete={onDelete}
      />
      <table className='table-auto w-full bg-transparent text-left'>
        <thead className='bg-[#F5F8FA] border-y'>
          <tr className='text-gray-600 text-sm font-md leading-normal'>
            <th className='px-3 text-left w-20'>
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
                  selectedFormId?.length === dataTable?.length && selectedFormId.length !== 0
                }
              />
            </th>
            {headers?.map((filed: HeaderList, index) => {
              if (filed.sorting) {
                return (
                  <th className='py-3 px-2 text-left font-semibold whitespace-nowrap' key={index}>
                    <TableSortLabel
                      active={sortBy === filed.id}
                      direction={sortBy === filed.id ? sortDir : 'asc'}
                      onClick={() => {
                        setSortBy(filed.id as string)
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
            <th className='py-3 px-2 text-left w-24'></th>
          </tr>
        </thead>

        {/* // bg-white text-base font-md text-gray-600 font-normal */}
        <tbody className='text-gray-600 text-sm font-md '>
          {dataTable &&
            dataTable.map((data: any) => {
              return (
                <tr className='text-sm font-md text-gray-600 border-b' key={data.id}>
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
                  {headers.map((header: any) => {
                    return (
                      <td className='text-left py-3 px-2' key={header.id}>
                        {data[header.id]}
                      </td>
                    )
                  })}
                  {(props.canEdit || props.canDelete) && (
                    <td className='py-3 px-2 text-center'>
                      <div className='flex item-center justify-start'>
                        {/* Edit */}
                        {props.canEdit && (
                          <div
                            className='w-4 mr-4 transform hover:text-green-900 hover:scale-110 text-green-700'
                            onClick={() => onEdit(data)}
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
                        {props.canDelete && (
                          <div
                            className='w-4 mr-4 transform hover:text-green-900 hover:scale-110 text-green-700'
                            onClick={() => onDelete([data.id])}
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
            })}
        </tbody>
      </table>
      {isFetching && <Loading />}
      <div className='mt-4'>
        <LimitWithPagination
          limit={limit}
          setLimit={(v) => setLimit(v)}
          pageCount={Math.ceil(counts / limit) === 0 ? 1 : Math.ceil(counts / limit)}
          page={page}
          setPage={(v) => setPage(v)}
        />
      </div>
    </div>
  )
}

export default Table
