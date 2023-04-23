import http from '../../helpers/http-common'

// Query

const getFeedbackByFeedbackType = (
  feedbackTypeName: string,
  submittedDateFrom: string,
  submittedDateTo: string,
  type: string,
  locationId: string,
  areaId: string,
  departmentId: string
) => {
  const data = {
    // path
    url: 'dashboard/getFeedbackByFeedbackType',
    // query
    params: {
      feedbackTypeName,
      submittedDateFrom,
      submittedDateTo,
      type,
      locationId,
      areaId,
      departmentId,
    },
  }
  return http.GET(data)
}

const getFeedbackByMultiStatus = (
  status: string,
  submittedDateFrom: string,
  submittedDateTo: string,
  type: string,
  locationId: string,
  areaId: string,
  departmentId: string
) => {
  const data = {
    // path
    url: 'dashboard/getFeedbackByMultiStatus',
    // query
    params: {
      status,
      submittedDateFrom,
      submittedDateTo,
      type,
      locationId,
      areaId,
      departmentId,
    },
  }
  return http.GET(data)
}

const getFeedbackByStatus = (
  status: string,
  submittedDateFrom: string,
  submittedDateTo: string,
  type: string,
  locationId: string,
  areaId: string,
  departmentId: string
) => {
  const data = {
    // path
    url: 'dashboard/getFeedbackByStatus',
    // query
    params: {
      status,
      submittedDateFrom,
      submittedDateTo,
      type,
      locationId,
      areaId,
      departmentId,
    },
  }
  return http.GET(data)
}

const getFeedbackAllStatus = (submittedDateFrom: string, submittedDateTo: string) => {
  const data = {
    // path
    url: 'dashboard/getFeedbackAllStatus',
    // query
    params: {
      submittedDateFrom,
      submittedDateTo,
    },
  }
  return http.GET(data)
}

const DashboardService = {
  getFeedbackByStatus,
  getFeedbackByMultiStatus,
  getFeedbackAllStatus,
  getFeedbackByFeedbackType,
}

export default DashboardService
