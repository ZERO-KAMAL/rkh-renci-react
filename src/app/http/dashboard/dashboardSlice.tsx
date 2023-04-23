import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { statusCase } from 'app/modules/feedback/form/FeedbackDetail'

import {
  Feedback,
  FeedbackResponse,
  FeedbackTypeParams,
  FeedbackTypeResponse,
  SortingType,
  params,
} from './dashboard.model'
import DashboardService from './dashboardService'

export const defParamsDashType: FeedbackTypeParams = {
  feedbackTypeName: '',
  submittedDateFrom: '',
  submittedDateTo: '',
  type: '',
  locationId: '',
  areaId: '',
  departmentId: '',
}

export const defParamsDash: params = {
  status: '',
  submittedDateFrom: '',
  submittedDateTo: '',
  type: '',
  locationId: '',
  areaId: '',
  departmentId: '',
}

interface DashboardState {
  allFeedbacks: FeedbackResponse
  activeFeedbacks: FeedbackResponse
  pendingFeedbacks: FeedbackResponse
  overdueFeedbacks: FeedbackResponse
  feedbackPiechart: FeedbackTypeResponse[]
  feedbackAreachart: FeedbackTypeResponse[]
  loading: boolean
  error: string
  order: SortingType
  selectedLocationIds: number[]
  selectedAreaIds: number[]
  selectedDeptIds: number[]
}

const initialState: DashboardState = {
  selectedLocationIds: [],
  selectedAreaIds: [],
  selectedDeptIds: [],
  feedbackPiechart: [],
  feedbackAreachart: [],
  allFeedbacks: {
    count: 0,
    status: '',
    data: [],
    previousCount: 0,
  },
  activeFeedbacks: {
    count: 0,
    status: '',
    data: [],
    previousCount: 0,
  },
  pendingFeedbacks: {
    count: 0,
    status: '',
    data: [],
    previousCount: 0,
  },
  overdueFeedbacks: {
    count: 0,
    status: '',
    data: [],
    previousCount: 0,
  },
  loading: false,
  error: '',
  order: {
    sortDir: 'asc',
    sortBy: null,
  },
}
// Actions
export const fetchFeedbacksAreaChart = createAsyncThunk(
  'dashboard/fetchFeedbacksByFeedbackTypeAreaChart',
  async (parms: FeedbackTypeParams = defParamsDashType, thunkAPI) => {
    try {
      const {
        feedbackTypeName,
        submittedDateFrom,
        submittedDateTo,
        type,
        locationId,
        areaId,
        departmentId,
      } = parms
      const respsone: FeedbackTypeResponse[] = await DashboardService.getFeedbackByFeedbackType(
        feedbackTypeName,
        submittedDateFrom,
        submittedDateTo,
        type,
        locationId,
        areaId,
        departmentId
      )
      return respsone
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const fetchFeedbacksPiechart = createAsyncThunk(
  'dashboard/fetchFeedbacksByFeedbackTypePiechart',
  async (parms: FeedbackTypeParams = defParamsDashType, thunkAPI) => {
    try {
      const {
        feedbackTypeName,
        submittedDateFrom,
        submittedDateTo,
        type,
        locationId,
        areaId,
        departmentId,
      } = parms
      const respsone: FeedbackTypeResponse[] = await DashboardService.getFeedbackByFeedbackType(
        feedbackTypeName,
        submittedDateFrom,
        submittedDateTo,
        type,
        locationId,
        areaId,
        departmentId
      )
      return respsone
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const fetchFeedbacksByStatus = createAsyncThunk(
  'dashboard/fetchFeedbacks',
  async (parms: params = defParamsDash, thunkAPI) => {
    try {
      const { status, submittedDateFrom, submittedDateTo, type, locationId, areaId, departmentId } =
        parms
      const respsone: FeedbackResponse[] = await DashboardService.getFeedbackByMultiStatus(
        status,
        submittedDateFrom,
        submittedDateTo,
        type,
        locationId,
        areaId,
        departmentId
      )
      return respsone
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const fetchAllFeedbacks = createAsyncThunk(
  'dashboard/fetchAllFeedbacks',
  async (parms: params = defParamsDash, thunkAPI) => {
    try {
      const { submittedDateFrom, submittedDateTo } = parms
      const respsone: Feedback[] = await DashboardService.getFeedbackAllStatus(
        submittedDateFrom,
        submittedDateTo
      )
      return respsone
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: initialState,
  reducers: {
    setDashboardStateClear: () => initialState,
    setSelectedLocationIds: (state, action) => {
      state.selectedLocationIds = action.payload
    },
    setSelectedAreaIds: (state, action) => {
      state.selectedAreaIds = action.payload
    },
    setSelectedDeptIds: (state, action) => {
      state.selectedDeptIds = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeedbacksByStatus.fulfilled, (state, action) => {
      // if (action.meta.arg.status === statusCase.CaseActive) state.activeFeedbacks = action.payload
      // if (action.meta.arg.status === statusCase.Pending) state.pendingFeedbacks = action.payload
      // if (action.meta.arg.status === statusCase.Overdue) state.overdueFeedbacks = action.payload

      const pending: FeedbackResponse | undefined = action.payload.find(
        (x) => x.status === statusCase.Pending
      )
      pending ? (state.pendingFeedbacks = pending) : {}

      const active: FeedbackResponse | undefined = action.payload.find(
        (x) => x.status === statusCase.CaseActive
      )
      active ? (state.activeFeedbacks = active) : {}

      const overdue: FeedbackResponse | undefined = action.payload.find(
        (x) => x.status === statusCase.Overdue
      )
      overdue ? (state.overdueFeedbacks = overdue) : {}

      console.log('response: ', action.payload)
    })
    // fetchFeedbacksByFeedbackType Piechart
    builder.addCase(fetchFeedbacksPiechart.fulfilled, (state, action) => {
      state.feedbackPiechart = action.payload
      state.loading = false
    })
    builder.addCase(fetchFeedbacksPiechart.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(fetchFeedbacksPiechart.pending, (state) => {
      state.loading = true
    })
    // fetchFeedbacksByFeedbackType Areachart
    builder.addCase(fetchFeedbacksAreaChart.fulfilled, (state, action) => {
      state.feedbackAreachart = action.payload
      state.loading = false
    })
    builder.addCase(fetchFeedbacksAreaChart.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(fetchFeedbacksAreaChart.pending, (state) => {
      state.loading = true
    })
  },
})

export default dashboardSlice

export const {
  setDashboardStateClear,
  setSelectedLocationIds,
  setSelectedAreaIds,
  setSelectedDeptIds,
} = dashboardSlice.actions

// advance
export const dashboardActions = dashboardSlice.actions
