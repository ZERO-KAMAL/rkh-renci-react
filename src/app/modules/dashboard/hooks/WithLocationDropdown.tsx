import { DropdownOptions } from 'app/common/MultipleSelect3'
import { setSelectedAreaIds, setSelectedDeptIds, setSelectedLocationIds } from 'app/http/dashboard/dashboardSlice'
import { fetchLocations } from 'app/http/locations/locationSlice'
import { fetchUserById } from 'app/http/users/userSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useCallback, useEffect, useState } from 'react'

import LocationDropdown from '../components/location-dropdown/LocationDropdown'
import DashboardConst from '../constants/dashboard.const'
import { defLocationDetailsApi } from '../model/feedback.model'
import useLocationDetails from './useLocationDetails'

const WithLocationDropdown = () => {
  const dispatch = useAppDispatch()
  const xxx = useAppSelector((state) => state)

  const { dataTable: dataTableLocation } = useAppSelector((state) => state.location)
  const userId = useAppSelector((state) => state.user.currentUser?.userInfo.id)
  const locationDetailIds = useAppSelector((state) => state.user.locationDetailIds)

  // current options to display
  const [locationDropdown, setLocationDropdown] = useState<DropdownOptions[]>([])
  const [areaDropdown, setAreaDropdown] = useState<DropdownOptions[]>([])
  const [deptDropdown, setDeptDropdown] = useState<DropdownOptions[]>([])

  const [locationPlaceholder, setLocationPlaceholder] = useState(DashboardConst.LOCATION_DEFAULT)
  const [areaPlaceholder, setAreaPlaceholder] = useState(DashboardConst.LOCATION_FIRST)
  const [deptPlaceholder, setDeptPlaceholder] = useState(DashboardConst.LOCATION_FIRST)

  // last saved selected option
  const [selectedLoc, setSelectedLoc] = useState<number[]>([])

  // APIs
  const initFetchUserLocation = useCallback(async () => {
    await dispatch(fetchUserById(userId))
  }, [userId])

  const initLocation = useCallback(async () => {
    await dispatch(fetchLocations(defLocationDetailsApi))
  }, [])

  // Step1: Fetch list of locations allowed by user
  useEffect(() => {
    initLocation()
  }, [])

  useEffect(() => {
    initFetchUserLocation()
  }, [userId])

  // UI: Location dropdown option
  useEffect(() => {
    if (!locationDetailIds || !dataTableLocation) return
    const temp: DropdownOptions[] = []

    if (locationDetailIds.length) {
      locationDetailIds.forEach((location) => {
        temp.push({
          id: location.locationId,
          label: location.locationName,
        })
      })
    } else {
      dataTableLocation.forEach((location) => {
        temp.push({
          id: location.id,
          label: location.name,
        })
      })
    }
    setLocationDropdown(temp)
  }, [locationDetailIds, dataTableLocation])

  // UI: Area dropdown option
  const handleLocationChange = async (ids: any[]) => {
    // console.log('handleLocationChange: ', ids)
    dispatch(setSelectedLocationIds(ids))
    setSelectedLoc(ids)

    if (ids.length === 0) {
      // reset selection
      setAreaPlaceholder(DashboardConst.LOCATION_FIRST)
      setAreaDropdown([])
      setDeptPlaceholder(DashboardConst.AREA_FIRST)
      setDeptDropdown([])
      return
    }

    if (ids.length > 0) {
      setAreaPlaceholder(DashboardConst.AREA_DEFAULT)
      setDeptPlaceholder(DashboardConst.AREA_FIRST)
      // set area dropdown
      const temp: DropdownOptions[] = await useLocationDetails.getAreas(locationDetailIds, ids)
      // console.log('set area dropdown: ', temp)
      setAreaDropdown(temp)
      return
    }
  }

  // on Area change
  const handleAreaChange = async (ids: any[]) => {
    // console.log('handleAreaChange: ', ids)
    dispatch(setSelectedAreaIds(ids))

    if (ids.length === 0) {
      setDeptPlaceholder(DashboardConst.AREA_FIRST)
      setDeptDropdown([])
      return
    }

    if (ids.length > 0) {
      setDeptPlaceholder(DashboardConst.DEPT_DEFAULT)
      // set dept dropdown
      const temp: DropdownOptions[] = await useLocationDetails.getDepts(
        locationDetailIds,
        selectedLoc,
        ids
      )
      setDeptDropdown(temp)
      return
    }
  }

  // on Department change
  const handleDeptChange = (ids: any[]) => {
    // console.log('handleDeptChange: ', ids)
    dispatch(setSelectedDeptIds(ids))
  }

  // STEP 4: If location is multiple, then call Dashboard API

  return (
    <LocationDropdown
      // location
      handleLocationChange={handleLocationChange}
      locationData={locationDropdown}
      locationPlaceholder={locationPlaceholder}
      // area
      handleAreaChange={handleAreaChange}
      areaData={areaDropdown}
      areaPlaceholder={areaPlaceholder}
      // department
      handleDeptChange={handleDeptChange}
      deptData={deptDropdown}
      deptPlaceholder={deptPlaceholder}
    />
  )
}

export default WithLocationDropdown
