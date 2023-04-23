import { TableSortLabel } from '@mui/material'
import { MODULES } from 'app/constants/module-permission'
import { LocationDetailStructure } from 'app/http/location-datas/locationDetail.model'
import {
  deleteAllLocationDetails,
  fetchLocationDetails,
  setEditData,
  setItemIdForUpdate,
  setOrder,
  setSelectedAll,
  setSelectedById,
} from 'app/http/location-datas/locationDetailSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import React, { useCallback, useEffect } from 'react'
import Swal from 'sweetalert2'

import Loading from '../component/Loading'

const LocationTable = () => {
  const tableHeaderList = [
    {
      id: 'locationId',
      lable: 'Location',
      sorting: true,
    },
    {
      id: 'areaId',
      lable: 'Area',
      sorting: true,
    },
    {
      id: 'departmentId',
      lable: 'Department',
      sorting: true,
    },
    {
      id: 'address',
      lable: 'Address',
      sorting: false,
    },
  ]

  const { dataTable, page, limit, locationId, text, order, loading, selected, selectedAll } =
    useAppSelector((state) => state.locationDetail)
  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  const canEditLocations = Boolean(
    permissions.find((a) => a.code === MODULES.SetupLocationEditFunc.code)
  )

  const canDeleteLocations = Boolean(
    permissions.find((a) => a.code === MODULES.SetupLocationDeleteFunc.code)
  )

  const dispatch = useAppDispatch()
  const initFetch = useCallback(async () => {
    await dispatch(
      fetchLocationDetails({
        page,
        limit,
        locationId,
        text,
        order,
      })
    )
  }, [page, limit, locationId, text, order])

  useEffect(() => {
    // fetch loation detail
    // console.log('fetch location details')
    initFetch()
  }, [dispatch, text, locationId, page, limit, order])

  // Actions
  const editOnClick = (data: LocationDetailStructure) => {
    dispatch(setEditData(data))
    dispatch(setItemIdForUpdate(null))
  }
  const deleteOnClick = (id: number) => {
    // console.log(`delete id => ${id}`)
    Swal.fire({
      title: ' </br>Are you sure you’d like to delete these location data?',

      text: 'This action cannot be undone, so please be sure before proceeding.',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'green',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Go Back',
      reverseButtons: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAllLocationDetails([id])).then((response) => {
          const status = response.meta.requestStatus
          if (status === 'rejected') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response?.payload?.data?.message || 'Something went wrong!',
            })
          } else if (status === 'fulfilled') {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
          }
        })
      }
    })
  }

  return (
    <div className=' mt-4'>
      {loading && <Loading />}

      {/* <h1 className='text-black text-3xl font-bold '> Table UI</h1> */}

      <div className='bg-white  rounded my-6'>
        <table className='w-full table-auto bg-[#F5F8FA]'>
          {/* Table Header */}
          <thead>
            <tr className='bg-[##FFFFFF] text-gray-600 uppercase text-sm leading-normal '>
              {/* select all toggle */}
              <th className='py-3 px-0  text-left'>
                <input
                  type='checkbox'
                  className='w-5 h-5 ml-4 '
                  checked={selectedAll}
                  onChange={() => dispatch(setSelectedAll(!selectedAll))}
                />
              </th>
              {tableHeaderList.map((data: any, index: number) => {
                if (data.sorting) {
                  return (
                    <th className='py-3 px-6 text-left' key={index}>
                      <TableSortLabel
                        active={order.sortBy === data.id}
                        direction={order.sortDir}
                        onClick={() => {
                          dispatch(
                            setOrder({
                              sortDir: order.sortDir == 'asc' ? 'desc' : 'asc',
                              sortBy: data.id,
                            })
                          )
                        }}
                      >
                        {data.lable}
                      </TableSortLabel>
                    </th>
                  )
                } else {
                  return (
                    <th className='py-3 px-6 text-left' key={index}>
                      {data.lable}
                    </th>
                  )
                }
              })}
              {/* <th className='py-3 px-6 text-left'>Location</th>
              <th className='py-3 px-6 text-left'>Area</th>
              <th className='py-3 px-6 text-center'>Department</th>
              <th className='py-3 px-6 text-center'>Address</th> */}
              {(canEditLocations || canDeleteLocations) && (
                <th className='py-3 px-6 text-center'></th>
              )}
            </tr>
          </thead>
          {/* Table Body */}
          <tbody className='text-gray-600 text-sm font-light'>
            {dataTable?.map((row: LocationDetailStructure, index: number) => {
              return (
                <tr key={index} className='border-b border-gray-200 hover:bg-gray-100'>
                  {/* toggle */}
                  <td className='py-3 px-0  text-left '>
                    <input
                      type='checkbox'
                      className='w-5 h-5 ml-4'
                      checked={selected.includes(row.id)}
                      onChange={() => dispatch(setSelectedById(row.id))}
                    />
                  </td>
                  {/* Location */}
                  <td className='py-3 px-6 text-left whitespace-nowrap'>
                    <div className=''>
                      <span className='font-medium'>{row.locationName}</span>
                    </div>
                  </td>
                  {/* Aread */}
                  <td className='py-3 px-6 text-left'>
                    <div className=''>
                      <span className='font-medium'>{row.areaName}</span>
                    </div>
                  </td>
                  {/* Department */}
                  <td className='py-3 px-6 text-left'>
                    <div className=''>
                      <span className='font-medium'>{row.departmentName}</span>
                    </div>
                  </td>
                  {/* Address */}
                  <td className='py-3 px-6 text-left'>
                    <div className=''>
                      <span className='font-medium'>{row.address}</span>
                    </div>
                  </td>
                  {/* Action */}
                  {(canEditLocations || canDeleteLocations) && (
                    <td className='py-3 px-6 text-center'>
                      <div className='flex items-center justify-center'>
                        {/* Edit */}
                        {canEditLocations && (
                          <div
                            className='w-4 mr-4 transform hover:text-green-900 hover:scale-110 text-green-700'
                            onClick={() => editOnClick(row)}
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
                        {canDeleteLocations && (
                          <div
                            className='w-4 mr-4 transform hover:text-green-900 hover:scale-110 text-green-700'
                            onClick={() => deleteOnClick(row.id)}
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
      </div>
    </div>
  )
}

export default LocationTable
