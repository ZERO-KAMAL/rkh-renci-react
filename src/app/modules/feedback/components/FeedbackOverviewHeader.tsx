import Loading from 'app/components/Loading'
import { MODULES } from 'app/constants/module-permission'
import ConfigService from 'app/http/config/configService'
import { fetchConfig } from 'app/http/config/configSlice'
import FeedbackService from 'app/http/feedbacks/feedBackService'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import FileSaver from 'file-saver'
import React, { useCallback, useEffect, useState } from 'react'
import { FaDownload } from 'react-icons/fa'
import { IoMdAdd } from 'react-icons/io'
import { RiInboxArchiveLine } from 'react-icons/ri'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import {
  createArchiveFeedback,
  createUnarchiveFeedback,
  fetchArchiveFeedback,
  setActiveFeedBackForm,
} from '../../../http/feedbacks/feedBackSlice'

// {title : '' , }
const FeedbackOverviewHeader = (parms: any) => {
  const dispatch = useAppDispatch()
  const { selected } = useAppSelector((state) => state.feedback)
  const { config } = useAppSelector((state) => state.config)
  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)

  // Feedback module permission
  const canFeedbackArchiveFeedback = Boolean(
    permissions.find((a) => a.code === MODULES.FeedbackOverviewArchiveFunc.code)
  )
  const canFeedbackEdit = Boolean(
    permissions.find((a) => a.code === MODULES.FeedbackOverviewEditFeedbackFunc.code)
  )

  const fetchArchive = useCallback(async () => {
    await dispatch(fetchArchiveFeedback())
  }, [])

  // actions
  const handleArchieve = () => {
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
        // console.log(`selected ids => ${selected}`)
        dispatch(createArchiveFeedback(selected)).then((response) => {
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
  const handleUnArchieve = () => {
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
        // console.log(`selected ids => ${selected}`)
        dispatch(createUnarchiveFeedback(selected)).then((response) => {
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

  // useEffect(() => {
  //   dispatch(fetchConfig({}))
  // }, [])

  const [loading, setLoading] = useState(false)
  const handleImportFeedback = async (event: any) => {
    if (!event.target.files[0]) return
    const file = event.target.files[0]
    try {
      setLoading(true)
      await FeedbackService.uploadFeedback(file)
      setLoading(false)
      toast.success('Success')
      fetchArchive()
    } catch (err: any) {
      setLoading(false)
      toast.error(`Error ${err?.status}! ${err?.data?.message || ''}`)
    }
  }

  const handleDownloadTemplate = async () => {
    // if (!config?.feedbackTemplateUri) {
    //   toast.error(`No Template found in database!`)
    //   return
    // }

    try {
      // const response = await ConfigService.downloadFromUrl(config?.feedbackTemplateUri)
      const response = await FeedbackService.downloadTemplate()

      // console.log('res: ', response)
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
        // type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      FileSaver.saveAs(blob, 'Feedback_Template.xlsx')
    } catch (err: any) {
      if (err) console.log(err)
      toast.error(`Error ${err?.status || ''}! ${err?.data?.message || ''}`)
    }
  }

  return (
    <div className='flex justify-between items-center pt-4  flex-wrap'>
      {/* title */}
      <h1 className='text-lg text-black font-semibold'>{parms.title}</h1>
      {/* button groups */}
      {parms.title !== 'Archive' ? (
        <div className='flex flex-row gap-4'>
          {/* archieve button */}
          {canFeedbackArchiveFeedback && (
            <button
              className={clsx(
                'w-[150px] h-[40px] bg-[#2BA579] rounded font-semibold text-white  hover:bg-green-500 p-1 flex items-center justify-start pl-3',
                selected.length <= 0 && 'hidden'
              )}
              onClick={() => {
                handleArchieve()
              }}
            >
              <RiInboxArchiveLine size={20} className='mr-3' /> Archive ({selected.length})
            </button>
          )}
          {/* add button */}
          {canFeedbackEdit && (
            <button
              className='h-[40px] bg-[#F69B11] rounded text-white
         hover:bg-orange-500 px-2 py-1 flex items-center justify-center font-semibold'
              onClick={() => {
                dispatch(setActiveFeedBackForm(true))
              }}
            >
              <IoMdAdd size={20} /> Add Feedback
            </button>
          )}
        </div>
      ) : (
        <div className='flex flex-row gap-4 justify-start md:justify-end flex-wrap'>
          {/* unarchieve button  flex flex-row gap-4 */}
          <button
            className={clsx(
              'w-[150px] h-[45px] bg-[#2BA579] rounded font-semibold text-white  hover:bg-green-800 p-1 flex items-center justify-start pl-3 text-sm',
              selected.length <= 0 && 'hidden'
            )}
            onClick={() => {
              handleUnArchieve()
            }}
          >
            <RiInboxArchiveLine size={15} className='mr-3' /> Unarchive ({selected?.length})
          </button>
          <button
            className={clsx(
              'w-[200px] h-[45px] bg-[#2BA579] rounded font-semibold text-sm text-white  hover:bg-green-800 p-1 flex items-center justify-start pl-3'
            )}
            onClick={() => {
              handleDownloadTemplate()
            }}
          >
            <FaDownload size={15} className='mr-1' /> Download Template
          </button>
          {/* import button */}
          <div className='flex justify-center align-middle w-[180px]'>
            <input
              id='import-feedback'
              className='invisible w-0'
              type='file'
              name='file'
              accept='.xlsx, .xls'
              onChange={(e: any) => {
                handleImportFeedback(e)
              }}
            />
            <label
              htmlFor='import-feedback'
              className='w-full h-[45px] bg-[#2BA579] rounded font-bold text-sm text-white  hover:bg-green-800 p-1 flex items-center justify-start pl-3'
            >
              <IoMdAdd size={20} /> Import Feedback
            </label>
          </div>
        </div>
      )}
      {loading && <Loading />}
    </div>
  )
}

export default FeedbackOverviewHeader
