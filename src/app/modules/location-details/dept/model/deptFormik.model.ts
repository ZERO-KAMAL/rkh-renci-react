import { Department } from 'app/http/departments/department.model'
import * as Yup from 'yup'

export type DeptForm = Partial<Department>

export const deptInitialValues: DeptForm = {
  name: '',
}

export const deptSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Minimum  symbol')
    .max(50, 'Maximum 50 symbols')
    .required('Department is required'),
})
