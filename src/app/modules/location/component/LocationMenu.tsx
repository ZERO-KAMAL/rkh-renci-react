import ReactIconBtn, { ColorsEnum } from 'app/components/button/ReactIconBtn'
import { MODULES } from 'app/constants/module-permission'
import { setItemIdForUpdate, setLocationId } from 'app/http/location-datas/locationDetailSlice'
import { Location } from 'app/http/locations/location.model'
import { fetchLocations } from 'app/http/locations/locationSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { RiAddFill } from 'react-icons/ri'

const LocationMenu = () => {
  const dispatch = useAppDispatch()

  const { page, limit, locationId, text, order, dataTable } = useAppSelector(
    (state) => state.location
  )

  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  const canEditLocations = Boolean(
    permissions.find((a) => a.code === MODULES.SetupLocationEditFunc.code)
  )

  const initFetch = useCallback(async () => {
    await dispatch(
      fetchLocations({
        page,
        limit,
        locationId,
        text,
        order,
      })
    )
  }, [page, limit, locationId, text, order])

  useEffect(() => {
    // console.log('initial fetch location')
    initFetch()
  }, [dispatch, locationId])

  const [active, setActive] = useState('all')
  const handleOnClick = (loc: Location) => {
    if (loc.id == 0) {
      setActive('all')
      dispatch(setLocationId(''))
    } else {
      setActive(loc.id.toString())
      dispatch(setLocationId(loc.id))
    }
  }
  return (
    <div className='flex mt-5 '>
      <div>
        <button
          onClick={() => {
            const data: any = { id: 0, name: '' }
            handleOnClick(data)
          }}
          className={clsx(
            'hover:bg-white hover:text-green-500 text-gray-500 mr-3 font-bold p-2 rounded w-[100px]',
            active === 'all' && 'bg-white text-green-500 '
          )}
        >
          All
        </button>
      </div>
      <div className='flex flex-wrap'>
        {dataTable &&
          dataTable.map((loc) => (
            <button
              onClick={() => {
                handleOnClick(loc)
              }}
              className={clsx(
                ' hover:bg-white hover:text-green-500 text-gray-500 mr-3 font-bold p-2 rounded',
                active == loc.id.toString() && 'bg-white text-green-500'
              )}
              id={loc.id.toString()}
              key={loc.id}
            >
              {loc.name}
            </button>
          ))}
      </div>
      {canEditLocations && (
        <div>
          <ReactIconBtn
            key={0}
            name='Add location Data'
            icon={<RiAddFill size={20} />}
            bgColor={ColorsEnum.orange}
            onClick={() => {
              dispatch(setItemIdForUpdate(null))
            }}
          ></ReactIconBtn>
        </div>
      )}
    </div>
  )
}

export default LocationMenu
