import DepartmentService from 'app/http/departments/departmentService'
import { fetchDepartments } from 'app/http/departments/departmentSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'

import AddDepartment from '../components/AddDepartment'
import { deptInitialValues, deptSchema } from '../model/deptFormik.model'

const WithAddDepartment = () => {
  const dispatch = useAppDispatch()
  const { limit, page, order, text } = useAppSelector((state) => state.department)
  const formik = useFormik({
    initialValues: deptInitialValues,
    enableReinitialize: true,
    validationSchema: deptSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await DepartmentService.createDepartment({
          name: values.name!,
        })
        setSubmitting(false)
        toast.success('Success')
        await dispatch(fetchDepartments({ page, limit, areaId: '', locationId: '', text, order }))
        resetForm()
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
      }
    },
  })
  return <AddDepartment formik={formik} />
}

export default WithAddDepartment
