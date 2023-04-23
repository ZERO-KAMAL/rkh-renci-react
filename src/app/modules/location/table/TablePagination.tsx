import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import { setLimit, setPage } from 'app/http/location-datas/locationDetailSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'

const TablePagination = () => {
  const dispatch = useAppDispatch()
  const { limit } = useAppSelector((state) => state.locationDetail)
  const handleOnChange = (v: any) => {
    console.log(`page => ${v}`)
    dispatch(setPage(v))
  }
  return (
    <div className='flex justify-between items-center'>
      {/* limit */}
      <div className='w-[150px] ht-[30px]'>
        <FormControl className='w-full'>
          <InputLabel id='demo-simple-select-label'>Limit</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={limit}
            label='Limit'
            onChange={(e) => {
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
      <Stack spacing={2}>
        {/* <Pagination count={10} shape="rounded" /> */}
        <Pagination
          count={10}
          variant='outlined'
          shape='rounded'
          onChange={(e, v) => {
            handleOnChange(v)
          }}
        />
      </Stack>
    </div>
  )
}

export default TablePagination
