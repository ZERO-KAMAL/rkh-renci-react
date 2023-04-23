import FeedbackTypeService from 'app/http/feedback-types/feedbacktypes.service'
import {
  defParamsFb,
  fetchFeedbackTypes,
  setEditData,
} from 'app/http/feedback-types/feedbacktypesSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useFormik } from 'formik'
import { useState } from 'react'
import { toast } from 'react-toastify'

import EditCategoryModal from '../components/EditCategoryModal'
import {
  CategoriesForm,
  categoryInitialValues,
  categorySchema,
} from '../model/categoriesFormik.model'

const WithEditCategoryModal = () => {
  const dispatch = useAppDispatch()
  const { dataTable, tabIndex, editData } = useAppSelector((state) => state.feedbackTypes)
  const [editDataValues] = useState<CategoriesForm>({
    category: editData?.editSubCategory || '',
  })

  const onClose = () => {
    dispatch(setEditData(undefined))
  }

  const formik = useFormik({
    initialValues: editDataValues || categoryInitialValues,
    enableReinitialize: true,
    validationSchema: categorySchema,
    onSubmit: async (values, { setSubmitting }) => {
      if (!dataTable.rows.length || !editData?.editSubCategory) {
        console.log('Error, unable to edit')
        return
      }
      const selectedTab = JSON.parse(JSON.stringify(dataTable.rows[tabIndex]))

      if (!selectedTab.subCategories) {
        console.log('Error, unable to edit')
        return
      }

      // console.log('handle submit: ', values, editData)
      // console.log('selected tab: ', selectedTab)

      if (selectedTab.subCategories.includes(values.category)) {
        toast.error(`Category already exist`)
      }

      const index = selectedTab.subCategories.indexOf(editData.editSubCategory)
      // console.log('index: ', index)

      selectedTab.subCategories.splice(index, 1, values.category)

      console.log('edited data: ', selectedTab)
      try {
        await FeedbackTypeService.updateFeedbackType(selectedTab)
        setSubmitting(false)
        dispatch(setEditData(undefined))
        toast.success('Success')
        await dispatch(fetchFeedbackTypes({ ...defParamsFb, setLoading: false }))
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
      }
    },
  })
  return <EditCategoryModal onClose={onClose} modalTitle={'Edit Category'} formik={formik} />
}

export default WithEditCategoryModal
