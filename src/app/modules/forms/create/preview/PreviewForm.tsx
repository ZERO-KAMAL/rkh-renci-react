import LoadingButton from '@mui/lab/LoadingButton'
import { Button } from '@mui/material'
import BackIconButton from 'app/components/button/BackIconButton'
import { prevStep } from 'app/http/feedback-form/feedBackFormCreationSlice'
import { useAppSelector } from 'app/redux/store'
import { FC } from 'react'
import { useDispatch } from 'react-redux'

import FormGenerator from './FormGenerator'

interface Props {
  createFormClicked: () => void
  formId?: number
}
const PreviewForm: FC<Props> = ({ createFormClicked, formId }) => {
  const dispatch = useDispatch()

  const { fields, logo, title, subTitle } = useAppSelector((state) => state.feedbackFormCreation)
  const { loadingFormCreation, loadingFormUpdate } = useAppSelector((state) => state.feedbackForm)

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <BackIconButton
          onClick={() => dispatch(prevStep())}
          iconSize={'22px'}
          iconColor={'#1BC5BD'}
          textSize={'20px'}
        />
        <LoadingButton
          variant='contained'
          className='bg-skin-navbar hover:bg-skin-navbar focus:bg-skin-navbar normal-case'
          onClick={createFormClicked}
          loading={formId ? loadingFormUpdate : loadingFormCreation}
          loadingPosition='center'
        >
          {formId ? 'Update Form' : 'Create Form'}
        </LoadingButton>
      </div>
      <FormGenerator logo={logo} title={title} subTitle={subTitle} data={fields} />
    </div>
  )
}

export default PreviewForm
