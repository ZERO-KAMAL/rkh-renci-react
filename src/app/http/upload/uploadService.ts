import http from 'app/helpers/http-common'
import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_API_URL

const upload = (body: File) => {
  return axios.post<any>(`${API_URL}/upload`, body)
}

const UploadService = {
  upload
}
export default UploadService
