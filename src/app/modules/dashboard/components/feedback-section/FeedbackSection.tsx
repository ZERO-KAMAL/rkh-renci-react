import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import FeedbackLabelWithPercent from 'app/modules/dashboard/components/feedback-section/FeedbackLabelWithPercent'
import moment from 'moment'
import { FC, memo, useEffect, useState } from 'react'

import DashboardConst from '../../constants/dashboard.const'
import { FeedbackModel } from '../../model/feedback.model'
import SimplePieChart from './SimplePieChart'

// &:focus
const buttonStyle = {
  fontSize: '12px',
  color: '#B5B5C3',
  '&:hover': {
    color: '#FFFFFF',
    backgroundColor: '#464E5F',
  },
}

interface Props {
  data: FeedbackModel[]

  onMonthly: (event: any) => void
  onWeekly: (event: any) => void
  onDaily: (event: any) => void
}

const FeedbackSection: FC<Props> = (props: Props) => {
  const { data, onMonthly, onWeekly, onDaily } = props

  const [total, setTotal] = useState<number>(0)
  const [tab, setTab] = useState(DashboardConst.MONTHLY)

  useEffect(() => {
    const cnt = data.map((item) => item.value).reduce((partialSum, a) => partialSum + a, 0)
    setTotal(cnt)
  }, [data])

  const today = moment(new Date()).format('DD MMM')
  const startOfWeek = moment(new Date()).startOf('week').add(1, 'd').format('DD MMM')
  const endOfWeek = moment(new Date()).endOf('week').add(1, 'd').format('DD MMM')
  const startOfMonth = moment(new Date()).startOf('month').format('DD MMM')
  const endOfMonth = moment(new Date()).endOf('month').format('DD MMM')

  return (
    <Paper elevation={0} className='rounded-lg px-5 py-4'>
      <div className='flex items-center justify-between'>
        <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Feedback</Typography>
        <div>
          <Grid container>
            <Grid item xs={12} md={4}>
              <Button
                size='large'
                sx={buttonStyle}
                onClick={(e) => {
                  onMonthly(e)
                  setTab(DashboardConst.MONTHLY)
                }}
              >
                Month
              </Button>
              <hr
                className={`h-px bg-gray-200 border-0 dark:bg-gray-700 ${
                  tab !== DashboardConst.MONTHLY ? 'hidden' : ''
                }`}
              ></hr>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                size='large'
                sx={buttonStyle}
                onClick={(e) => {
                  onWeekly(e)
                  setTab(DashboardConst.WEEKLY)
                }}
              >
                Week
              </Button>
              <hr
                className={`h-px bg-gray-200 border-0 dark:bg-gray-700 ${
                  tab !== DashboardConst.WEEKLY ? 'hidden' : ''
                }`}
              ></hr>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button size='large' sx={buttonStyle} onClick={(e) => {
                onDaily(e)
                setTab(DashboardConst.DAILY)
              }}>
                Day
              </Button>
              <hr
                className={`h-px bg-gray-200 border-0 dark:bg-gray-700 ${
                  tab !== DashboardConst.DAILY ? 'hidden' : ''
                }`}
              ></hr>
            </Grid>
          </Grid>
        </div>
      </div>
      <div className='pl-3 text-sm font-semibold pt-3'>
        {tab === DashboardConst.DAILY &&
          today
        }
        {tab === DashboardConst.WEEKLY &&
          startOfWeek + " - " + endOfWeek
        }
        {tab === DashboardConst.MONTHLY &&
          startOfMonth + " - " + endOfMonth
        }
      </div>
      <SimplePieChart data={data} total={total} />
      <Grid container>
        {data.map((entry, index) => (
          <Grid item md={6} key={index}>
            <FeedbackLabelWithPercent
              key={`cell-${index}`}
              color={entry.color}
              numbers={[~~Number(((entry.value / total) * 100).toFixed(0)), entry.value]}
              label={entry.label}
            />
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}

export default memo(FeedbackSection)
