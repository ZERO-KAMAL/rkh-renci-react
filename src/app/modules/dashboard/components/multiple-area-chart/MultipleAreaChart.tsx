import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { borderBottom } from '@mui/system'
import { fetchAppConstant, fetchFeedbackType } from 'app/http/feedbacks/feedBackSlice'
import { useAppSelector } from 'app/redux/store'
import moment from 'moment'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Bar, BarChart, Brush, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

import FeedbackLabel from '../../../../components/FeedbackLabel'
import { MultipleAreaData } from '../../model/feedback.model'
import MonthYearPicker from './MonthYearPicker'

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

export const colors = [
  '#8950FC',
  // '#3699FF',
  '#F64E60',
  '#0BB783',
  '#FFA621',
]

interface Props {
  data: MultipleAreaData[]

  onDateChange: (month: string, year: number) => void
  onGenerateQuickReport: (e: any) => void
}

const getMaxValue = (data: any) => {
  let res = 0
  data.forEach((el: any) => {
    const obj = { ...el }
    delete obj.submittedDate
    delete obj.status
    const arr: any = Object.values(obj)
    const maxData = Math.max(...arr)
    res = maxData > res ? maxData : res
  })
  return res
}

const MultipleAreaChart: FC<Props> = (props: Props) => {
  const paperRef = useRef<any>(null)
  const size = useClientSize(paperRef)
  const dispatch = useDispatch()

  const handleXTickFormat = useCallback((t: string) => {
    const formattedDate = moment(t).format('D MMM')
    return formattedDate
  }, [])

  const onChange = useCallback(() => {}, [])

  const { feedbackTypeList } = useAppSelector((state) => state.feedback)

  const initFetch = useCallback(async () => {
    await dispatch(fetchFeedbackType() as any)
  }, [])

  useEffect(() => {
    initFetch()
  }, [])

  const [selected, setSelected] = useState<any>([
    'Appeals/MP letters',
    // 'Appreciations',
    'Complaints',
    'Compliments',
    'Suggestions',
  ])

  useEffect(() => {
    console.log('feedbackTypeList: ', feedbackTypeList)
  }, [feedbackTypeList])

  const changeHandler = (value: any) => {
    const newArr = [...selected]
    const index = newArr.indexOf(value)
    if (index === -1) {
      newArr.push(value)
    } else {
      newArr.splice(index, 1)
    }
    setSelected(newArr)
  }

  const maxData = getMaxValue(props.data)

  return (
    <Box sx={{ minHeight: '465px', width: '100%' }}>
      <Paper elevation={0} className='rounded-lg p-6 w-full h-full'>
        <Typography variant='h5' className='mb-5'>
          Monthly Status
        </Typography>
        <div className='flex w-full h-full max-md:flex-col max-md: gap-2'>
          <Box className='w-[70%] h-full max-md:w-full max-md:h-auto'>
            <div ref={paperRef} className='w-full'>
              <BarChart
                {...size}
                data={props.data}
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
                  axisLine={false}
                  tickLine={false}
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
                {feedbackTypeList?.map((item: any, index: number) => {
                  if (selected.includes(item.name)) {
                    return (
                      <Bar
                        type='monotone'
                        dataKey={item.name}
                        strokeWidth={0}
                        fill={colors[index]}
                        key={index}
                      />
                    )
                  } else return null
                })}
                <Brush
                  startIndex={props.data.length <= 5 ? 0 : props.data.length - 6}
                  endIndex={props.data.length - 1}
                  dataKey='submittedDate'
                />
              </BarChart>
            </div>
          </Box>
          <Box
            className='w-[30%] max-md:w-full'
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'relative' }} className='mb-5'>
              <MonthYearPicker onDateChange={props.onDateChange} />
            </Box>
            {feedbackTypeList && (
              <Box sx={{ backgroundColor: '#F3F6F9', width: '100%', padding: '15px' }}>
                {feedbackTypeList.map((item: any, index: number) => {
                  return (
                    <FeedbackLabel
                      key={index}
                      color={colors[index]}
                      label={item.name}
                      selected={selected.includes(item.name)}
                      onClick={() => changeHandler(item.name)}
                    />
                  )
                })}
              </Box>
            )}
            {/* <Button
              style={{ backgroundColor: '#2BA579' }}
              className='w-full mt-3'
              variant='contained'
              onClick={props.onGenerateQuickReport}
            >
              Generate Quick Report
            </Button> */}
          </Box>
        </div>
      </Paper>
    </Box>
  )
}

export default MultipleAreaChart
