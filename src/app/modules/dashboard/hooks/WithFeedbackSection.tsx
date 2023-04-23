import useCompare from 'app/helpers/hooks/useCompare'
import { fetchFeedbacksPiechart } from 'app/http/dashboard/dashboardSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import moment from 'moment'
import { useCallback, useEffect, useRef, useState } from 'react'

import FeedbackSection from '../components/feedback-section/FeedbackSection'
import DashboardConst from '../constants/dashboard.const'
import { FeedbackModel } from '../model/feedback.model'

const WithFeedbackSection = () => {
  const dispatch = useAppDispatch()
  const { feedbackPiechart, loading, selectedLocationIds, selectedAreaIds, selectedDeptIds } =
    useAppSelector((state) => state.dashboard)

  const [complaintCount, setComplaintCount] = useState(0)
  const [complimentCount, setComplimentCount] = useState(0)
  const [suggestionCount, setSuggestionCount] = useState(0)
  const [appealCount, setAppealCount] = useState(0)
  const [appreciationCount, setAppreciationCount] = useState(0)
  const [currentTab, setCurrentTab] = useState(DashboardConst.MONTHLY)

  const startOfDay = moment().startOf('day').local().format()
  const endOfDay = moment().local().format()
  const startOfWeek = moment().startOf('week').add(1, 'd').local().format()
  const endOfWeek = moment().endOf('week').add(1, 'd').local().format()
  const startOfMonth = moment().startOf('month').local().format()
  const endOfMonth = moment().endOf('month').local().format()

  // 1. User button actions -> call API
  const onMonthly = useCallback(() => {
    // console.log('fetch on monthly')
    setCurrentTab(DashboardConst.MONTHLY)
    dispatch(
      fetchFeedbacksPiechart({
        feedbackTypeName: '',
        submittedDateFrom: startOfMonth,
        submittedDateTo: endOfMonth,
        type: DashboardConst.MONTHLY,
        locationId: selectedLocationIds.toString(),
        areaId: selectedAreaIds.toString(),
        departmentId: selectedDeptIds.toString(),
      })
    )
  }, [selectedLocationIds, selectedAreaIds, selectedDeptIds])

  const onWeekly = useCallback(() => {
    // console.log('fetch on weekly')
    setCurrentTab(DashboardConst.WEEKLY)
    dispatch(
      fetchFeedbacksPiechart({
        feedbackTypeName: '',
        submittedDateFrom: startOfWeek,
        submittedDateTo: endOfWeek,
        type: DashboardConst.WEEKLY,
        locationId: selectedLocationIds.toString(),
        areaId: selectedAreaIds.toString(),
        departmentId: selectedDeptIds.toString(),
      })
    )
  }, [selectedLocationIds, selectedAreaIds, selectedDeptIds])

  const onDaily = useCallback(() => {
    // console.log('fetch on daily')
    setCurrentTab(DashboardConst.DAILY)
    dispatch(
      fetchFeedbacksPiechart({
        feedbackTypeName: '',
        submittedDateFrom: startOfDay,
        submittedDateTo: endOfDay,
        type: DashboardConst.DAILY,
        locationId: selectedLocationIds.toString(),
        areaId: selectedAreaIds.toString(),
        departmentId: selectedDeptIds.toString(),
      })
    )
  }, [selectedLocationIds, selectedAreaIds, selectedDeptIds])

  // console.log(feedbackPiechart)

  // 2. Refresh UI
  useEffect(() => {
    if (!feedbackPiechart) return
    const complain = getFeedbackSum(DashboardConst.COMPLAINT.backendCode)
    setComplaintCount(complain)
    const compliment = getFeedbackSum(DashboardConst.COMPLIMENT.backendCode)
    setComplimentCount(compliment)
    const suggestion = getFeedbackSum(DashboardConst.SUGGESTION.backendCode)
    setSuggestionCount(suggestion)
    const appeal = getFeedbackSum(DashboardConst.APPEAL.backendCode)
    setAppealCount(appeal)
    const appreciation = getFeedbackSum(DashboardConst.APPRECIATION.backendCode)
    setAppreciationCount(appreciation)
  }, [feedbackPiechart, currentTab, selectedLocationIds, selectedAreaIds, selectedDeptIds])

  const hasLocIdChanged = useCompare(selectedLocationIds.toString())
  const hasAreaIdChanged = useCompare(selectedAreaIds.toString())
  const hasDeptIdChanged = useCompare(selectedDeptIds.toString())

  const isInitialMount = useRef(true)
  const [cnt, setCnt] = useState(0)

  // Call API
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
    } else {
      // setCnt((c) => c + 1)
      // console.log('feedback section: ', cnt)
      switch (currentTab) {
        case DashboardConst.MONTHLY:
          onMonthly()
          break
        case DashboardConst.WEEKLY:
          onWeekly()
          break
        case DashboardConst.DAILY:
          onDaily()
          break
      }
    }
  }, [currentTab, hasLocIdChanged, hasAreaIdChanged, hasDeptIdChanged])

  // helper function to map reduce array of obj to a single total giving the feedback type you need
  const getFeedbackSum = useCallback(
    (type: string) => {
      const sum = feedbackPiechart
        .map((item) => item.data.filter((item) => item.feedbackType === type))
        .flat()
        .map((item) => item.count)
        .reduce((partialSum, a) => partialSum + a, 0)
      return sum
    },
    [feedbackPiechart, currentTab, selectedLocationIds, selectedAreaIds, selectedDeptIds]
  )

  const data: FeedbackModel[] = [
    {
      name: DashboardConst.APPEAL.backendCode,
      value: appealCount,
      color: DashboardConst.APPEAL.color,
      label: DashboardConst.APPEAL.frontendLabel,
    },
    // {
    //   name: DashboardConst.APPRECIATION.backendCode,
    //   value: appreciationCount,
    //   color: DashboardConst.APPRECIATION.color,
    //   label: DashboardConst.APPRECIATION.frontendLabel,
    // },
    {
      name: DashboardConst.COMPLAINT.backendCode,
      value: complaintCount,
      color: DashboardConst.COMPLAINT.color,
      label: DashboardConst.COMPLAINT.frontendLabel,
    },
    {
      name: DashboardConst.COMPLIMENT.backendCode,
      value: complimentCount,
      color: DashboardConst.COMPLIMENT.color,
      label: DashboardConst.COMPLIMENT.frontendLabel,
    },
    {
      name: DashboardConst.SUGGESTION.backendCode,
      value: suggestionCount,
      color: DashboardConst.SUGGESTION.color,
      label: DashboardConst.SUGGESTION.frontendLabel,
    },
  ]

  return <FeedbackSection data={data} onMonthly={onMonthly} onWeekly={onWeekly} onDaily={onDaily} />
}

export default WithFeedbackSection
