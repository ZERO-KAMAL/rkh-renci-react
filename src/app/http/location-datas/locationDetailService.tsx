import http from '../../helpers/http-common'
import {
  LocationDetail,
  LocationDetailFormScheam,
  LocationDetailList,
  SortingType,
} from './locationDetail.model'

// Query
const getLocationDetailFilter = (
  page: number,
  limit: number,
  locationId: number | null | string = '',
  text = '',
  order: SortingType
) => {
  const data = {
    // path
    url:
      page <= 0
        ? `locationDetails/${null}/${null}`
        : `locationDetails/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    // query
    params: {
      text: text,
      locationId: locationId,
      // sortBy: order.sortBy,
      // sortDir: order.sortDir,
    },
  }
  return http.GET(data)
}

// Mutation
const createLocationDetail = (body: LocationDetailFormScheam) => {
  const data = { url: `locationDetails`, body: body }
  return http.POST(data)
}
const updateLocationDetail = (id: number, body: LocationDetailFormScheam) => {
  const data = { url: `locationDetails/${id}`, body: body }
  return http.PUT(data)
}
const deleteAllLoationDetail = (ids: Array<number>) => {
  const body = { ids: ids }
  console.log(`body => ${JSON.stringify(body)}`)
  const data = { url: `locationDetails/deleteMulti`, body: body }
  return http.DELETE(data)
}

const LocationDetailService = {
  getLocationDetailFilter,
  createLocationDetail,
  updateLocationDetail,
  deleteAllLoationDetail,
}
export default LocationDetailService
