import { HeaderList } from 'app/http/users/users.model'

const HEADER_LIST: HeaderList[] = [
  {
    id: 'fullName',
    label: 'Name',
    sorting: true,
  },
  {
    id: 'roleId',
    label: 'Role',
    sorting: true,
  },
  {
    id: 'designation',
    label: 'Designation',
    sorting: true,
  },
  {
    id: 'locationDetailIds',
    label: 'Location',
    sorting: true,
  },
]

const QSM_SUPERADMIN_CODE = 'qsm superadmin'

const UserConst = {
  HEADER_LIST,
  QSM_SUPERADMIN_CODE
}


export default UserConst
