import { DropdownOptions } from 'app/common/MultipleSelect3'
import LocationDetailsConst from 'app/constants/location-details.const'
import AreaService from 'app/http/areas/areaService'
import { Department } from 'app/http/departments/department.model'
import DepartmentService from 'app/http/departments/departmentService'
import {
  LocationDetail,
  LocationDetailStructure,
} from 'app/http/location-datas/locationDetail.model'
import _ from 'lodash'

import { ILocation } from '../model/feedback.model'

// copied from james@ locationDetailSlice.tsx
const destructureData = (datas: LocationDetail[]) => {
  // console.log('Debug destructure begin: ', datas)
  const dataTable: Array<LocationDetailStructure> = []
  try {
    datas.forEach((data) => {
      dataTable.push({
        id: data.id,
        locationId: data?.locationId,
        locationName: data.location?.name,
        areaId: data?.areaId,
        areaName: data.area?.name,
        departmentId: data?.departmentId,
        departmentName: data.department?.name,
        address: data.location?.address,
      })
    })
  } catch (err) {
    console.error(err)
  }
  // console.log('Debug destructure ends: ', dataTable)
  return dataTable
}

// input: destructureData
// returns: restructures data into a nested array 3 tier relationship (location -> area -> department)
const restructureData = (data: LocationDetailStructure[]): ILocation[] => {
  // console.log('Debug restructure begin: ', data)
  const result = _(data)
    .groupBy('locationId')
    .map((value, key) => {
      return {
        locationId: Number(key),
        locationName: value[0].locationName,
        area: _(value)
          .groupBy('areaId')
          .map((value, key) => {
            return {
              areaId: Number(key),
              areaName: value[0].areaName,
              department: _(value)
                .groupBy('departmentId')
                .map((value, key) => {
                  return {
                    departmentId: Number(key),
                    departmentName: value[0].departmentName,
                  }
                })
                .value(),
            }
          })
          .value(),
      }
    })
    .value()

  const temp: ILocation[] = [...result]
  // console.log('Debug restructure ends: ', temp)
  return temp
}

const fillNullData = () => {}

const getAreas = async (
  locationDropdown: ILocation[],
  selectedLocationIds: number[]
): Promise<DropdownOptions[]> => {
  let temp: DropdownOptions[] = []
  let areaIsNull = false

  for (const locationId of selectedLocationIds) {
    const areas = locationDropdown.find((location) => location.locationId === locationId)?.area

    if (areas?.length && !Number.isNaN(areas[0].areaId)) {
      for (const area of areas) {
        temp.push({
          id: area.areaId,
          label: area.areaName,
        })
      }
    } else {
      areaIsNull = true
      break
    }
  }

  if (areaIsNull) {
    // fetch all area ids related to location, because API returns null
    try {
      let areas: Department[] = await AreaService.getAreaByIdLocationDetail(selectedLocationIds, '')
      // Sorting func 1: Sort Strings with num
      const sortAlphaNum = (a: any, b: any) => {
        return a.name.localeCompare(b.name, 'en', { numeric: true })
      }

      const areaNames = areas.map((item) => item.name)
      const containsWard =
        areaNames.findIndex((element: any) => element.toLowerCase().includes('ward')) > 0 ? true : false
      if (containsWard) {
      }

      if (containsWard) {
        // Ward have to be in front
        const sorted = areas.sort(sortAlphaNum)
        const withoutWard = sorted.filter((e: any) => !e.name.toLowerCase().includes('ward'))
        const withWard = sorted.filter((e: any) => e.name.toLowerCase().includes('ward'))
        areas = withWard.concat(withoutWard)
      } else {
        areas = areas.sort(sortAlphaNum)
      }

      areas.forEach((dept) => {
        temp.push({
          id: dept.id,
          label: dept.name,
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  // remove duplicates by id
  temp = temp.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i)
  return temp
}

const getDepts = async (
  locationDropdown: ILocation[],
  selectedLocationIds: number[],
  selectedAreaIds: number[]
): Promise<DropdownOptions[]> => {
  let temp: DropdownOptions[] = []

  for (const locationId of selectedLocationIds) {
    let deptIsNull = false
    for (const areaId of selectedAreaIds) {
      const department = locationDropdown
        .find((location) => location.locationId === locationId)
        ?.area.find((area) => area.areaId === areaId)?.department

      if (department?.length && !Number.isNaN(department[0].departmentId)) {
        department.forEach((dept) => {
          temp.push({
            id: dept.departmentId,
            label: dept.departmentName,
          })
        })
      } else {
        deptIsNull = true
        break
      }
    }
    if (deptIsNull) {
      // fetch all department ids related to location and area, because API returns null
      try {
        let department: Department[] = await DepartmentService.getDepartmentByAreaId(
          locationId,
          selectedAreaIds,
          ''
        )
        department = department.filter(item => item.name && !LocationDetailsConst.EXCLUDE_DEPTS.includes(item.name))
        department.forEach((dept) => {
          temp.push({
            id: dept.id,
            label: dept.name,
          })
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  // remove duplicates by id
  temp = temp.filter((v, i, a) => a.findIndex((v2) => v2.id === v.id) === i)
  return temp
}

const useLocationDetails = {
  destructureData,
  restructureData,
  getAreas,
  getDepts,
}

export default useLocationDetails
