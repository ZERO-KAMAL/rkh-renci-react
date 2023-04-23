import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import LocationDetailsConst from 'app/constants/location-details.const'

import {
  Department,
  DepartmentFormSchema,
  DepartmentList,
  SortingType,
  params,
} from './department.model'
import DepartmentService from './departmentService'

export const defParamsDep: params = {
  page: 1,
  limit: 100000,
  text: '',
  areaId: '',
  locationId: '',
  order: {
    sortDir: 'asc',
    sortBy: 'name',
  },
}

interface DepartmentState {
  dataTableDep: Department[]
  editData: Partial<Department> | null | undefined
  counts: number
  loadingDep: boolean
  disabledDep: boolean
  activeDep: boolean
  error: string
  itemIdForUpdate: number | null | undefined
  page: number
  limit: number
  text: string
  selectedAll: boolean
  selected: Array<number>
  departmentId: number | null | undefined
  order: SortingType
  name: string | null
}

const initialState: DepartmentState = {
  dataTableDep: [],
  editData: undefined,
  counts: 0,
  loadingDep: false,
  disabledDep: true,
  activeDep: false,
  error: '',
  itemIdForUpdate: undefined,
  page: 1,
  limit: 10,
  text: '',
  selectedAll: false,
  selected: [],
  departmentId: null,
  order: {
    sortDir: 'asc',
    sortBy: 'name',
  },
  name: 'Choose a department',
}
// Actions
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (parms: params = defParamsDep, thunkAPI) => {
    try {
      const { page, limit, areaId, locationId, text, order } = parms
      // console.log('fetchDepartmentsByArea=>' + areaId)
      // console.log(`parms=> ${JSON.stringify(parms)}`)
      const respsone: DepartmentList = await DepartmentService.getDepartmentFilter(
        page,
        limit,
        '',
        locationId,
        text,
        order
      )
      return respsone
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const fetchDepartmentReport = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, thunkAPI: any) => {
    try {
      const { page, limit, text, order } = thunkAPI.getState().department
      const respsone: DepartmentList = await DepartmentService.getDepartmentFilter(
        page,
        1000,
        '',
        '',
        text,
        order
      )
      return respsone
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const fetchDepartmentByAreaId = createAsyncThunk(
  'locationDetails/getDeprtmentByAreaId',
  async (data: any, thunkApi: any) => {
    try {
      const { locId, areaId, text } = data
      const response = await DepartmentService.getDepartmentByAreaId(locId, areaId, text)
      console.log(`getDeprtmentByAreaId => ${JSON.stringify(data)}`)
      return response
    } catch (err) {
      return thunkApi.rejectWithValue(err)
    }
  }
)

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (data: any, thunkAPI) => {
    try {
      // console.log(`createDepartment => ${JSON.stringify(data)}`)
      const response = await DepartmentService.createDepartment(data)
      if (response) {
        // const areaId = data.areaId
        const locationId = data.locationId
        const parms: params = { ...defParamsDep, locationId }
        thunkAPI.dispatch(fetchDepartments(parms))
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const departmentSlice = createSlice({
  name: 'department',
  initialState: initialState,
  reducers: {
    setItemIdForUpdate: (state, action) => {
      state.itemIdForUpdate = action.payload
    },
    setTextDep: (state, action) => {
      state.text = action.payload
    },
    setDepartmentId: (state, action) => {
      state.departmentId = action.payload
    },
    setDisabledDep: (state, action) => {
      state.disabledDep = action.payload
    },
    setActiveDep: (state, action) => {
      state.activeDep = action.payload
    },
    setNameDep: (state, action) => {
      state.name = action.payload
    },
    setDepartmentStateClear: () => initialState,
    // setDataTable: (state, action) => {
    //   console.log(`checking data => %o`, action.payload)
    //   // state.dataTable = action.payload
    // },
    setEditData: (state, action) => {
      state.editData = action.payload
    },
    setOrder: (state, action) => {
      state.order = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setLimit: (state, action) => {
      state.limit = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDepartments.pending, (state) => {
      // console.log('pending')
      state.loadingDep = true
    })
    builder.addCase(fetchDepartments.fulfilled, (state, action) => {
      // console.log(`fulfilled=> ${JSON.stringify(action.payload)}`)
      state.dataTableDep = action.payload.rows
      state.counts = action.payload.count
      state.loadingDep = false
    })
    builder.addCase(fetchDepartments.rejected, (state, action) => {
      // console.log('rejected')
      state.loadingDep = false
      state.error = action.error.message || 'Something was wrong'
    })
    builder.addCase(fetchDepartmentByAreaId.pending, (state) => {
      state.loadingDep = true
    })
    builder.addCase(fetchDepartmentByAreaId.fulfilled, (state, action) => {
      const departments: Department[] = action.payload.filter(
        (item: Department) => item.name && !LocationDetailsConst.EXCLUDE_DEPTS.includes(item.name)
      )
      state.dataTableDep = departments
      state.loadingDep = false
    })
    builder.addCase(fetchDepartmentByAreaId.rejected, (state) => {
      state.loadingDep = false
    })
  },
})

export default departmentSlice

export const {
  setItemIdForUpdate,
  setDisabledDep,
  setTextDep,
  setDepartmentId,
  setActiveDep,
  setNameDep,
  setDepartmentStateClear,
  setEditData,
  setOrder,
  setLimit,
  setPage,
  // setDataTable,
} = departmentSlice.actions

// advance
export const departmentActions = departmentSlice.actions
