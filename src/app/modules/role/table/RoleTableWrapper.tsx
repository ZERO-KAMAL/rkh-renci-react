import React from 'react'

import RoleSearchBar from '../component/RoleSearchBar'
import RoleTable from './RoleTable'

const RoleTableWrapper = () => {
  return (
    <div>
      <div className='bg-white shadow-md rounded  p-5 mt-5'>
        {/* SearchBar */}
        <RoleSearchBar />
        {/* table */}
        <RoleTable />
      </div>
    </div>
  )
}

export default RoleTableWrapper
