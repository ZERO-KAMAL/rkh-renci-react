import UserConst from 'app/constants/user.const'

import { Role } from '../roles-modules/roleModule.model'

export interface LoginReq {
  email: string
  password: string
}

export interface LoginRes {
  token: string
  userInfo: UserInfo
  refreshToken: string
}

export interface UserInfo {
  id: number
  phoneNumber?: string
  email?: string
  fullName: string
  designation: any
  dob?: string | Date
  avatarUri?: string
  roleId?: number
  role: Role | undefined
  locationDetailIds: LocationDetailId[]
  isActive: boolean
  address?: string
  refreshToken: string

  // Accept all unknown properties
  [otherOptions: string]: unknown
}

export interface ChangeEmail {
  oldEmail: string
  oldPassword: string
  newEmail: string
}

export interface ChangePassword {
  email: string
  otp: string
  newPassword: string
}

export interface ChangePasswordWeb {
  email: string
  oldPassword: string
  newPassword: string
}

export interface LocationDetailId {
  locationId: number
  areaId: number
  departmentId: number
  location: Location
  area: Area
  department: Department
}

export interface Location {
  name: string
  address: string
}

export interface Area {
  name: string
}

export interface Department {
  name: string
}

export interface UserList {
  count: number
  rows: UserInfo[]
}

export interface Permission {
  id: number
  module: string
  name: string
  code: string
  description: string
  no: number
  createdAt: string
  updatedAt: string
  deletedAt: any
  rolePermissions: RolePermissions
}

export interface RolePermissions {
  createdAt: string
  updatedAt: string
  roleId: number
  permissionId: number
}

export interface SortingType {
  sortDir: 'asc' | 'desc'
  sortBy: keyof Partial<UserInfo>
}

export interface Pagination {
  page: number
  limit: number
}

// Required for table header
export interface HeaderList {
  id: keyof Partial<UserInfo>
  label: string
  sorting: boolean
}

export interface SearchBar {
  searchText: string | undefined // Search bar
}

export interface UserTableParams extends SortingType, Pagination, SearchBar {
  header: HeaderList[]
  selectedId: number[] // Selected checkboxes
  isAllSelected: boolean // All checkbox selected
  hideTableData: boolean // Hide table data
  showModal: boolean // Show modal
  modalData: Partial<UserInfo> | undefined // Modal data
}

export const tableInit: UserTableParams = {
  header: UserConst.HEADER_LIST,
  page: 1,
  limit: 10,
  sortBy: 'fullName',
  sortDir: 'asc',

  selectedId: [],
  isAllSelected: false,
  hideTableData: false,
  showModal: false,
  modalData: undefined,

  searchText: undefined,
}
