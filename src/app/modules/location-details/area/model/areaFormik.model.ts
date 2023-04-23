import { Area } from 'app/http/areas/area.model'
import * as Yup from 'yup'

export type AreaForm = Partial<Area>

export const areaInitialValues: AreaForm = {
  name: '',
}

export const areaSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Minimum  symbol')
    .max(50, 'Maximum 50 symbols')
    .required('Area is required'),
})
