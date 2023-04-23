import { Department } from 'app/http/departments/department.model'
import { FeedbackTypes } from 'app/http/feedback-types/feedbacktypes.model'
import * as Yup from 'yup'

export type CategoriesForm = {
  category: string
}

export const categoryInitialValues: CategoriesForm = {
  category: '',
}

export const categorySchema = Yup.object().shape({
  category: Yup.string()
    .min(1, 'Minimum  symbol')
    .max(50, 'Maximum 50 symbols')
    .required('Category is required'),
})
