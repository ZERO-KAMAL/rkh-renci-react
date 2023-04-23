import { Location } from 'app/http/locations/location.model'
import * as Yup from 'yup'

export type LocationForm = Partial<Location>

export const locationInitialValues: LocationForm = {
  name: '',
  address: '',
}

export const locationSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Minimum  symbol')
    .max(50, 'Maximum 50 symbols')
    .required('Location is required'),
  address: Yup.string()
    .min(1, 'Minimum 1 symbol')
    .max(50, 'Maximum 50 symbols')
    // .required('Address is required'),
})
