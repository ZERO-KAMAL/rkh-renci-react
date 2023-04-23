import { Checkbox } from '@mui/material'
import Loading from 'app/components/Loading'
import ReactIconBtn, { ColorsEnum } from 'app/components/button/ReactIconBtn'
import { FC, useEffect, useState } from 'react'

import { HeaderList } from '../model/tableHeader'

interface Props {
  headers: any[]
  dataTable: any
  isFetching: boolean
  canEditCategories: boolean
  canDeleteCategories: boolean

  onEdit: (data: any) => void
  onDelete: (ids: number[]) => void
}

const Table: FC<Props> = (props: Props) => {
  const {
    headers,
    dataTable,
    isFetching,

    onEdit,
    onDelete,
  } = props

  const [selectedFormId, setSelectedFormId] = useState<any[]>([])
  const selectAll = (e: any) => {
    if (e.target.checked) setSelectedFormId(dataTable.subCategories)
    else setSelectedFormId([])
  }

  const checkOnChange = (id: number) => {
    if (selectedFormId?.includes(id)) {
      setSelectedFormId(selectedFormId?.filter((itemId) => itemId !== id))
    } else {
      setSelectedFormId([...selectedFormId, id])
    }
  }

  return (
    <div className='w-full h-auto bg-white mt-4 p-1 md:p-[24px] rounded-xl max-md:overflow-auto'>
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
                  dataTable?.subCategories?.length > 0 &&
                  selectedFormId?.length === dataTable?.subCategories?.length
                }
              />
            </th>
            {headers?.map((filed: HeaderList, index) => {
              return (
                <th key={index} className='py-3 px-6 text-left whitespace-nowrap font-semibold '>
                  {filed.label}
                </th>
              )
            })}
            {selectedFormId?.length > 0 ? (
              <th className='py-3 px-6 text-left whitespace-nowrap font-semibold w-2'>
                <ReactIconBtn
                  name='Delete Selected'
                  bgColor={ColorsEnum.red}
                  onClick={() => {
                    props.onDelete(selectedFormId)
                  }}
                ></ReactIconBtn>
              </th>
            ) : (
              <th className='py-3 px-2 text-left w-24'></th>
            )}
          </tr>
        </thead>

        {/* // bg-white text-base font-md text-gray-600 font-normal */}
        <tbody className='text-gray-600 text-sm font-md '>
          {dataTable.subCategories &&
            dataTable.subCategories.map((data: any, index: number) => {
              return (
                <tr className='text-sm font-md text-gray-600 border-b' key={index}>
                  <td className='pl-3'>
                    <Checkbox
                      color='success'
                      sx={{
                        color: '#A1A5B7',
                        '&.Mui-checked': {
                          color: '#2BA579',
                        },
                      }}
                      onChange={() => checkOnChange(data)}
                      checked={selectedFormId ? selectedFormId?.includes(data) : false}
                    />
                  </td>
                  <td className='text-left py-3 px-6'>{data}</td>

                  <td className='py-3 px-2 text-center'>
                    <div className='flex item-center justify-end'>
                      {/* Edit */}
                      {props.canEditCategories && (
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
                      {props.canDeleteCategories && (
                        <div
                          className='w-4 mr-4 transform hover:text-green-900 hover:scale-110 text-green-700'
                          onClick={() => onDelete([data])}
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
                </tr>
              )
            })}
        </tbody>
      </table>
      {isFetching && <Loading />}
    </div>
  )
}

export default Table
