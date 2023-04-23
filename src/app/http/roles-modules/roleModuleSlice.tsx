import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import {
  Permission,
  PermissionList,
  Role,
  RoleList,
  RolePermission,
  params,
} from './roleModule.model'
import roleModuleService from './roleModuleService'

export const defParamsRole: params = {
  page: 1,
  limit: 20,
  text: '',
  order: {
    sortDir: 'asc',
    sortBy: 'id',
  },
}
export const defParamsPermission: params = {
  page: 1,
  limit: 50,
  text: '',
  order: {
    sortDir: 'asc',
    sortBy: 'no',
  },
}

interface roleModuleState {
  dataTable: Role[] | null
  counts: number
  editData: any
  roleId: number | any
  roleName: string
  roleActive: boolean
  loadingRole: boolean
  loadingPermission: boolean
  selected: Array<number> // permission ids
  permissionDataTable: Array<Permission>
  text: string
}
const initialState: roleModuleState = {
  dataTable: [], // rolelist
  counts: 0,
  editData: null, // {id : 1 : name :'Superadmin'}
  roleId: null,
  roleName: '',
  roleActive: true,
  loadingRole: false,
  loadingPermission: false,
  selected: [],
  permissionDataTable: [],
  text: '',
}
// Action
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (parms: params = defParamsRole, thunkAPI: any) => {
    try {
      const { page, limit, order } = parms
      const text = thunkAPI.getState().roleModule.text
      const response: RoleList = await roleModuleService.getRoleFilter(page, limit, text, order)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const fetchPermission = createAsyncThunk(
  'roles/permissions',
  async (parms: params = defParamsPermission, thunkAPI: any) => {
    try {
      const { page, limit, order } = parms
      const response: PermissionList = await roleModuleService.getPermissionFilter(
        page,
        limit,
        '',
        order
      )
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const createRolePermission = createAsyncThunk(
  'roles/rolepermission',
  async (data: RolePermission, thunkAPI) => {
    try {
      const response = await roleModuleService.createRolePermission(data)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

// Slice
const roleModuleSlice = createSlice({
  name: 'roleModule',
  initialState,
  reducers: {
    setRoleAction: (state, action: PayloadAction<boolean>) => {
      state.roleActive = action.payload
    },
    setRolePermission: (state, action) => {
      const data = action.payload
      // console.log(`data => ${JSON.stringify(data)}`)
      state.roleId = data.roleId
      state.roleName = data.roleName
      state.selected = data.permissions
      // get permissions
    },
    setSelectedById: (state, action: PayloadAction<number>) => {
      // check already selected or not ,if selected , remove and if not Add on
      const id = action.payload
      if (state.selected.includes(id)) {
        state.selected = state.selected.filter((itemId) => itemId !== id)
      } else {
        const updateSelected = [...state.selected, id]
        state.selected = updateSelected
      }
    },
    setText: (state, action) => {
      state.text = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoles.pending, (state) => {
      // console.log('pending')
      state.loadingRole = true
    })
    builder.addCase(fetchRoles.fulfilled, (state, action) => {
      // console.log(`fulfilled`)
      // console.log(`fulfilled => ${JSON.stringify(action.payload)}`)
      state.dataTable = action.payload.rows
      state.counts = action.payload.count
      state.loadingRole = false
    })
    builder.addCase(fetchRoles.rejected, (state, action) => {
      // console.log(`rejected`)
      state.loadingRole = false
    })
    builder.addCase(fetchPermission.pending, (state) => {
      // console.log('pending')
      state.loadingPermission = true
    })
    builder.addCase(fetchPermission.fulfilled, (state, action) => {
      // console.log(`fulfilled`)
      // console.log(`fulfilled => ${JSON.stringify(action.payload)}`)
      state.permissionDataTable = action.payload.rows
      state.loadingPermission = false
    })
    builder.addCase(fetchPermission.rejected, (state, action) => {
      // console.log(`rejected`)
      state.loadingPermission = false
    })
  },
})
export default roleModuleSlice
export const { setRoleAction, setRolePermission, setSelectedById, setText } =
  roleModuleSlice.actions
// export const roleModuleActions = roleModuleSlice.actions
// export const departmentActions = departmentSlice.actions
