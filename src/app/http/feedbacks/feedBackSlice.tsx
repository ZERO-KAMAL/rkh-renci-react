import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { AnyMessageParams } from 'yup/lib/types'

import { FeedbackFormSchema, FeedbackMailBody, SortingType } from './feedBack.model'
import FeedbackService from './feedBackService'
import { FeedbackStruct } from './feedback.destructure.model'
import { Feedback } from './feedback.org.model'

export const defParams: any = {
  page: 1,
  limit: 10,
  text: '',
  feedbackType: '',
  source: '',
  salutation: '',
  status: '',
  locationIds: '',
  areaIds: '',
  departmentIds: '',
  order: {
    sortDir: 'desc',
    sortBy: 'submittedDate',
  },
}

interface FeedBackState {
  dataTableFeedback: any[]
  dataTableActivity: [] | any
  editDataFeedback: any | null
  editDataFeedbackOrg: FeedbackStruct | null
  counts: number
  loadingFeedback: boolean
  page: number
  limit: number
  text: string
  feedbackType: string
  source: string
  salutation: string
  locationIds: string
  areaIds: string
  departmentIds: string
  status: string
  order: SortingType
  selectedAll: boolean
  selected: Array<number>
  activeFeedBackForm: boolean
  activeFilterForm: boolean
  activeTagAssignFeedBackForm: boolean
  activeShareFeedBackForm: boolean
  activeFeedBackDetail: boolean
  activeFeedBackActivity: boolean
  feedbackTypeList: []
  sourceList: Array<string>
  salutationList: Array<string>
  statusList: Array<string>
  tatList: []
  from: string
  to: string
  feedbackId: number
  type: string
  feedbackTypeLoading: boolean
  feedbackReportOverviewData: [] | any
  feedbackReportOverviewLoading: boolean
}
const initialState: FeedBackState = {
  dataTableFeedback: [],
  dataTableActivity: [],
  editDataFeedback: null,
  editDataFeedbackOrg: null,
  counts: 0,
  loadingFeedback: false,
  page: 1,
  limit: 10,
  text: '',
  feedbackType: '',
  source: '',
  salutation: '',
  locationIds: '',
  areaIds: '',
  departmentIds: '',
  status: '',
  order: {
    sortDir: 'desc',
    sortBy: 'submittedDate',
  },
  selectedAll: false,
  selected: [],
  activeFeedBackForm: false,
  activeFilterForm: false,
  activeTagAssignFeedBackForm: false,
  activeShareFeedBackForm: false,
  activeFeedBackDetail: false,
  activeFeedBackActivity: false,
  feedbackTypeList: [],
  sourceList: [],
  salutationList: [],
  statusList: [],
  tatList: [],
  from: '',
  to: '',
  feedbackId: 0,
  type: '',
  feedbackTypeLoading: false,
  feedbackReportOverviewData: [],
  feedbackReportOverviewLoading: false,
}

// Actions

