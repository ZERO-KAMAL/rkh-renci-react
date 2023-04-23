import { Box } from '@mui/material'
import { ReportTypesColor } from 'app/constants/report'
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
  selectedTypes: Array<string>
}

const getMaxValue = (data: any) => {
  let res = 0
  data.forEach((el: any) => {
    const obj = {...el}
    delete obj.submittedDate
    delete obj.exceededTAT
    delete obj.withinTAT
    const arr: any = Object.values(obj);
    const maxData = Math.max(...arr);
    res = maxData > res ? maxData : res
  });
  return res
}

const OverviewChart: FC<Props> = ({data, selectedTypes}) => {
  const paperRef = useRef<any>(null)
  const size = useClientSize(paperRef)
  
  const handleXTickFormat = useCallback((t: string) => {
    const formattedDate = `TAT ${t}`
    return formattedDate
  }, [])

  const onChange = useCallback(() => {}, [])
  
  const maxData = getMaxValue(data)
  console.log(data)

  return (
    <Box className='w-full h-full max-md:w-full max-md:h-auto'>
      <div ref={paperRef} className='w-full relative'>
        <p className='absolute left-0 bottom-20 text-[red] text-sm'>Over TAT</p>
        <p className='absolute left-0 bottom-12 text-[green] text-sm'>Within TAT</p>
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
            dataKey='submittedDate'
            // tickFormatter={handleXTickFormat}
            fontSize={12}
            xAxisId="0"
            axisLine={false}
            tickLine={false}
          />
          <XAxis
            dataKey='exceededTAT'
            // label={{ value: 'Exceeded TAT', position: 'insideBottomLeft', offset: 0 }}
            padding={{ left: 5 }}
            // tickFormatter={handleXTickFormat}
            xAxisId="1"
            fontSize={12}
            axisLine={false}
            tickLine={false}
            stroke="red"
          />
          <XAxis
            dataKey='withinTAT'
            padding={{ left: 5 }}
            xAxisId="2"
            fontSize={12}
            axisLine={false}
            tickLine={false}
            stroke="green"
          />
          <YAxis
            type='number'
            tickCount={5}
            domain={[0, maxData < 4 ? 4 : maxData]}
            axisLine={false}
            // hide
            tickLine={false}
          />
          <Tooltip />
          {(selectedTypes.includes('Appeals/MP letters')|| selectedTypes.length === 0) && <Bar type='monotone' dataKey='Appeals/MP letters' strokeWidth={0} fill={ReportTypesColor['Appeals/MP letters']} />}
          {(selectedTypes.includes('Appreciations')|| selectedTypes.length === 0) && <Bar type='monotone' dataKey='Appreciations' strokeWidth={0} fill={ReportTypesColor['Appreciations']} />}
          {(selectedTypes.includes('Complaints')|| selectedTypes.length === 0) && <Bar type='monotone' dataKey='Complaints' strokeWidth={0} fill={ReportTypesColor['Complaints']} />}
          {(selectedTypes.includes('Compliments')|| selectedTypes.length === 0) && <Bar type='monotone' dataKey='Compliments' strokeWidth={0} fill={ReportTypesColor['Compliments']} />}
          {(selectedTypes.includes('Suggestions')|| selectedTypes.length === 0) && <Bar type='monotone' dataKey='Suggestions' strokeWidth={0} fill={ReportTypesColor['Suggestions']} />}
          {/* <Bar type='monotone' dataKey='exceededTAT' strokeWidth={0} fill={"gray"} /> */}
          <Brush/>
        </BarChart>
      </div>
    </Box>
  )
}

export default OverviewChart
