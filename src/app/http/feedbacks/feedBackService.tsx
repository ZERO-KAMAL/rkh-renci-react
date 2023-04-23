import axios from 'axios'

import http from '../../helpers/http-common'
import {
  FeedbackFormSchema,
  FeedbackMailBody,
  SortingType,
  TagAssignFeedbackFormSchema,
} from './feedBack.model'

const API_URL = import.meta.env.VITE_APP_API_URL

// Query
const getFeedbackFilter = (
  page: number,
  limit: number,
  text = '',
  feedbackType = '',
  source = '',
  salutation = '',
  status = '',
  locationIds = '',
  areaIds = '',
  departmentIds = '',
  from = '',
  to = '',
  order: SortingType
) => {
  const data = {
    url:
      page <= 0
        ? `feedbacks/${null}/${null}}`
        : `feedbacks/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    params: {
      text: text,
      feedbackType: feedbackType,
      source: source,
      salutation: salutation,
      status: status,
      locationIds: locationIds,
      areaIds: areaIds,
      departmentIds: departmentIds,
      submittedDateFrom: from,
      submittedDateTo: to,
    },
  }
  return http.GET(data)
}
const getFeedbackArchiveFilter = (
  page: number,
  limit: number,
  text = '',
  feedbackType = '',
  source = '',
  salutation = '',
  status = '',
  locationIds: string,
  areaIds: string,
  departmentIds: string,
  from = '',
  to = '',
  order: SortingType
) => {
  const data = {
    url:
      page <= 0
        ? `feedbacks/archives/${null}/${null}}`
        : `feedbacks/archives/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    params: {
      text: text,
      feedbackType: feedbackType,
      source: source,
      salutation: salutation,
      status: status,
      locationIds: locationIds,
      areaIds: areaIds,
      departmentIds: departmentIds,
      submittedDateFrom: from,
      submittedDateTo: to,
    },
  }
  return http.GET(data)
}
const getFeedbackById = (id: number) => {
  const data = { url: `feedbacks/${id}` }
  return http.GET(data)
}
const getFeedbackExport = (id: number) => {
  const data = { url: `feedbacks/export/${id}` }
  return http.POST(data)
}
const getAppConstants = () => {
  const data = { url: 'appConstants' }
  return http.GET(data)
}

const getFeedbackTypeFilter = (
  page = 1,
  limit = 10,
  order: SortingType = {
    sortBy: 'name',
    sortDir: 'asc',
  }
) => {
  const data = { url: `feedbackTypes/${page}/${limit}/${order.sortBy}/${order.sortDir}` }
  return http.GET(data)
}
const getFeedbackRecentActivity = (id: number) => {
  const data = { url: `feedbacks/${id}/feedbackActivities` }
  return http.GET(data)
}

const sendFeedbackEmail = (body: FeedbackMailBody) => {
  const data = { url: `mailerSends/sendEmailForFeedback`, body: body }
  return http.POST(data)
}

const getFeedbackOverviewData = (
  feedbackTypeName = undefined,
  submittedDateFrom = '',
  submittedDateTo = '',
  type = 'monthly',
  locationIds = '',
  areaIds = '',
  departmentIds = ''
) => {
  const searchParams = new URLSearchParams()
  if (feedbackTypeName) {
    searchParams.append('feedbackTypeNames', feedbackTypeName)
  }
  searchParams.append('submittedDateFrom', submittedDateFrom)
  searchParams.append('submittedDateTo', submittedDateTo)
  searchParams.append('type', type)
  searchParams.append('locationIds', locationIds)
  searchParams.append('areaIds', areaIds)
  searchParams.append('departmentIds', departmentIds)

  const url = 'feedbackReports/overview?'
  const data = {
    url: `${url}${searchParams.toString()}`,
  }
  return http.GET(data)
}

const getFeedbackTNTReport = (
  feedbackTypeName = null,
  submittedDateFrom = '',
  submittedDateTo = '',
  type = 'monthly',
  locationIds = '',
  areaIds = '',
  categories = '',
  exportFormat = 'pdf'
) => {
  const data = {
    url: `feedbackReports/turnAroundTime?feedbackTypeName=${feedbackTypeName}&submittedDateFrom=${submittedDateFrom}&submittedDateTo=${submittedDateTo}&type=${type}&locationIds=${locationIds}&areaIds=${areaIds}&categories=${categories}&exportFormat=${exportFormat}`,
  }
  return http.GET(data)
}

