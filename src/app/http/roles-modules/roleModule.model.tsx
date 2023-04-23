export interface Role {
  id: number
  name: string
  permissions: Array<Permission>
  code: string
}

export interface RoleList {
  count: number
  rows: Array<Role>
}
export interface Permission {
  module: string
  code: string
  id: number
  name: string
  description: string
}
export interface PermissionList {
  count: number
  rows: Array<Permission>
}
export interface RolePermission {
  roleId: number
  permissionIds: Array<number>
}
export interface params {
  page: number
  limit: number
  text: string | ''
  order: SortingType
}
export interface SortingType {
  sortDir: 'asc' | 'desc'
  sortBy: string | null
}
