import useCompare from 'app/helpers/hooks/useCompare'
import { FeedbackTypeResponse } from 'app/http/dashboard/dashboard.model'
import { fetchFeedbacksAreaChart } from 'app/http/dashboard/dashboardSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import moment from 'moment'
import { useCallback, useEffect, useRef, useState } from 'react'

import MultipleAreaChart from '../components/multiple-area-chart/MultipleAreaChart'
import DashboardConst from '../constants/dashboard.const'
import { MultipleAreaData } from '../model/feedback.model'

const WithMultipleAreaChart = () => {
  const dispatch = useAppDispatch()
  const { feedbackAreachart, loading, selectedAreaIds, selectedLocationIds, selectedDeptIds } =
    useAppSelector((state) => state.dashboard)

  const startOfMonth = moment().startOf('month').local().format()
  const endOfDay = moment().local().format()

  const [data, setData] = useState<MultipleAreaData[]>([])
  const [submittedDateFrom, setSubmittedDateFrom] = useState(startOfMonth)
  const [submittedDateTo, setSubmittedDateTo] = useState(endOfDay)

  const hasLocIdChanged = useCompare(selectedLocationIds.toString())
  const hasAreaIdChanged = useCompare(selectedAreaIds.toString())
  const hasDeptIdChanged = useCompare(selectedDeptIds.toString())

  const isInitialMount = useRef(true)
  const [cnt, setCnt] = useState(0)

  const fetchAreaChartApi = async () => {
    dispatch(
      fetchFeedbacksAreaChart({
        feedbackTypeName: '',
        submittedDateFrom: submittedDateFrom,
        submittedDateTo: submittedDateTo,
        type: DashboardConst.DAILY,
        locationId: selectedLocationIds.toString(),
        areaId: selectedAreaIds.toString(),
        departmentId: selectedDeptIds.toString(),
      })
    )
  }

  // 1. on change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      // setCnt((c) => c + 1)
      // console.log('multiple chart: ', cnt)
      fetchAreaChartApi()
    }
  }, [submittedDateFrom, submittedDateTo, hasLocIdChanged, hasAreaIdChanged, hasDeptIdChanged])

  // 2. refresh ui
  useEffect(() => {
    if (!feedbackAreachart) return
    // console.log('debug feedbackAreachart: ', feedbackAreachart)
    const areaChartDataArr: MultipleAreaData[] = []
    feedbackAreachart.forEach((api: any) => {
      const areaChartData: MultipleAreaData = {
        submittedDate: moment(api.submitDateTime).format('DD MMM'),
        status: 'New Case',
        Complaints: getFeedbackSum(api, DashboardConst.COMPLAINT.backendCode),
        Compliments: getFeedbackSum(api, DashboardConst.COMPLIMENT.backendCode),
        Suggestions: getFeedbackSum(api, DashboardConst.SUGGESTION.backendCode),
        'Appeals/MP letters': getFeedbackSum(api, DashboardConst.APPEAL.backendCode),
        Appreciations: getFeedbackSum(api, DashboardConst.APPRECIATION.backendCode),
      }
      areaChartDataArr.push(areaChartData)
    })
    setData(areaChartDataArr)
  }, [feedbackAreachart])

  // helper function to map reduce array of obj to a single total giving the feedback type you need
  const getFeedbackSum = useCallback(
    (api: FeedbackTypeResponse, type: string) => {
      const sum = api.data
        .filter((item: any) => item.feedbackType === type)
        .map((item: any) => item.count)
        .reduce((partialSum: any, a: any) => partialSum + a, 0)
        .toString()
      return sum
    },
    [feedbackAreachart]
  )

  const onDateChange = (month: string, year: number) => {
    // console.log(year)
    // console.log(moment().format('MMM'))
    const mtn = Number(moment(month, 'MMM').format('MM'))
    const startOfMonth = moment(`${year}-${mtn}-${1}`, 'YYYY-MM-DD')
      .startOf('month')
      .local()
      .format()
    const endOfMonth = moment(`${year}-${mtn}-${1}`, 'YYYY-MM-DD').endOf('month').local().format()

    setSubmittedDateFrom(startOfMonth)
    setSubmittedDateTo(
      String(year) === moment().format('YYYY') && month === moment().format('MMM')
        ? moment().local().format()
        : endOfMonth
    )
  }

  const onGenerateQuickReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // console.log('handle onGenerateQuickReport')
  }

  return (
    <MultipleAreaChart
      onDateChange={onDateChange}
      onGenerateQuickReport={onGenerateQuickReport}
      data={data}
    />
  )
}

export default WithMultipleAreaChart
