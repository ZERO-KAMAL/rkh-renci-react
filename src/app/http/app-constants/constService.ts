import axios from 'axios'
import { useQuery } from 'react-query'

import { ConstantsRes } from './const.model'

const API_URL = import.meta.env.VITE_APP_API_URL
const APP_CONSTANTS_URL = `${API_URL}/appConstants`

const getConstants = () => {
  return axios.get<ConstantsRes>(APP_CONSTANTS_URL)
}

const constantsQuery = (
  dependencies?: any,
  onSuccess?: (res: any) => void,
  onError?: (err: any) => void
) => {
  return useQuery(['app-constants', dependencies], getConstants, {
    onSuccess,
    onError,
    retry: false,
    enabled: false,
  })
}

const ConstService = {
  constantsQuery,
  getConstants,
}

export default ConstService
