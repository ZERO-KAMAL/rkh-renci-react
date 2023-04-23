import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { GrCoatCheck } from 'react-icons/gr'

import {
  LocationDetail,
  LocationDetailFormScheam,
  LocationDetailList,
  LocationDetailStructure,
  SortingType,
  params,
} from '../location-datas/locationDetail.model'
import LocationDetailService from './locationDetailService'

export const defParams: params = {
  page: 1,
  limit: 5,
  text: '',
  locationId: '',
  order: {
    sortDir: 'asc',
    sortBy: 'locationId',
  },
}

const defFrom: LocationDetailFormScheam = {
  locationId: 0,
  areaId: 0,
  departmentId: 0,
  address: null,
}

interface LocationDetailState {
  dataTable: LocationDetailStructure[] | null
  editData: LocationDetailStructure | null
  counts: number
  loading: boolean
  error: string
  itemIdForUpdate: number | null | undefined
  page: number
  limit: number
  text: string
  selectedAll: boolean
  selected: Array<number>
  locationId: number | string
  order: SortingType
  form: LocationDetailFormScheam | null
}

const initialState: LocationDetailState = {
  dataTable: [],
  editData: null,
  counts: 0,
  loading: false,
  error: '',
  itemIdForUpdate: undefined,
  page: 1,
  limit: 5,
  text: '',
  selectedAll: false,
  selected: [],
  locationId: '',
  order: {
    sortDir: 'asc',
    sortBy: 'locationId',
  },
  form: defFrom,
}

