// MUI
import { Box, Typography } from '@mui/material'
import {
  defParamsNotify,
  defParamsNotifyPolling,
  fetchNotifications,
  fetchNotificationsUnreadData,
  readMultipleNotification,
} from 'app/http/notification/notificationSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import moment from 'moment'
import { useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NotificationModal = ({ handleClose }: any) => {
  const currentUser = useAppSelector((state) => state.user.currentUser)
  const { notifications, loading } = useAppSelector((state) => state.notifications)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const initialFetch = useCallback(async () => {
    await dispatch(fetchNotifications({ ...defParamsNotify, userId: currentUser?.userInfo.id }))
  }, [])

  const fetchUnreads = useCallback(async () => {
    await dispatch(
      fetchNotificationsUnreadData({ ...defParamsNotifyPolling, userId: currentUser?.userInfo.id })
    )
  }, [])

  useEffect(() => {
    fetchUnreads()
    initialFetch()
  }, [])

  return (
    <Box className='min-h-[200px] max-md:max-h-[520px] overflow-auto'>
      <Link to='/notifications'>
        <Typography
          className='text-sm font-semibold font-roboto text-right pointer'
          onClick={handleClose}
        >
          View All Notifications
        </Typography>
      </Link>
      {loading ? (
        <Typography>loading...</Typography>
      ) : (
        notifications?.rows?.slice(0, 5).map((item: any, ind: any) => (
          <Box className='py-4 border-b-[1px] border-[#EBEDF3]' key={ind}>
            <Box
              className='px-3 py-2 rounded pointer'
              // sx={{ backgroundColor: item.isAlert ? '#DFF1EB' : null }}
              sx={{ backgroundColor: !item.read ? '#DFF1EB' : null }}
              onClick={() => {
                if (item.refId) {
                  dispatch(readMultipleNotification({ ids: [item.id], read: true }))
                  if(item.type === 'feedback') {
                    navigate(`/feedback/detail/${item.refId}`)
                  }
                  fetchUnreads()
                  handleClose()
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
          </Box>
        ))
      )}
    </Box>
  )
}

export default NotificationModal
