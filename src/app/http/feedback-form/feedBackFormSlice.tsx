import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import moment from 'moment'

import UserService from '../users/usersService'
import { CreateFeedBackFormSchema, SortingType, params, Form } from './feedBackForm.model'
import FeedbackFormService from './feedBackFormService'

export const defParamsForm: any = {
  page: 1,
  limit: 10,
  text: '',
  locationId: '',
  departmentId: '',
  areaId: '',
  order: {
    sortDir: 'desc',
    sortBy: 'createdAt',
  },
}

interface FeedBackFormState {
  dataTableFeedbackForm: Form[]
  counts: number
  loadingFeedbackForm: boolean
  page: number
  limit: number
  text: string
  order: SortingType
  selectedAll: boolean
  selected: Form[]
  loadingFormCreation: boolean
  formCreationData: CreateFeedBackFormSchema | undefined
  feedBackFormDetails: any
  loadingFeedbackFormDetails: boolean
  formUpdateData: any
  loadingFormUpdate: boolean
  deleteStatus: 'loading' | 'success' | 'error' | '',
  location: any,
  area: any,
  department: any
}

const initialState: FeedBackFormState = {
  dataTableFeedbackForm: [],
  counts: 0,
  loadingFeedbackForm: false,
  page: 1,
  limit: 10,
  text: '',
  order: {
    sortDir: 'desc',
    sortBy: 'createdAt',
  },
  selectedAll: false,
  selected: [],
  loadingFormCreation: false,
  formCreationData: undefined,
  feedBackFormDetails: undefined,
  loadingFeedbackFormDetails: false,
  formUpdateData: undefined,
  loadingFormUpdate: false,
  deleteStatus: '',
  location: null,
  area: null,
  department: null
}

