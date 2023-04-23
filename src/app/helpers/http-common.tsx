import Auth from 'app/constants/auth'
import NAVIGATE_LINKS from 'app/constants/router-links'
import useLocalStorage from 'app/helpers/hooks/useLocalStorage'
import { useHistory } from 'app/routing/AppRoutes'
import axios, { AxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_APP_API_URL

axios.interceptors.request.use((config) => {
  // console.log("request config =================> response: ", config);
  return config
})

function FETCH({
  onSuccess = () => {},
  onError = () => {},
  url = '',
  method = undefined,
  body = {},
  params = {},
  headers = {},
  signal = undefined,
  timeout = 10 * 3600,
  showLoading = false,
  hideLoading = false,
  showError = false,
}) {
  const config: AxiosRequestConfig = {
    method,
    baseURL: API_URL,
    url,
    data: body,
    timeout,
    headers,
    params: {
      ...params,
    },
    signal: signal,
  }
  const token = useLocalStorage.getUser()?.token

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: '*/*',
    Authorization: 'Bearer ' + token,
  }
  if (headers) {
    config.headers = { ...defaultHeaders, ...headers }
  } else {
    config.headers = defaultHeaders
  }
  // console.log(`config => ${JSON.stringify(config)}`)
  return axios(config)
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      // console.log('Axios Error =>' + error)
      return Promise.reject(error)
    })
}

axios.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    const { response } = error

    return Promise.reject(response)
  }
)

const GET = (data: any) => {
  data.method = 'get'
  return FETCH(data)
}
const POST = (data: any) => {
  data.method = 'post'
  return FETCH(data)
}
const PUT = (data: any) => {
  data.method = 'put'
  return FETCH(data)
}
const DELETE = (data: any) => {
  data.method = 'delete'
  return FETCH(data)
}

const http = {
  GET,
  POST,
  PUT,
  DELETE,
}

export default http
