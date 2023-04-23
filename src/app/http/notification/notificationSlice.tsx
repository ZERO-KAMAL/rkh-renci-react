import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { POLLING_NOTIFICATION_COUNT } from 'app/constants/polling-frequency'
import { toast } from 'react-toastify'

import { NotificationList, SortingType, params } from './notification.model'
import NotificationService from './notificationService'

export const defParamsNotifyPolling: params = {
  page: 1,
  limit: POLLING_NOTIFICATION_COUNT,
  text: '',
  type: 'feedback',
  isAlert: '',
  order: {
    sortDir: 'desc',
    sortBy: 'id',
  },
  userId: undefined,
  read: undefined,
}

export const defParamsNotify: params = {
  page: 1,
  limit: 10,
  text: '',
  type: 'feedback',
  isAlert: '',
  order: {
    sortDir: 'desc',
    sortBy: 'id',
  },
  userId: undefined,
  read: undefined,
}

interface NotificationState {
  loading: boolean
  updating: boolean
  error: string
  page: number
  limit: number
  text: string
  type: string
  order: SortingType
  notifications: NotificationList
  notificationsData: NotificationList
  notificationsDataLoading: boolean
  cachedNotifications: NotificationList
  unreadNotifications: NotificationList
}

const initialState: NotificationState = {
  loading: true,
  updating: false,
  error: '',
  page: 1,
  limit: 10,
  text: '',
  type: 'feedback',
  order: {
    sortDir: 'desc',
    sortBy: 'id',
  },
  notifications: {
    count: 0,
    rows: [],
  },
  notificationsData: {
    count: 0,
    rows: [],
  },
  notificationsDataLoading: true,
  // unreadCount: 0,
  cachedNotifications: {
    count: -1,
    rows: [],
  },
  unreadNotifications: {
    count: 0,
    rows: [],
  },
}

// Actions
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params: params = defParamsNotify, thunkAPI) => {
    try {
      // console.log('fetchNotificationsByNotification=>' + params.type)
      // console.log(`params => ${JSON.stringify(params.order)}`)

      const { page, limit, type, text, order, isAlert, userId, read } = params
      const response = await NotificationService.getNotificationFilter(
        page,
        limit,
        order,
        type,
        text,
        isAlert,
        userId,
        read
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const fetchNotificationsData = createAsyncThunk(
  'notifications/fetchNotificationsData',
  async (params: params = defParamsNotify, thunkAPI) => {
    try {
      // console.log('fetchNotificationsByNotification=>' + params.type)
      // console.log(`params => ${JSON.stringify(params.order)}`)

      const { page, limit, type, text, order, isAlert, userId, read } = params
      const response = await NotificationService.getNotificationFilter(
        page,
        limit,
        order,
        type,
        text,
        isAlert,
        userId,
        read
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const fetchNotificationsUnreadData = createAsyncThunk(
  'notifications/fetchNotificationsUnreadData',
  async (params: params = defParamsNotify, thunkAPI) => {
    try {
      // console.log('fetchNotificationsByNotification=>' + params.type)
      // console.log(`params => ${JSON.stringify(params.order)}`)

      const { page, limit, type, text, order, isAlert, userId } = params
      const read = false
      const response = await NotificationService.getNotificationFilter(
        page,
        limit,
        order,
        type,
        text,
        isAlert,
        userId,
        read
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const readMultipleNotification = createAsyncThunk(
  'notifications/updateMultipleRead',
  async (data: any, thunkAPI: any) => {
    const { ids, read } = data
    try {
      const response = await NotificationService.updateReadMultipleNotification(ids, read)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const readAllNotification = createAsyncThunk(
  'notifications/readAllNotification',
  async (data: any, thunkAPI: any) => {
    const { id } = data
    try {
      const response = await NotificationService.readAllNotification(id)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

// Slice
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setUnreadNotifications: (state, action: PayloadAction<NotificationList>) => {
      state.unreadNotifications = action.payload
    },
    setCachedNotifications: (state, action: PayloadAction<NotificationList>) => {
      state.cachedNotifications = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchNotificationsUnreadData.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      fetchNotificationsUnreadData.fulfilled,
      (state, action: PayloadAction<NotificationList>) => {
        state.unreadNotifications = action.payload
        state.loading = false
      }
    )
    builder.addCase(readAllNotification.pending, (state) => {
      state.updating = true
    })
    builder.addCase(readAllNotification.fulfilled, (state) => {
      state.updating = false
    })
    builder.addCase(fetchNotifications.pending, (state) => {
      // console.log('loation pending')
      state.loading = true
    })
    builder.addCase(
      fetchNotifications.fulfilled,
      (state, action: PayloadAction<NotificationList>) => {
        // console.log('loation fulfilled => ' + JSON.stringify(action.payload))
        state.notifications = action.payload
        state.loading = false
      }
    )
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || 'Something was wrong'
    })
    builder.addCase(fetchNotificationsData.pending, (state) => {
      state.notificationsDataLoading = true
    })
    builder.addCase(
      fetchNotificationsData.fulfilled,
      (state, action: PayloadAction<NotificationList>) => {
        state.notificationsData = action.payload
        state.notificationsDataLoading = false
      }
    )
    builder.addCase(fetchNotificationsData.rejected, (state, action) => {
      state.notificationsDataLoading = false
      state.error = action.error.message || 'Something was wrong'
    })
  },
})

export default notificationSlice

export const {
  setNotifications,
  setPage,
  setLimit,
  setCachedNotifications,
  setUnreadNotifications,
} = notificationSlice.actions
