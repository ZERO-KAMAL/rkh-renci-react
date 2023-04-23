import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { SortingType } from './feedBackEmailLabel.model'
import FeedBackEmailLabelService from './feedBackEmailLabelService'

interface FeedBackEmailLableState {
  dataTable: [] | any
  editData: any | null
  counts: number
  loading: boolean
  page: number
  limit: number
  text: string
  selectedAll: boolean
  selected: Array<number>
  order: SortingType
  labelId: number | string
  activeLabelForm: boolean
}

const initialState: FeedBackEmailLableState = {
  dataTable: [],
  editData: null,
  counts: 0,
  loading: false,
  page: 1,
  limit: 10,
  text: '',
  selectedAll: false,
  selected: [],
  order: {
    sortDir: 'desc',
    sortBy: 'id',
  },
  labelId: '',
  activeLabelForm: false,
}

export const fetchFeedbackLable = createAsyncThunk(
  'feedbackEmailLabels/fetchFeedbackLabels',
  async (_, thunkAPI: any) => {
    try {
      const { page, limit, text, order }: FeedBackEmailLableState =
        thunkAPI.getState().feedbackEmailLabel

      const response = await FeedBackEmailLabelService.getFeedbackLabelFilter(
        page,
        limit,
        text,
        order
      )

      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const createFeedbackLable = createAsyncThunk(
  'feedbackEmailLabels/createFeedbackLabel',
  async (data: any, thunkAPI: any) => {
    try {
      // console.log(`data => ${JSON.stringify(data)}`)
      const current: FeedBackEmailLableState = thunkAPI.getState().feedbackEmailLabel
      let response = null
      if (current.editData === null)
        response = await FeedBackEmailLabelService.createFeedbackLable(data.data)
      else
        response = await FeedBackEmailLabelService.updateFeedbackLabel(
          current.editData.id,
          data.data
        )

      if (response) {
        thunkAPI.dispatch(fetchFeedbackLable())
      }
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const deleteAllFeedbackLabel = createAsyncThunk(
  'feedbackEmailLabels/deleteAllFeedbackLable',
  async (selected: Array<number>, thunkAPI: any) => {
    try {
      const respsone = await FeedBackEmailLabelService.deleteAllFeedbackLable(selected)
      // grab data
      thunkAPI.dispatch(fetchFeedbackLable())
      thunkAPI.dispatch(setClearSelected())
      return respsone
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

const feedBackEmailLableSlice = createSlice({
  name: 'feedbackEmailLabel',
  initialState,
  reducers: {
    setStateClear: () => initialState,
    setClearSelected: (state: any) => {
      state.selected = []
      state.selectedAll = false
    },
    setActiveLableForm: (state: any, action: any) => {
      state.activeLabelForm = action.payload
    },
    setText: (state: any, action: any) => {
      state.text = action.payload
    },
    setLabelId: (state: any, action: any) => {
      state.labelId = action.payload
    },
    setEditData: (state: any, action: any) => {
      console.log(`setEditData => ${JSON.stringify(action.payload)}`)
      state.editData = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeedbackLable.pending, (state: any) => {
      state.loading = true
    })
    builder.addCase(fetchFeedbackLable.fulfilled, (state: any, action: any) => {
      state.counts = action.payload.count
      state.dataTable = action?.payload?.rows?.filter((f: any) => f.name !== 'Appreciations')
      state.loading = false
      state.selected = []
    })
    builder.addCase(fetchFeedbackLable.rejected, (state: any, action: any) => {
      state.loading = false
    })
  },
})

export default feedBackEmailLableSlice
export const {
  setClearSelected,
  setActiveLableForm,
  setText,
  setStateClear,
  setLabelId,
  setEditData,
} = feedBackEmailLableSlice.actions
