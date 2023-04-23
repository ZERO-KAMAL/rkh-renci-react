import LoadingButton from '@mui/lab/LoadingButton'
import { Box, Button, CircularProgress, Grid } from '@mui/material'
import CustomMultipleSelect3, { DropdownOptions } from 'app/common/MultipleSelect3'
import CustomSelect from 'app/common/select'
import Loading from 'app/components/Loading'
import { FORM_FIELD_TYPE } from 'app/constants'
import { MODULES } from 'app/constants/module-permission'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { defParamsFb, fetchFeedbackTypes } from 'app/http/feedback-types/feedbacktypesSlice'
import FeedbackService from 'app/http/feedbacks/feedBackService'
import { uploadFile } from 'app/http/upload/uploadSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import clsx from 'clsx'
import FileSaver from 'file-saver'
import _ from 'lodash'
import moment from 'moment'
import QRCode from 'qrcode.react'
import React, { FC, useEffect, useState } from 'react'
import { AiFillDelete, AiOutlineDelete, AiOutlineDownload, AiOutlineEye } from 'react-icons/ai'
import { BiArrowBack } from 'react-icons/bi'
import { BsReplyAll } from 'react-icons/bs'
import { FiActivity } from 'react-icons/fi'
import { MdOutlineModeEditOutline } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

import imoji2 from '../../../assets/gif/frowning_face.gif'
import imoji4 from '../../../assets/gif/grinning_face_with_smiling_eyes.gif'
import imoji3 from '../../../assets/gif/nutral_face.gif'
import imoji1 from '../../../assets/gif/pouting_face.gif'
import imoji5 from '../../../assets/gif/smiling_face_with_heart_eyes.gif'
import {
  feedbackExport,
  fetchFeedbackById,
  setActiveFeedBackActivity,
  setActiveFeedBackDetail,
  setActiveFeedBackForm,
  setActiveTagAssignFeedBackForm,
} from '../../../http/feedbacks/feedBackSlice'
import ReplyModal from '../components/ReplyModal'
import FeedbackFormModal from './FeedbackFormModal'
import RecentActivityFormModal from './RecentActivityFormModal'
import TagAssignFeedbackFormModal from './TagAssignFeedbackFormModal'

export const statusCase = {
  NewCase: 'New Case',
  AckCase: 'Case Acknowledged',
  Overdue: 'Response Overdue',
  Pending: 'Pending Response',
  CaseActive: 'Case Active',
  CaseClosed: 'Case Closed',
}

moment.locale('en-GB')

const NULL_PLACEHOLDER = 'N/A'

