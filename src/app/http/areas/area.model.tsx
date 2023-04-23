export interface Area {
  id: number
  name: string | null
  locationId?: number
}

export interface AreaList {
  count: number
  rows: Area[]
}

export interface params {
  page: number
  limit: number
  locationId: number | undefined
  text: string | ''
  order: SortingType
}

export interface SortingType {
  sortDir: 'asc' | 'desc'
  sortBy: string | null
}

export interface AreaFormSchema {
  name: string
  locationId?: number
}
