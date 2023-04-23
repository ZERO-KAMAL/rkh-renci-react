import DepartmentService from 'app/http/departments/departmentService'
import { defParamsDep, fetchDepartments, setEditData } from 'app/http/departments/departmentSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useFormik } from 'formik'
import { useState } from 'react'
import { toast } from 'react-toastify'

import EditDeptModal from '../components/EditDeptModal'
import { DeptForm, deptInitialValues, deptSchema } from '../model/deptFormik.model'

const WithEditDeptModal = () => {
  const dispatch = useAppDispatch()
  const { editData, limit, page, order, text } = useAppSelector((state) => state.department)

  const [editDataValues] = useState<DeptForm>({
    id: editData?.id,
    name: editData?.name,
  })

  const onClose = () => {
    dispatch(setEditData(undefined))
  }

  const formik = useFormik({
    initialValues: editDataValues || deptInitialValues,
    enableReinitialize: true,
    validationSchema: deptSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await DepartmentService.updateDepartment(values.id!, {
          name: values.name!,
        })
        setSubmitting(false)
        dispatch(setEditData(undefined))
        toast.success('Success')
        await dispatch(fetchDepartments({ page, limit, areaId: '', locationId: '', text, order }))
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
        dispatch(setEditData(undefined))
      }
    },
  })
  return <EditDeptModal onClose={onClose} modalTitle={'Edit Department'} formik={formik} />
}

export default WithEditDeptModal
