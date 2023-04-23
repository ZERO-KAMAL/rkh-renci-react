import axios from 'axios'

import http from '../../helpers/http-common'
import { AreaFormSchema, SortingType } from './area.model'

const API_URL = import.meta.env.VITE_APP_API_URL

// Query
const getAreaFilter = (
  page: number,
  limit: number,
  locationId: number | undefined,
  text: string,
  order: SortingType,
  signal: any
) => {
  // console.log(`Coming service process`)
  const data = {
    // path
    url:
      page <= 0
        ? `areas/${null}/${null}`
        : `areas/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    // query
    params: {
      // locationId: locationId,
      text: text,
      // sortBy: order.sortBy,
      // sortDir: order.sortDir,
    },
    signal: signal,
  }
  // console.log(`data => ${JSON.stringify(data)}`)
  return http.GET(data)
}
const getAreaByIdLocationDetail = (id: any, text?: string) => {
  const data = { url: `locationDetails/getAreas?text=${text || ''}&locationIds=${id}` }
  return http.GET(data)
}

const getAllArea = () => {
  const data = {
    url: 'areas',
  }
  return http.GET(data)
}
const getAreaById = (id: number) => {
  const data = { url: `areas/${id}` }
  return http.GET(data)
}

// Mutation
const createArea = (body: AreaFormSchema) => {
  const data = { url: `areas`, body: body }
  return http.POST(data)
}
const updateArea = (id: number, body: AreaFormSchema) => {
  const data = { url: `areas/${id}`, body: body }
  return http.PUT(data)
}
const deleteAera = (id: number) => {
  const data = { url: `areas/${id}` }
  return http.DELETE(data)
}

const deleteAreas = (ids: number[]) => {
  const body = { data: { ids: ids } }
  return axios.delete<any>(`${API_URL}/areas/deleteMulti`, body)
}

const AreaService = {
  getAllArea,
  getAreaFilter,
  getAreaByIdLocationDetail,
  getAreaById,
  createArea,
  updateArea,
  deleteAera,
  deleteAreas,
}

export default AreaService
