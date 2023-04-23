import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { departmentActions } from '../departments/departmentSlice'
import { Area, AreaFormSchema, AreaList, SortingType, params } from './area.model'
import AreaService from './areaService'

// Use after create New Records
export const defParams: params = {
  page: 1,
  limit: 100000,
  text: '',
  locationId: undefined,
  order: {
    sortDir: 'asc',
    sortBy: 'name',
  },
}

interface AreaState {
  dataTableArea: Area[]
  editData: Partial<Area> | null | undefined
  counts: number
  loading: boolean
  disabledArea: boolean
  active: boolean
  error: string
  itemIdForUpdate: number | null | undefined
  page: number
  limit: number
  text: string
  selectedAll: boolean
  selected: Array<number>
  areaId: number | null | undefined
  order: SortingType
  name: string | null
  locationId: number | undefined
}

const initialState: AreaState = {
  dataTableArea: [], // testing purpose
  editData: undefined,
  counts: 0,
  loading: false,
  disabledArea: true,
  active: false,
  error: '',
  itemIdForUpdate: undefined,
  page: 1,
  limit: 10,
  text: '',
  selectedAll: false,
  selected: [],
  areaId: null,
  order: {
    sortDir: 'asc',
    sortBy: 'name',
  },
  name: 'Choose a area',
  locationId: undefined,
}
// Actions

export const fetchAreas = createAsyncThunk(
  'areas/fetchAreas',
  async (parms: params, thunkAPI: any) => {
    try {
      const { page, limit, locationId, text, order } = parms
      // console.log('fetchAreasByLocation =>' + locationId)
      // console.log(`parms=> ${JSON.stringify(parms)}`)
      // console.log(`signal => ${thunkAPI.signal}`)
      //  const response: AreaList = await AreaService.getAreaFilter(parms)

      const response: AreaList = await AreaService.getAreaFilter(
        page,
        limit,
        0,
        text,
        order,
        thunkAPI.signal
      )
      // check the data and set to deparment
      // if (response?.count > 0) {
      //   thunkAPI.dispatch(departmentActions.setDataTable('hello'))
      // }

      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const fetchAreaReport = createAsyncThunk('areas/fetchAreas', async (_, thunkAPI: any) => {
  try {
    const { page, text, order } = thunkAPI.getState().department
    const response: AreaList = await AreaService.getAreaFilter(
      page,
      1000,
      0,
      text,
      order,
      thunkAPI.signal
    )

    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export const fetchAreaByLocationId = createAsyncThunk(
  'locationDetails/getAreaById',
  async (id: any, thunkAPI: any) => {
    try {
      const response = await AreaService.getAreaByIdLocationDetail(id)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const fetchAreaByLocationIdWithSearch = createAsyncThunk(
  'locationDetails/getAreaByIdWithSearch',
  async (value: any, thunkAPI: any) => {
    const { locationId, text } = value
    try {
      const response = await AreaService.getAreaByIdLocationDetail(locationId, text)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const createArea = createAsyncThunk(
  'areas/createArea',
  async (data: AreaFormSchema, thunkAPI: any) => {
    try {
      // console.log(`createArea => ${JSON.stringify(data)}`)
      const response = await AreaService.createArea(data)
      // console.log(`respsone => ${JSON.stringify(response)}`)
      // call back the getbyfilter
      if (response) {
        // console.log(`locationId => ${(thunkAPI.getState().locationDetail.form.locationId)}`)
        // const locationId = thunkAPI.getState().locationDetail.form.locationId
        const locationId = data.locationId

        const parms: params = { ...defParams, locationId }
        thunkAPI.dispatch(fetchAreas(parms))
      }

      return response
    } catch (error) {
      console.error('Something went wrong')
      return thunkAPI.rejectWithValue(error)
    }
  }
)
// Slice
const areaSlice = createSlice({
  name: 'area',
  initialState,
  reducers: {
    setItemIdForUpdate: (state, action) => {
      state.itemIdForUpdate = action.payload
    },
    setText: (state, action) => {
      state.text = action.payload
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
    setAreaId: (state, action) => {
      state.areaId = action.payload
    },
    setAreaDisabled: (state, action) => {
      state.disabledArea = action.payload
    },
    setAreaActive: (state, action) => {
      state.active = action.payload
    },
    setName: (state, action) => {
      state.name = action.payload
    },
    setEditData: (state, action) => {
      state.editData = action.payload
    },
    setAreaStateClear: () => initialState,
    onSelect: (state, action) => {
      const id = Number(action.payload)
      // check already selected
      if (state.selected?.includes(id)) {
        // remove
        state.selected = state.selected.filter((itemID) => itemID !== id)
      } else {
        // add
        state.selected = [...state.selected, id]
      }
    },
    onSelectAll: (state, action) => {
      // check selectedAll is true
      if (state.selectedAll) {
        state.selected = []
      } else {
        const data = state.dataTableArea
        if (!data || !data.length) {
          return
        }
        state.selected = data.filter((item) => item.id).map((item) => item.id)
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAreas.pending, (state) => {
      // console.log('pending')
      state.loading = true
    })
    builder.addCase(fetchAreas.fulfilled, (state, action) => {
      // console.log('fulfilled=>' + JSON.stringify(action.payload))
      state.dataTableArea = action.payload.rows
      state.counts = action.payload.count
      state.loading = false
    })
    builder.addCase(fetchAreas.rejected, (state, action) => {
      // console.log('rejected')
      state.loading = false

      // state.dataTable = null
      state.error = action.error.message || 'Something was wrong'
    })
    builder.addCase(fetchAreaByLocationId.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchAreaByLocationId.fulfilled, (state, action) => {
      
      // Sorting func 1: Sort Strings with num
      const sortAlphaNum = (a: any, b: any) => {
        return a.name.localeCompare(b.name, 'en', { numeric: true })
      }
      const areaNames = action.payload.map((item: { id: any, name: string }) => item.name)
      const containsWard = areaNames.findIndex((element: any) => element.toLowerCase().includes("ward")) > 0 ? true : false

      if (containsWard) {
        // Ward have to be in front
        const sorted = action.payload.sort(sortAlphaNum)
        const withoutWard = sorted.filter((e: any) => !e.name.toLowerCase().includes('ward'))
        const withWard = sorted.filter((e: any) => e.name.toLowerCase().includes('ward'))
        state.dataTableArea = withWard.concat(withoutWard)
      } else {
        state.dataTableArea = action.payload.sort(sortAlphaNum)
      }
      
      state.loading = false
    })
    builder.addCase(fetchAreaByLocationId.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(fetchAreaByLocationIdWithSearch.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchAreaByLocationIdWithSearch.fulfilled, (state, action) => {
      state.dataTableArea = action.payload
      state.loading = false
    })
    builder.addCase(fetchAreaByLocationIdWithSearch.rejected, (state) => {
      state.loading = false
    })
  },
})
export default areaSlice
export const {
  setItemIdForUpdate,
  setAreaId,
  setText,
  setOrder,
  setPage,
  setLimit,
  setName,
  setEditData,
  setAreaDisabled,
  setAreaActive,
  setAreaStateClear,
  onSelect,
  onSelectAll,
} = areaSlice.actions
