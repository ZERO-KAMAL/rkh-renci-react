import ModuleHeader from 'app/components/ModuleHeader'
import { MODULES } from 'app/constants/module-permission'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { useAppSelector } from 'app/redux/store'

import LocationNavBtns from '../shared-components/LocationNavBtns'
import WithAddLocation from './hooks/WithAddLocation'
import WithEditLocationModal from './hooks/WithEditLocationModal'
import WithLocationTable from './hooks/WithLocationTable'

const LocationLoc = () => {
  const { editData } = useAppSelector((state) => state.location)
  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  const canEdit = Boolean(
    permissions.find((a) => a.code === MODULES.SetupLocationEditFunc.code)
  )

  return (
    <div className='w-full h-full overflow-auto pt-5'>
      <div className='w-[1024px]  mx-auto overflow-auto h-full '>
        {/* header */}
        <ModuleHeader
          header='Location Areas Departments'
          headerButtons={LocationNavBtns()}
          withBackButton={true}
          returnUrl={NAVIGATE_LINKS.SETUP.LOCATION}
        />
        {/* Add Location */}
        {canEdit && <WithAddLocation />}
        {/* table */}
        <WithLocationTable />
        {/* modal */}
        {editData !== undefined && <WithEditLocationModal />}
      </div>
    </div>
  )
}

export default LocationLoc
