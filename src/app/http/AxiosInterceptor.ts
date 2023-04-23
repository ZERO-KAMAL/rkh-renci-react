import Auth from 'app/constants/auth'
import NAVIGATE_LINKS from 'app/constants/router-links'
import useLocalStorage from 'app/helpers/hooks/useLocalStorage'
import { useHistory } from 'app/routing/AppRoutes'
import { AxiosRequestConfig, AxiosStatic } from 'axios'
import { toast } from 'react-toastify'

// Axios Global Request Interceptor
const jwt = (axios: AxiosStatic) => {
  axios.defaults.headers.post['Content-Type'] = 'application/json'

  // Inject Token before request is sent
  axios.interceptors.request.use(
    (config: AxiosRequestConfig<any>) => {
      if (config.headers == undefined) {
        return config
      }

      // Inject token for our own API only
      const isApiUrl = config.url?.startsWith(import.meta.env.VITE_APP_API_URL)
      const token = useLocalStorage.getUser()?.token
      if (isApiUrl && token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      // config.headers['Access-Control-Allow-Headers'] = 'Content-Disposition'
      // config.headers["Access-Control-Allow-Origin"] =  "*";
      // config.headers["Access-Control-Allow-Credentials"] =  "true";
      // config.headers["Access-Control-Allow-Methods"] =  "GET,HEAD,OPTIONS,POST,PUT";
      // config.headers["Access-Control-Allow-Headers"] =  "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers";

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}

// Ensure only called at most once every 5sec, in case multiple request all attempt to navigate
let hasNavigate = false 
const navigateTimeout = () => {
  hasNavigate = true
  setTimeout(() => hasNavigate = false, 5000);
}

// Axios Global Response Interceptor
const unauthorized = (axios: AxiosStatic) => {
  axios.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error

      if (error.status === 401 && !hasNavigate) {
        // Monkey patch so it does not keep toasting
        toast.error(Auth.SESSION_TIMEOUT_MSG, { toastId: 3 })
        useHistory.replace(NAVIGATE_LINKS.AUTH.LOGOUT)
        navigateTimeout()
      }
      if (error.status === 403 && !hasNavigate) {
        useHistory.replace(NAVIGATE_LINKS.ERRORS.ERROR403)
        hasNavigate = true
        navigateTimeout()
      }
      if (error.status === 404 && !hasNavigate) {
        useHistory.replace(NAVIGATE_LINKS.ERRORS.ERROR404)
        hasNavigate = true
        navigateTimeout()
      }
      if (error.status > 500 && !hasNavigate) {
        useHistory.replace(NAVIGATE_LINKS.ERRORS.ERROR500)
        hasNavigate = true
        navigateTimeout()
      }
      return Promise.reject(error)
    }
  )
}

const AxiosInterceptor = {
  jwt,
  unauthorized,
}

export default AxiosInterceptor
