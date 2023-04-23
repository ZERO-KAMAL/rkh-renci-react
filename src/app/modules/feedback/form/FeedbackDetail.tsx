import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { AiOutlineDownload } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import { BsReplyAll } from 'react-icons/bs'
import { FiActivity } from 'react-icons/fi'
import QRCode from 'react-qr-code'

import {
  feedbackExport,
  setActiveFeedBackActivity,
  setActiveFeedBackDetail,
  setActiveFeedBackForm,
} from '../../../http/feedbacks/feedBackSlice'
import FeedbackFormModal from './FeedbackFormModal'
import RecentActivityFormModal from './RecentActivityFormModal'

export const statusCase = {
  NewCase: 'New Case',
  AckCase: 'Case Acknowledged',
  Overdue: 'Response Overdue',
  Pending: 'Pending Response',
  CaseActive: 'Case Active',
  CaseClosed: 'Case Closed',
}

// check feedback id and call get by id to get data
const FeedbackDetail = () => {
  const dispatch = useAppDispatch()
  const { editDataFeedback, feedbackId, activeFeedBackActivity, activeFeedBackForm } =
    useAppSelector((state) => state.feedback)

  return (
    <div className='max-w-[1120px]  mx-auto pt-4 mt-8'>
      {/* popup */}
      {activeFeedBackActivity && <RecentActivityFormModal />}
      {/* header section */}
      <div className='flex  justify-between'>
        <div className='flex items-center'>
          <BiArrowBack
            size={30}
            color={'green'}
            className='cursor-pointer'
            onClick={() => {
              dispatch(setActiveFeedBackDetail(false))
            }}
          />
          <h1 className=' text-lg text-black font-semibold ml-4'>Back To Feedback Overview</h1>
        </div>

        <div className='flex flex-row gap-4 '>
          {/* Recent Activity */}
          <button
            className='w-[150px] h-[50px] bg-orange-300 rounded-lg font-bold text-white
         hover:bg-orange-500 p-l flex items-center justify-center text-sm'
            onClick={() => {
              dispatch(setActiveFeedBackActivity({ active: true, feedbackId: feedbackId }))
            }}
          >
            <FiActivity size={20} /> Recent Activity
          </button>
          {/* Reply */}
          <button
            className={clsx(
              'w-[150px] h-[50px] bg-green-900 rounded-lg font-bold text-white  hover:bg-green-500 p-1 flex items-center justify-start pl-3 text-sm'
            )}
            onClick={() => {}}
          >
            <BsReplyAll size={20} className='mr-3' /> Reply
          </button>
        </div>
      </div>

      {/* qrcode info */}
      <div className='bg-white w-full  rounded-lg mt-4 p-4'>
        {/* qrcode */}
        <div className='flex items-center'>
          <QRCode value={editDataFeedback?.feedbackCode || 'default'} size={140} />
          {/* feedback info */}
          <div className='flex-col  ml-8'>
            <div className='text-sm font-bold mb-2'>
              Feedback ID : <span>{editDataFeedback?.feedbackCode} </span>
            </div>
            <div className='text-[10px] text-["#B5B5C3"] mb-3'>
              Form ID : <span>{editDataFeedback?.feedbackCode}</span>
            </div>
            <span
              className={clsx(
                'rounded-lg text-sm font-bold p-2',
                editDataFeedback.status === statusCase.NewCase && 'text-[#0095E8] bg-[#ECF8FF]',
                editDataFeedback.status === statusCase.AckCase && 'text-[#8950FC] bg-[#EEE5FF]',
                editDataFeedback.status === statusCase.CaseActive && 'text-#50CD89] bg-[#E8FFF3]',
                editDataFeedback.status === statusCase.Overdue && 'text-[#F1416C] bg-[#FFF5F8]',
                editDataFeedback.status === statusCase.CaseClosed && 'text-[#5E6278] bg-[#E4E6EF]',
                editDataFeedback.status === statusCase.Pending && 'text-[#FFA621] bg-[#FFF5E7]'
              )}
            >
              {editDataFeedback.status}
            </span>
            {/* <span className='p-1 text-[#8950FC] bg-[#EEE5FF] rounded-lg text-sm font-bold '>
              Case Acknowledged
            </span> */}
            <div className='flex flex-1 mt-3 '>
              {/* Case Tag */}
              <div className='flex flex-col p-2 text-[12px] border border-dotted  border-spacing-10 mr-4'>
                <span className='font-bold '>{editDataFeedback?.caseType}</span>
                <span className='text-[#B5B5C3]'>Case Tag</span>
              </div>
              {/* Source */}
              <div className='flex flex-col p-2 text-[12px] border border-dotted  border-spacing-10 mr-4'>
                <span className='font-bold '>{editDataFeedback?.source}</span>
                <span className='text-[#B5B5C3]'>Source</span>
              </div>
              {/* TAT */}
              <div className='flex flex-col p-2 text-[12px] border border-dotted  border-spacing-10 mr-4'>
                <span className='font-bold '>{editDataFeedback?.tat}</span>
                <span className='text-[#B5B5C3]'>TAT</span>
              </div>
              {/* Feedback Received */}
              <div className='flex flex-col p-2 text-[12px] border border-dotted  border-spacing-10 mr-4'>
                <span className='font-bold '>{editDataFeedback?.feedbackReceived}</span>
                <span className='text-[#B5B5C3]'>Feedback Received</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* detail data form */}

      <div className='py-6 px-6 lg:px-8 bg-white mt-6 rounded-lg'>
        <div className='flex justify-between items-center'>
          <span className='mb-4 text-xl font-medium text-gray-900 dark:text-white '>
            Feedback Form
          </span>
          <div className='flex gap-2'>
            {/* edit */}
            <div
              className='w-[100px] h-[40px] bg-[#F69B11] rounded font-semibold flex items-center justify-center
                       text-white hover:bg-orange-600 select-none cursor-pointer'
              onClick={() => {
                dispatch(setActiveFeedBackForm(true))
              }}
            >
              <span>Edit</span>
            </div>
            {/* donwload */}
            <div
              className='mb-4 text-[13px] font-bold text-green-900 dark:text-white cursor-pointer flex items-end '
              onClick={() => {
                dispatch(feedbackExport(feedbackId)).then((response) => {
                  console.log(`url =>${response.payload.url}`)
                  window.open(response.payload.url, '_blank')
                })
              }}
            >
              <AiOutlineDownload size={20} color={'darkgreen'} />
              <span className='ml-2'> Download Feedback</span>
            </div>
          </div>
        </div>

        <div className='border mt-3'> </div>
        {/* Form */}
        <form className='space-y-6'>
          {/* feedback Type */}
          <div className='mt-4'>
            <label
              className='block mb-2 text-sm 
                             font-medium text-gray-900'
            >
              Feedback Type <span className='text-red-700 font-bold'>*</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                type='text'
                id='patientName'
                placeholder={editDataFeedback?.feedbackType}
                autoComplete='off'
                className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                disabled
              />
            </div>
          </div>

          {/* Source */}
          <div>
            <label
              className='block mb-2 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-300 '
            >
              Source <span className='text-red-700 font-bold'>*</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                type='text'
                id='patientName'
                placeholder={editDataFeedback?.source}
                autoComplete='off'
                className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                disabled
              />
            </div>
          </div>

          {/* Date Submitted */}
          <div>
            <label
              className='block mb-2 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-300 '
            >
              Date Submitted <span className='text-red-700 font-bold'>*</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                type='text'
                id='datesubbmit'
                placeholder={editDataFeedback?.feedbackReceived}
                autoComplete='off'
                className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                disabled
              />
            </div>
          </div>

          {/* Salutation */}
          <div>
            <label
              className='block mb-2 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-300 '
            >
              Salutation <span className='text-red-700 font-bold'>*</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                type='text'
                id='salutation'
                placeholder={editDataFeedback?.salutation}
                autoComplete='off'
                className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                disabled
              />
            </div>
          </div>

          {/* FullName*/}
          <div className=' '>
            <label
              className='block mb-2 text-sm 
                              font-medium text-gray-900 
                              dark:text-gray-300 '
            >
              Your Name
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                type='text'
                id='fullName'
                placeholder={editDataFeedback?.fullName}
                autoComplete='off'
                className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                disabled
              />
            </div>
          </div>

          {/* Contact Number Email */}
          <br />
          <div className='flex justify-between items-center relative'>
            {/* Contact Number */}
            <div className=' w-full mr-5'>
              <label
                className='block mb-2 text-sm 
                              font-medium text-gray-900 
                              dark:text-gray-300 '
              >
                Contact Number <span className='text-red-700 font-bold'>*</span>
              </label>
              <div className='pl-2 bg-[#ECF0F3] rounded'>
                <input
                  type='text'
                  id='contactNumber'
                  placeholder={editDataFeedback?.contactNumber}
                  autoComplete='off'
                  className=' bg-transparent h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                  disabled
                />
              </div>
            </div>

            {/* Email */}
            <div className='w-full'>
              <label
                className='block mb-2 text-sm 
                              font-medium text-gray-900 
                              dark:text-gray-300 '
              >
                Email <span className='text-red-700 font-bold'>*</span>
              </label>
              <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
                <input
                  type='email'
                  id='email'
                  placeholder={editDataFeedback?.email}
                  autoComplete='off'
                  className=' bg-transparent h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                  disabled
                />
              </div>
            </div>
          </div>
          <br />
          {/* Location Details */}
          <div>
            <label
              className='block mb-2 text-sm 
                              font-medium text-gray-900 
                              dark:text-gray-300 '
            >
              Location Detail <span className='text-red-700 font-bold'>*</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full mt-2'>
              <input
                type='text'
                id='location'
                placeholder={editDataFeedback?.locationName}
                autoComplete='off'
                className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                disabled
              />
            </div>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full mt-2'>
              <input
                type='text'
                id='area'
                placeholder={editDataFeedback?.areaName}
                autoComplete='off'
                className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                disabled
              />
            </div>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full mt-2'>
              <input
                type='text'
                id='department'
                placeholder={editDataFeedback?.departmentName}
                autoComplete='off'
                className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                disabled
              />
            </div>
          </div>
          {/* Client Patient Recident Name */}
          <div className=' '>
            <label
              className='block mb-2 text-sm 
                              font-medium text-gray-900 
                              dark:text-gray-300 '
            >
              Relationship with Client/Patient/Resident (where applicable)
              {/* Client's/Patient's/Resident's Name (where applicable) */}
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                type='text'
                id='patientName'
                placeholder={editDataFeedback?.patientName}
                autoComplete='off'
                className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                disabled
              />
            </div>
          </div>

          {/* FeedBack */}
          <div className=' '>
            <label
              className='block mb-2 text-sm 
                                  font-medium text-gray-900 
                                  dark:text-gray-300 '
            >
              Feedback
            </label>
            <div className='p-3 w-full h-auto bg-[#ECF0F3] rounded-lg'>
              <textarea
                placeholder={editDataFeedback?.feedback}
                className='w-full h-[200px] bg-transparent
                              focus:outline-none rounded-md text-sm '
                disabled
              />
            </div>
          </div>
        </form>
      </div>
      {activeFeedBackForm && <FeedbackFormModal />}
    </div>
  )
}

export default FeedbackDetail
