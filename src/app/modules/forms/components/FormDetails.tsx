import { Button, Dialog } from '@mui/material'
import Loading from 'app/components/Loading'
import { fetchfeedbackFormDetails } from 'app/http/feedback-form/feedBackFormSlice'
import { useAppSelector } from 'app/redux/store'
import { useHistory } from 'app/routing/AppRoutes'
import moment from 'moment'
import QRCode from 'qrcode.react'
import { FC, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

interface Props {
  open: boolean
  handleClose: () => void
  formId: number | null
}

const FormDetails: FC<Props> = ({ open, handleClose, formId }) => {
  const { feedBackFormDetails, loadingFeedbackFormDetails } = useAppSelector(
    (state: any) => state.feedbackForm
  )
  const dispatch = useDispatch()

  useEffect(() => {
    if (formId !== null) {
      dispatch(fetchfeedbackFormDetails(formId) as any)
    }
  }, [formId])

  const downloadQRCode = () => {
    const canvas: any = document.getElementById('qr-gen')
    const pngUrl = canvas?.toDataURL('image/png').replace('image/png', 'image/octet-stream')
    const downloadLink = document.createElement('a')
    downloadLink.href = pngUrl
    downloadLink.download = `qr_${feedBackFormDetails.id}.png`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  }

  const url = new URL(window.location.href)

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '680px',
          borderRadius: '12px',
        },
      }}
    >
      <div className='w-[680px] max-md:w-auto bg-white rounded box-border max-h-[calc(100vh-144px)]'>
        <div className='px-[40px] max-md:px-6 pt-[30px] pb-[15px] flex justify-between items-center border-b-2 box-border'>
          <p className='tex-md font-semibold '>Form Details</p>
          <IoClose size={'25px'} color={'rgba(0, 0, 0, 0.54)'} onClick={handleClose} />
        </div>
        <div
          className='px-16 max-md:px-6 py-9 max-md:py-5 overflow-scroll'
          style={{ maxHeight: 'calc(100vh - 222px)' }}
        >
          {loadingFeedbackFormDetails && <Loading />}
          {!loadingFeedbackFormDetails && feedBackFormDetails && (
            <div>
              <div className='flex justify-center'>
                <div className='flex flex-col items-center'>
                  <QRCode
                    id='qr-gen'
                    value={`${url.host}/feedback/formview/${feedBackFormDetails.feedbackFormCode}`}
                    size={290}
                    level={'H'}
                    includeMargin={true}
                  />
                  <div className='w-[200px]'>
                    <Link
                      target='_blank'
                      to={`/feedback/formview/${feedBackFormDetails.feedbackFormCode}`}
                    >
                      <Button
                        variant='contained'
                        className='bg-[#F69B11] hover:bg-[#F69B11] focus:bg-[#F69B11] normal-case w-full mb-3'
                      >
                        Preview
                      </Button>
                    </Link>
                    <Button
                      variant='contained'
                      className='bg-[#4AB58E] hover:bg-[#4AB58E] focus:bg-[#4AB58E] normal-case w-full'
                      onClick={downloadQRCode}
                    >
                      Download QR Code
                    </Button>
                  </div>
                </div>
              </div>
              <div className='mt-10'>
                <p className='text-md font-bold'>Form Title</p>
                <p className='text-md text-[#5E6278]'>{feedBackFormDetails.title}</p>
              </div>
              <div className='mt-8'>
                <p className='text-md font-bold'>Location</p>
                <p className='text-md text-[#5E6278]'>
                  {feedBackFormDetails?.location?.name || '_'}
                </p>
              </div>
              <div className='mt-8'>
                <p className='text-md font-bold'>Area</p>
                <p className='text-md text-[#5E6278]'>{feedBackFormDetails?.area?.name || '_'}</p>
              </div>
              <div className='mt-8'>
                <p className='text-md font-bold'>Department</p>
                <p className='text-md text-[#5E6278]'>
                  {feedBackFormDetails?.department?.name || '_'}
                </p>
              </div>
              <div className='mt-8'>
                <p className='text-md font-bold'>Form Assigned to</p>
                {feedBackFormDetails?.assignedUsers?.map((u: any, i: number) => {
                  return (
                    <p className='text-md text-[#5E6278]' key={i}>
                      {u?.name}
                    </p>
                  )
                })}
              </div>
              <div className='mt-8'>
                <p className='text-md font-bold'>KPI Notification Settings</p>
                <p className='text-md text-[#5E6278]'>{feedBackFormDetails?.kpi && 'On'}</p>
                <p className='text-md text-[#5E6278]'>{feedBackFormDetails?.kpiDay} Days</p>
              </div>
              <div className='mt-8'>
                <p className='text-md font-bold'>Date Created</p>
                <p className='text-md text-[#5E6278]'>
                  {moment(feedBackFormDetails.createdAt).format('DD/MM/YYYY')}
                </p>
              </div>
              <div className='mt-8'>
                <p className='text-md font-bold'>Created By</p>
                <p className='text-md text-[#5E6278]'>
                  {feedBackFormDetails?.user?.fullName || '_'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}

export default FormDetails
