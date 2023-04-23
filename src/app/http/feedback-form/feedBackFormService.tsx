import http from 'app/helpers/http-common'

import { CreateFeedBackFormSchema, SortingType } from './feedBackForm.model'

// Query
const getFeedbackFormFilter = (
  page: number,
  limit: number,
  text: string | undefined,
  locationId: string | undefined,
  areaId: string | undefined,
  departmentId: string | undefined,
  order: SortingType
) => {
  const data = {
    url:
      page <= 0
        ? `feedbackForms/${null}/${null}}`
        : `feedbackForms/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    params: {
      text: text || '',
      locationId: locationId || '',
      areaId: areaId || '',
      departmentId: departmentId || '',
    },
  }
  return http.GET(data)
}

const getFeedbackFormDetailsById = async (id: number) => {
  const data = { url: `feedbackForms/${id}` }
  return http.GET(data)
}

const uploadFeedBackFormLogo = async (logo: any) => {
  const formdata = new FormData()
  formdata.append('file', logo, 'logo.png')

  const data = { url: `upload`, body: formdata }
  return http.POST(data)
}
const postFeedbackForm = (body: CreateFeedBackFormSchema) => {
  const data = { url: 'feedbackForms', body: body }
  return http.POST(data)
}
const putFeedbackForm = (id: number, body: CreateFeedBackFormSchema) => {
  const data = { url: `feedbackForms/${id}`, body: body }
  return http.PUT(data)
}
const deleteFeedbackForm = (ids: Array<number>) => {
  const body = { ids: ids }
  const data = { url: `feedbackForms/deleteMulti`, body: body }
  return http.DELETE(data)
}

const FeedbackFormService = {
  getFeedbackFormFilter,
  uploadFeedBackFormLogo,
  postFeedbackForm,
  getFeedbackFormDetailsById,
  putFeedbackForm,
  deleteFeedbackForm,
}

export default FeedbackFormService
