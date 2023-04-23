import LimitWithPagination from 'app/components/LimitWithPagination'
import { useAppDispatch, useAppSelector } from 'app/redux/store'

import { setLimit, setPage } from '../../../http/location-datas/locationDetailSlice'
import LocationTable from './LocationTable'
import SearchBar from './SearchBar'

const LocationTableWrapper = () => {
  const dispatch = useAppDispatch()

  const { counts, page, limit } = useAppSelector((state) => state.locationDetail)
  return (
    <div className='bg-[#FFFFFF] p-5 rounded-md mt-2'>
      {/* Search bar */}
      <SearchBar />
      {/* table */}
      <LocationTable />
      {/* pagination */}
      <LimitWithPagination
        limit={limit}
        setLimit={(v) => dispatch(setLimit(v))}
        pageCount={Math.ceil(counts / limit) === 0 ? 1 : Math.ceil(counts / limit)}
        page={page}
        setPage={(v) => dispatch(setPage(v))}
      />
      {/* <TablePagination /> */}
    </div>
  )
}

export default LocationTableWrapper
