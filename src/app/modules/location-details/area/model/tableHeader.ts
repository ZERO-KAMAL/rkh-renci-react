import { Location } from 'app/http/locations/location.model'

export interface HeaderList {
  id: keyof Partial<Location>
  label: string
  sorting: boolean
}

export const TABLE_HEADER: HeaderList[] = [
  {
    id: 'name',
    label: 'Area',
    sorting: true,
  }
]

export const TABLE_INIT: any = {
  page: 1,
  limit: 10,
  text: '',
  areaId: '',
  locationId: '',
  order: {
    sortDir: 'asc',
    sortBy: 'name',
  },
}
