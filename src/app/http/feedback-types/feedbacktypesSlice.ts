import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import _ from 'lodash'

import { EditFeedbackTypes, FeedbackTypes, FeedbackTypesList, Params } from './feedbacktypes.model'
import FeedbackTypeService from './feedbacktypes.service'

export const defParamsFb: Params = {
  page: 1,
  limit: 99999,
  sortDir: 'asc',
  sortBy: 'name',
}

interface FeedbackState {
  dataTable: FeedbackTypesList
  editData: EditFeedbackTypes | undefined
  loading: boolean
  tabIndex: number
}

const initialState: FeedbackState = {
  dataTable: {
    count: 0,
    rows: [],
  },
  loading: false,
  editData: undefined,
  tabIndex: 0,
}

export const fetchFeedbackTypes = createAsyncThunk(
  'feedbackTypes/fetchFeedbackTypes',
  async (params: Params = defParamsFb, thunkAPI) => {
    try {
      const { page, limit, sortDir, sortBy, text, name } = params
      const response = await FeedbackTypeService.getFeedbackTypesByFilter(
        page,
        limit,
        sortBy,
        sortDir,
        text,
        name
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const fetchFeedbackTypesById = createAsyncThunk(
  'feedbackTypes/fetchFeedbackTypesById',
  async (name: string, thunkAPI) => {
    try {
      const response = await FeedbackTypeService.getFeedbackTypesById(name)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const createFeedbackType = createAsyncThunk(
  'feedbackTypes/createFeedbackType',
  async (data: FeedbackTypes, thunkAPI) => {
    try {
      const response = await FeedbackTypeService.createFeedbackType(data)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const updateFeedbackType = createAsyncThunk(
  'feedbackTypes/updateFeedbackType',
  async (data: FeedbackTypes, thunkAPI) => {
    try {
      const response = await FeedbackTypeService.updateFeedbackType(data)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const deleteFeedbackType = createAsyncThunk(
  'feedbackTypes/deleteFeedbackType',
  async (feedbackNames: string[], thunkAPI) => {
    try {
      const response = await FeedbackTypeService.deleteMultiFeedbackTypes(feedbackNames)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

const feedbackTypesSlice = createSlice({
  name: 'feedbacktypes',
  initialState,
  reducers: {
    setEditData: (state, action) => {
      state.editData = action.payload
    },
    setTabIndex: (state, action) => {
      state.tabIndex = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeedbackTypes.pending, (state, action) => {
      if (action.meta.arg.setLoading) state.loading = true
    })
    builder.addCase(
      fetchFeedbackTypes.fulfilled,
      (state, action: PayloadAction<FeedbackTypesList>) => {
        // console.log(`feedBack datas => ${JSON.stringify(action.payload)}`)
        const res = _.cloneDeep(action.payload)
        res.rows = res.rows.filter(item => item.name !== 'Appreciations')
        state.dataTable = res
        state.loading = false
      }
    )
    builder.addCase(fetchFeedbackTypes.rejected, (state, action) => {
      state.loading = false
    })
  },
})

export default feedbackTypesSlice
export const { setEditData, setTabIndex } = feedbackTypesSlice.actions
