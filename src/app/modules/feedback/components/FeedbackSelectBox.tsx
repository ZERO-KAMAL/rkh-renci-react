import { LoadingButton } from '@mui/lab'
import { Menu } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { MODULES } from 'app/constants/module-permission'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import clsx from 'clsx'
import React, { memo, useEffect, useState } from 'react'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { shallowEqual, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import {
  ackFeedback,
  createArchiveFeedback,
  createUnarchiveFeedback,
  sendFeedbackAlert,
  setActiveFeedBackActivity,
  setActiveFeedBackDetail,
  setActiveShareFeedBackForm,
  setActiveTagAssignFeedBackForm,
  setAutoAlert,
  setFeedbackId,
} from '../../../http/feedbacks/feedBackSlice'

// James Note
// Feedback Status is New Case => show acknowledge checkbox and that action only can do Leader
// Tag & Assign Feedback is related with QSM
// Share Feedback is relaed with Leader
// {id : 1 , active : true , status : 'New Case' }
// QSM => 1, TeamLead => 2
const FeedbackSelectBox = (data: any) => {
  //  console.log(`data => ${JSON.stringify(data)}`)
  const [active, setActive] = useState(false)
  const [checked, setChecked] = useState(data.status === 'New Case' ? false : true)
  const [highlight, setHighlight] = useState(0)
  const dispatch = useAppDispatch()
  const { id, permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)
  const [sendAlertLoading, setSendAlertLoading] = useState(false)
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { user } = useSelector(
    (state: any) => ({
      user: state.user.currentUser.userInfo,
    }),
    shallowEqual
  )

  useEffect(() => {
    return () => {
      // console.log('exist')
      setActive(false)
    }
  }, [])

  useEffect(() => {
    // console.log('Status Check...')
    if (data.status !== 'New Case') setChecked(true)
  }, [data])

  // Dashboard module permission
  const canDashboardCaseTagging = Boolean(
    permissions.find((a) => a.code === MODULES.DashboardCaseTaggingFunc.code)
  )
  const canDashboardArchiveFeedback = Boolean(
    permissions.find((a) => a.code === MODULES.DashboardArchiveFunc.code)
  )

  // Feedback module permission
  const canFeedbackArchiveFeedback = Boolean(
    permissions.find((a) => a.code === MODULES.FeedbackOverviewArchiveFunc.code)
  )
  const canFeedbackCaseTagging = Boolean(
    permissions.find((a) => a.code === MODULES.FeedbackOverviewCaseTaggingFunc.code)
  )
  const canFeedbackEdit = Boolean(
    permissions.find((a) => a.code === MODULES.FeedbackOverviewEditFeedbackFunc.code)
  )

  const location = useLocation()
  const [isDashboard, setIsDashboard] = useState(false)

  useEffect(() => {
    const dashboard = location.pathname.includes(NAVIGATE_LINKS.DASHBOARD.ROOT_PATH)
    setIsDashboard(dashboard)
  }, [location])

  // Action
  const handleAckOnClick = () => {
    // console.log(`feedback ack onclick => `, data.id)
    try {
      dispatch(ackFeedback(data.id)).then((response) => {
        if (response.meta.requestStatus === 'fulfilled') {
          setChecked(true)
          toast.success('Acknowledge Successful', {
            position: toast.POSITION.TOP_RIGHT,
          })
        } else if (response.meta.requestStatus === 'rejected') {
          toast.error('Something was wrong', {
            position: toast.POSITION.TOP_RIGHT,
          })
        }
      })
    } catch (err) {}
    // {id : 1 , status : 'Case Acknowledged'}
  }
  const handleArchieve = (id: number) => {
    Swal.fire({
      title: ' </br>Are you sure you’d like to archive these feedback?',

      text: 'Once archived, the feedback will be removed from the overview page and moved to the archive tab instead',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'darkblue',
      confirmButtonText: 'Archive Feedback',
      cancelButtonText: 'Go Back',
      reverseButtons: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // console.log(`selected ids => ${id}`)
        dispatch(createArchiveFeedback([id])).then((response) => {
          const status = response.meta.requestStatus
          if (status === 'rejected') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response?.payload?.data?.message || 'Something went wrong!',
            })
          } else if (status === 'fulfilled') {
            Swal.fire('Archive!', 'Your file has been archived.', 'success')
          }
        })
      }
    })
  }
  const handleUnArchieve = (id: number) => {
    Swal.fire({
      title: ' </br>Are you sure you’d like to unarchive these feedback?',

      text: 'Once unarchived, the feedback will be removed from the archive page and moved to the overview tab instead',
      showCancelButton: true,
      confirmButtonColor: 'green',
      cancelButtonColor: 'darkblue',
      confirmButtonText: 'Unarchive Feedback',
      cancelButtonText: 'Go Back',
      reverseButtons: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(createUnarchiveFeedback([id])).then((response) => {
          const status = response.meta.requestStatus
          if (status === 'rejected') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response?.payload?.data?.message || 'Something went wrong!',
            })
          } else if (status === 'fulfilled') {
            Swal.fire('Unarchive!', 'Your file has been unarchived.', 'success')
          }
        })
      }
    })
  }
  return (
    <>
      <div
        className=''
        onClick={(e) => {
          setAnchorEl(e.currentTarget)
        }}
      >
        <BiDotsHorizontalRounded size={30} className={clsx(active ? 'text-green-600' : null)} />
      </div>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={()=> setAnchorEl(null)}
      >
        <div className='bg-white pb-5 pt-2 px-2 flex flex-col justify-between text-sm'>
          {/* Acknowledge */}

          {canFeedbackEdit && (
            <div
              className={clsx(
                'rounded-sm px-3 py-1 flex justify-between items-center'
                // data.status === 'Case Acknowledged' && 'hidden'
              )}
            >
              <span className='select-none font-bold'>Acknowledge Case </span>
              <Checkbox
                inputProps={{ 'aria-label': 'controlled' }}
                checked={checked}
                onChange={() => {
                  // console.log(`checked => ${checked}`)
                  if (!checked) handleAckOnClick()
                }}
                color='success'
                disabled={checked}
              />
            </div>
          )}

          {canFeedbackEdit && (
            <div
              className={clsx(
                'rounded-sm px-3 py-1 flex justify-between items-center border-b-2 mb-4 '
              )}
            >
              {/* <span className={clsx('select-none font-bold', user?.role?.code !== 'qsm superadmin' && "text-gray-400")}>Auto Alert </span>
            <Checkbox
              inputProps={{ 'aria-label': 'controlled' }}
              checked={data.manualAlert === null}
              onChange={() => dispatch(setAutoAlert({feedbackId: data.id, value: data.manualAlert ? null : true}))}
              color='success'
              disabled={user?.role?.code !== 'qsm superadmin'}
            /> */}
              <LoadingButton
                variant='contained'
                className='bg-[#2BA579] hover:bg-[#2BA579] focus:bg-[#2BA579] normal-case w-full mb-2'
                loading={sendAlertLoading}
                loadingPosition='center'
                onClick={() => {
                  dispatch(
                    sendFeedbackAlert({
                      id: data.id,
                      subject: 'Reminder',
                      content: 'Reminder',
                      type: 'remind',
                    })
                  ).then((response) => {
                    setSendAlertLoading(true)
                    if (response.meta.requestStatus === 'fulfilled') {
                      setSendAlertLoading(false)
                      toast.success('Alert Sent', {
                        position: toast.POSITION.TOP_RIGHT,
                      })
                    } else if (response.meta.requestStatus === 'rejected') {
                      setSendAlertLoading(false)
                      toast.error('Something went wrong', {
                        position: toast.POSITION.TOP_RIGHT,
                      })
                    }
                  })
                }}
              >
                Send Alert
              </LoadingButton>
            </div>
          )}
          {((!isDashboard && canFeedbackCaseTagging) ||
            (isDashboard && canDashboardCaseTagging)) && (
            <div
              className={clsx(
                'hover:bg-green-100 hover:font-bold hover:rounded rounded-sm px-3 py-2 flex justify-between items-center',
                highlight === 1 && 'bg-green-100 font-bold ',
                id !== 1 && 'hidden'
              )}
              onClick={() => {
                setHighlight(1)
                setActive((prev) => !prev)
                dispatch(setActiveTagAssignFeedBackForm({ active: true, feedbackId: data.id }))
              }}
            >
              <span className='select-none'>Tag & Assign Feedback</span>
              {/* <BiDotsHorizontalRounded size={30} /> */}
            </div>
          )}
          <div
            className={clsx(
              'hover:bg-green-100 hover:font-bold hover:rounded rounded-sm px-3 py-2 flex justify-between items-center',
              highlight === 1 && 'bg-green-100 font-bold ',
              id !== 2 && 'hidden'
            )}
            onClick={() => {
              setHighlight(1)
              setActive((prev) => !prev)
              dispatch(setActiveShareFeedBackForm({ active: true, feedbackId: data.id }))
            }}
          >
            <span className='select-none'>Share Feedback</span>
            {/* <BiDotsHorizontalRounded size={30} /> */}
          </div>
          <div
            className={clsx(
              'hover:bg-green-100 hover:font-bold hover:rounded rounded-sm px-3 py-2 flex justify-between items-center',
              highlight === 2 && 'bg-green-100 font-bold '
            )}
            onClick={() => {
              setHighlight(2)
              // dispatch(setActiveFeedBackDetail({ active: true, feedbackId: data.id }))
              // useHistory.replace(`/feedback/detail/${data.id}`)
              navigate(`/feedback/detail/${data.id}`)
            }}
          >
            <span className='select-none'>View Feedback Details</span>
          </div>
          <div
            className={clsx(
              'hover:bg-green-100 hover:font-bold hover:rounded rounded-sm px-3 py-2 flex justify-between items-center',
              highlight === 3 && 'bg-green-100 font-bold '
            )}
            onClick={() => {
              setHighlight(3)
              dispatch(setActiveFeedBackActivity({ active: true, feedbackId: data.id }))
            }}
          >
            <span className='select-none'>Recent Activity</span>
          </div>
          {((!isDashboard && canFeedbackArchiveFeedback) ||
            (isDashboard && canDashboardArchiveFeedback)) && (
            <div
              className={clsx(
                'hover:bg-green-100 hover:font-bold hover:rounded rounded-sm px-3 py-2 flex justify-between items-center',
                highlight === 4 && 'bg-green-100 font-bold '
              )}
              onClick={() => {
                setHighlight(4)
                if (data.title === 'Archive') handleUnArchieve(data.id)
                else handleArchieve(data.id)
              }}
            >
              <span className='select-none'>
                {data.title === 'Archive' ? 'Unarchive Feedback' : 'Archive Feedback'}
              </span>
            </div>
          )}
        </div>
      </Menu>
    </>
  )
}

export default memo(FeedbackSelectBox)
