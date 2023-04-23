import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { SortingType, params } from './feedBackEmail.model'
import FeedBackEmailService from './feedBackEmailService'

export const defParamsFeedback: params = {
  isRead: false,
  isStarred: false,
  isArchive: false,
  subject: '',
  emailType: '',
  createdAtFrom: '' || undefined,
  createdAtTo: '' || undefined,
  page: 1,
}
interface EmailTypeData {
  count: number
  emailType: 'Inbox' | 'Draft' | 'Sent' | 'Junk' | 'Starred' | 'Archive'
}
interface FeedBackEmailState {
  dataTable: [] | any
  editData: any
  emailTypeList: [] | any
  counts: number
  loading: boolean
  page: number
  limit: number
  text: string
  subject: string
  content: string
  emailType: string
  isRead: string
  isStarred: string
  isArchive: string
  createdAtFrom: string | null
  createdAtTo: string | null
  order: SortingType
  selectedAll: boolean
  selected: Array<number>
  emailId: string | number
  showReply: boolean
  showForward: boolean
  emailTypeCounts: null | Array<EmailTypeData>
  groupData: [] | any
  loadingGroupData: boolean
}

export const initialState: FeedBackEmailState = {
  dataTable: [],
  editData: null,
  emailTypeList: [],
  counts: 0,
  loading: false,
  page: 0,
  limit: 10,
  text: '',
  subject: '',
  content: '',
  emailType: '',
  isRead: 'false',
  isStarred: 'false',
  isArchive: 'false',
  createdAtFrom: '',
  createdAtTo: '',
  order: {
    sortDir: 'desc',
    sortBy: 'id',
  },
  selectedAll: false,
  selected: [],
  emailId: '',
  showReply: false,
  showForward: false,
  emailTypeCounts: null,
  groupData: [],
  loadingGroupData: false
}

export const fetchFeedbackEmail = createAsyncThunk(
  'feedbackEmails/fetchFeedbackEmails',
  async (params: params = defParamsFeedback, thunkAPI: any) => {
    try {
      const { limit, order, text, content }: FeedBackEmailState = thunkAPI.getState().feedbackEmail
      const { isRead, isStarred, subject, createdAtFrom, createdAtTo, emailType, page, labelId, isArchive, feedbackId } =
        params
      const response = await FeedBackEmailService.getFeedbackInboxFilter(
        page,
        limit,
        order,
        text,
        subject,
        content,
        emailType,
        isRead,
        isStarred,
        createdAtFrom,
        createdAtTo,
        labelId,
        isArchive,
        feedbackId
      )
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const fetchFeedbackEmailGroup = createAsyncThunk(
  'feedbackEmails/fetchFeedbackEmailsGroup',
  async (params: params = defParamsFeedback, thunkAPI: any) => {
    try {
      const { text, content }: FeedBackEmailState = thunkAPI.getState().feedbackEmail
      const limit = 1000;
      const order: any = {
        sortDir: 'asc',
        sortBy: 'createdAt'
      }
      const isRead = undefined
      const isStarred = undefined
      const isArchive = undefined
      const emailType = undefined
      const { subject, createdAtFrom, createdAtTo, page, labelId, feedbackId } =
        params
      const response = await FeedBackEmailService.getFeedbackInboxFilter(
        page,
        limit,
        order,
        text,
        subject,
        content,
        emailType,
        isRead,
        isStarred,
        createdAtFrom,
        createdAtTo,
        labelId,
        isArchive,
        feedbackId
      )
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const DeleteFeedbackEmail = createAsyncThunk(
  'feedbackEmails/DeleteFeedbackEmails',
  async (ids: string[], thunkAPI: any) => {
    try {
      const response = await FeedBackEmailService.deleteAllFeedbackEmail(ids)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const getFeedbackType = createAsyncThunk(
  'feedbackEmailReplySendForwards/getFeedbackType',
  async (params: any, thunkAPI: any) => {
    try {
      return await FeedBackEmailService.getFeedbackType()
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const getFeedbackById = createAsyncThunk(
  'feedbackEmailReplySendForwards/getFeedbackById',
  async (params: any, thunkAPI: any) => {
    try {
      return await FeedBackEmailService.getFeedbackById(params)
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

const feedBackEmailSlice = createSlice({
  name: 'feedbackEmail',
  initialState,
  reducers: {
    setEmailId: (state: any, action: any) => {
      state.emailId = action.payload
      state.editData = state.dataTable.filter((d: any) => d.id === action.payload)[0]
    },
    setPage: (state: any, action: any) => {
      state.page = action.payload
    },
    setShowReply: (state: any, action: any) => {
      state.showReply = action.payload
    },
    setShowForward: (state: any, action: any) => {
      state.showForward = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeedbackEmail.pending, (state: any) => {
      state.loading = true
    })
    builder.addCase(fetchFeedbackEmail.fulfilled, (state: any, action: any) => {
      console.log(`email list => ${JSON.stringify(action.payload)}`)
      state.counts = action.payload.count
      state.dataTable = action.payload.rows
      state.loading = false
      state.selected = []
    })
    builder.addCase(fetchFeedbackEmail.rejected, (state: any, action: any) => {
      console.log(JSON.stringify(action.payload))
      state.loading = false
    })

    builder.addCase(DeleteFeedbackEmail.pending, (state: any) => {
      state.loading = true
    })
    builder.addCase(DeleteFeedbackEmail.fulfilled, (state: any, action: any) => {
      state.loading = false
    })
    builder.addCase(DeleteFeedbackEmail.rejected, (state: any, action: any) => {
      state.loading = false
    })
    builder.addCase(getFeedbackType.pending, (state: any) => {
      state.loading = true
    })
    builder.addCase(getFeedbackType.fulfilled, (state: any, action: any) => {
      state.emailTypeCounts = action.payload
      state.loading = false
    })
    builder.addCase(getFeedbackType.rejected, (state: any, action: any) => {
      state.loading = false
    })
    builder.addCase(getFeedbackById.pending, (state: any) => {
      state.loading = true
    })
    builder.addCase(getFeedbackById.fulfilled, (state: any, action: any) => {
      state.editData = action.payload
      state.loading = false
    })
    builder.addCase(getFeedbackById.rejected, (state: any, action: any) => {
      state.loading = false
    })
    builder.addCase(fetchFeedbackEmailGroup.pending, (state: any) => {
      state.loadingGroupData = true
    })
    builder.addCase(fetchFeedbackEmailGroup.fulfilled, (state: any, action: any) => {
      state.groupData = action.payload.rows
      state.loadingGroupData = false
    })
    builder.addCase(fetchFeedbackEmailGroup.rejected, (state: any, action: any) => {
      state.loadingGroupData = false
    })
  },
})

export default feedBackEmailSlice
export const { setPage, setEmailId, setShowReply, setShowForward } = feedBackEmailSlice.actions
