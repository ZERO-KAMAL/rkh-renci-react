import { POLLING_NOTIFICATION_DELAY } from 'app/constants/polling-frequency'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { fetchArchiveFeedback, fetchFeedback } from 'app/http/feedbacks/feedBackSlice'
import { Notification } from 'app/http/notification/notification.model'
import {
  defParamsNotifyPolling,
  fetchNotificationsUnreadData,
  readMultipleNotification,
  setCachedNotifications,
} from 'app/http/notification/notificationSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import { useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useInterval } from 'usehooks-ts'

const useNotificationPollService = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()

  const currentUser = useAppSelector((state) => state.user.currentUser)
  const { unreadNotifications, cachedNotifications } = useAppSelector(
    (state) => state.notifications
  )

  const fetchNotifications = useCallback(async () => {
    await dispatch(
      fetchNotificationsUnreadData({ ...defParamsNotifyPolling, userId: currentUser?.userInfo.id })
    )
  }, [])

  // Update on init
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Polling every 5mins
  useInterval(() => {
    fetchNotifications()
  }, POLLING_NOTIFICATION_DELAY)

  // Update on route change
  useEffect(() => {
    fetchNotifications()
  }, [location])

  const fetchUnreads = useCallback(async () => {
    await dispatch(
      fetchNotificationsUnreadData({ ...defParamsNotifyPolling, userId: currentUser?.userInfo.id })
    )
  }, [])

  const onClick = (item: Notification) => {
    if (item.refId) {
      dispatch(readMultipleNotification({ ids: [item.id], read: true }))
      useHistory.replace(`/feedback/detail/${item.refId}`)
      fetchUnreads()
    }
  }

  // Update toast alert on new notification
  useEffect(() => {
    if (cachedNotifications.rows.length < 0) {
      dispatch(setCachedNotifications(unreadNotifications))
    } else {
      const oldNotificationCount = cachedNotifications.count
      const newNotificationCount = unreadNotifications.count
      const hasNewNotification = newNotificationCount > oldNotificationCount
      // console.log('DEBUG: ', oldNotificationCount, newNotificationCount, hasNewNotification)
      // console.log('cachedNotifications: ', cachedNotifications)
      // console.log('unreadNotifications: ', unreadNotifications)

      if (hasNewNotification && unreadNotifications?.rows[0]?.title) {
        toast.success(unreadNotifications.rows[0].title, {
          toastId: 1,
          onClick: () => {
            onClick(unreadNotifications.rows[0])
          },
        })

        if (location.pathname.includes(NAVIGATE_LINKS.FEEDBACK.OVERVIEW)) {
          dispatch(fetchFeedback())
        }
        if (location.pathname.includes(NAVIGATE_LINKS.FEEDBACK.ARCHIVE)) {
          dispatch(fetchArchiveFeedback())
        }
      }
      dispatch(setCachedNotifications(unreadNotifications))
    }
  }, [unreadNotifications])
}

export default useNotificationPollService
