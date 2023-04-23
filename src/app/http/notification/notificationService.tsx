import http from 'app/helpers/http-common'

import { SortingType } from './notification.model'

const getNotificationFilter = (
  page: number,
  limit: number,
  order: SortingType,
  type = 'feedback',
  text = '',
  isAlert: any,
  userId: number | undefined,
  read: boolean | undefined,
) => {
  // console.log('Coming notifications process')
  const data = {
    // path
    url:
      page <= 0
        ? `notifications/${null}/${null}`
        : `notifications/${page}/${limit}/${order.sortBy}/${order.sortDir}`,
    // query
    params: {
      text,
      isAlert,
      userId,
      read,
    },
  }

  return http.GET(data)
}

const readAllNotification = (id: number) => {
  const data = { url: `notifications/readAll`, body: { userId: id} }
  return http.POST(data)
}

const updateReadMultipleNotification = (ids: Array<number | string>, read: boolean) => {
  const data = { url: `notifications/updateMulti`, body: { ids: ids, read: read } }
  return http.POST(data)
}

const NotificationService = {
  getNotificationFilter,
  updateReadMultipleNotification,
  readAllNotification
}
export default NotificationService
