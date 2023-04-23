import LocationService from 'app/http/locations/locationService'
import { fetchLocations, setEditData } from 'app/http/locations/locationSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useFormik } from 'formik'
import { useState } from 'react'
import { toast } from 'react-toastify'

import EditLocationModal from '../components/EditLocationModal'
import { LocationForm, locationInitialValues, locationSchema } from '../model/locationFormik.model'

const WithEditLocationModal = () => {
  const dispatch = useAppDispatch()
  const { editData, limit, page, order, locationId, text } = useAppSelector((state) => state.location)
  const [editDataValues] = useState<LocationForm>({
    id: editData?.id,
    name: editData?.name,
    address: editData?.address,
  })

  const onClose = () => {
    dispatch(setEditData(undefined))
  }

  const formik = useFormik({
    initialValues: editDataValues || locationInitialValues,
    enableReinitialize: true,
    validationSchema: locationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await LocationService.updateLocation(values.id!, values)
        setSubmitting(false)
        dispatch(setEditData(undefined))
        toast.success('Success')
        await dispatch(fetchLocations({ page, limit, locationId, text, order }))
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
        dispatch(setEditData(undefined))
      }
    },
  })
  return <EditLocationModal onClose={onClose} modalTitle={'Edit Location'} formik={formik} />
}

export default WithEditLocationModal
