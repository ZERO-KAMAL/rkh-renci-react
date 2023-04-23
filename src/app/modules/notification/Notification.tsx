// MUI
import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Checkbox, Typography } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import Stack from '@mui/material/Stack'
import {
  defParamsNotify,
  defParamsNotifyPolling,
  fetchNotificationsData,
  fetchNotificationsUnreadData,
  readAllNotification,
  readMultipleNotification,
  setPage,
} from 'app/http/notification/notificationSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'

const Notification = () => {
  const currentUser = useAppSelector((state) => state.user.currentUser)

  const {
    notificationsData: notifications,
    notificationsDataLoading: loading,
    page,
    limit,
    updating,
    cachedNotifications,
  } = useAppSelector((state) => state.notifications)
  const [alertOnly, setAlertOnly] = useState<true | ''>('')
  const dispatch = useAppDispatch()

  const fetchUnreads = useCallback(async () => {
    await dispatch(
      fetchNotificationsUnreadData({ ...defParamsNotifyPolling, userId: currentUser?.userInfo.id })
    )
  }, [])

  const initialFetch = useCallback(async () => {
    await dispatch(
      fetchNotificationsData({
        ...defParamsNotify,
        page,
        isAlert: alertOnly,
        userId: currentUser?.userInfo.id,
      })
    )
  }, [updating, page, alertOnly])

  useEffect(() => {
    fetchUnreads()
    initialFetch()
  }, [updating, page, alertOnly])

  const markAllAsRead = () => {
    const unreadCount = cachedNotifications.count

    if (unreadCount !== 0) {
      dispatch(readAllNotification({ id: currentUser?.userInfo.id }))
    }
  }

  return (
    <Box className='flex justify-center'>
      <Box className='max-w-[580px] w-full'>
        <div className='flex justify-between'>
          <Typography className='font-semibold text-xl'>
            All Notifications
            <span className='text-base font-medium text-[#A1A5B7]'>({notifications?.count})</span>
          </Typography>
          {/* <button className='font-semibold text-xl'>Read all</button> */}
          <LoadingButton
            variant='contained'
            className='!bg-skin-button-primary !hover:bg-skin-button-primary !focus:bg-skin-button-primary normal-case'
            loading={updating}
            loadingPosition='center'
            onClick={markAllAsRead}
          >
            Mark all as read
          </LoadingButton>
        </div>

        <Typography className='font-semibold text-sm mt-5'>
          Feedback Alerts Only
          <Checkbox
            value={alertOnly}
            onClick={() => {
              dispatch(setPage(1))
              setAlertOnly((prev) => (prev === '' ? true : ''))
            }}
            style={{
              color: 'green',
            }}
          />
        </Typography>

        <Box className='mt-9'>
          {loading ? (
            <Typography>loading...</Typography>
          ) : (
            notifications?.rows?.map((item: any, ind: any) => (
              <Box
                className='p-4 mb-5 border-b-[2px] border-[#EBEDF3] pointer'
                // sx={{ backgroundColor: item.isAlert ? '#DFF1EB' : null }}
                sx={{ backgroundColor: !item.read ? '#DFF1EB' : null }}
                key={ind}
                onClick={() => {
                  if (item.refId) {
                    dispatch(readMultipleNotification({ ids: [item.id], read: true }))
                    if(item.type === 'feedback') {
                      useHistory.replace(`/feedback/detail/${item.refId}`)
                    }
                    fetchUnreads()
                  }
                }}
              >
                <Typography className='text-sm mb-3 font-roboto font-bold flex items-center'>
                  {!item.read && <span className='bg-[#F69B11] w-3 h-3 rounded-full mr-2'></span>}
                  {item.title}
                </Typography>
                <Typography className='text-sm font-medium font-roboto text-[#7E8299]'>
                  {item.content}
                </Typography>
                <Typography className='text-xs font-normal font-roboto text-[#7E8299] mt-2'>
                  {moment(item.createdAt).local().format('DD/MM/YY, h:mm a')}
                </Typography>
              </Box>
            ))
          )}
        </Box>
        <Box className='mt-14 w-full flex justify-center'>
          <Stack spacing={2}>
            <Pagination
              count={
                Math.ceil(notifications.count / limit) === 0
                  ? 1
                  : Math.ceil(notifications.count / limit)
              }
              variant='text'
              shape='rounded'
              onChange={(e, v) => {
                dispatch(setPage(v))
              }}
              page={page}
              className='pagination-pointer'
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default Notification
