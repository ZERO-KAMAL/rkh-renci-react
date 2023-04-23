import LocationService from 'app/http/locations/locationService'
import { fetchLocations } from 'app/http/locations/locationSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useFormik } from 'formik'
import { toast } from 'react-toastify'

import AddLocation from '../components/AddLocation'
import { locationInitialValues, locationSchema } from '../model/locationFormik.model'

const WithAddLocation = () => {
  const dispatch = useAppDispatch()
  const { limit, page, order, locationId, text } = useAppSelector((state) => state.location)
  const formik = useFormik({
    initialValues: locationInitialValues,
    enableReinitialize: true,
    validationSchema: locationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await LocationService.createLocation(values)
        setSubmitting(false)
        toast.success('Success')
        await dispatch(fetchLocations({ page, limit, locationId, text, order }))
        resetForm()
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
      }
    },
  })
  return <AddLocation formik={formik} />
}

export default WithAddLocation
