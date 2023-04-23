import { Box } from "@mui/material"
import Loading from "app/components/Loading"
import { fetchStorageData } from "app/http/storage/storageSlice"
import { useAppDispatch, useAppSelector } from "app/redux/store"
import { useEffect, useState } from "react"
import DataUsageChart from "./overview/DataUsageChart"


const ReportDataUsage = () => {
  const { data: storageData, loading } = useAppSelector((state) => state.storage)
  const dispatch = useAppDispatch()
  const [storageChartData, setStorageChartData] = useState([])

  useEffect(()=> {
    if(storageData?.table) {
      const areaChartDataArr: any = []
      let dataSize: any = 0
      storageData?.table?.forEach((api: any) => {
        const areaChartData: any = {
          ...api,
          table: api.table.charAt(0).toUpperCase() + api.table.slice(1),
          size: Number((api.size/(1000000))).toFixed(2)
        }
        dataSize = Number(dataSize) + Number((api.size/(1000000)))
        areaChartDataArr.push(areaChartData)
      })
      areaChartDataArr.push({table: "Logs", size: (Number(storageData?.total[0]?.total.substring(0 , storageData?.total[0]?.total.length - 2)) - Number(dataSize)).toFixed(2)})
      setStorageChartData(areaChartDataArr)
    }
  }, [storageData])

  useEffect(()=> {
    dispatch(fetchStorageData())
  }, [])

  // console.log(storageChartData)

  return (
    <Box className='max-w-[1120px] w-full mx-auto pt-10'>
      {
          loading &&
          <Box className="w-full p-10 ">
            <Loading />
          </Box>
        }
        {
          !loading && storageChartData &&
          <Box className='flex justify-center md:justify-between items-center bg-white px-6 py-8 rounded-xl flex-wrap mt-5'>
            <Box className="w-full">
              <p className="font-semibold text-md">Data Usage</p>
            </Box>
            <Box className="flex items-center justify-center w-full my-5">
              <p><span className="font-semibold">Total Size:</span> {storageData?.total[0]?.total}</p>
            </Box>
            <DataUsageChart data={storageChartData} />
          </Box>
        }
    </Box>
  )
}

export default ReportDataUsage