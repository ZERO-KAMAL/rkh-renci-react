import { Box } from '@mui/material'
import { ReportTypes, ReportTypesColor } from 'app/constants/report'
import moment from 'moment'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Bar, BarChart, Brush, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

export const useClientSize = (ref: any) => {
  const [size, setSize] = useState({ width: ref.current?.clientWidth, height: 400 })
  const getClientSize = useCallback(() => {
    setSize({
      width: ref.current?.clientWidth,
      height: 400,
    })
  }, [ref])
  useEffect(() => {
    window.addEventListener('resize', getClientSize)
    getClientSize()
    return () => {
      window.removeEventListener('resize', getClientSize)
    }
  }, [getClientSize])
  return size
}

interface Props {
  data: any
}

const getMaxValue = (data: any) => {
  let res = 0
  data.forEach((el: any) => {
    res = Number(el.size) > res ? Number(el.size) : res
  })
  return Math.ceil(res)
}

const DataUsageChart: FC<Props> = ({ data }) => {
  const paperRef = useRef<any>(null)
  const size = useClientSize(paperRef)

  const handleXTickFormat = useCallback((t: string) => {
    const formattedDate = moment(t).format('D MMM')
    return formattedDate
  }, [])
  const handleTooltipFormat = useCallback((t: string) => {
    const res = t + ' MB'
    return res
  }, [])

  const onChange = useCallback(() => {}, [])

  const maxData = getMaxValue(data)

  return (
    <Box className='w-full h-full max-md:w-full max-md:h-auto'>
      <div ref={paperRef} className='w-full'>
        <BarChart
          {...size}
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis
            dataKey='table'
            // tickFormatter={handleXTickFormat}
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type='number'
            tickCount={6}
            domain={[0, maxData]}
            axisLine={false}
            // hide
            tickLine={false}
          />
          <Tooltip formatter={handleTooltipFormat} />
          {<Bar type='monotone' dataKey='size' strokeWidth={0} fill={'#FFA621'} />}
          {/* <Brush startIndex={data.length <= 5 ? 0 : data.length - 6} endIndex={data.length - 1} dataKey="submittedDate" /> */}
        </BarChart>
      </div>
    </Box>
  )
}

export default DataUsageChart
