import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Swal from 'sweetalert2'

import {
  FeedbackLabelUpdate,
  FeedbackReplySendForward,
} from './FeedbackEmailReplySendForward.model'
// import { SortingType } from './feedBackEmailLabel.model'
import FeedBackEmailReplySendForwardService from './FeedbackEmailReplySendForwardServices'

export interface FeedBackEmailReplySendForwardState {
  dataTable: [] | any
  loading: boolean
  subject: string
  content: string
  emailTo: []
  emailCc: []
  emailBc: []
  feedbackId: null
  parentId: null
  showCompose: boolean
}

const initialState: FeedBackEmailReplySendForwardState = {
  dataTable: [],
  loading: false,
  subject: '',
  content: '',
  emailTo: [],
  emailCc: [],
  emailBc: [],
  feedbackId: null,
  parentId: null,
  showCompose: false,
}

export const createFeedbackReplySendForward = createAsyncThunk(
  'feedbackEmailReplySendForwards/createFeedbackReplySendForward',
  async (data: FeedbackReplySendForward, thunkAPI: any) => {
    try {
      // console.log(`data => ${JSON.stringify(data)}`)
      const current: FeedBackEmailReplySendForwardState =
        thunkAPI.getState().feedbackEmailReplySendForw
      let response = null
      // if (current === null)
      response = await FeedBackEmailReplySendForwardService.createFeedbackReplySendForward(data)
      // else
      // response = await FeedBackEmailReplySendForwService.createFeedbackReplySendForw(data.data)
      Swal.fire({
        title: 'Sent Successfully',
        icon: 'success',
        confirmButtonColor: 'green',
      })
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const createFeedbackDraft = createAsyncThunk(
  'feedbackEmailReplySendForwards/createFeedbackReplySendForwardDraft',
  async (data: FeedbackReplySendForward, thunkAPI: any) => {
    try {
      // console.log(`data => ${JSON.stringify(data)}`)
      const current: FeedBackEmailReplySendForwardState =
        thunkAPI.getState().feedbackEmailReplySendForw
      let response = null
      // if (current === null)
      response = await FeedBackEmailReplySendForwardService.createFeedbackDraft(data)
      // else
      // response = await FeedBackEmailReplySendForwService.createFeedbackReplySendForw(data.data)
      // Swal.fire({
      //   title: 'Sent Successfully',
      //   icon: 'success',
      //   confirmButtonColor: 'green',
      // })
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const updateFeedbackLabel = createAsyncThunk(
  'feedbackEmailReplySendForwards/updateFeedbackLabel',
  async (data: any, thunkAPI: any) => {
    try {
      // console.log(`data => ${JSON.stringify(data)}`)
      let response = null
      // if (current === null)
      response = await FeedBackEmailReplySendForwardService.updateFeedbackLabel(data)
      Swal.fire({
        title: 'Labels updated',
        icon: 'success',
        confirmButtonColor: 'green',
      })
      // else
      // response = await FeedBackEmailReplySendForwService.createFeedbackReplySendForw(data.data)
      return response
    } catch (err) {
      Swal.fire({
        title: 'Some went wrong!',
        icon: 'error',
      })
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const updateMultipleFeedback = createAsyncThunk(
  'feedbackEmailReplySendForwards/updateMultipleFeedback',
  async (data: any = {}, thunkAPI: any) => {
    try {
      // console.log(`data => ${JSON.stringify(data)}`)
      const { data: res, successShow = true } = data || {}
      let response = null
      response = await FeedBackEmailReplySendForwardService.updateMultipleFeedback(res)
      if (successShow) {
        Swal.fire({
          title: 'Action has been successfully completed',
          icon: 'success',
          confirmButtonColor: 'green',
        })
      }
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

const feedBackEmailReplySendForwardSlice = createSlice({
  name: 'feedbackEmailReplySendForward',
  initialState,
  reducers: {
    setReplySendForwId: (state: any, action: any) => {
      state.ReplySendForwardId = action.payload
    },
    setCompose: (state: any, action: any) => {
      state.showCompose = action.payload
    },
    setComposeData: (state: any, action: any) => {
      state.subject = action.payload.subject
      state.content = action.payload.content
      state.emailTo = action.payload.emailTo
      state.emailBc = action.payload.emailBc
      state.emailCc = action.payload.emailCc
      state.parentId = action.payload.parentId
      state.feedbackId = action.payload.id
    },
    clearComposeData: (state: any) => {
      state.subject = ''
      state.content = ''
      state.emailTo = []
      state.emailBc = []
      state.emailCc = []
      state.parentId = null
      state.feedbackId = null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createFeedbackReplySendForward.pending, (state: any) => {
      state.loading = true
    })
    builder.addCase(createFeedbackReplySendForward.fulfilled, (state: any, action: any) => {
      state.loading = false
      state.showCompose = false
    })
    builder.addCase(createFeedbackReplySendForward.rejected, (state: any, action: any) => {
      state.loading = false
      state.showCompose = false
    })
    builder.addCase(updateFeedbackLabel.pending, (state: any) => {
      state.loading = true
    })
    builder.addCase(updateFeedbackLabel.fulfilled, (state: any, action: any) => {
      state.loading = false
    })
    builder.addCase(updateFeedbackLabel.rejected, (state: any, action: any) => {
      state.loading = false
    })
  },
})

export default feedBackEmailReplySendForwardSlice
export const { setCompose, setComposeData, clearComposeData } =
  feedBackEmailReplySendForwardSlice.actions
