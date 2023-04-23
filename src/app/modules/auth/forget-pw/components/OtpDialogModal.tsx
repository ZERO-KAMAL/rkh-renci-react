import { LoadingButton } from '@mui/lab'
import { Button, Dialog } from '@mui/material'
import { FC, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import OtpInput from 'react-otp-input'

interface Props {
  open: boolean
  isLoading: boolean
  onSubmit: (otp: string) => void
  onResend: (e: any) => void
  onClose: () => void
}

const OtpDialogModal: FC<Props> = (props: Props) => {
  const [otp, setOtp] = useState('')

  const handleOtpChange = (otp1: string) => {
    setOtp(otp1)
  }

  const handleClose = (event: any, reason: any) => {
    if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')) return
    props.onClose()
  }

  return (
    <Dialog
      open={props.open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '650px',
          borderRadius: '12px',
        },
      }}
    >
      <div className='px-4 py-8'>
        <div className='flex justify-end'>
          <IoClose size={'30px'} color={'rgba(0, 0, 0, 0.54)'} onClick={props.onClose} />
        </div>
        {
          <>
            <div className='p-7'>
              <p className='text-[1.2rem] font-semibold text-center'>
                Please key in the validation code sent to your email
              </p>
              <div className='flex justify-center text-[#A7A8BB] text-center my-4 flex-wrap'>
                <OtpInput
                  inputStyle={{
                    width: '2.5rem',
                    height: '2.5rem',
                    fontsize: '2rem',
                    borderRadius: '4px',
                    border: '1px solid rgba(0,0,0,0.3)',
                    color: 'black',
                  }}
                  value={otp}
                  onChange={handleOtpChange}
                  numInputs={6}
                  separator={<span>-</span>}
                />
              </div>
            </div>
            <div className='flex items-center justify-center'>
              <div className='flex gap-5'>
                <Button
                  variant='contained'
                  className='bg-[#F1416C] hover:bg-[#F1416C] focus:bg-[#F1416C] normal-case'
                  onClick={props.onClose}
                >
                  Go Back
                </Button>
                <LoadingButton
                  variant='contained'
                  className='bg-[#4AB58E] hover:bg-[#4AB58E] focus:bg-[#4AB58E] normal-case'
                  loading={props.isLoading}
                  loadingPosition='center'
                  onClick={() => {
                    props.onSubmit(otp)
                  }}
                >
                  Continue
                </LoadingButton>
              </div>
            </div>
            <a
              href='#'
              onClick={(e: any) => {
                props.onResend(e)
                setOtp('')
              }}
              className='flex justify-center mt-5 text-sm text-[#2BA579] font-medium'
            >
              Resend Validation Code
            </a>
          </>
        }
      </div>
    </Dialog>
  )
}

export default OtpDialogModal
