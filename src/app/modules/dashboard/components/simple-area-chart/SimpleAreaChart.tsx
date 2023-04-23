import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useClientSize } from 'app/helpers/CommonFunction'
import { Feedback } from 'app/http/dashboard/dashboard.model'
import moment from 'moment'
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaArrowDown, FaArrowUp, FaArrowsAltH } from 'react-icons/fa'
import { Tooltip, Bar, BarChart, XAxis, YAxis } from 'recharts'

type Data = {
  count: number
  previousCount: number
  data: Feedback[]
}

interface Props {
  label: string
  colors: [
    string, // chart background color
    string, // chart stroke color
    string // arrow color
  ]
  data: Data
}

const getMaxValue = (data: any) => {
  let res = 0
  data.forEach((el: any) => {
    const obj = {...el}
    delete obj.submittedDate
    delete obj.status
    const arr: any = Object.values(obj);
    const maxData = Math.max(...arr);
    res = maxData > res ? maxData : res
  });
  return res
}

const SimpleAreaChart: FC<Props> = ({ label, colors, data }) => {
  const paperRef = useRef<any>(null)
  const size = useClientSize(paperRef, 270)
  const [count, setCount] = useState(0)

  const handleXTickFormat = useCallback((t: string) => {
    const formattedDate = moment(t).format('D')
    return formattedDate
  }, [])

  const ArrowIndicator = useMemo(() => {
    if (data.count - data.previousCount > 0) {
      setCount(data.count)
      return <FaArrowUp color={colors[2]} />
    }
    if (data.count - data.previousCount < 0) {
      setCount(data.count)
      return <FaArrowDown color={colors[2]} />
    }
    setCount(data.count)
    return <FaArrowsAltH color={colors[2]} />
  }, [data])

  const withSubmittedDate = useMemo(() => {
    const dataPoint = data.data.map((feedback) => ({
      count: feedback.count,
      status: feedback.status,
      submittedDate: moment(feedback.submitDateTime).format('D'),
    }))
    return dataPoint
  }, [data])

  const maxData = getMaxValue(data?.data)

  return (
    <Paper elevation={0} ref={paperRef} className='rounded-lg relative pt-12'>
      <BarChart
        {...size}
        data={withSubmittedDate}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis
          dataKey='submittedDate'
          // tickFormatter={handleXTickFormat}
          fontSize={12}
          axisLine={false}
          tickLine={false}
        />
        <YAxis type='number' domain={[0, maxData > 4 ? maxData : 4]} tickCount={5} axisLine={false} tickLine={false} />
        <Tooltip label="count" />
        <Bar type='monotone' dataKey='count' stroke={colors[1]} strokeWidth={0} fill={colors[0]} />
      </BarChart>
      <div className='flex justify-center pb-4 font-semibold text-sm'>
        {moment(data.data[0]?.submitDateTime).format('MMMM')}
      </div>
      <div className='absolute top-5 right-10'>
        <div className='flex justify-end items-center'>
          <Typography sx={{ fontSize: '17px', color: '#B5B5C3', marginRight: '10px' }}>{label}</Typography>
          <div className='flex items-center'>
            {ArrowIndicator}
            <Typography sx={{ fontSize: 24, fontWeight: 'bold', marginLeft: '10px' }}>
              {count}
            </Typography>
          </div>
        </div>
      </div>
    </Paper>
  )
}

export default SimpleAreaChart
