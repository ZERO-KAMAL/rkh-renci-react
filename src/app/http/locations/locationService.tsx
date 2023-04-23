import { Location } from 'app/http/locations/location.model'
import axios from 'axios'

import http from '../../helpers/http-common'
import { SortingType } from './location.model'

const API_URL = import.meta.env.VITE_APP_API_URL

const getLocationFilter = (
  page: number,
  limit: number,
  locationId: number | null,
  text = '',
  order: SortingType
) => {
  // console.log('Coming service process')
  const data = {
    // path
    url:
      page <= 0
        ? `locations/${null}/${null}`
        : `locations/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    // query
    params: {
      text: text,
      // sortBy: order.sortBy,
      // sortDir: order.sortDir,
    },
  }

  return http.GET(data)
}

const createLocation = (body: Partial<Location>) => {
  return axios.post<any>(`${API_URL}/locations`, body)
}

const updateLocation = (id: number, body: Partial<Location>) => {
  return axios.put<any>(`${API_URL}/locations/${id}`, body)
}

const deleteLocation = (ids: number[]) => {
  const body = { data: { ids: ids } }
  return axios.delete<any>(`${API_URL}/locations/deleteMulti`, body)
}

const LocationService = {
  getLocationFilter,
  createLocation,
  updateLocation,
  deleteLocation,
}
export default LocationService
