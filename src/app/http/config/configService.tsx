import useLocalStorage from 'app/helpers/hooks/useLocalStorage'
import http from 'app/helpers/http-common'
import axios from 'axios'

import { Config } from './config.model'

const createConfig = (body: Config) => {
  const data = { url: `configs`, body: body }
  return http.POST(data)
}

const getConfig = () => {
  const data = { url: `configs` }
  return http.GET(data)
}

const downloadFromUrl = (url: string) => {
  return axios.get<any>(`${url}`, { responseType: 'blob' })
}

const ConfigService = {
  createConfig,
  getConfig,
  downloadFromUrl,
}

export default ConfigService
