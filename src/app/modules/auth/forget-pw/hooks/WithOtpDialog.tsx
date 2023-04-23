import NAVIGATE_LINKS from 'app/constants/router-links'
import UserService from 'app/http/users/usersService'
import { FC, useState } from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import OtpDialogModal from '../components/OtpDialogModal'

export interface OtpDialogProps {
  open: boolean
  email: string
}

interface Props {
  dialog: OtpDialogProps
  email: string
  setDialog: (item: any) => void
}

const WithOtpDialog:FC<Props> = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (otp: string) => {
    // navigate to reset-pw
    if (otp.length !== 6) return
    const params = { email: props.email, otp: otp }

    try {
      const res = await UserService.validateOTP(props.email!, otp!)
      console.log(res)
      navigate({
        pathname: NAVIGATE_LINKS.AUTH.RESET_PASSWORD,
        search: `?${createSearchParams(params)}`,
      })
    } catch (err: any) {
      err?.status < 500
        ? toast.error(`Error ${err?.status}! ${err?.data?.message || ''}`)
        : toast.error(`An error has occurred`)
    }
  }

  const onResend = async (event: any) => {
    try {
      event.preventDefault()
      const res = await UserService.resetEmailPassword(props.email!)
      toast.success('Otp Resent! Check your email')
    } catch (err: any) {
      toast.error(`Error ${err?.status}! ${err?.data?.message}`)
    }
  }

  return (
    <OtpDialogModal
      open={props.dialog.open}
      isLoading={isLoading}
      onSubmit={onSubmit}
      onResend={onResend}
      onClose={() =>
        props.setDialog({
          open: false,
          email: '',
        })
      }
    />
  )
}

export default WithOtpDialog
