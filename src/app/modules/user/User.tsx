import ModuleHeader from 'app/components/ModuleHeader'
import ReactIconBtn, { ColorsEnum } from 'app/components/button/ReactIconBtn'
import { MODULES } from 'app/constants/module-permission'
import { Location } from 'app/http/locations/location.model'
import { fetchLocations } from 'app/http/locations/locationSlice'
import { userTableSlice } from 'app/http/users/userTableSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import _ from 'lodash'
import { useCallback, useEffect, useMemo } from 'react'
import { RiAddFill } from 'react-icons/ri'

import LocationBtn from './components/LocationBtn'
import UserFormWrapper from './user-modal/UserFormWrapper'
import UserTableWrapper from './user-table/UserTableWrapper'

const UserList = () => {
  const dispatch = useAppDispatch()
  const table = useAppSelector((state) => state.userTable.table)

  const userModelComp = useMemo(() => <UserFormWrapper />, [])

  const addUser = () => {
    dispatch(
      userTableSlice.actions.setTable({
        modalData: undefined,
        showModal: true,
      })
    )
  }
  const myButtons = [
    <ReactIconBtn
      key={0}
      name='Add user'
      icon={<RiAddFill size={20} />}
      bgColor={ColorsEnum.green}
      onClick={addUser}
    ></ReactIconBtn>,
  ]

  // Location Header
  const { page, limit, locationId, text, order, dataTable, loading } = useAppSelector(
    (state) => state.location
  )
  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  // Users module permission
  const canUsersEdit = Boolean(permissions.find((a) => a.code === MODULES.SetupUsersEditFunc.code))

  // const initFetch = useCallback(async () => {
  //   await dispatch(
  //     fetchLocations({
  //       page,
  //       limit,
  //       locationId,
  //       text,
  //       order,
  //     })
  //   )
  // }, [page, limit, locationId, text, order])
  // useEffect(() => {
  //   initFetch()
  // }, [initFetch])

  const selectLocation = (loc: Location) => {
    // console.log('Selected Location: ', loc.id)
    if (loc.id >= 0) {
      dispatch(userTableSlice.actions.setLocationId(loc.id))
    } else {
      dispatch(userTableSlice.actions.setLocationId(''))
    }
  }

  return (
    <div className='relative max-w-[1024px] h-full mx-auto pt-5'>
      {canUsersEdit ? (
        <ModuleHeader header='Users' headerButtons={myButtons} />
      ) : (
        <ModuleHeader header='Users' />
      )}

      <div className='flex flex-col w-full h-[calc(100%-3rem)] rounded overflow-auto'>
        {!loading && <LocationBtn locations={dataTable} onClick={selectLocation} />}
        <UserTableWrapper />
      </div>
      {table.showModal && userModelComp}
    </div>
  )
}

const User = () => {
  return <UserList />
}

export default User
