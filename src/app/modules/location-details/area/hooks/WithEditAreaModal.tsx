import AreaService from 'app/http/areas/areaService'
import { fetchAreas, setEditData } from 'app/http/areas/areaSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import { useFormik } from 'formik'
import { useState } from 'react'
import { toast } from 'react-toastify'

import EditAreaModal from '../components/EditAreaModal'
import { AreaForm, areaInitialValues, areaSchema } from '../model/areaFormik.model'

const WithEditAreaModal = () => {
  const dispatch = useAppDispatch()
  const { editData, page, limit, locationId, text, order } = useAppSelector((state) => state.area)

  const [editDataValues] = useState<AreaForm>({
    id: editData?.id,
    name: editData?.name,
  })

  const onClose = () => {
    dispatch(setEditData(undefined))
  }

  const formik = useFormik({
    initialValues: editDataValues || areaInitialValues,
    enableReinitialize: true,
    validationSchema: areaSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false)
      dispatch(setEditData(undefined))

      try {
        await AreaService.updateArea(values.id!, {
          name: values.name!,
        })
        setSubmitting(false)
        dispatch(setEditData(undefined))
        toast.success('Success')
        await dispatch(fetchAreas({ page, limit, locationId, text, order }))
      } catch (err: any) {
        toast.error(`Error ${err?.status}! ${err?.data?.message}`)
        setSubmitting(false)
        dispatch(setEditData(undefined))
      }
    },
  })
  return <EditAreaModal onClose={onClose} modalTitle={'Edit Area'} formik={formik} />
}

export default WithEditAreaModal
