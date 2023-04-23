import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { setLimit, setPage } from 'app/http/feedbacks/feedBackSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import React, { useState } from 'react'

const TablePagination = () => {
  const dispatch = useAppDispatch()
  const { page, limit } = useAppSelector((state) => state.feedback)

  const handleOnChange = (v: any) => {
    // console.log(`page => ${v}`)
    dispatch(setPage(v))
  }

  return (
    <div className='bg-white py-5 flex items-center justify-between mb-20 mx-1 rounded-b-lg'>
      {/* limit */}
      <div className='w-[150px] ht-[30px] ml-3'>
        <FormControl className='w-full'>
          <InputLabel id='demo-simple-select-label'>Limit</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={limit}
            label='Limit'
            onChange={(e: any) => {
              dispatch(setLimit(e.target.value))
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </Select>
        </FormControl>
      </div>
      {/* pagination */}
      <Stack spacing={2} className='mr-3'>
        {/* <Pagination count={10} shape="rounded" /> */}
        <Pagination
          count={10}
          variant='outlined'
          shape='rounded'
          onChange={(e, v) => {
            handleOnChange(v)
          }}
          sx={{ button: { color: 'green' }, hover: { color: 'darkgreen' } }}
        />
      </Stack>
    </div>
  )
}

export default TablePagination
