import { Box } from '@mui/material'
import Grid from '@mui/material/Grid'
import ModuleHeader from 'app/components/ModuleHeader'
import { MODULES } from 'app/constants/module-permission'
import { fetchFeedback } from 'app/http/feedbacks/feedBackSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useEffect } from 'react'

import FeedbackDetail from '../feedback/form/FeedbackDetail'
import FeedbackFormModal from '../feedback/form/FeedbackFormModal'
import MoreFilterFormModal from '../feedback/form/MoreFilterFormModal'
import RecentActivityFormModal from '../feedback/form/RecentActivityFormModal'
import ShareFeedbackFormModal from '../feedback/form/ShareFeedbackFormModal'
import TagAssignFeedbackFormModal from '../feedback/form/TagAssignFeedbackFormModal'
import FeedbackTable from '../feedback/table/FeedbackTable'
import WithFeedbackSection from './hooks/WithFeedbackSection'
import WithLocationDropdown from './hooks/WithLocationDropdown'
import WithMultipleAreaChart from './hooks/WithMultipleAreaChart'
import WithSimpleAreaChart from './hooks/WithSimpleAreaChart'


type RedirectLocationState = {
  has: string
  key: string
  pathname: string
  search: string
}

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const xxx = useAppSelector((state) => state)
  const {
    activeFeedBackForm,
    activeFilterForm,
    activeTagAssignFeedBackForm,
    activeShareFeedBackForm,
    activeFeedBackDetail,
    activeFeedBackActivity,
  } = useAppSelector((state) => state.feedback)

  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)
  const canViewFeedbackTbl = Boolean(permissions.find(
    (a) => a.code === MODULES.DashboardViewFeedbackFunc.code
  ))

  const currentUser = useAppSelector((state) => state.user.currentUser)
  // console.log({ xxx })

  useEffect(() => {
    dispatch(fetchFeedback())
  }, [])

  return (
    <div className='max-w-[1120px] w-full mx-auto'>
      <ModuleHeader header='Dashboard' subHeader={`  | ${currentUser?.userInfo.role?.name}`} />
      <WithLocationDropdown />
      <Box>
        <WithSimpleAreaChart />
      </Box>
      <Grid container spacing={5} className='mt-1 mb-1'>
        <Grid item xs={12} sm={7.8}>
          <WithMultipleAreaChart />
        </Grid>
        <Grid item xs={12} sm={4.2}>
          <WithFeedbackSection />
        </Grid>
      </Grid>

      {canViewFeedbackTbl && (
        <div className='mt-8'>
          <ModuleHeader header='Latest Feedback' />
          <FeedbackTable title='Feedback Overview' forDashboard hideSorting hideCheckbox />
          {/* Form */}
          {activeFeedBackForm && <FeedbackFormModal />}
          {/* Filter */}
          {activeFilterForm && <MoreFilterFormModal title='Feedback Overview' />}
          {/* Assign */}
          {activeTagAssignFeedBackForm && <TagAssignFeedbackFormModal />}
          {/* Share */}
          {activeShareFeedBackForm && <ShareFeedbackFormModal />}
          {/* Activity */}
          {activeFeedBackActivity && <RecentActivityFormModal />}
          {/* Feedback Detail */}
          {activeFeedBackDetail && <FeedbackDetail />}
        </div>
      )}
    </div>
  )
}

export default Dashboard
