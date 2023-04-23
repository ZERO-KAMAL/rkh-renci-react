import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { LoginRes } from 'app/http/users/users.model'
import { ILocation } from 'app/modules/dashboard/model/feedback.model'
import { toast } from 'react-toastify'

import useLocationDetails from '../../modules/dashboard/hooks/useLocationDetails'
import UserService from './usersService'

interface UserSliceState {
  // Login module
  currentUser: LoginRes | undefined
  jwtTimeout: NodeJS.Timeout | undefined
  // fetchUserList
  counts: number
  userListDataTable: []
  loadingUserList: boolean
  locationDetailIds: ILocation[]
  loading: boolean
  hasLogout: boolean
}

const initialState: UserSliceState = {
  // Login module
  currentUser: undefined,
  jwtTimeout: undefined,
  // fetchUserList
  counts: 0,
  userListDataTable: [],
  loadingUserList: false,
  // userGetById
  locationDetailIds: [],
  loading: false,
  hasLogout: false,
}

export const defParamsUserList: any = {
  page: 1,
  limit: 10,
  order: {
    sortDir: 'asc',
    sortBy: 'id',
  },
  fullName: '',
  email: '',
  phoneNumber: '',
}

export const fetchUserList = createAsyncThunk(
  'feedbackForm/fetchFeedbackForm',
  async (parms: any, thunkAPI: any) => {
    try {
      // console.log(`parms => ${JSON.stringify(parms)}`)
      const { page, limit, order, fullName, email, phoneNumber }: any = parms
      const response = await UserService.getUserListFilter(
        page,
        limit,
        order,
        fullName,
        email,
        phoneNumber
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const fetchUserById = createAsyncThunk(
  'user/fetchUserDetail',
  async (id: any, thunkAPI: any) => {
    try {
      const {
        phoneNumber,
        email,
        fullName,
        designation,
        dob,
        avatarUri,
        roleId,
        role,
        locationDetailIds,
        isActive,
        isAdmin,
        address,
        otp,
      } = await UserService.getUserById(id)
      return {
        id,
        phoneNumber,
        email,
        firstName: fullName.split(' ')[0],
        lastName: fullName.split(' ')[1],
        fullName,
        designation,
        dob,
        avatarUri,
        roleId,
        role,
        locationDetailIds,
        isActive,
        isAdmin,
        address,
        otp,
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (params: any, thunkAPI: any) => {
    try {
      const { id, user } = params
      const res = await UserService.updateUser(id, user)
      toast.success('Details Successfully Updated')
      return user
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateUserEmail = createAsyncThunk(
  'user/updateUserEmail',
  async (params: any, thunkAPI: any) => {
    try {
      const res = await UserService.changeEmail(params)
      toast.success('Email Successfully Updated')
      return params.newEmail
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateUserPassword = createAsyncThunk(
  'user/updateUserPassword',
  async (params: any, thunkAPI: any) => {
    try {
      const res = await UserService.changePasswordWeb(params)
      toast.success('Password Successfully Updated')
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateImage = createAsyncThunk(
  'user/updateUserImage',
  async (file: any, thunkAPI: any) => {
    try {
      const data: any = new FormData()
      data.append('file', file)
      const res = await UserService.uploadImage(data)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Required for Login module
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload
    },
    setJwtTimeout: (state, action) => {
      state.jwtTimeout = action.payload
    },
    setHasLogout: (state, action) => {
      state.hasLogout = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserList.pending, (state) => {
      state.loadingUserList = true
    })
    builder.addCase(fetchUserList.fulfilled, (state, action) => {
      state.userListDataTable = action.payload.rows
      state.counts = action.payload.count
      state.loadingUserList = false
    })
    builder.addCase(fetchUserList.rejected, (state, action) => {
      state.loadingUserList = false
    })
    builder.addCase(fetchUserById.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      if (!state.hasLogout) {
        state.currentUser = {
          ...state.currentUser,
          userInfo: action.payload,
        } as any
      }
      state.loading = false
      state.locationDetailIds = useLocationDetails.restructureData(
        useLocationDetails.destructureData(action.payload.locationDetailIds)
      )
    })
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.loading = false
    })
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      if (!state.hasLogout) {
        state.currentUser = {
          ...state.currentUser,
          userInfo: action.payload,
        } as any
      }
    })
    builder.addCase(updateUserEmail.fulfilled, (state, action) => {
      if (!state.hasLogout) {
        state.currentUser = {
          ...state.currentUser,
          userInfo: {
            ...state.currentUser?.userInfo,
            email: action.payload,
          },
        } as any
      }
    })
  },
})
