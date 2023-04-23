import AreaService from 'app/http/areas/areaService'
import { defParams, fetchAreas } from 'app/http/areas/areaSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'

import AddArea from '../components/AddArea'
import { areaInitialValues, areaSchema } from '../model/areaFormik.model'

const WithAddLocation = () => {
  const dispatch = useAppDispatch()
  const { page, limit, locationId, text, order } = useAppSelector((state) => state.area)
  const formik = useFormik({
    initialValues: areaInitialValues,
    enableReinitialize: true,
    validationSchema: areaSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await AreaService.createArea({
          name: values.name!,
        })
        setSubmitting(false)
        toast.success('Success')
        await dispatch(fetchAreas({ page, limit, locationId, text, order }))
        resetForm()
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
      }
    },
  })
  return <AddArea formik={formik} />
}

export default WithAddLocation
