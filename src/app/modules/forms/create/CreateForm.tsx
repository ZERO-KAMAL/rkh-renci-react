import NAVIGATE_LINKS from 'app/constants/router-links'
import { CreateFeedBackFormSchema, formCreationStep } from 'app/http/feedback-form/feedBackForm.model'
import { setFeedBackFormCreationStateClear } from 'app/http/feedback-form/feedBackFormCreationSlice'
import { createFeedbackForm, setFormCreationData } from 'app/http/feedback-form/feedBackFormSlice'
import { useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import AssignLocation from './components/AssignLocation'
import AssignRecipients from './components/AssignRecipients'
import SuccessDialog from './components/SuccessDialog'
import FormBuilder from './components/form-builder/FormBuilder'
import PreviewForm from './preview/PreviewForm'

const CreateForm: React.FC = () => {
  const dispatch = useDispatch()
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
  const { formCreationData } = useAppSelector((state) => state.feedbackForm)

  const createFormHandler = () => {
    const validMainRecipients = mainRecipients?.filter((r) => r).map((a) => a?.id) || []
    const validCCRecipients = ccRecipients?.filter((r) => r).map((a) => a?.id) || []

    const data: CreateFeedBackFormSchema = {
      feedbackId: '',
      title: title,
      subtitle: subTitle,
      logo: logo,
      mainRecipient: validMainRecipients as Array<number>,
      ccRecipient: validCCRecipients as Array<number>,
      userId: currentUser?.userInfo?.id || null,
      kpi: true,
      kpiDay: 5,
      fields: fields,
    }

    if(location?.id !== null && location?.id !== 0) {
      data.locationId = location?.id
    }
    if(area?.id !== null && area?.id !== 0) {
      data.areaId = area?.id
    }
    if(department?.id !== null && department?.id !== 0) {
      data.departmentId = department?.id
    }

    dispatch(createFeedbackForm(data) as any)
  }

  useEffect(() => {
    dispatch(setFeedBackFormCreationStateClear())
  }, [])

  return (
    <div className='max-w-[1120px] w-full mx-auto'>
      {step === formCreationStep.ASSIGN_LOCATION && <AssignLocation />}
      {step === formCreationStep.ASSIGN_RECIPIENT && <AssignRecipients />}
      {step === formCreationStep.FORM_FIELD && (
        <FormBuilder createFormClicked={createFormHandler} />
      )}
      {step === formCreationStep.PREVIEW && <PreviewForm createFormClicked={createFormHandler} />}
      <SuccessDialog
        open={!!formCreationData}
        handleClose={() => dispatch(setFormCreationData(undefined))}
        okClicked={() => {
          dispatch(setFormCreationData(undefined))
          useHistory.replace(NAVIGATE_LINKS.FORMS.OVERVIEW)
          dispatch(setFeedBackFormCreationStateClear())
        }}
      />
    </div>
  )
}
export default CreateForm
