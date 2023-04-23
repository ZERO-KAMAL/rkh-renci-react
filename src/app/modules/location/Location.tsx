import ModuleHeader from 'app/components/ModuleHeader'
import { MODULES } from 'app/constants/module-permission'
import { useAppSelector } from 'app/redux/store'

import LocationNavBtns from '../location-details/shared-components/LocationNavBtns'
import LocationMenu from './component/LocationMenu'
import LocationFormModal from './form/LocationFormModal'
import LocationTableWrapper from './table/LocationTableWrapper'

const Location = () => {
  const { itemIdForUpdate } = useAppSelector((state) => state.locationDetail)

  return (
    <div className='w-full h-full overflow-auto pt-5'>
      <div className='w-[1024px]  mx-auto overflow-auto h-full '>
        {/* header */}
        <ModuleHeader header='Location Areas Departments' headerButtons={LocationNavBtns()} />
        {/* menu */}
        <LocationMenu />
        {/* table */}
        <LocationTableWrapper />
        {/* form */}
        {itemIdForUpdate !== undefined && <LocationFormModal />}
      </div>
    </div>
  )
}

export default Location
