export interface Department {
  id: number
  name: string | null
}
export interface DepartmentList {
  count: number
  rows: Department[]
}
export interface params {
  page: number
  limit: number
  areaId: number | ''
  locationId: number | ''
  text: string | ''
  order: SortingType
}
export interface SortingType {
  sortDir: 'asc' | 'desc'
  sortBy: string | null
}
export interface DepartmentFormSchema {
  name: string
  // areaId: number
  locationId?: number
}