export const fetchFeedbackForm = createAsyncThunk(
  'feedbackForm/fetchFeedbackForm',
  async (parms: params, thunkAPI: any) => {
    try {
      const { page, limit, text, order, locationId, areaId, departmentId }: params = parms
      const current: FeedBackFormState = thunkAPI.getState().feedbackForm
      const response = await FeedbackFormService.getFeedbackFormFilter(
        page,
        limit,
        text,
        current?.location?.id || locationId,
        current?.area?.id || areaId,
        current?.department?.id || departmentId,
        current?.order || order
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const getUsersInfoById = async (ids: Array<number>) => {
  const users = await UserService.fetchMultiUsersById(ids)
  const userInfo = users.map(({id, fullName}: any)=> ({id, name: fullName}))
  return userInfo
}

// const getAssignedUsersInfo = async (userIds: []) => {
//   const users: any = []
//   await Promise.all(
//     userIds?.map(async (userId: any) => {
//       const user = await getUserInfoById(userId)
//       users.push(user)
//     })
//   )
//   return users
// }

export const fetchfeedbackFormDetails = createAsyncThunk(
  'feedbackForm/feedbackFormDetails',
  async (id: number, thunkAPI: any) => {
    try {
      const response = await FeedbackFormService.getFeedbackFormDetailsById(id)

      const mainRecipients = await getUsersInfoById(response?.mainRecipient)
      const ccRecipients = await getUsersInfoById(response?.ccRecipient)

      const assignedUsers = mainRecipients.concat(ccRecipients)

      return { ...response, assignedUsers, mainRecipients, ccRecipients }
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const createFeedbackForm = createAsyncThunk(
  'feedbackForm/createFeedbackForm',
  async (data: CreateFeedBackFormSchema, thunkAPI: any) => {
    try {
      let logo = undefined
      if (data.logo) logo = await FeedbackFormService.uploadFeedBackFormLogo(data.logo)
      const response = await FeedbackFormService.postFeedbackForm({
        ...data,
        logo: logo?.uri || '',
      })
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateFeedbackForm = createAsyncThunk(
  'feedbackForm/updateFeedbackForm',
  async (params: any, thunkAPI: any) => {
    const { id, body } = params
    try {
      let logo = body?.logo
      if (typeof logo !== 'string') {
        logo = await FeedbackFormService.uploadFeedBackFormLogo(body?.logo)
      }
      const response = await FeedbackFormService.putFeedbackForm(id, {
        ...body,
        logo: logo !== '' ? logo.uri : logo,
      })
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const deleteFeedbackForm = createAsyncThunk(
  'feedbackForm/deleteFeedbackForm',
  async (ids: Array<number>, thunkAPI: any) => {
    try {
      const response = await FeedbackFormService.deleteFeedbackForm(ids)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const destructureData = (datas: Form[]) => {
  const dataTable: any = []
  try {
    datas.forEach((data: any) => {
      dataTable.push({
        id: data?.id,
        title: data?.title,
        location: data?.location?.name,
        area: data?.area?.name,
        department: data?.department?.name,
        createdDate: moment(data?.createdAt).format('DD/MM/YYYY'),
        feedbackFormCode: data?.feedbackFormCode
      })
    })
  } catch (error) {
    console.error(error)
  }
  return dataTable
}

const feedBackFormSlice = createSlice({
  name: 'feedbackForm',
  initialState,
  reducers: {
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setFormCreationData: (state, action: PayloadAction<any>) => {
      state.formCreationData = action.payload
    },
    setFormUpdateData: (state, action: PayloadAction<any>) => {
      state.formUpdateData = action.payload
    },
    setDeleteStatus: (state, action: PayloadAction<any>) => {
      state.deleteStatus = action.payload
    },
    setOrder: (state: any, action: any) => {
      state.order = action.payload
    },
    setLocation: (state, action: PayloadAction<any>) => {
      state.location = action.payload
    },
    setArea: (state, action: PayloadAction<any>) => {
      state.area = action.payload
    },
    setDepartment: (state, action: PayloadAction<any>) => {
      state.department = action.payload
    },
    setFeedBackFormStateClear: () => initialState,
    setSelected: (state, action: PayloadAction<any>) => {
      state.selected = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeedbackForm.pending, (state) => {
      state.loadingFeedbackForm = true
    })
    builder.addCase(fetchFeedbackForm.fulfilled, (state, action) => {
      // console.log('fetchFeedbackForm fulfiled')
      // console.log(`feedBackForm datas => ${JSON.stringify(action.payload)}`)
      state.dataTableFeedbackForm = destructureData(action.payload.rows)
      state.counts = action.payload.count
      state.loadingFeedbackForm = false
    })
    builder.addCase(fetchFeedbackForm.rejected, (state, action) => {
      state.loadingFeedbackForm = false
    })
    builder.addCase(createFeedbackForm.pending, (state) => {
      state.loadingFormCreation = true
    })
    builder.addCase(createFeedbackForm.fulfilled, (state, action) => {
      state.formCreationData = action.payload
      state.loadingFormCreation = false
    })
    builder.addCase(createFeedbackForm.rejected, (state) => {
      state.loadingFormCreation = false
    })
    builder.addCase(fetchfeedbackFormDetails.pending, (state) => {
      state.loadingFeedbackFormDetails = true
    })
    builder.addCase(fetchfeedbackFormDetails.fulfilled, (state, action) => {
      state.feedBackFormDetails = action.payload
      state.loadingFeedbackFormDetails = false
    })
    builder.addCase(fetchfeedbackFormDetails.rejected, (state) => {
      state.loadingFeedbackFormDetails = false
    })
    builder.addCase(updateFeedbackForm.pending, (state) => {
      state.loadingFormUpdate = true
    })
    builder.addCase(updateFeedbackForm.fulfilled, (state, action) => {
      state.formUpdateData = action.payload
      state.loadingFormUpdate = false
    })
    builder.addCase(updateFeedbackForm.rejected, (state) => {
      state.loadingFormUpdate = false
    })
    builder.addCase(deleteFeedbackForm.pending, (state) => {
      state.deleteStatus = 'loading'
    })
    builder.addCase(deleteFeedbackForm.fulfilled, (state) => {
      state.deleteStatus = 'success'
    })
    builder.addCase(deleteFeedbackForm.rejected, (state) => {
      state.deleteStatus = 'error'
    })
  },
})

export default feedBackFormSlice
export const {
  setFeedBackFormStateClear,
  setPage,
  setLimit,
  setFormCreationData,
  setFormUpdateData,
  setDeleteStatus,
  setLocation,
  setArea,
  setDepartment,
  setOrder,
  setSelected,
} = feedBackFormSlice.actions