export const fetchAppConstant = createAsyncThunk('get/appConstant', async (_, thunkAPI: any) => {
  try {
    const respsone = await FeedbackService.getAppConstants()
    // if (respsone) {
    //   thunkAPI.dispatch(fetchFeedbackType())
    // }
    return respsone
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
export const fetchFeedbackType = createAsyncThunk(
  'get/fetchFeedbackType',
  async (_, thunkAPI: any) => {
    try {
      // console.log(`feetch feedback type process`)
      const response = await FeedbackService.getFeedbackTypeFilter()
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const fetchFeedbackActivity = createAsyncThunk(
  'feedbacks/recentActivity',
  async (id: number, thunkAPI: any) => {
    try {
      const response = await FeedbackService.getFeedbackRecentActivity(id)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const fetchFeedbackBk = createAsyncThunk(
  'feedbacks/fetchFeedback',
  async (parms: any, thunkAPI: any) => {
    try {
      // console.log(`parms => ${JSON.stringify(parms)}`)
      const { page, limit, text, feedbackType, source, salutation, status, order }: any = parms
      const current: FeedBackState = thunkAPI.getState().feedback
      const response = await FeedbackService.getFeedbackFilter(
        page,
        limit,
        text,
        feedbackType,
        source,
        salutation,
        status,
        current.locationIds,
        current.areaIds,
        current.departmentIds,
        current.from,
        current.to,
        order
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const fetchFeedback = createAsyncThunk(
  'feedbacks/fetchFeedback',
  async (_, thunkAPI: any) => {
    try {
      const {
        page,
        limit,
        text,
        feedbackType,
        source,
        salutation,
        status,
        order,
        locationIds,
        areaIds,
        departmentIds,
        from,
        to,
      }: FeedBackState = thunkAPI.getState().feedback

      const response = await FeedbackService.getFeedbackFilter(
        page,
        limit,
        text,
        feedbackType,
        source,
        salutation,
        status,
        locationIds,
        areaIds,
        departmentIds,
        from,
        to,
        order
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const fetchArchiveFeedback = createAsyncThunk(
  'feedbacks/fetchArchiveFeedback',
  async (_, thunkAPI: any) => {
    try {
      const {
        page,
        limit,
        text,
        feedbackType,
        source,
        salutation,
        status,
        order,
        locationIds,
        areaIds,
        departmentIds,
        from,
        to,
      }: FeedBackState = thunkAPI.getState().feedback
      const response = await FeedbackService.getFeedbackArchiveFilter(
        page,
        limit,
        text,
        feedbackType,
        source,
        salutation,
        status,
        locationIds,
        areaIds,
        departmentIds,
        from,
        to,
        order
      )
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const fetchFeedbackById = createAsyncThunk(
  'feedbacks/getbyId',
  async (id: number, thunkAPI: any) => {
    try {
      // console.log(`fetchFeedbackById =>${id}`)
      const response = await FeedbackService.getFeedbackById(id)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const createAssignFeedback = createAsyncThunk(
  'feedbacks/assignFeedback',
  async (data: any, thunkAPI: any) => {
    try {
      const response = await FeedbackService.createAssignFeedback(data.id, data.data)
      if (response) {
        const current: FeedBackState = thunkAPI.getState().feedback
        reloadFeedBack(current, thunkAPI)
      }
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const createShareFeedback = createAsyncThunk(
  'feedbacks/shareFeedback',
  async (data: any, thunkAPI: any) => {
    try {
      const response = await FeedbackService.createShareFeedback(data.id, data.data)
      if (response) {
        const current: FeedBackState = thunkAPI.getState().feedback
        reloadFeedBack(current, thunkAPI)
      }
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const createArchiveFeedback = createAsyncThunk(
  'feedbacks/archive',
  async (data: any, thunkAPI: any) => {
    try {
      const response = await FeedbackService.createArchiveFeedback({ ids: data })
      if (response) {
        const current: FeedBackState = thunkAPI.getState().feedback
        reloadFeedBack(current, thunkAPI)
      }
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const createUnarchiveFeedback = createAsyncThunk(
  'feedbacks/unarchive',
  async (data: any, thunkAPI: any) => {
    try {
      const response = await FeedbackService.createUnarchiveFeedback({ ids: data })
      if (response) {
        const current: FeedBackState = thunkAPI.getState().feedback
        reloadUnArchiveFeedBack(current, thunkAPI)
      }
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const createFeedback = createAsyncThunk(
  'feedbacks/createFeedback',
  async (data: FeedbackFormSchema, thunkAPI: any) => {
    try {
      // console.log(`post data => ${JSON.stringify(data)}`)
      const current: FeedBackState = thunkAPI.getState().feedback
      // console.log(`submitted date original => ${data.submittedDate}`)
      // const submittedDate = moment(data.submittedDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
      // console.log(`submitted date convert => ${submittedDate}`)
      const response = current.editDataFeedback
        ? await FeedbackService.updateFeedback(current.editDataFeedback.id, {
            ...data,
            // submittedDate,
          })
        : await FeedbackService.createFeedback(data)

      // console.log(`feedback respsone => ${JSON.stringify(response)}`)
      if (response) {
        if (current.type === 'overview') reloadFeedBack(current, thunkAPI)
        else if (current.type === 'archive') reloadUnArchiveFeedBack(current, thunkAPI)
      }
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)
export const ackFeedback = createAsyncThunk(
  'feedbacks/ackFeedback',
  async (data: any, thunkAPI: any) => {
    try {
      const response = await FeedbackService.updateFeedback(data, {
        status: 'Case Acknowledged',
      })
      if (response) {
        const current: FeedBackState = thunkAPI.getState().feedback
        reloadFeedBack(current, thunkAPI)
      }
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const reopenFeedback = createAsyncThunk(
  'feedbacks/ackFeedback',
  async (data: any, thunkAPI: any) => {
    try {
      const response = await FeedbackService.updateFeedback(data.feedbackId, {
        status: 'New Case',
      })
      if (response) {
        const current: FeedBackState = thunkAPI.getState().feedback
        if (data.title === 'Archive') reloadUnArchiveFeedBack(current, thunkAPI)
        else reloadFeedBack(current, thunkAPI)
      }
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const setAutoAlert = createAsyncThunk(
  'feedbacks/setAutoAlert',
  async (data: any, thunkAPI: any) => {
    try {
      const response = await FeedbackService.updateFeedback(data.feedbackId, {
        configManualAlert: data.value,
      })
      if (response) {
        const current: FeedBackState = thunkAPI.getState().feedback
        reloadFeedBack(current, thunkAPI)
      }
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const sendFeedbackAlert = createAsyncThunk(
  'feedbacks/sendFeedbackAlert',
  async (data: FeedbackMailBody, thunkAPI: any) => {
    try {
      const response = await FeedbackService.sendFeedbackEmail(data)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
export const feedbackExport = createAsyncThunk(
  'feedbacks/export',
  async (data: any, thunkAPI: any) => {
    try {
      const response = await FeedbackService.getFeedbackExport(data)
      // console.log(`response => ${JSON.stringify(response)}`)
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)
// Report
export const GenereateFeedbackTNTReport = createAsyncThunk('', async (data: any, thunkAPI: any) => {
  try {
    const {
      feedbackTypeName,
      submittedDateFrom,
      submittedDateTo,
      type,
      locationIds,
      areaIds,
      categories,
      exportFormat,
    } = data
    const response = await FeedbackService.getFeedbackTNTReport(
      feedbackTypeName,
      submittedDateFrom,
      submittedDateTo,
      type,
      locationIds,
      areaIds,
      categories,
      exportFormat
    )
    return response
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
})

export const GenereateFeedbackSummaryReport = createAsyncThunk(
  '',
  async (data: any, thunkAPI: any) => {
    try {
      const { submittedDateFrom, submittedDateTo, type, locationIds, areaIds, exportFormat } = data
      const response = await FeedbackService.getFeedbackSummaryReport(
        submittedDateFrom,
        submittedDateTo,
        type,
        locationIds,
        areaIds,
        exportFormat
      )
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const getFeedbackOverviewReportData = createAsyncThunk(
  'feedbacks/overviewReportData',
  async (data: any, thunkAPI: any) => {
    try {
      const {
        feedbackTypeName,
        submittedDateFrom,
        submittedDateTo,
        type,
        locationIds,
        areaIds,
        departmentIds,
      } = data
      const response = await FeedbackService.getFeedbackOverviewData(
        feedbackTypeName,
        submittedDateFrom,
        submittedDateTo,
        type,
        locationIds,
        areaIds,
        departmentIds
      )
      return response
    } catch (err) {
      return thunkAPI.rejectWithValue(err)
    }
  }
)

const reloadFeedBack = (current: FeedBackState, thunkAPI: any) => {
  try {
    // const page = current.page
    // const limit = current.limit
    // const text = current.text
    // const order = current.order
    // const feedbackType = current.feedbackType
    // const source = current.source
    // const salutation = current.salutation
    // const status = current.status
    if (current.selectedAll) thunkAPI.dispatch(setSelectedAll(false))
    thunkAPI.dispatch(fetchFeedback())
  } catch (err) {}
}
const reloadUnArchiveFeedBack = (current: FeedBackState, thunkAPI: any) => {
  try {
    // const page = current.page
    // const limit = current.limit
    // const text = current.text
    // const order = current.order
    // const feedbackType = current.feedbackType
    // const source = current.source
    // const salutation = current.salutation
    // const status = current.status

    // const  { page, limit, text, feedbackType, source,
    //   salutation, status, order, locationIds ,areaIds,
    //   departmentIds , from , to
    //   }: FeedBackState = current

    if (current.selectedAll) thunkAPI.dispatch(setSelectedAll(false))
    thunkAPI.dispatch(fetchArchiveFeedback())
  } catch (err) {}
}

const destructureTATData = (datas: any) => {
  const dataTable: any = []
  try {
    datas.forEach((data: any, index: number) => {
      const from = data.fromDays
      const to = data.toDays ? `-${data.toDays} Days` : ' and more'
      dataTable.push({
        id: index,
        title: `${from}${to}`,
      })
    })
  } catch (err) {}

  return dataTable
}

const destructureData = (datas: any): FeedbackStruct[] => {
  const dataTable: FeedbackStruct[] = []
  // console.log(`destructureData.....`)

  try {
    datas?.forEach((data: any) => {
      // console.log('-----------------------------------------')

      let diff
      if (!data.closedDateTime) {
        const start = moment().local()
        const end = moment(data.submittedDate).local()
        diff = start.diff(end, 'days')
      } else {
        const start = moment(data.closedDateTime).local()
        const end = moment(data.submittedDate).local()
        diff = start.diff(end, 'days')
      }

      const assignLocations: any = []
      data?.assignLocations.forEach((loc: any) => {
        assignLocations.push({
          locationId: loc?.location?.id,
          locationName: loc?.location?.name,
          areaId: loc?.area?.id,
          areaName: loc?.area?.name,
          departmentId: loc?.department?.id,
          departmentName: loc?.department?.name,
        })
      })

      dataTable.push({
        ...data,
        feedbackReceived: moment(data.submittedDate).format('DD/MM/YYYY hh:mm a'),
        feedbackReceivedPicker: moment(data.submittedDate).local().format(),
        tat: `${diff}/${data.TAT} days`,
        tatCount: diff,
        feedbackType: data.feedbackTypeName,

        locationId: data.locationDetail?.location?.id,
        locationName: data.locationDetail?.location?.name,
        areaId: data.locationDetail?.area?.id,
        areaName: data.locationDetail?.area?.name,
        departmentId: data.locationDetail?.department?.id,
        departmentName: data.locationDetail?.department?.name,
        locations: [
          {
            locationId: data?.locationDetail?.location?.id,
            areaId: data?.locationDetail?.area?.id,
            departmentId: data?.locationDetail?.department?.id,
          },
        ],
        assignLocations: assignLocations || [],
      })
    })
  } catch (error) {
    console.error(error)
  }
  return dataTable
}

// slice

const feedBackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setActiveFeedBackForm: (state, action: PayloadAction<boolean>) => {
      state.activeFeedBackForm = action.payload
    },
    setActiveFilterForm: (state, action: PayloadAction<boolean>) => {
      state.activeFilterForm = action.payload
    },
    setActiveTagAssignFeedBackForm: (state, action: any) => {
      state.activeTagAssignFeedBackForm = action.payload.active
      state.feedbackId = action.payload.feedbackId
      if (state.dataTableFeedback.length) {
        state.editDataFeedback = state.dataTableFeedback.filter(
          (item: any) => item.id == action.payload.feedbackId
        )[0]
      }
    },
    setActiveShareFeedBackForm: (state, action: any) => {
      state.activeShareFeedBackForm = action.payload.active
      state.feedbackId = action.payload.feedbackId
    },
    setActiveFeedBackDetail: (state, action: any) => {
      state.activeFeedBackDetail = action.payload.active
      state.feedbackId = action.payload.feedbackId
      state.editDataFeedback = state.dataTableFeedback.filter(
        (item: any) => item.id == action.payload.feedbackId
      )[0]
      state.order = {
        sortDir: 'desc',
        sortBy: 'submittedDate',
      }
    },
    setActiveFeedBackActivity: (state, action: any) => {
      state.activeFeedBackActivity = action.payload.active
      state.feedbackId = action.payload.feedbackId
      if (!action.payload.active) {
        state.dataTableActivity = []
      }
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    },
    setOrder: (state: any, action: any) => {
      state.order = action.payload
    },
    setFeedbackType: (state: any, action: PayloadAction<string>) => {
      state.feedbackType = action.payload
    },
    setStatus: (state, action: PayloadAction<string>) => {
      state.status = action.payload
    },
    setFeedbackId: (state, action: PayloadAction<number>) => {
      // console.log(`setFeedbackId => ${action.payload}`)
      state.feedbackId = action.payload
    },
    setFeedBackStateClear: () => initialState,
    setSelectById: (state, action: PayloadAction<number>) => {
      const id: number = action.payload
      if (state.selected.includes(id)) {
        state.selected = state.selected.filter((itemId: number) => itemId !== id)
      } else {
        const updateSelected = [...state.selected, id]
        state.selected = updateSelected
      }

      if (state.selected.length === state.dataTableFeedback?.length) {
        state.selectedAll = true
      } else {
        state.selectedAll = false
      }
    },
    setSelectedAll: (state, action: PayloadAction<boolean>) => {
      const toggle = action.payload
      state.selectedAll = toggle
      if (state.dataTableFeedback) {
        if (toggle) {
          const ids: Array<number> = state.dataTableFeedback.map((item: any) => item.id)
          state.selected = ids
        } else {
          state.selected = []
        }
      }
    },
    setMoreFilter: (state: any, action: any) => {
      // console.log(`setMoreFilter => ${JSON.stringify(action.payload)}`)
      const { source, locationId, areaId, departmentId } = action.payload
      state.source = source ? source : ''
      state.locationIds = locationId > 0 ? locationId : ''
      state.areaIds = areaId > 0 ? areaId : ''
      state.departmentIds = departmentId > 0 ? departmentId : ''
    },
    setReset: (state: any) => {
      state.source = ''
      state.locationIds = ''
      state.areaIds = ''
      state.departmentIds = ''
      state.from = ''
      state.to = ''
    },
    setFromToDate: (state: any, action: any) => {
      const { from, to } = action.payload
      state.from = from
      state.to = to
    },
    setSearch: (state: any, action: any) => {
      state.text = action.payload
    },
    setLoadingFeedback: (state: any, action: any) => {
      state.loadingFeedback = action.payload
    },
    setFeedbackTypeLoading: (state: any, action: any) => {
      state.feedbackTypeLoading = action.payload
    },
    setType: (state: any, action: any) => {
      state.type = action.payload
      state.page = 1
      state.limit = 10
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeedback.pending, (state) => {
      state.loadingFeedback = true
      state.dataTableFeedback = []
    })
    builder.addCase(fetchFeedback.fulfilled, (state, action) => {
      // console.log('fetchFeedback fulfiled')
      // console.log(`feedBack datas => ${JSON.stringify(action.payload)}`)
      state.dataTableFeedback = destructureData(action.payload.rows)
      state.counts = action.payload.count
      state.loadingFeedback = false
      state.selected = []
    })
    builder.addCase(fetchFeedback.rejected, (state, action) => {
      state.loadingFeedback = false
      state.dataTableFeedback = []
    })
    builder.addCase(fetchFeedbackById.pending, (state) => {
      state.loadingFeedback = true
    })
    builder.addCase(fetchFeedbackById.fulfilled, (state, action) => {
      state.editDataFeedback = destructureData([action.payload])[0]
      state.editDataFeedbackOrg = action.payload
      state.loadingFeedback = false
    })
    builder.addCase(fetchFeedbackById.rejected, (state) => {
      state.loadingFeedback = false
    })

    builder.addCase(fetchArchiveFeedback.pending, (state) => {
      state.loadingFeedback = true
      state.dataTableFeedback = []
    })
    builder.addCase(fetchArchiveFeedback.fulfilled, (state, action) => {
      // console.log('fetchFeedback fulfiled')
      // console.log(`feedBack datas => ${JSON.stringify(action.payload)}`)
      state.dataTableFeedback = destructureData(action.payload.rows)
      state.counts = action.payload.count
      state.loadingFeedback = false
      state.selected = []
    })
    builder.addCase(fetchArchiveFeedback.rejected, (state, action) => {
      state.loadingFeedback = false
      state.dataTableFeedback = []
    })

    builder.addCase(fetchAppConstant.fulfilled, (state, action) => {
      state.sourceList = action.payload.feedbackSources
      state.salutationList = action.payload.salutation
      state.statusList = action.payload.feedbackStatus
      state.tatList = destructureTATData(action.payload.TATFilter)
    })
    builder.addCase(fetchFeedbackType.pending, (state) => {
      state.feedbackTypeLoading = true
    })
    builder.addCase(fetchFeedbackType.fulfilled, (state, action) => {
      state.feedbackTypeList = action.payload.rows.filter((f: any) => f.name !== 'Appreciations')
      state.feedbackTypeLoading = false
    })
    builder.addCase(fetchFeedbackType.rejected, (state) => {
      state.feedbackTypeLoading = false
    })
    builder.addCase(fetchFeedbackActivity.fulfilled, (state, action) => {
      const datas = action.payload.rows.map((data: any) => {
        return {
          id: data.id,
          comment: data.comment,
          dateTime: moment(data.createdAt).format('DD/MM'),
        }
      })
      // console.log(`Activities => ${JSON.stringify(datas)}`)
      state.dataTableActivity = datas
    })
    builder.addCase(getFeedbackOverviewReportData.pending, (state) => {
      state.feedbackReportOverviewLoading = true
    })
    builder.addCase(getFeedbackOverviewReportData.fulfilled, (state, action) => {
      state.feedbackReportOverviewData = action.payload
      state.feedbackReportOverviewLoading = false
    })
    builder.addCase(getFeedbackOverviewReportData.rejected, (state) => {
      state.feedbackReportOverviewLoading = false
    })
  },
})

export default feedBackSlice
export const {
  setActiveFeedBackForm,
  setActiveFilterForm,
  setFeedBackStateClear,
  setActiveTagAssignFeedBackForm,
  setActiveShareFeedBackForm,
  setActiveFeedBackDetail,
  setActiveFeedBackActivity,
  setPage,
  setLimit,
  setFeedbackType,
  setFeedbackId,
  setStatus,
  setSelectedAll,
  setSelectById,
  setMoreFilter,
  setFromToDate,
  setSearch,
  setType,
  setOrder,
  setReset,
  setLoadingFeedback,
  setFeedbackTypeLoading,
} = feedBackSlice.actions