// Actions
export const fetchLocationDetails = createAsyncThunk(
  'locationDetails/fetchLocationDetails',
  async (parms: params, thunkAPI: any) => {
    try {
      const { page, limit, locationId, text, order } = parms
      // console.log(`parms => ${JSON.stringify(parms)}`)
      const response: LocationDetailList = await LocationDetailService.getLocationDetailFilter(
        page,
        limit,
        locationId,
        text,
        order
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const createLocationDetails = createAsyncThunk(
  'locationDetails/createLocationDetails',
  async (data: LocationDetailFormScheam, thunkAPI: any) => {
    try {
      let response = {}
      // console.log(`createLocationDetail => ${JSON.stringify(data)}`)
      let isUpdate = false
      if (thunkAPI.getState().locationDetail.editData) {
        // update
        const id = thunkAPI.getState().locationDetail.editData.id
        // console.log(`edit... => ${id}`)
        response = await LocationDetailService.updateLocationDetail(id, data)
        isUpdate = true
      } else {
        // create
        // console.log(`save...`)
        response = await LocationDetailService.createLocationDetail(data)
      }
      // response = await LocationDetailService.createLocationDetail(data)
      // console.log(`respsone => ${JSON.stringify(response)}`)
      if (response) {
        const { locationId, page, limit } = thunkAPI.getState().locationDetail
        const parms: params = { ...defParams, locationId, page, limit }
        if (isUpdate) thunkAPI.dispatch(setClearEditData())
        thunkAPI.dispatch(fetchLocationDetails(parms))
      }
      return response
    } catch (error) {
      console.error(error)
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const deleteAllLocationDetails = createAsyncThunk(
  'locationDetails/deleteAllLocationDetails',
  async (selected: Array<number>, thunkAPI: any) => {
    try {
      // const ids = thunkAPI.getState().locationDetail.selected
      const ids = selected
      const response = await LocationDetailService.deleteAllLoationDetail(ids)
      // console.log(`response => ${JSON.stringify(response)}`)
      // grab data
      const { locationId, page, limit } = thunkAPI.getState().locationDetail
      const parms: params = { ...defParams, locationId, page, limit }
      thunkAPI.dispatch(fetchLocationDetails(parms))
      thunkAPI.dispatch(setClearSelected())
    } catch (error) {
      console.error(error)
      return thunkAPI.rejectWithValue(error)
    }
  }
)
// Slice

const locationDetailSlice = createSlice({
  name: 'locationDetail',
  initialState,
  reducers: {
    setItemIdForUpdate: (state, action) => {
      state.itemIdForUpdate = action.payload
    },
    setFormLocationId: (state, action) => {
      state.form!.locationId = action.payload
    },
    setFormAreaId: (state, action) => {
      state.form!.areaId = action.payload
    },
    setFormDepartmentId: (state, action) => {
      state.form!.departmentId = action.payload
    },
    setFormAddress: (state, action) => {
      state.form!.address = action.payload
    },
    setText: (state, action) => {
      state.text = action.payload
    },
    setLocationId: (state, action) => {
      // console.log(`location menu select => ${action.payload}`)
      state.locationId = action.payload
    },
    setFormClear: (state) => {
      if (state.itemIdForUpdate === undefined) {
        state.form = defFrom
        state.editData = null
      }
    },
    setClearEditData: (state) => {
      state.editData = null
    },
    setLocationSelectClear: (state, action) => {
      if (action.payload) {
        const address = state.form?.address!
        // console.log(`from address => ${address}`)
        state.form = { ...defFrom, address }
      } else {
        state.form = defFrom
      }
    },
    setEditData: (state, action: PayloadAction<LocationDetailStructure>) => {
      state.editData = action.payload
      state.form = {
        locationId: action.payload.locationId,
        areaId: action.payload.areaId,
        departmentId: action.payload.departmentId,
        address: action.payload.address,
      }
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setLimit: (state, action) => {
      state.limit = action.payload
    },
    setOrder: (state, action) => {
      state.order = action.payload
    },
    setClearSelected: (state) => {
      state.selected = []
      state.selectedAll = false
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
      // check selected count and row count
      if (state.selected.length === state.dataTable?.length) {
        state.selectedAll = true
      } else {
        state.selectedAll = false
      }
    },
    setSelectedAll: (state, action: PayloadAction<boolean>) => {
      const toggle = action.payload
      state.selectedAll = toggle

      if (state.dataTable) {
        if (toggle) {
          // add on
          // console.log('add on.....')
          const ids: any[] = state.dataTable.map((item) => item.id)
          state.selected = ids
        } else {
          // remove
          // console.log('remove.....')
          state.selected = []
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocationDetails.pending, (state) => {
      // console.log('pending')
      state.loading = true
    })
    builder.addCase(
      fetchLocationDetails.fulfilled,
      (state, action: PayloadAction<LocationDetailList>) => {
        // console.log('fetchLocationDetails fulfiled')
        state.dataTable = destructureData(action.payload.rows)
        state.counts = action.payload.count
        state.loading = false
      }
    )
    builder.addCase(fetchLocationDetails.rejected, (state, action) => {
      // console.log('rejected')
      //  state.dataTable = null
      state.loading = false
      state.error = action.error.message || 'Something was wrong'
    })
  },
})

// Function
const destructureData = (datas: LocationDetail[]) => {
  const dataTable: Array<LocationDetailStructure> = []
  // console.log(`destructureData..... ${JSON.stringify(datas)}`)
  try {
    datas.forEach((data) => {
      dataTable.push({
        id: data.id,
        locationId: data?.locationId,
        locationName: data.location?.name,
        areaId: data?.areaId,
        areaName: data.area?.name,
        departmentId: data?.departmentId,
        departmentName: data.department?.name,
        address: data.location?.address,
      })
    })
  } catch (err) {
    console.error(err)
  }
  return dataTable
}

export default locationDetailSlice
export const {
  setItemIdForUpdate,
  setFormLocationId,
  setFormAreaId,
  setFormDepartmentId,
  setFormAddress,
  setFormClear,
  setEditData,
  setText,
  setLocationId,
  setLocationSelectClear,
  setClearEditData,
  setPage,
  setLimit,
  setSelectedById,
  setSelectedAll,
  setClearSelected,
  setOrder,
} = locationDetailSlice.actions
