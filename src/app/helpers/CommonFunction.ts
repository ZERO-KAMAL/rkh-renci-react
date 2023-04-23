import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'

const currentTime = moment()
const currentDay = parseInt(currentTime.format('DD'))
const currentMonth = currentTime.month() + 1
const currentYear = currentTime.year()

export const TIME = { day: currentDay, month: currentMonth, year: currentYear }

export const formatDateTime = (value: any) => {
  if (!value) return
  const valueDate = new Date(
    value.toString().replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)$/, '$4:$5:$6 $2/$3/$1')
  )
  return Math.floor(valueDate.getTime())
}

export const formatDateTimeNoSecond = (value: any) => {
  if (!value) return
  const valueDate = new Date(
    value.toString().replace(/^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)$/, '$4:$5 $2/$3/$1')
  )
  return Math.floor(valueDate.getTime())
}

export const appendOx = (value: any) => {
  value = value.toString()
  if (value.length > 1) return `${value}`
  return `0${value}`
}

export const convertUnixTimeToOurFormat = (value: string) => {
  const _fromDateTime = moment(value)
  const day = appendOx(_fromDateTime.format('D'))
  const month = appendOx(_fromDateTime.format('M'))
  const year = _fromDateTime.format('YYYY')
  const fromHour = _fromDateTime.format('HH')
  const fromMinute = _fromDateTime.format('MM')
  return parseFloat(`${year}${month}${day}${fromHour}${fromMinute}00`)
}

export const useClientSize = (ref: any, height: number) => {
  const [size, setSize] = useState({ width: ref.current?.clientWidth, height })
  const getClientSize = useCallback(() => {
    setSize({
      width: ref.current?.clientWidth,
      height,
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
