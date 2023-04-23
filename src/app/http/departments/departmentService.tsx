import axios from 'axios'

import http from '../../helpers/http-common'
import { DepartmentFormSchema, SortingType } from './department.model'

const API_URL = import.meta.env.VITE_APP_API_URL

// Query
const getDepartmentFilter = (
  page: number,
  limit: number,
  areaId: number | string = '',
  locationId: number | string = '',
  text = '',
  order: SortingType
) => {
  // console.log(`areaId => ${areaId}`)
  const data = {
    // path
    url:
      page <= 0
        ? `departments/${null}/${null}`
        : `departments/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    // query
    params: {
      // areaId: areaId,
      //  locationId: locationId,
      text: text,
      // sortBy: order.sortBy,
      // sortDir: order.sortDir,
    },
  }
  return http.GET(data)
}
export const getDepartmentByAreaId = (locId: any, areaId: any, text?: string) => {
  const data = {
    url: `locationDetails/getDepartments?locationIds=${locId}&areaIds=${areaId}&text=${text || ''}`,
  }
  return http.GET(data)
}

const getAllDepartment = () => {
  const data = {
    url: 'departments',
  }
  return http.GET(data)
}

const getDepartmentById = (id: number) => {
  const data = { url: `departments/${id}` }
  return http.GET(data)
}

// Mutation
const createDepartment = (body: DepartmentFormSchema) => {
  const data = { url: 'departments', body: body }
  return http.POST(data)
}
const updateDepartment = (id: number, body: DepartmentFormSchema) => {
  const data = { url: `departments/${id}`, body: body }
  return http.PUT(data)
}
const deleteDepartment = (id: number) => {
  const data = { url: `departments/${id}` }
  return http.DELETE(data)
}
const deleteDepartments = (ids: number[]) => {
  const body = { data: { ids: ids } }
  return axios.delete<any>(`${API_URL}/departments/deleteMulti`, body)
}

const DepartmentService = {
  getDepartmentFilter,
  getDepartmentByAreaId,
  getAllDepartment,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  deleteDepartments,
}

export default DepartmentService
