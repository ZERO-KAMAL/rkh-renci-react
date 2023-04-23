import ModuleHeader from 'app/components/ModuleHeader'
import { MODULES } from 'app/constants/module-permission'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { useAppSelector } from 'app/redux/store'

import LocationNavBtns from '../shared-components/LocationNavBtns'
import WithAddDepartment from './hooks/WithAddDepartment'
import WithDeptTable from './hooks/WithDeptTable'
import WithEditDeptModal from './hooks/WithEditDeptModal'

const LocationDept = () => {
  const { editData } = useAppSelector((state) => state.department)
  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  const canEdit = Boolean(permissions.find((a) => a.code === MODULES.SetupLocationEditFunc.code))

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
        {/* Add Department */}
        {canEdit && <WithAddDepartment />}
        {/* table */}
        <WithDeptTable />
        {/* modal */}
        {editData !== undefined && <WithEditDeptModal />}
      </div>
    </div>
  )
}

export default LocationDept
