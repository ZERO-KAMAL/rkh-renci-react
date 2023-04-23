import { Box, Grid, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import CustomDatePicker2 from "app/common/date-picker2"
import CustomMultipleSelect2 from "app/common/MultipleSelect2"
import CustomSelect from "app/common/select"
import Loading from "app/components/Loading"
import ModuleHeader from "app/components/ModuleHeader"
import { DAILY, MONTHLY, ReportTypes, ReportTypesColor, TimeFrames, WEEKLY, YEARLY } from "app/constants/report"
import { fetchAreaByLocationId, fetchAreaReport } from "app/http/areas/areaSlice"
import { fetchDepartmentByAreaId, fetchDepartmentReport } from "app/http/departments/departmentSlice"
import { getFeedbackOverviewReportData } from "app/http/feedbacks/feedBackSlice"
import { fetchLocationReport } from "app/http/locations/locationSlice"
import { useAppDispatch, useAppSelector } from "app/redux/store"
import moment from "moment"
import { createRef, useCallback, useEffect, useState } from "react"
import { BsFillCircleFill } from "react-icons/bs"
import DashboardConst from "../dashboard/constants/dashboard.const"
import OverviewChart from "./overview/OverviewChart"
import { useScreenshot, createFileName } from "use-react-screenshot";
import jsPDF from "jspdf";
import { LoadingButton } from "@mui/lab"

export const ReportFormat = ['jpg', 'pdf']

const ReportOverview = () => {
  // end of day + 1 is done in handleEndDateChange
  const startOfDay = moment().subtract(6, 'd').startOf('day').local().format()
  const toDay = moment().endOf('day').local().format()
  const startOfWeek = moment().startOf('week').subtract(6, 'w').add(1, 'd').local().format()
  const startOfMonth = moment().startOf('year').local().format()
  const startOfYear = moment().startOf('year').subtract(2, 'y').local().format()
  
  const [reportTypes, setReportTypes] = useState<Array<string>>([])
  const [locations, setLocations] = useState<Array<string>>([])
  const [areas, setAreas] = useState<Array<string>>([])
  const [departments, setDepartments] = useState<Array<string>>([])
  const { dataTable: dataTableLocation } = useAppSelector((state) => state.location)
  const { dataTableArea } = useAppSelector((state) => state.area)
  const { dataTableDep } = useAppSelector((state) => state.department)
  const [submittedFromDate, setSubmittedFromDate] = useState(startOfMonth)
  const [submittedToDate, setSubmittedToDate] = useState(toDay)
  const [timeFrame, setTimeFrame] = useState('monthly')
  const [chartData, setChartData] = useState([])
  const [reportFormat, setReportFormat] = useState('jpg')
  const [downloading, setDownloading] = useState(false)

  const dispatch = useAppDispatch()

  const initLocation = useCallback(async () => {
    await dispatch(fetchLocationReport())
  }, [])

  const initArea = useCallback(async () => {
    await dispatch(fetchAreaReport())
  }, [])

  const initDep = useCallback(async () => {
    await dispatch(fetchDepartmentReport())
  }, [])

  const AreaByLocationIds = useCallback(async (ids: any) => {
    await dispatch(fetchAreaByLocationId(ids))
  }, [])

  const DepartmentByAreaIds = useCallback(async (locIds: any, areaIds: any) => {
    await dispatch(fetchDepartmentByAreaId({ locId: locIds, areaId: areaIds, text: '' }))
  }, [])

  const handleReportTypeChange = (e: any, options: any) => {
    const value = e.target.value
    // console.log(value)
    if (value[value.length - 1] === 'ALL') {
      setReportTypes(
        reportTypes.length === options.length ? [] : options.map((item: any) => item.id)
      )
      return
    }
    setReportTypes(typeof value === 'string' ? value.split(',') : value)
  }
  const handleLocationChange = (e: any, options: any) => {
    const value = e.target.value
    if (value[value.length - 1] === 'ALL') {
      setLocations(locations.length === options.length ? [] : options.map((item: any) => item.id))
      return
    }
    setLocations(typeof value === 'string' ? value.split(',') : value)
  }
  const handleAreaChange = (e: any, options: any) => {
    const value = e.target.value
    if (value[value.length - 1] === 'ALL') {
      setAreas(areas.length === options.length ? [] : options.map((item: any) => item.id))
      return
    }
    setAreas(typeof value === 'string' ? value.split(',') : value)
  }
  const handleDepChange = (e: any, options: any) => {
    const value = e.target.value
    if (value[value.length - 1] === 'ALL') {
      setDepartments(
        departments.length === options.length ? [] : options.map((item: any) => item.id)
      )
      return
    }
    setDepartments(typeof value === 'string' ? value.split(',') : value)
  }
  const handleTimeFrameChange = (e: any) => {
    switch (e.target.value) {
      case DAILY:
        // console.log('on Daily')
        setSubmittedFromDate(startOfDay)
        setSubmittedToDate(toDay)
        break
      case WEEKLY:
        // console.log('on weekly')
        setSubmittedFromDate(startOfWeek)
        setSubmittedToDate(toDay)
        break
      case MONTHLY:
        // console.log('on monthly')
        setSubmittedFromDate(startOfMonth)
        setSubmittedToDate(toDay)
        break
      case YEARLY:
        // console.log('on yearly')
        setSubmittedFromDate(startOfYear)
        setSubmittedToDate(toDay)
        break
    }
    setTimeFrame(e.target.value)
  }
  const handleStartDateChange = (value: any) => {
    // console.log(`handleStartDateChange => ${value}`)
    if (value === null) {
      // setFromDate('')
      setSubmittedFromDate('')
    } else {
      // setFromDate(moment(value).format('DD MMM YYYY'))
      setSubmittedFromDate(moment(value).startOf('day').local().format())
    }
  }
  const handleEndDateChange = (value: any) => {
    // console.log(`handleEndDateChange => ${value}`)
    if (value === null) {
      // setToDate('')
      setSubmittedToDate('')
    } else {
      // setToDate(` to ${moment(value).format('DD MMM YYYY')}`)
      setSubmittedToDate(moment(value).endOf('day').local().format())
    }
  }

  useEffect(() => {
    initLocation()
    initArea()
    initDep()
  }, [])

  useEffect(() => {
    // console.log('handleLocationChange: ', locations)
    if (locations.length == 0) {
      initArea()
      initDep()
    } else {
      AreaByLocationIds(locations.toString()).then(() => {
        DepartmentByAreaIds(locations.toString(), '')
      })
    }
  }, [locations])

  useEffect(() => {
    // console.log('handleAreaChange: ', areas)
    if (locations.length == 0 && areas.length == 0) initDep()
    else DepartmentByAreaIds(locations.toString(), areas.toString())
  }, [areas])

  const { feedbackReportOverviewData, feedbackReportOverviewLoading } = useAppSelector((state) => state.feedback)

  useEffect(()=> {
    dispatch(
      getFeedbackOverviewReportData({
        feedbackTypeName: reportTypes.length === 0 ? undefined : reportTypes,
        submittedDateFrom: submittedFromDate,
        submittedDateTo: moment(submittedToDate).local().format(),
        type: timeFrame,
        locationIds: locations.toString(),
        areaIds: areas.toString(),
        departmentIds: departments.toString()
      })
    )
  },[reportTypes, submittedFromDate, submittedToDate, timeFrame, locations, areas, departments])

  useEffect(() => {
    if (!feedbackReportOverviewData?.dates) return
    const areaChartDataArr: any = []
    feedbackReportOverviewData?.dates?.forEach((api: any) => {
      const areaChartData: any = {
        submittedDate: moment(api.submitDateTime).format(timeFrame === YEARLY ? "YYYY" : timeFrame === MONTHLY ? 'MMM' :  "D MMM"),
        "Appeals/MP letters": getFeedbackSum(api, DashboardConst.APPEAL.backendCode),
        // "Appreciations": getFeedbackSum(api, DashboardConst.APPRECIATION.backendCode),
        "Complaints": getFeedbackSum(api, DashboardConst.COMPLAINT.backendCode),
        "Compliments": getFeedbackSum(api, DashboardConst.COMPLIMENT.backendCode),
        "Suggestions": getFeedbackSum(api, DashboardConst.SUGGESTION.backendCode),
        withinTAT: getWithinTATSum(api),
        exceededTAT: getTATSum(api),
      }
      areaChartDataArr.push(areaChartData)
    })
    setChartData(areaChartDataArr)
  }, [feedbackReportOverviewData])
  const getFeedbackSum = useCallback(
    (api: any, type: string) => {
      const item = api.data
        .find((item: any) => item.feedbackType === type)

      let count = 0
      if(item?.count) {
        count += item?.count
      }
      if(item?.overTATCount)
        count += item?.overTATCount
      else if(item?.overTATcount)
        count += item?.overTATcount
      return count
    },
    [feedbackReportOverviewData]
  )
  const getTATSum = useCallback(
    (api: any) => {
      let count = 0
      api.data.forEach((item: any) => {
        
        if(item.overTATCount) {
          count += item.overTATCount
        }
        else if(item.overTATcount) {
          count += item.overTATcount
        }
      });
      return count
    },
    [feedbackReportOverviewData]
  )
  const getWithinTATSum = useCallback(
    (api: any) => {
      const sum = api.data
        .map((item: any) => item.count)
        .reduce((partialSum: any, a: any) => partialSum + a, 0)
        .toString()
      return sum === "NaN" ? 0 : sum
    },
    [feedbackReportOverviewData]
  )

  const ref = createRef();

  const [image, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0
  });

  const download = (image: any, { name = `Report-Overall-${moment(submittedFromDate).format('DDMMYYYY')}-${moment(submittedToDate).format('DDMMYYYY')}`} = {}) => {
    if(reportFormat === 'jpg') {
      const a = document.createElement("a");
      a.href = image;
      a.download = createFileName('jpg', name);
      a.click();
    }
    else {
      const pdf = new jsPDF();
      pdf.addImage(image, 'jpg', 5, 0, 200, 0)
      pdf.save(`${name}.pdf`);
    }
    setDownloading(false)
  };

  const downloadScreenshot = () => {
    setDownloading(true)
    const el: any = document.getElementById("report_hide")
    const el2: any = document.getElementById("report_unhide")
    const el3: any = document.getElementById("report_unhide1")
    const el4: any = document.getElementById("report_unhide2")
    el.style.display= "block";
    el2.style.display= "none";
    el3.style.display= "none";
    el4.style.display= "none";
    takeScreenShot(ref.current).then(download)
    el.style.display= "none";
    el2.style.display= "block";
    el3.style.display= "block";
    el4.style.display= "block";
  };


  return(
    <Box className='max-w-[1120px] w-full mx-auto md:pt-10'>
      <ModuleHeader header='Reports' />
      <Box>
        <Box className='flex justify-center md:justify-between items-center bg-white px-6 py-8 rounded-xl flex-wrap'>
          <Grid container spacing={2}>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              <CustomMultipleSelect2
                value={reportTypes}
                placeholderText={'Report Type'}
                label='Report Type'
                handleChange={handleReportTypeChange}
                enableAllSelect
                options={ReportTypes.map((label) => ({
                  id: label,
                  label,
                }))}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              <CustomMultipleSelect2
                value={locations}
                placeholderText={'By Location'}
                label='By Location'
                handleChange={handleLocationChange}
                enableAllSelect
                options={dataTableLocation.map(({ id: id, name: label }) => ({
                  id,
                  label,
                }))}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              <CustomMultipleSelect2
                value={areas}
                placeholderText={'By Area'}
                label='By Area'
                handleChange={handleAreaChange}
                enableAllSelect
                options={dataTableArea.map(({ id: id, name: label }) => ({
                  id,
                  label,
                }))}
              />
            </Grid>
            <Grid item sm={12} md={6} lg={3} className='w-full'>
              <CustomMultipleSelect2
                value={departments}
                placeholderText={'By Department'}
                label='By Department'
                handleChange={handleDepChange}
                enableAllSelect
                options={dataTableDep.map(({ id: id, name: label }) => ({
                  id,
                  label,
                }))}
              />
            </Grid>
          </Grid>
        </Box>

        <Box ref={ref}>
          <Box className='flex justify-center md:justify-between items-center bg-white px-6 py-8 rounded-xl flex-wrap mt-5'>
            <div style={{display: "none"}} id="report_hide">
              <div className="mb-3">
                <p className="font-bold text-[#3F4254]">Report Type:</p>
                <div className="px-5">
                  {reportTypes.length === 0 ?
                  <p>All</p>
                  :
                  reportTypes
                  .reduce((a, b) => a + ' ' + b + ',', '')
                  }
                </div>
              </div>
              <div className="mb-3">
                <p className="font-bold text-[#3F4254]">Location:</p>
                <div className="px-5">
                  {locations.length === 0 ?
                  <p>All</p>
                  :
                  locations.map((item: any, i: any)=> dataTableLocation?.find((f: any)=> f.id === item)?.name)
                  .reduce((a, b) => a + ' ' + b + ',', '')
                  }
                </div>
              </div>
              <div className="mb-3">
                <p className="font-bold text-[#3F4254]">Area:</p>
                <div className="px-5">
                  {areas.length === 0 ?
                  <p>All</p>
                  :
                  areas.map((item: any, i: any)=> dataTableArea?.find((f: any)=> f.id === item)?.name)
                  .reduce((a, b) => a + ' ' + b + ',', '')
                  }
                </div>
              </div>
              <div className="mb-3">
                <p className="font-bold text-[#3F4254]">Department:</p>
                <div className="px-5">
                  {departments.length === 0 ?
                  <p>All</p>
                  :
                  departments.map((item: any, i: any)=> dataTableDep?.find((f: any)=> f.id === item)?.name)
                  .reduce((a, b) => a + ' ' + b + ',', '')
                  }
                </div>
              </div>
              <div className="mb-3">
                <p className="font-bold text-[#3F4254]">Time Frame:</p>
                <div className="px-5">
                  <p>{timeFrame}</p>
                </div>
              </div>
            </div>
            <Box className="w-full pb-5 border-b">
              <Grid container spacing={2}>
                <Grid item sm={12} md={6} lg={3} className='w-full'>
                  <div className='flex flex-col text-[#3F4254] font-bold'>
                    <span>Report Period</span>
                    <span>
                      {moment(submittedFromDate).format('DD MMM YYYY')}
                      {" to "}
                      {moment(submittedToDate).format('DD MMM YYYY')}
                    </span>
                  </div>
                </Grid>
                <Grid item sm={12} md={6} lg={3} id="report_unhide" className='w-full'>
                  <CustomSelect
                    label={'Time Frame'}
                    none={'false'}
                    height={'h-10'}
                    options={TimeFrames}
                    value={timeFrame}
                    handleChange={handleTimeFrameChange}
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={3} id="report_unhide1" className='w-full'>
                  <CustomDatePicker2
                    label='Start Date'
                    handleChange={handleStartDateChange}
                    labelStyles={'pt-1'}
                    date={submittedFromDate}
                  />
                </Grid>
                <Grid item sm={12} md={6} lg={3} id="report_unhide2" className='w-full'>
                  <CustomDatePicker2
                    label='End Date'
                    handleChange={handleEndDateChange}
                    labelStyles={'pt-1'}
                    date={submittedToDate}
                  />
                </Grid>
              </Grid>
            </Box>
            {
              feedbackReportOverviewLoading &&
              <Box className="w-full p-10 ">
                <Loading />
              </Box>
            }
            {
              feedbackReportOverviewData && !feedbackReportOverviewLoading &&
              <Box className="w-full pt-5">
                <Grid container spacing={2}>
                  <Grid item xs={12} md={9} lg={9}>
                    <OverviewChart data={chartData} selectedTypes={reportTypes} />
                  </Grid>
                  <Grid item xs={12} md={3} lg={3}>
                    <Box>
                      <Box className="rounded-lg bg-[#F3F6F9] w-full p-[15px]">
                        {
                          ReportTypes.map((item: any, index: number)=> {
                            return(
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  fontSize: '18px',
                                  fontWeight: 'bold',
                                  padding: '5px',
                                  cursor: 'pointer',
                                  my: '5px',
                                }}
                                key={index}
                              >
                                <BsFillCircleFill color={ReportTypesColor[item]} size={12} />
                                <Typography className="ml-3">{item}</Typography>
                              </Box>
                            )
                          })
                        }
                      </Box>
                      <Box className="rounded-lg bg-[#F3F6F9] w-full p-[15px] mt-5">
                        <Stack direction="row" alignItems="center" justifyContent="space-between" className="mb-5">
                          <Typography>Total feedback received </Typography>
                          <Box className="min-w-[80px] h-[50px] bg-[#D9D9D9] rounded flex items-center justify-center ml-2">
                            {feedbackReportOverviewData?.summary?.total}
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" className="mb-5">
                          <Typography>Average number of feedback per month </Typography>
                          <Box className="min-w-[80px] h-[50px] bg-[#D9D9D9] rounded flex items-center justify-center ml-2">
                            {Math.floor(feedbackReportOverviewData?.summary?.average)}
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" className="mb-5">
                          <Typography>Total exceeded TAT </Typography>
                          <Box className="min-w-[80px] h-[50px] bg-[#D9D9D9] rounded flex items-center justify-center ml-2">
                            {feedbackReportOverviewData?.summary?.totalOverTAT}
                          </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Typography>Within TAT </Typography>
                          <Box className="min-w-[80px] h-[50px] bg-[#D9D9D9] rounded flex items-center justify-center ml-2">
                            {feedbackReportOverviewData?.summary?.totalWithinTAT}
                          </Box>
                        </Stack>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            }
          </Box>
        </Box>
      </Box>
      <Box className='mt-7 flex justify-end items-center border-t bg-white rounded-xl px-5 py-6'>
        <CustomSelect
          none={'false'}
          maxWidth={'w-[150px]'}
          itemStyles={'uppercase'}
          inputStyles={'uppercase'}
          options={ReportFormat}
          value={reportFormat}
          handleChange={()=> setReportFormat((prev) => prev === 'jpg' ? 'pdf' : 'jpg')}
        />
        <LoadingButton
          variant='contained'
          className='bg-[#2BA579] hover:bg-[#2BA579] focus:bg-[#2BA579] normal-case h-[42px] ml-5'
          onClick={downloadScreenshot}
          loading={downloading}
          loadingPosition='center'
          loadingIndicator={<span className="text-white">Downloading...</span>}
        >
          Download Report
        </LoadingButton>
      </Box>
    </Box>
  )
}

export default ReportOverview