const getFeedbackTATReportAxios = (queryParams: any) => {
  const {
    feedbackTypeName,
    submittedDateFrom,
    submittedDateTo,
    type,
    locationIds,
    areaIds,
    categories,
    exportFormat,
  } = queryParams

  const searchParams = new URLSearchParams()
  searchParams.append('feedbackTypeName', feedbackTypeName)
  searchParams.append('submittedDateFrom', submittedDateFrom)
  searchParams.append('submittedDateTo', submittedDateTo)
  searchParams.append('type', type)
  searchParams.append('locationIds', locationIds)
  searchParams.append('areaIds', areaIds)
  searchParams.append('categories', categories)
  searchParams.append('exportFormat', exportFormat)

  const url = 'feedbackReports/turnAroundTime?'
  return axios.get<any>(`${API_URL}/${url}${searchParams.toString()}`, {
    responseType: 'arraybuffer',
    // headers: {
    //   'Access-Control-Allow-Headers': 'Content-Disposition',
    //   // 'access-control-allow-origin': '*',
    // },
  })
}

const getFeedbackSummaryReportAxios = (queryParams: any) => {
  const { submittedDateFrom, submittedDateTo, type, locationIds, areaIds, exportFormat, formIds } =
    queryParams

  const searchParams = new URLSearchParams()
  searchParams.append('submittedDateFrom', submittedDateFrom)
  searchParams.append('submittedDateTo', submittedDateTo)
  searchParams.append('type', type)
  searchParams.append('locationId', locationIds)
  searchParams.append('areaId', areaIds)
  searchParams.append('exportFormat', exportFormat)
  searchParams.append('formIds', formIds)

  const url = 'feedbackReports/feedbackSummaryReport?'
  return axios.get<any>(`${API_URL}/${url}${searchParams.toString()}`, { responseType: 'blob' })
}

const getFeedbackLogsReportAxios = (queryParams: any) => {
  const { submittedDateFrom, submittedDateTo } =
    queryParams

  const searchParams = new URLSearchParams()
  searchParams.append('submittedDateFrom', submittedDateFrom)
  searchParams.append('submittedDateTo', submittedDateTo)

  const url = 'feedbackReports/feedbackLogs?'
  return axios.get<any>(`${API_URL}/${url}${searchParams.toString()}`, { responseType: 'blob' })
}

const getFeedbackSummaryReport = (
  submittedDateFrom = '',
  submittedDateTo = '',
  type = 'monthly',
  locationIds = '',
  areaIds = '',
  exportFormat = 'pdf'
) => {
  const searchParams = new URLSearchParams()
  searchParams.append('submittedDateFrom', submittedDateFrom)
  searchParams.append('submittedDateTo', submittedDateTo)
  searchParams.append('type', type)
  searchParams.append('locationIds', locationIds)
  searchParams.append('areaIds', areaIds)
  searchParams.append('exportFormat', exportFormat)

  const data = {
    url: `feedbackReports/turnAroundTime?${searchParams.toString()}`,
  }
  return http.GET(data)
}

// Mutation
const createFeedback = (body: FeedbackFormSchema) => {
  const data = { url: 'feedbacks', body: body }
  return http.POST(data)
}
const createAssignFeedback = (id: number, body: TagAssignFeedbackFormSchema) => {
  const data = { url: `feedbacks/assignFeedback/${id}`, body: body }
  return http.POST(data)
}
const createShareFeedback = (id: number, body: any) => {
  const data = { url: `feedbacks/shareFeedback/${id}`, body: body }
  return http.POST(data)
}
const createArchiveFeedback = (body: any) => {
  const data = { url: `feedbacks/archive`, body: body }
  return http.POST(data)
}
const createUnarchiveFeedback = (body: any) => {
  const data = { url: `feedbacks/unArchive`, body: body }
  return http.POST(data)
}
const updateFeedback = (id: number, body: any) => {
  const data = { url: `feedbacks/${id}`, body: body }
  return http.PUT(data)
}
const uploadFeedback = (body: any) => {
  const formData: any = new FormData()
  formData.append('file', body)
  const data = { url: `feedbacks/upload`, body: formData }
  return http.POST(data)
}

const deleteAllFeedback = (ids: Array<number>) => {
  const body = { ids: ids }
  // console.log(`body => ${JSON.stringify(body)}`)
  const data = { url: `feedbacks/deleteMulti`, body: body }
  return http.DELETE(data)
}

const downloadTemplate = () => {
  const url = 'feedbacks/downloadTemplate'
  return axios.post<any>(`${API_URL}/${url}`, {}, { responseType: 'blob' })
}

const FeedbackService = {
  getFeedbackFilter,
  getFeedbackArchiveFilter,
  getFeedbackTypeFilter,
  getFeedbackRecentActivity,
  getAppConstants,
  getFeedbackExport,
  getFeedbackTNTReport,
  getFeedbackTATReportAxios,
  getFeedbackSummaryReport,
  getFeedbackSummaryReportAxios,
  getFeedbackLogsReportAxios,
  createFeedback,
  createAssignFeedback,
  createShareFeedback,
  createArchiveFeedback,
  createUnarchiveFeedback,
  updateFeedback,
  deleteAllFeedback,
  getFeedbackById,
  uploadFeedback,
  sendFeedbackEmail,
  getFeedbackOverviewData,
  downloadTemplate,
}

export default FeedbackService
