import { FormControl, InputLabel, MenuItem, Pagination, Select, Stack } from '@mui/material'
import { setPage } from 'app/http/location-datas/locationDetailSlice'
import React from 'react'

interface IProps {
  limit: number
  setLimit: (v: number) => void
  pageCount: number
  page: number
  setPage: (v: number) => void
}
const LimitWithPagination: React.FC<IProps> = ({ limit, setLimit, pageCount, page, setPage }) => {
  return (
    <Stack
      alignItems={'center'}
      justifyContent={'space-between'}
      direction='row'
      className='bg-white mb-2'
    >
      <div className='w-[150px] ht-[30px] p-2'>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>Limit</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={limit}
            label='Limit'
            onChange={(e: any) => {
              setLimit(e.target.value)
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={15}>15</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
            <MenuItem value={100}>100</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Stack spacing={2} className='mr-3'>
        <Pagination
          count={pageCount}
          variant='outlined'
          shape='rounded'
          page={page}
          onChange={(e, v) => {
            setPage(v)
          }}
        />
      </Stack>
    </Stack>
  )
}

export default LimitWithPagination
