import 'app/assets/scss/style.scss'
import AxiosInterceptor from 'app/http/AxiosInterceptor'
import MasterTheme from 'app/layout/MasterTheme'
import AppInit from 'app/modules/app-init/AppInit'
import { store } from 'app/redux/store'
import { AppRoutes } from 'app/routing/AppRoutes'
import axios from 'axios'
import axiosRetry from 'axios-retry'
import React from 'react'
import 'react-date-range/dist/styles.css'
// main style file
import 'react-date-range/dist/theme/default.css'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// theme css file
const showDebugger = false
const queryClient = new QueryClient()

AxiosInterceptor.jwt(axios)
AxiosInterceptor.unauthorized(axios)

// Axios global retry
axiosRetry(axios, {
  retries: 3,
  retryCondition: (error: any) => {
    console.log('error: ', error)
    return error.status === 429
  },
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`)
    return retryCount * 500 // time interval between retries
  },
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MasterTheme>
          <AppInit>
            <ToastContainer />
            <AppRoutes />
          </AppInit>
        </MasterTheme>
        {showDebugger && <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />}
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
)