// check feedback id and call get by id to get data
const FeedbackDetailDynamic: FC = () => {
  const params = useParams()
  const { feedbackId } = params

  const dispatch = useAppDispatch()
  const {
    // editDataFeedback,
    editDataFeedbackOrg,
    activeFeedBackActivity,
    activeFeedBackForm,
    loadingFeedback,
  } = useAppSelector((state) => state.feedback)

  const { dataTable: feedbackTypeTbl, loading: loadingFeedbackType } = useAppSelector(
    (state) => state.feedbackTypes
  )
  const navigate = useNavigate()
  const [feedbackTypeOpt, setFeedbackTypeOpt] = useState<string[]>([])
  const [feedbackTypeSubOpt, setFeedbackTypeSubOpt] = useState<DropdownOptions[]>([])
  const [feedbackType, setFeedbackType] = useState<string>('')
  const [feedbackInitSubCategory, setFeedbackInitSubCategory] = useState<string[]>([])
  const [feedbackTypeSubCategory, setFeedbackTypeSubCategory] = useState<string[]>([])
  const [categoryError, setCategoryError] = useState(false)
  const [summary, setSummary] = useState('')
  const [rootCause, setRootCause] = useState('')
  const [outcome, setOutcome] = useState('')
  const [process, setProcess] = useState('')
  const [delayDueTo, setDelayDueTo] = useState('')
  const [remarks, setRemarks] = useState('')
  const [mpLetter, setMpLetter] = useState('')
  const [mpLetterUploading, setMpLetterUploading] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const { activeTagAssignFeedBackForm } = useAppSelector((state) => state.feedback)

  const { permissions } = useAppSelector((state) => state.user.currentUser?.userInfo.role!)
  const canFeedbackEdit = Boolean(
    permissions.find((a) => a.code === MODULES.FeedbackOverviewEditFeedbackFunc.code)
  )

  // const [reload, setReload] = useState('')
  const xxx = useAppSelector((state) => state.feedback)

  // useEffect(() => {
  //   // console.log(`FeedbackDetailDynamic....${feedbackId}`)
  //   // console.log(xxx)
  //   // console.log('editDataFeedback: ', editDataFeedback)
  //   console.log('editDataFeedbackOrg: ', editDataFeedbackOrg)
  // }, [loadingFeedback])

  useEffect(() => {
    if (!feedbackTypeTbl.rows.length || !editDataFeedbackOrg) return
    const feedbackTypeNames = feedbackTypeTbl.rows.map((item) => item.name)
    // console.log('DEBUG feedbackTypeTbl: ', feedbackTypeTbl)
    // console.log('DEBUG editDataFeedback: ', editDataFeedback)
    setFeedbackTypeOpt(feedbackTypeNames)
    setFeedbackType(editDataFeedbackOrg?.feedbackTypeName)
    setFeedbackInitSubCategory(editDataFeedbackOrg?.subCategories || [])
    setSummary(editDataFeedbackOrg?.summary)
    setRootCause(editDataFeedbackOrg?.rootCauses)
    setOutcome(editDataFeedbackOrg?.outCome)
    setProcess(editDataFeedbackOrg?.processImprovement)
    setDelayDueTo(editDataFeedbackOrg?.delayDueTo)
    setRemarks(editDataFeedbackOrg?.remarks)
    setMpLetter(editDataFeedbackOrg?.mpLetter)
  }, [feedbackTypeTbl, editDataFeedbackOrg])

  useEffect(() => {
    const categories =
      feedbackTypeTbl.rows
        .find((item) => item.name === feedbackType)
        ?.subCategories?.map((subCategoryName) => {
          return {
            id: subCategoryName,
            label: subCategoryName,
          }
        }) || []
    setFeedbackTypeSubOpt(categories)
    setFeedbackTypeSubCategory([])
    // console.log('debug: ', categories)
  }, [feedbackType])

  useEffect(() => {
    dispatch(fetchFeedbackTypes(defParamsFb))
  }, [])

  useEffect(() => {
    // console.log(`reload changes...${feedbackId}_${JSON.stringify(editDataFeedbackOrg?.status)}`)
    if (feedbackId) {
      // console.log(`feedbackId => ${feedbackId}`)
      // dispatch(setActiveFeedBackDetail({ active: false, feedbackId: Number(feedbackId) }))
      dispatch(fetchFeedbackById(Number(feedbackId)))
    }
  }, [editDataFeedbackOrg?.status, activeFeedBackForm])

  const url = new URL(window.location.href)

  const [replyFeedbackId, setReplyFeedBackId] = useState<any>(undefined)

  const handleFeedbackTypeChange = (e: any) => {
    // console.log('handleFeedbackTypeChange: ', e.target.value)
    setFeedbackType(e.target.value)
  }

  const handleSubCategoryChange = async (ids: any[]) => {
    // console.log('handleSubCategoryChange: ', ids)
    setFeedbackTypeSubCategory(ids)
    ids.length ? setCategoryError(false) : setCategoryError(true)
  }

  const handleSubmit = async () => {
    // Sub-Category is mandatory
    if (feedbackTypeSubOpt.length && !feedbackTypeSubCategory.length) {
      setCategoryError(true)
    }

    const editData = _.cloneDeep(editDataFeedbackOrg)
    if (!editData) return
    editData['feedbackTypeName'] = feedbackType
    editData['subCategories'] = feedbackTypeSubCategory
    editData.summary = summary
    editData.rootCauses = rootCause
    editData.outCome = outcome
    editData.processImprovement = process
    editData.delayDueTo = delayDueTo
    editData.remarks = remarks
    if (feedbackType === 'Appeals/MP letters') {
      editData.mpLetter = mpLetter
    }
    try {
      const res = await FeedbackService.updateFeedback(editData.id, {
        ...editData,
      })
      dispatch(fetchFeedbackById(Number(feedbackId)))
      toast.success('Success')
    } catch (err: any) {
      toast.error(`Error ${err?.status}! ${err?.data?.message}`)
    }
  }

  const calculateTAT = (closedDateTime: any, submittedDate: any): number => {
    let diff
    if (closedDateTime) {
      const start = moment(closedDateTime).local()
      const end = moment(submittedDate).local()
      diff = start.diff(end, 'days')
    } else {
      const start = moment().local()
      const end = moment(submittedDate).local()
      diff = start.diff(end, 'days')
    }
    return diff
  }

  const inputFileRef = React.useRef<HTMLInputElement>(null)
  const onFileChangeCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event?.target?.files?.[0]
    if (event.target.files && file) {
      setMpLetterUploading(true)
      dispatch(uploadFile(file))
        .then((res: any) => {
          setMpLetterUploading(false)
          const { payload } = res
          if (payload.status === 200) {
            // setFieldValue('avatarUri', payload.uri)
            setMpLetter(res.payload.uri)
          }
        })
        .catch((err: any) => {
          setMpLetterUploading(false)
          // console.log('error: ', err)
        })
    }
  }
  const onUploadMpLetter = () => {
    // console.log('clicked: ', inputFileRef?.current)
    inputFileRef?.current?.click()
  }

  // useEffect(() => {
  //   console.log('editDataFeedbackOrg: ', editDataFeedbackOrg)
  // }, [editDataFeedbackOrg])

  // useEffect(() => {
  //   console.log('mpLetter: ', mpLetter)
  // }, [mpLetter])

  return (
    <div className='max-w-[1120px]  mx-auto pt-4 mt-8'>
      {activeFeedBackActivity && <RecentActivityFormModal />}
      {loadingFeedback && <Loading />}
      <div className='flex  justify-between'>
        <div className='flex items-center'>
          <BiArrowBack
            size={30}
            color={'green'}
            className='cursor-pointer'
            onClick={() => {
              dispatch(setActiveFeedBackDetail(false))
              navigate(-1)
            }}
          />
          <h1 className=' text-lg text-black font-semibold ml-4'>Back To Feedback Overview</h1>
        </div>
        <div className='flex flex-row gap-4 flex-wrap'>
          {/* Recent Activity */}
          <button
            className='w-[150px] h-[40px] bg-[#F69B11] rounded font-semibold text-white
         hover:bg-orange-500 p-l flex items-center justify-center text-sm'
            onClick={() => {
              dispatch(setActiveFeedBackActivity({ active: true, feedbackId: feedbackId }))
            }}
          >
            <FiActivity size={20} className='mr-1' /> Recent Activity
          </button>
          {/* Reply */}
          {canFeedbackEdit && (
            <button
              className={clsx(
                'w-[150px] h-[40px] bg-[#2BA579] rounded font-semibold text-white  hover:bg-green-500 p-1 flex items-center justify-center pl-3 text-sm'
              )}
              onClick={() => setReplyFeedBackId(feedbackId)}
            >
              <BsReplyAll size={20} className='mr-3' /> Reply
            </button>
          )}
        </div>
      </div>
      {/* qrcode info */}
      <div className='bg-white w-full  rounded-lg mt-4 p-4'>
        {/* qrcode */}
        <div className='flex items-center flex-wrap'>
          {/* {editDataFeedbackOrg?.feedbackFormCode && editDataFeedbackOrg && (
            <div className='ml-5'>
              <QRCode
                id='qr-gen'
                value={`${url.host}/feedback/formview/${editDataFeedbackOrg?.feedbackFormCode}`}
                size={130}
                level={'H'}
                includeMargin
              />
            </div>
          )} */}
          {/* feedback info */}
          <div className='flex-col ml-8 w-full'>
            <div className='text-sm font-bold mb-2'>
              Feedback ID : <span>{editDataFeedbackOrg?.feedbackCode} </span>
            </div>
            {/* <div className='text-[10px] text-["#B5B5C3"] mb-3'>
              Form ID : <span>{editDataFeedbackOrg?.feedbackCode}</span>
            </div> */}
            <span
              className={clsx(
                'rounded-lg text-sm font-bold p-2 mt-4',
                editDataFeedbackOrg?.status === statusCase.NewCase && 'text-[#0095E8] bg-[#ECF8FF]',
                editDataFeedbackOrg?.status === statusCase.AckCase && 'text-[#8950FC] bg-[#EEE5FF]',
                editDataFeedbackOrg?.status === statusCase.CaseActive &&
                  'text-#50CD89] bg-[#E8FFF3]',
                editDataFeedbackOrg?.status === statusCase.Overdue && 'text-[#F1416C] bg-[#FFF5F8]',
                editDataFeedbackOrg?.status === statusCase.CaseClosed &&
                  'text-[#5E6278] bg-[#E4E6EF]',
                editDataFeedbackOrg?.status === statusCase.Pending && 'text-[#FFA621] bg-[#FFF5E7]'
              )}
            >
              {editDataFeedbackOrg?.status}
            </span>
            {/* <span className='p-1 text-[#8950FC] bg-[#EEE5FF] rounded-lg text-sm font-bold '>
              Case Acknowledged
            </span> */}
            <div className='flex flex-1 mt-4 flex-wrap w-full'>
              {/* Case Tag */}
              <div className='flex flex-col p-2 text-[12px] border-2 border-slate-400 border-dotted  border-spacing-10 mr-4 w-[40%] md:w-[15%]'>
                <span className='font-bold '>{editDataFeedbackOrg?.caseType}</span>
                <span className='text-slate-500'>Case Tag</span>
              </div>
              {/* Source */}
              <div className='flex flex-col p-2 text-[12px] border-2 border-slate-400 border-dotted  border-spacing-10 mr-4 w-[40%] md:w-[15%]'>
                <span className='font-bold '>{editDataFeedbackOrg?.source}</span>
                <span className='text-slate-500'>Source</span>
              </div>
              {/* TAT */}
              <div className='flex flex-col p-2 text-[12px] border-2 border-slate-400 border-dotted  border-spacing-10 mr-4 w-[40%] md:w-[15%]'>
                {/* <span className='font-bold '>{editDataFeedbackOrg?.TAT}</span> */}
                <span className='font-bold '>
                  {calculateTAT(
                    editDataFeedbackOrg?.closedDateTime,
                    editDataFeedbackOrg?.submittedDate
                  )}
                  /{editDataFeedbackOrg?.TAT}
                  &nbsp;Days
                </span>
                <span className='text-slate-500'>TAT Group</span>
              </div>
              {/* Feedback Received */}
              <div className='flex flex-col p-2 text-[12px] border-2 border-slate-400 border-dotted  border-spacing-10 mr-4 w-[40%] md:w-[15%]'>
                <span className='font-bold '>
                  {moment(editDataFeedbackOrg?.submittedDate).local().format('DD/MM/YYYY')}
                </span>
                <span className='font-bold '>
                  {moment(editDataFeedbackOrg?.submittedDate).local().format('hh:mm a')}
                </span>
                <span className='text-slate-500'>Feedback Received</span>
              </div>
              {/* Feedback Acknowledged */}
              {editDataFeedbackOrg &&
                editDataFeedbackOrg?.status !== 'New Case' &&
                editDataFeedbackOrg?.ackDateTime && (
                  <div className='flex flex-col p-2 text-[12px] border-2 border-slate-400 border-dotted  border-spacing-10 mr-4 w-[86%] md:w-[15%]'>
                    <span className='font-bold '>
                      {moment(editDataFeedbackOrg?.ackDateTime).local().format('DD/MM/YYYY')}
                    </span>
                    <span className='font-bold '>
                      {moment(editDataFeedbackOrg?.ackDateTime).local().format('hh:mm a')}
                    </span>
                    <span className='text-slate-500'>Feedback Acknowledged</span>
                  </div>
                )}
              {/* Feedback Closed */}
              {editDataFeedbackOrg &&
                editDataFeedbackOrg?.status === 'Case Closed' &&
                editDataFeedbackOrg?.closedDateTime && (
                  <div className='flex flex-col p-2 text-[12px] border-2 border-slate-400 border-dotted  border-spacing-10 w-[86%] md:w-[15%]'>
                    <span className='font-bold '>
                      {moment(editDataFeedbackOrg?.closedDateTime).local().format('DD/MM/YYYY')}
                    </span>
                    <span className='font-bold '>
                      {moment(editDataFeedbackOrg?.closedDateTime).local().format('hh:mm a')}
                    </span>
                    <span className='text-slate-500'>Feedback Closed</span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {!loadingFeedbackType && canFeedbackEdit ? (
        <Box className='mt-4 bg-white px-6 py-8  mb-6 rounded-xl'>
          <div className='flex justify-between items-center'>
            <span className='mb-4 text-xl font-medium text-gray-90 '>Internal Comments</span>
            <LoadingButton
              variant='contained'
              className='bg-[#2BA579] hover:bg-[#2BA579] focus:bg-[#2BA579] normal-case'
              loading={false}
              loadingPosition='center'
              onClick={() => {
                handleSubmit()
              }}
              disabled={categoryError}
            >
              Save
            </LoadingButton>
          </div>
          <Grid container spacing={2}>
            <Grid item sm={12} md={6} lg={6} className='w-full'>
              <CustomSelect
                label={'Feedback Type'}
                none={'false'}
                height={'h-11'}
                options={feedbackTypeOpt}
                value={feedbackType}
                handleChange={handleFeedbackTypeChange}
              />
            </Grid>
            {feedbackTypeSubOpt.length ? (
              <Grid item sm={12} md={6} lg={6} className='w-full'>
                <CustomMultipleSelect3
                  label='Root causes/Aspects'
                  handleChange={handleSubCategoryChange}
                  placeholderText={'Select Category'}
                  enableAllSelect
                  multiple={true}
                  initialValue={feedbackInitSubCategory}
                  options={feedbackTypeSubOpt}
                />
                {categoryError && (
                  <div className='text-red-600 text-sm ml-2 '>
                    <span role='alert'>{'Root causes/ aspects is required'}</span>
                  </div>
                )}
              </Grid>
            ) : (
              <></>
            )}
            {/* <Grid item xs={12}>
              <div>
                <label className='block mb-2 font-roboto font-medium text-base text-[#7E8299]'>
                  Summary of Feedback
                </label>
                <div className=' bg-[#ECF0F3] rounded w-full'>
                  <textarea
                    placeholder={NULL_PLACEHOLDER}
                    className='w-full h-[70px] bg-transparent focus:outline-none rounded-md text-sm p-2'
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                  />
                </div>
              </div>
            </Grid> */}
            {/* <Grid item xs={12}>
              <div>
                <label className='block mb-2 font-roboto font-medium text-base text-[#7E8299]'>
                  Root causes/Aspects
                </label>
                <div className=' bg-[#ECF0F3] rounded w-full'>
                  <textarea
                    placeholder={NULL_PLACEHOLDER}
                    className='w-full h-[70px] bg-transparent focus:outline-none rounded-md text-sm p-2'
                    value={rootCause}
                    onChange={(e) => setRootCause(e.target.value)}
                  />
                </div>
              </div>
            </Grid> */}
            <Grid item xs={12}>
              <div>
                <label className='block mb-2 font-roboto font-medium text-base text-[#7E8299]'>
                  Outcome
                </label>
                <div className=' bg-[#ECF0F3] rounded w-full'>
                  <textarea
                    placeholder={NULL_PLACEHOLDER}
                    className='w-full h-[70px] bg-transparent focus:outline-none rounded-md text-sm p-2'
                    value={outcome || ''}
                    onChange={(e) => setOutcome(e.target.value)}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div>
                <label className='block mb-2 font-roboto font-medium text-base text-[#7E8299]'>
                  Process improvement (if none, state why)
                </label>
                <div className=' bg-[#ECF0F3] rounded w-full'>
                  <textarea
                    placeholder={NULL_PLACEHOLDER}
                    className='w-full h-[70px] bg-transparent focus:outline-none rounded-md text-sm p-2'
                    value={process || ''}
                    onChange={(e) => setProcess(e.target.value)}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div>
                <label className='block mb-2 font-roboto font-medium text-base text-[#7E8299]'>
                  Delay due to
                </label>
                <div className=' bg-[#ECF0F3] rounded w-full'>
                  <textarea
                    placeholder={NULL_PLACEHOLDER}
                    className='w-full h-[70px] bg-transparent focus:outline-none rounded-md text-sm p-2'
                    value={delayDueTo || ''}
                    onChange={(e) => setDelayDueTo(e.target.value)}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div>
                <label className='block mb-2 font-roboto font-medium text-base text-[#7E8299]'>
                  Remarks
                </label>
                <div className=' bg-[#ECF0F3] rounded w-full'>
                  <textarea
                    placeholder={NULL_PLACEHOLDER}
                    className='w-full h-[70px] bg-transparent focus:outline-none rounded-md text-sm p-2'
                    value={remarks || ''}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>
              </div>
            </Grid>
            {feedbackType === 'Appeals/MP letters' && (
              <>
                {/* file upload */}
                <input
                  id='mp-letter'
                  ref={inputFileRef}
                  className='invisible h-0'
                  type='file'
                  name='file'
                  accept='*'
                  onChange={(e: any) => onFileChangeCapture(e)}
                />
                <Grid item xs={12}>
                  <div>
                    <label className='block mb-2 font-roboto font-medium text-base text-[#7E8299]'>
                      MP Letter
                    </label>
                    {!mpLetter || mpLetterUploading ? (
                      <div className='max-w-[150px] flex items-end'>
                        <LoadingButton
                          variant='contained'
                          className='!bg-[#2BA579] !hover:bg-[#2BA579] !focus:bg-[#2BA579] normal-case'
                          loading={mpLetterUploading}
                          loadingPosition='center'
                          onClick={onUploadMpLetter}
                        >
                          Upload file
                        </LoadingButton>
                      </div>
                    ) : (
                      <Grid container spacing={4}>
                        <Grid item xs={4}>
                          <p>{mpLetter.split('_')[1]}</p>
                        </Grid>
                        <Grid item xs={4}>
                          <div className='flex gap-2'>
                            <AiOutlineEye
                              size={24}
                              onClick={() => {
                                window.open(mpLetter, '_blank', 'noopener,noreferrer')
                              }}
                              className='hover:cursor-pointer'
                            />
                            <MdOutlineModeEditOutline
                              size={24}
                              onClick={onUploadMpLetter}
                              className='hover:cursor-pointer'
                            />
                            <AiOutlineDelete
                              size={24}
                              onClick={() => {
                                setMpLetter('')
                              }}
                              className='hover:cursor-pointer'
                            />
                          </div>
                        </Grid>
                      </Grid>
                    )}
                  </div>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      ) : (
        canFeedbackEdit && <CircularProgress color='success' />
      )}

      {/* detail data form */}

      <div className='py-6 px-6 lg:px-8 bg-white mt-6 rounded-lg'>
        <div className='flex justify-between items-center'>
          <span className='mb-4 text-xl font-medium text-gray-90 '>Feedback Form</span>
          <div className='flex gap-2'>
            {/* edit */}
            {!editDataFeedbackOrg?.feedbackFormCode && editDataFeedbackOrg && (
              <div
                className='w-[100px] h-[40px] bg-[#F69B11] rounded font-semibold flex items-center justify-center
                        text-white hover:bg-orange-600 select-none cursor-pointer'
                onClick={() => {
                  dispatch(setActiveFeedBackForm(true))
                }}
              >
                <span>Edit</span>
              </div>
            )}
            {/* donwload */}
            <button
              className='mb-4 text-[16px] font-bold text-[#2BA579] cursor-pointer flex items-center'
              onClick={() => {
                setDownloading(true)
                dispatch(feedbackExport(feedbackId)).then((response) => {
                  // const linkSource = `data:application/pdf;base64,${response.payload.url}`
                  // const downloadLink = document.createElement("a");
                  // const fileName = `Feedback_${editDataFeedbackOrg?.feedbackCode}.pdf`
                  // downloadLink.href = linkSource;
                  // downloadLink.download = fileName;
                  // downloadLink.click();

                  try {
                    const fileName = `Feedback_${editDataFeedbackOrg?.feedbackCode}.pdf`

                    const byteCharacters = window.atob(response.payload.url)
                    const byteNumbers = new Array(byteCharacters.length)
                    for (let i = 0; i < byteCharacters.length; i++) {
                      byteNumbers[i] = byteCharacters.charCodeAt(i)
                    }
                    const byteArray = new Uint8Array(byteNumbers)

                    const blob = new Blob([byteArray], {
                      type: 'data:application/pdf;base64',
                    })
                    console.log('Saving ...')
                    FileSaver.saveAs(blob, fileName)
                    console.log('PDF Saved!')
                    setDownloading(false)
                  } catch (err: any) {
                    toast.error(`Error ${err?.status}! ${err?.data?.message}`)
                    console.log(err)
                  }
                })
              }}
            >
              {!downloading ? (
                <>
                  <AiOutlineDownload size={25} color={'#2BA579'} />
                  <span className='ml-2'> Download Feedback</span>
                </>
              ) : (
                <>
                  <span className='ml-2'> Downloading...</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className='border mt-3'> </div>
        {/* Form */}
        <form className='space-y-6'>
          {/* feedback Type */}
          <div className='mt-4'>
            <label
              className='block mb-2 text-sm 
                             font-medium text-gray-900 '
            >
              Feedback Type <span className='text-red-700 font-bold'>*</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                type='text'
                id='patientName'
                placeholder={editDataFeedbackOrg?.feedbackTypeName || NULL_PLACEHOLDER}
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
                             font-medium text-gray-900'
            >
              Source <span className='text-red-700 font-bold'>*</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                type='text'
                id='patientName'
                placeholder={editDataFeedbackOrg?.source || NULL_PLACEHOLDER}
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
                             font-medium text-gray-900'
            >
              Date Submitted <span className='text-red-700 font-bold'>*</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                type='text'
                id='datesubbmit'
                placeholder={
                  moment.utc(editDataFeedbackOrg?.submittedDate).format('DD/MM/YYYY') ||
                  NULL_PLACEHOLDER
                }
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
                             font-medium text-gray-900'
            >
              Salutation <span className='text-red-700 font-bold'>*</span>
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                type='text'
                id='salutation'
                placeholder={editDataFeedbackOrg?.salutation || NULL_PLACEHOLDER}
                autoComplete='off'
                className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                disabled
              />
            </div>
          </div>

          {/* FullName*/}
          <div className=' '>
            <label className='block mb-2 text-sm font-medium text-gray-900'>
              Name of Feedback Provider/Appellant and Relationship
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                disabled
                type='text'
                id='fullName'
                placeholder={editDataFeedbackOrg?.fullName || NULL_PLACEHOLDER}
                autoComplete='off'
                className='bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
              />
            </div>
          </div>

          {/* Summary, shown when we used import feedback from excel file*/}
          {Boolean(editDataFeedbackOrg?.summary) && (
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900'>
                Summary of feedback
              </label>
              <div className=' bg-[#ECF0F3] rounded w-full'>
                <textarea
                  placeholder={NULL_PLACEHOLDER}
                  className='w-full h-[210px] bg-transparent focus:outline-none rounded-md text-sm p-2 caret-transparent'
                  value={editDataFeedbackOrg?.summary || ''}
                />
              </div>
            </div>
          )}

          {/* Summary, shown when we used create feedback from manual input*/}
          {Boolean(editDataFeedbackOrg?.feedback) && (
            <div>
              <label className='block mb-2 text-sm font-medium text-gray-900'>
                Summary of feedback
              </label>
              <div className=' bg-[#ECF0F3] rounded w-full'>
                <textarea
                  placeholder={NULL_PLACEHOLDER}
                  className='w-full h-[210px] bg-transparent focus:outline-none rounded-md text-sm p-2 caret-transparent'
                  value={editDataFeedbackOrg?.feedback || ''}
                />
              </div>
            </div>
          )}

          {/* Contact Number Email */}
          <br />
          <div className='flex justify-between items-center relative'>
            {/* Contact Number */}
            <div className=' w-full mr-5'>
              <label
                className='block mb-2 text-sm 
                              font-medium text-gray-900'
              >
                Contact Number
                {/* <span className='text-red-700 font-bold'>*</span> */}
              </label>
              <div className='pl-2 bg-[#ECF0F3] rounded'>
                <input
                  type='text'
                  id='contactNumber'
                  placeholder={editDataFeedbackOrg?.contactNumber || NULL_PLACEHOLDER}
                  autoComplete='off'
                  // w-[300px] lg:w-full
                  className=' bg-transparent h-[40px] ml-2 focus:outline-none rounded-md text-sm w-full'
                  disabled
                />
              </div>
            </div>

            {/* Email */}
            <div className='w-full'>
              <label
                className='block mb-2 text-sm 
                              font-medium text-gray-900'
              >
                Email
                {/* <span className='text-red-700 font-bold'>*</span> */}
              </label>
              <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
                <input
                  type='email'
                  id='email'
                  placeholder={editDataFeedbackOrg?.email || NULL_PLACEHOLDER}
                  autoComplete='off'
                  className=' bg-transparent h-[40px] ml-2 focus:outline-none rounded-md text-sm w-full'
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
                              font-medium text-gray-900'
            >
              Location Detail <span className='text-red-700 font-bold'>*</span>
            </label>
            {editDataFeedbackOrg && editDataFeedbackOrg?.assignLocations?.length > 0 ? (
              editDataFeedbackOrg?.assignLocations.map((loc: any, idx: any) => (
                <div key={idx}>
                  <div className='pl-2 bg-[#ECF0F3] rounded w-full mt-2'>
                    <input
                      type='text'
                      id='location'
                      placeholder={loc?.location?.name || NULL_PLACEHOLDER}
                      autoComplete='off'
                      className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                      disabled
                    />
                  </div>
                  <div className='pl-2 bg-[#ECF0F3] rounded w-full mt-2'>
                    <input
                      type='text'
                      id='area'
                      placeholder={loc?.area?.name || NULL_PLACEHOLDER}
                      autoComplete='off'
                      className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                      disabled
                    />
                  </div>
                  <div className='pl-2 bg-[#ECF0F3] rounded w-full mt-2'>
                    <input
                      type='text'
                      id='department'
                      placeholder={loc?.department?.name || NULL_PLACEHOLDER}
                      autoComplete='off'
                      className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                      disabled
                    />
                  </div>
                </div>
              ))
            ) : (
              <div>
                <div className='pl-2 bg-[#ECF0F3] rounded w-full mt-2'>
                  <input
                    type='text'
                    id='location'
                    placeholder={
                      editDataFeedbackOrg?.locationDetail?.location?.name || NULL_PLACEHOLDER
                    }
                    autoComplete='off'
                    className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                    disabled
                  />
                </div>
                <div className='pl-2 bg-[#ECF0F3] rounded w-full mt-2'>
                  <input
                    type='text'
                    id='area'
                    placeholder={
                      editDataFeedbackOrg?.locationDetail?.area?.name || NULL_PLACEHOLDER
                    }
                    autoComplete='off'
                    className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                    disabled
                  />
                </div>
                <div className='pl-2 bg-[#ECF0F3] rounded w-full mt-2'>
                  <input
                    type='text'
                    id='department'
                    placeholder={
                      editDataFeedbackOrg?.locationDetail?.department?.name || NULL_PLACEHOLDER
                    }
                    autoComplete='off'
                    className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                    disabled
                  />
                </div>
              </div>
            )}
          </div>
          {/* Client Patient Recident Name */}
          <div className=' '>
            <label
              className='block mb-2 text-sm 
                              font-medium text-gray-900'
            >
              Name of Patient/ Resident/Client (and last 4 characters of NRIC)
              {/* Client's/Patient's/Resident's Name (where applicable) */}
            </label>
            <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
              <input
                type='text'
                id='patientName'
                placeholder={editDataFeedbackOrg?.patientName || NULL_PLACEHOLDER}
                autoComplete='off'
                className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                disabled
              />
            </div>
          </div>

          {/* FeedBack */}
          {/* <div className=' '>
            <label
              className='block mb-2 text-sm 
                                  font-medium text-gray-900'
            >
              Feedback
            </label>
            <div className='p-3 w-full h-auto bg-[#ECF0F3] rounded-lg'>
              <textarea
                placeholder={editDataFeedbackOrg?.feedback || NULL_PLACEHOLDER}
                className='w-full h-[200px] bg-transparent
                              focus:outline-none rounded-md text-sm '
                disabled
              />
            </div>
          </div> */}
        </form>
        {Array.isArray(editDataFeedbackOrg?.dynamicValues) &&
          editDataFeedbackOrg?.dynamicValues?.map((item: any, i: number) => {
            return (
              <div key={i}>
                {item.key === FORM_FIELD_TYPE.ADDRESS ? (
                  <div className='mt-5 text-gray-400'>
                    <label className='block mb-2 text-sm font-medium text-gray-900'>
                      {item?.fieldName}
                    </label>
                    <input
                      className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm px-4 w-full'
                      type='text'
                      placeholder={item?.value?.street || NULL_PLACEHOLDER}
                      disabled
                    />
                    <div className='flex gap-4 mt-4 max-md:flex-col'>
                      <input
                        className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 max-md:flex-none px-4'
                        type='text'
                        placeholder={item?.value?.unit || NULL_PLACEHOLDER}
                        disabled
                      />
                      <input
                        className='bg-[#ECF0F3] h-[40px] focus:outline-none rounded-md text-sm flex-1 max-md:flex-none px-4'
                        type='text'
                        placeholder={item?.value?.code || NULL_PLACEHOLDER}
                        disabled
                      />
                    </div>
                  </div>
                ) : item.key === FORM_FIELD_TYPE.LONG_TEXT ? (
                  <div className='mt-5'>
                    <label className='block mb-2 text-sm font-medium text-gray-90'>
                      {item?.fieldName}
                    </label>
                    <div className='p-3 w-full h-auto bg-[#ECF0F3] rounded-lg'>
                      <textarea
                        placeholder={item.value || NULL_PLACEHOLDER}
                        className='w-full h-[100px] bg-transparent focus:outline-none rounded-md text-sm '
                        disabled
                      />
                    </div>
                  </div>
                ) : item.key === FORM_FIELD_TYPE.MULTIPLE_CHOISE ? (
                  <div className='mt-5'>
                    <label className='block mb-2 text-sm font-medium text-gray-90'>
                      {item?.fieldName}
                    </label>
                    <div className='p-3 w-full h-auto bg-[#ECF0F3] rounded-lg'>
                      {item?.value?.map((choise: any, i: number) => {
                        return (
                          <p className='text-sm text-gray-400' key={i}>
                            {choise || NULL_PLACEHOLDER}
                          </p>
                        )
                      })}
                    </div>
                  </div>
                ) : item.key === FORM_FIELD_TYPE.UPLOAD_IMAGE ? (
                  <div className='mt-5'>
                    <label className='block mb-2 text-sm font-medium text-gray-90'>
                      {item?.fieldName}
                    </label>
                    <figure className='max-w-[300px]'>
                      <img src={item.value} alt='Loading..' />
                    </figure>
                  </div>
                ) : item.key === FORM_FIELD_TYPE.SMILY_FACE ? (
                  <div className='mt-5'>
                    <label className='block mb-2 text-sm font-medium text-gray-90'>
                      {item?.fieldName}
                    </label>
                    <div className='pl-2 bg-[#ECF0F3] rounded w-full h-[40px]'>
                      {item.value === 1 ? (
                        <img className='w-[40px]' src={imoji1} alt='loading...' />
                      ) : item.value === 2 ? (
                        <img className='w-[40px]' src={imoji2} alt='loading...' />
                      ) : item.value === 3 ? (
                        <img className='w-[40px]' src={imoji4} alt='loading...' />
                      ) : item.value === 4 ? (
                        <img className='w-[40px]' src={imoji5} alt='loading...' />
                      ) : (
                        <p className='text-sm text-gray-400 h-full inline-block align-bottom mt-2 ml-2'>
                          {NULL_PLACEHOLDER}
                        </p>
                      )}
                    </div>
                  </div>
                ) : item.key === FORM_FIELD_TYPE.SMILY_FACE_FIVE ? (
                  <div className='mt-5'>
                    <label className='block mb-2 text-sm font-medium text-gray-90'>
                      {item?.fieldName}
                    </label>
                    <div className='pl-2 bg-[#ECF0F3] rounded w-full h-[40px]'>
                      {item.value === 1 ? (
                        <img className='w-[40px]' src={imoji1} alt='loading...' />
                      ) : item.value === 2 ? (
                        <img className='w-[40px]' src={imoji2} alt='loading...' />
                      ) : item.value === 3 ? (
                        <img className='w-[40px]' src={imoji3} alt='loading...' />
                      ) : item.value === 4 ? (
                        <img className='w-[40px]' src={imoji4} alt='loading...' />
                      ) : item.value === 5 ? (
                        <img className='w-[40px]' src={imoji5} alt='loading...' />
                      ) : (
                        <p className='text-sm text-gray-400 h-full inline-block align-bottom mt-2 ml-2'>
                          {NULL_PLACEHOLDER}
                        </p>
                      )}
                    </div>
                  </div>
                ) : item.key === FORM_FIELD_TYPE.SUB_HEADER ? (
                  <p className='mt-5 text-base font-semibold'>{item.value}</p>
                ) : (
                  <div className='mt-5'>
                    <label className='block mb-2 text-sm font-medium text-gray-90'>
                      {item?.fieldName}
                    </label>
                    <div className='pl-2 bg-[#ECF0F3] rounded w-full'>
                      <input
                        type='text'
                        id='patientName'
                        placeholder={item?.value || NULL_PLACEHOLDER}
                        autoComplete='off'
                        className=' bg-transparent w-full h-[40px] ml-2 focus:outline-none rounded-md text-sm'
                        disabled
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
      </div>

      <div className='flex bg-white px-8 pb-8 justify-center md:justify-start'>
        <Button
          variant='contained'
          className='bg-skin-button-primary hover:bg-skin-button-primary focus:bg-skin-button-primary normal-case
          '
          onClick={() => {
            dispatch(
              setActiveTagAssignFeedBackForm({ active: true, feedbackId: editDataFeedbackOrg?.id })
            )
          }}
        >
          Tag & Assign Feedback
        </Button>
      </div>
      {activeFeedBackForm && <FeedbackFormModal />}
      <ReplyModal
        open={!!replyFeedbackId}
        handleClose={() => {
          // setReload((Math.random() + 1).toString(36).substring(7))
          setReplyFeedBackId(undefined)
        }}
        feedbackId={editDataFeedbackOrg?.id}
      />
      {/* Assign */}
      {activeTagAssignFeedBackForm && <TagAssignFeedbackFormModal />}
    </div>
  )
}

export default FeedbackDetailDynamic
