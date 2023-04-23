import http from 'app/helpers/http-common'
import axios, { AxiosResponse } from 'axios'
import _ from 'lodash'
import { useQuery } from 'react-query'

import {
  ChangeEmail,
  ChangePassword,
  ChangePasswordWeb,
  LoginReq,
  LoginRes,
  SortingType,
  UserInfo,
  UserList,
  UserTableParams,
} from './users.model'

const API_URL = import.meta.env.VITE_APP_API_URL

const login = (email: string, password: string) => {
  const req: LoginReq = {
    email,
    password,
  }
  return axios.post<LoginRes>(`${API_URL}/users/login`, req)
}

const createUser = (body: Partial<UserInfo>) => {
  return axios.post<any>(`${API_URL}/users`, body)
}

const updateUser = (id: number, body: Partial<UserInfo>) => {
  return axios.put<any>(`${API_URL}/users/${id}`, body)
}

const deleteUser = (ids: number[]) => {
  const body = { data: { ids: ids } }
  return axios.delete<any>(`${API_URL}/users/deleteMulti`, body)
}

const resetEmailPassword = (email: string) => {
  const body = {
    email: email,
  }
  return axios.post<any>(`${API_URL}/users/resetPassword`, body)
}

const changeEmail = (body: ChangeEmail) => {
  return axios.post<any>(`${API_URL}/users/changeEmail`, body)
}

const changePassword = (body: ChangePassword) => {
  return axios.post<any>(`${API_URL}/users/changePassword`, body)
}

const changePasswordWeb = (body: ChangePasswordWeb) => {
  return axios.post<any>(`${API_URL}/users/changePasswordWeb`, body)
}

const refreshToken = (id: number, refreshToken: string) => {
  const body = {
    id: id,
    refreshToken: refreshToken,
  }
  return axios.post<any>(`${API_URL}/users/refreshToken`, body)
}

const getByFilter = (
  table: Partial<UserTableParams>,
  dependencies?: any,
  filterBy?: Partial<UserInfo>,
  onSuccess?: (res: AxiosResponse<UserList>) => void,
  onError?: (err: any) => void
) => {
  return useQuery(
    ['user-getbyfilter', dependencies],
    () => {
      return axios.get<UserList>(
        `${API_URL}/users/${table.page}/${table.limit}/${table.sortBy}/${table.sortDir}`,
        {
          params: _.pickBy(filterBy, (value, key) => {
            // return all other non-null values
            return !!value
          }),
        }
      )
    },
    {
      onSuccess,
      onError,
      retryDelay: 100,
    }
  )
}

const getUserListFilter = (
  page: number,
  limit: number,
  order: SortingType,
  fullName: string,
  email: string,
  phoneNumber: any
) => {
  const data = {
    url:
      page <= 0
        ? `users/${null}/${null}}`
        : `users/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    params: {
      fullName: fullName,
      email: email,
      phoneNumber: phoneNumber,
    },
  }
  return http.GET(data)
}

const getUserById = async (id: number) => {
  const data = { url: `users/${id}` }
  return http.GET(data)
}
const fetchMultiUsersById = async (ids: Array<number>) => {
  const data = { url: `users/getMulti`, body: {ids} }
  return http.POST(data)
}

const uploadImage = async (body: File) => {
  return axios.post<any>(`${API_URL}/upload`, body)
}

const validateOTP = (email: string, otp: string) => {
  const body = {
    email: email,
    otp: otp
  }
  return axios.post<any>(`${API_URL}/users/validateOTP`, body)
}

const UserService = {
  login,
  createUser,
  updateUser,
  deleteUser,
  getByFilter,
  getUserListFilter,
  getUserById,
  resetEmailPassword,
  changeEmail,
  changePassword,
  changePasswordWeb,
  uploadImage,
  refreshToken,
  validateOTP,
  fetchMultiUsersById
}

export default UserService
