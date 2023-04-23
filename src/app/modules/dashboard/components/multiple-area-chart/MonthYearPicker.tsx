import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import { FC, useCallback, useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import { BsCalendarPlus } from 'react-icons/bs'
import { FiChevronDown } from 'react-icons/fi'

interface Props {
  onDateChange: (month: string, year: number) => void
}

const MonthYearPicker: FC<Props> = (props: Props) => {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(moment(new Date()).format('MMM'))
  const [selectedDate, setSelectedDate] = useState(new Date())

  // useEffect(() => {
  //   props.onDateChange(month, year)

  //   // setSelectedDate(new Date(`${year}-${month}-${1}`)))
  //   setSelectedDate(moment(`${year}-${month}-${1}`, 'YYYY-MMM-DD').toDate())
  // }, [month, year])

  const handleDateChange = useCallback((date: any) => {
    setMonth(moment(date).format('MMM'))
    setYear(date.getFullYear())
    setSelectedDate(
      moment(`${date.getFullYear()}-${moment(date).format('MMM')}-${1}`, 'YYYY-MMM-DD').toDate()
    )
    props.onDateChange(moment(date).format('MMM'), date.getFullYear())
  }, [])

  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      dateFormat='MMM/yyyy'
      showMonthYearPicker
      customInput={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#A1A5B7',
          }}
        >
          <BsCalendarPlus />
          &nbsp;&nbsp;
          <Typography>{month}&nbsp;</Typography>
          <Typography>{year}&nbsp;&nbsp;</Typography>
          <FiChevronDown />
        </Box>
      }
    />
  )
}

export default MonthYearPicker
