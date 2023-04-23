import LimitWithPagination from 'app/components/LimitWithPagination'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import React, { useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'

import {
  fetchAppConstant,
  fetchArchiveFeedback,
  fetchFeedbackType,
  setFeedBackStateClear,
  setLimit,
  setPage,
  setType,
} from '../../http/feedbacks/feedBackSlice'
import FeedbackOverviewHeader from './components/FeedbackOverviewHeader'
import FeedbackDetail from './form/FeedbackDetail'
import FeedbackFormModal from './form/FeedbackFormModal'
import MoreFilterFormModal from './form/MoreFilterFormModal'
import RecentActivityFormModal from './form/RecentActivityFormModal'
import ShareFeedbackFormModal from './form/ShareFeedbackFormModal'
import TagAssignFeedbackFormModal from './form/TagAssignFeedbackFormModal'
import FeedbackTable from './table/FeedbackTable'
import SearchBar from './table/SearchBar'
import TablePagination from './table/TablePagination'

const FeedbackArchive = () => {
  const dispatch = useAppDispatch()
  const { page, limit, counts } = useAppSelector((state) => state.feedback)
  // state selector
  const {
    activeFeedBackForm,
    activeFilterForm,
    activeTagAssignFeedBackForm,
    activeShareFeedBackForm,
    activeFeedBackDetail,
    activeFeedBackActivity,
  } = useAppSelector((state) => state.feedback)

  const initFetch = useCallback(async () => {
    await dispatch(fetchArchiveFeedback())
    await dispatch(fetchAppConstant())
  }, [])

  useEffect(() => {
    // dispatch(fetchFeedbackType())
    // dispatch(fetchAppConstant())
    dispatch(setType('archive'))
    initFetch()
    // return () => {
    //   dispatch(setFeedBackStateClear())
    // }
  }, [])

  return (
    <div className=' '>
      <div className={clsx('max-w-[1120px]  mx-auto', activeFeedBackDetail && 'hidden')}>
        {/* Header */}
        <FeedbackOverviewHeader title='Archive' />
        {/* Search bar */}
        <SearchBar title='Archive' />
        {/* Table Wrapper */}
        <FeedbackTable title='Archive' />
        {/* Pagination */}
        {/* <TablePagination /> */}
        <LimitWithPagination
          limit={limit}
          setLimit={(v) => {
            dispatch(setPage(1))
            dispatch(setLimit(v))
          }}
          pageCount={Math.ceil(counts / limit) === 0 ? 1 : Math.ceil(counts / limit)}
          page={page}
          setPage={(v) => dispatch(setPage(v))}
        />
        {/* Form */}
        {activeFeedBackForm && <FeedbackFormModal />}
        {/* Filter */}
        {activeFilterForm && <MoreFilterFormModal title='Archive' />}
        {/* Assign */}
        {activeTagAssignFeedBackForm && <TagAssignFeedbackFormModal />}
        {/* Share */}
        {activeShareFeedBackForm && <ShareFeedbackFormModal />}
        {/* Activity */}
        {activeFeedBackActivity && <RecentActivityFormModal />}
      </div>
      {/* Feedback Detail */}
      {activeFeedBackDetail && <FeedbackDetail />}
    </div>
  )
}

export default FeedbackArchive
