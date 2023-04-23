import Loading from 'app/components/Loading'
import NAVIGATE_LINKS from 'app/constants/router-links'
import { formCreationStep } from 'app/http/feedback-form/feedBackForm.model'
import {
  setArea,
  setCCRecipient,
  setDepartment,
  setFeedBackFormCreationStateClear,
  setFields,
  setLocation,
  setLogo,
  setMainRecipient,
  setSubTitle,
  setTitle,
} from 'app/http/feedback-form/feedBackFormCreationSlice'
import {
  fetchfeedbackFormDetails,
  setFormUpdateData,
  updateFeedbackForm,
} from 'app/http/feedback-form/feedBackFormSlice'
import { useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import { FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

import AssignLocation from '../create/components/AssignLocation'
import AssignRecipients from '../create/components/AssignRecipients'
import SuccessDialog from '../create/components/SuccessDialog'
import FormBuilder from '../create/components/form-builder/FormBuilder'
import PreviewForm from '../create/preview/PreviewForm'
import { fetchAreaByLocationId } from 'app/http/areas/areaSlice'
import { fetchDepartmentByAreaId } from 'app/http/departments/departmentSlice'

const EditForm: FC = () => {
  const params = useParams()
  const { formId } = params

  const dispatch = useDispatch()
  const { feedBackFormDetails, loadingFeedbackFormDetails, formUpdateData } = useAppSelector(
    (state) => state.feedbackForm
  )
  const {
    step,
    location,
    area,
    department,
    mainRecipients,
    ccRecipients,
    title,
    subTitle,
    logo,
    fields,
  } = useAppSelector((state) => state.feedbackFormCreation)
  const { currentUser } = useAppSelector((state) => state.user)

  useEffect(() => {
    dispatch(setFeedBackFormCreationStateClear())
    if (formId) {
      dispatch(fetchfeedbackFormDetails(Number(formId)) as any)
    }
  }, [])

  // console.log(feedBackFormDetails)

  useEffect(() => {
    if (feedBackFormDetails) {
      dispatch(
        setLocation({
          id: feedBackFormDetails?.location?.id || 0,
          name: feedBackFormDetails?.location?.name || 'All Selected',
        })
      )
      dispatch(
        setArea({
          id: feedBackFormDetails?.area?.id,
          name: feedBackFormDetails?.area?.name
        })
      )
      dispatch(
        setDepartment({
          id: feedBackFormDetails?.department?.id,
          name: feedBackFormDetails?.department?.name,
        })
      )
      dispatch(setMainRecipient(feedBackFormDetails?.mainRecipients))
      dispatch(setCCRecipient(feedBackFormDetails?.ccRecipients))
      dispatch(setFields(feedBackFormDetails?.fields))
      dispatch(setTitle(feedBackFormDetails?.title))
      dispatch(setSubTitle(feedBackFormDetails?.subtitle))
      dispatch(setLogo(feedBackFormDetails?.logo))

      if(feedBackFormDetails?.location?.id)
        dispatch(fetchAreaByLocationId(feedBackFormDetails?.location?.id) as any)
      const locId = feedBackFormDetails?.location?.id
      const areaId = feedBackFormDetails?.area?.id
      if(locId && areaId)
        dispatch(fetchDepartmentByAreaId({locId , areaId}) as any)
    }
  }, [feedBackFormDetails])

  const editFormHandler = () => {
    const validMainRecipients = mainRecipients?.filter((r) => r).map((a) => a?.id) || []
    const validCCRecipients = ccRecipients?.filter((r) => r).map((a) => a?.id) || []

    const data = {
      feedbackId: '',
      title: title,
      subtitle: subTitle,
      logo: logo,
      mainRecipient: validMainRecipients as Array<number>,
      ccRecipient: validCCRecipients as Array<number>,
      locationId: location?.id || null,
      areaId: area?.id || null,
      userId: currentUser?.userInfo?.id || null,
      kpi: true,
      kpiDay: 5,
      departmentId: department?.id || null,
      fields: fields,
    }
    dispatch(updateFeedbackForm({ id: formId, body: data }) as any)
  }

  return (
    <div className='max-w-[1120px] w-full mx-auto relative'>
      {loadingFeedbackFormDetails && <Loading />}
      {!loadingFeedbackFormDetails && feedBackFormDetails && (
        <>
          {step === formCreationStep.ASSIGN_LOCATION && <AssignLocation />}
          {step === formCreationStep.ASSIGN_RECIPIENT && <AssignRecipients />}
          {step === formCreationStep.FORM_FIELD && (
            <FormBuilder createFormClicked={editFormHandler} formId={Number(formId)} />
          )}
          {step === formCreationStep.PREVIEW && (
            <PreviewForm createFormClicked={editFormHandler} formId={Number(formId)} />
          )}
          <SuccessDialog
            open={!!formUpdateData}
            handleClose={() => dispatch(setFormUpdateData(undefined))}
            okClicked={() => {
              dispatch(setFormUpdateData(undefined))
              useHistory.replace(NAVIGATE_LINKS.FORMS.OVERVIEW)
              dispatch(setFeedBackFormCreationStateClear())
            }}
            update
          />
        </>
      )}
    </div>
  )
}
export default EditForm
