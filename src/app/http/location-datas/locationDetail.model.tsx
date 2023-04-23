import { Area } from '../areas/area.model'
import { Department } from '../departments/department.model'
import { Location } from '../locations/location.model'

export interface LocationDetail {
  id: number
  locationId: number | null
  areaId: number | null
  departmentId: number | null
  address: string | null
  area: Area
  location: Location
  department: Department
}

export interface LocationDetailList {
  count: number
  rows: LocationDetail[]
}

export interface SortingType {
  sortDir: 'asc' | 'desc'
  sortBy: string | null
}
export interface params {
  page: number
  limit: number
  locationId: number | string | null
  text: string | ''
  order: SortingType
}
// Form format
export interface LocationDetailFormScheam {
  // id?: number | null
  locationId: number | null
  areaId: number | null
  departmentId: number | null
  address: string | null
}
export interface LocationDetailFormScheamV2 {
  // id?: number | null
  locationId: number | null
  areaId: number | null
  departmentId: number | null
  address: string | null
  locationName: string | null
  areaName: string | null
  departmentName: string | null
}

// Destructure
export interface LocationDetailStructure {
  id: number | null | any
  locationId: number | null | any
  locationName: string | null | any
  areaId: number | null | any
  areaName: string | null | any
  departmentId: number | null | any
  departmentName: string | null | any
  address: string | null | any
}
