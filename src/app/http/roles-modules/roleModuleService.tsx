import http from '../../helpers/http-common'
import { RolePermission, SortingType } from './roleModule.model'

// Query
const getRoleFilter = (page: number, limit: number, text = '', order: SortingType) => {
  const data = {
    url:
      page <= 0
        ? `roles/${null}/${null}`
        : `roles/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    params: {
      text: text,
    },
  }
  return http.GET(data)
}
const getRoleById = (id: number) => {
  const data = { url: `roles/${id}` }
  return http.GET(data)
}
const getPermissionFilter = (page: number, limit: number, text = '', order: SortingType) => {
  const data = {
    url:
      page <= 0
        ? `permissions/${null}/${null}`
        : `permissions/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    params: {
      text: text,
    },
  }
  return http.GET(data)
}

const createRolePermission = (body: RolePermission) => {
  const data = { url: `roles/permissions`, body: body }
  return http.POST(data)
}

const RoleModuleService = {
  getRoleFilter,
  getRoleById,
  getPermissionFilter,
  createRolePermission,
}

export default RoleModuleService
