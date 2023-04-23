import { FeedbackTypes } from 'app/http/feedback-types/feedbacktypes.model'
import FeedbackTypeService from 'app/http/feedback-types/feedbacktypes.service'
import { defParamsFb, fetchFeedbackTypes } from 'app/http/feedback-types/feedbacktypesSlice'
import { useAppDispatch } from 'app/redux/store'
import { useFormik } from 'formik'
import { FC } from 'react'
import { toast } from 'react-toastify'

import AddCategory from '../components/AddCategory'
import { categoryInitialValues, categorySchema } from '../model/categoriesFormik.model'

interface Props {
  data: FeedbackTypes
}

const WithAddCategory: FC<Props> = (props: Props) => {
  const dispatch = useAppDispatch()
  const formik = useFormik({
    initialValues: categoryInitialValues,
    enableReinitialize: true,
    validationSchema: categorySchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // console.log('handle submit: ', values, props.data)
      if (props?.data?.subCategories?.includes(values.category)) {
        toast.error(`Category already exist`)
        return
      }

      try {
        await FeedbackTypeService.updateFeedbackType({
          ...props.data,
          subCategories: [...(props.data.subCategories || []), values.category],
        })
        setSubmitting(false)
        toast.success('Success')
        await dispatch(fetchFeedbackTypes({ ...defParamsFb, setLoading: false }))
        resetForm()
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
      }
    },
  })
  return <AddCategory formik={formik} />
}

export default WithAddCategory
