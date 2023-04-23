import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { Location, LocationList, SortingType, params } from './location.model'
import LocationService from './locationService'

export const defParamsLoc: params = {
  page: 1,
  limit: 100000,
  text: '',
  locationId: null,
  order: {
    sortDir: 'asc',
    sortBy: 'name',
  },
}

interface LocationState {
  dataTable: Location[]
  editData: Partial<Location> | null | undefined
  counts: number
  loading: boolean
  error: string
  itemIdForUpdate: number | null | undefined
  page: number
  limit: number
  text: string
  selectedAll: boolean
  selected: Array<number>
  locationId: number | null
  order: SortingType
}

const initialState: LocationState = {
  dataTable: [],
  editData: undefined,
  counts: 0,
  loading: false,
  error: '',
  itemIdForUpdate: undefined,
  page: 1,
  limit: 10,
  text: '',
  selectedAll: false,
  selected: [],
  locationId: null,
  order: {
    sortDir: 'asc',
    sortBy: 'name',
  },
}

// Actions
export const fetchLocations = createAsyncThunk(
  'loations/fetchLoations',
  async (parms: params = defParamsLoc, thunkAPI) => {
    try {
      // console.log('fetchLocationsByLocation=>' + parms.locationId)
      // console.log(`parms => ${JSON.stringify(parms.order)}`)

      const { page, limit, locationId, text, order } = parms
      const response: LocationList = await LocationService.getLocationFilter(
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
export const fetchLocationReport = createAsyncThunk(
  'loations/fetchLoations',
  async (_, thunkAPI: any) => {
    try {
      // console.log('fetchLocationsByLocation=>' + parms.locationId)
      // console.log(`parms => ${JSON.stringify(parms.order)}`)

      const { page, limit, locationId, text, order } = thunkAPI.getState().location
      const response: LocationList = await LocationService.getLocationFilter(
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
// Slice

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setItemIdForUpdate: (state, action) => {
      state.itemIdForUpdate = action.payload
    },
    setEditData: (state, action) => {
      state.editData = action.payload
    },
    setTextLoc: (state, action) => {
      state.text = action.payload
    },
    setOrder: (state, action) => {
      state.order = action.payload
    },
    setLimit: (state, action) => {
      state.limit = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setLocationStateClear: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchLocations.pending, (state) => {
      // console.log('loation pending')
      state.loading = true
    })
    builder.addCase(fetchLocations.fulfilled, (state, action: PayloadAction<LocationList>) => {
      // console.log('loation fulfilled => ' + JSON.stringify(action.payload))
      state.dataTable = action.payload.rows
      state.counts = action.payload.count
      state.loading = false
    })
    builder.addCase(fetchLocations.rejected, (state, action) => {
      console.error('loation rejected')
      state.loading = false
      state.error = action.error.message || 'Something was wrong'
    })
  },
})

export default locationSlice

export const { setEditData, setItemIdForUpdate, setTextLoc, setOrder, setLimit, setPage, setLocationStateClear } =
  locationSlice.actions
