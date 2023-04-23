import { Grid } from '@mui/material'
import useCompare from 'app/helpers/hooks/useCompare'
import { defParamsDash, fetchFeedbacksByStatus } from 'app/http/dashboard/dashboardSlice'
import { statusCase } from 'app/modules/feedback/form/FeedbackDetail'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'

import SimpleAreaChart from '../components/simple-area-chart/SimpleAreaChart'

const WithSimpleAreaChart = () => {
  const dispatch = useAppDispatch()
  const {
    selectedAreaIds,
    selectedLocationIds,
    selectedDeptIds,
    activeFeedbacks,
    pendingFeedbacks,
    overdueFeedbacks,
  } = useAppSelector((state) => state.dashboard)

  const endOfDay = moment().local().format()
  const sixDaysBefore = moment().subtract(6, 'd').startOf('day').format()

  const hasLocIdChanged = useCompare(selectedLocationIds.toString())
  const hasAreaIdChanged = useCompare(selectedAreaIds.toString())
  const hasDeptIdChanged = useCompare(selectedDeptIds.toString())

  const isInitialMount = useRef(true)
  const [cnt, setCnt] = useState(0)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      // setCnt((c) => c + 1)
      // console.log('simple chart: ', cnt)
      // dispatch(
      //   fetchFeedbacksByStatus({
      //     ...defParamsDash,
      //     status: statusCase.CaseActive,
      //     submittedDateFrom: sixDaysBefore,
      //     submittedDateTo: endOfDay,
      //     locationId: selectedLocationIds.toString(),
      //     areaId: selectedAreaIds.toString(),
      //     departmentId: selectedDeptIds.toString(),
      //   })
      // )
      // dispatch(
      //   fetchFeedbacksByStatus({
      //     ...defParamsDash,
      //     status: statusCase.Pending,
      //     submittedDateFrom: sixDaysBefore,
      //     submittedDateTo: endOfDay,
      //     locationId: selectedLocationIds.toString(),
      //     areaId: selectedAreaIds.toString(),
      //     departmentId: selectedDeptIds.toString(),
      //   })
      // )
      // dispatch(
      //   fetchFeedbacksByStatus({
      //     ...defParamsDash,
      //     status: statusCase.Overdue,
      //     submittedDateFrom: sixDaysBefore,
      //     submittedDateTo: endOfDay,
      //     locationId: selectedLocationIds.toString(),
      //     areaId: selectedAreaIds.toString(),
      //     departmentId: selectedDeptIds.toString(),
      //   })
      // )
      dispatch(
        fetchFeedbacksByStatus({
          ...defParamsDash,
          status: [statusCase.CaseActive, statusCase.Pending, statusCase.Overdue].toString(),
          submittedDateFrom: sixDaysBefore,
          submittedDateTo: endOfDay,
          locationId: selectedLocationIds.toString(),
          areaId: selectedAreaIds.toString(),
          departmentId: selectedDeptIds.toString(),
        })
      )
    }
  }, [hasLocIdChanged, hasAreaIdChanged, hasDeptIdChanged])

  return (
    <div>
      <p className='font-semibold mb-3 text-lg'>Weekly Trending</p>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <SimpleAreaChart
            data={activeFeedbacks}
            label='Active Cases'
            colors={['#2BA579', '#2BA579', '#0BB783']}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SimpleAreaChart
            data={pendingFeedbacks}
            label='Pending Cases'
            colors={['#FFA621', '#FFA621', '#F69B11']}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SimpleAreaChart
            data={overdueFeedbacks}
            label='Overdue Cases'
            colors={['#F1416C', '#F1416C', '#F1416C']}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default WithSimpleAreaChart
