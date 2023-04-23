// Location
export interface Location {
  id: number
  name: string | null
  address?: string | null
}

export interface LocationList {
  count: number
  rows: Location[] | []
}

export interface SortingType {
  sortDir: 'asc' | 'desc'
  sortBy: string | null
}
export interface params {
  page: number
  limit: number
  locationId: number | null
  text: string | ''
  order: SortingType
}
