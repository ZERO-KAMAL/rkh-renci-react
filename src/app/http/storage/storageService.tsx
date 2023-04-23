import http from 'app/helpers/http-common'

const getStorageData = () => {
  const data = { url: `feedbackReports/dataStorage` }
  return http.GET(data)
}

const StorageService = {
  getStorageData
}
export default StorageService
