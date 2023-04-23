import { Button, Dialog } from '@mui/material'
import { FC } from 'react'
import { BsCheck2 } from 'react-icons/bs'
import { HiCheckCircle } from 'react-icons/hi'
import { IoClose } from 'react-icons/io5'

interface Props {
  open: boolean
  update?: boolean
  handleClose: () => void
  okClicked: () => void
}

const SuccessDialog: FC<Props> = ({ open, handleClose, okClicked, update }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <div>
        <div className='px-[48px] max-md:px-[20px] pt-[35px] max-md:pt-[20px] pb-[25px] max-md:pb-[12px] bg-[#F69B11] flex items-center min-w-[600px] max-md:min-w-fit justify-between'>
          <p className='text-white text-[20px] font-semibold'>
            Form {update ? 'Saved' : 'Created'} Successfully
          </p>
          <IoClose size={'30px'} color='white' onClick={handleClose} />
        </div>
        <div className='p-[45px] bg-white'>
          <div className='flex flex-col items-center justify-center'>
            <div className='w-[100px] h-[100px] rounded-full bg-[#4AB58E] flex items-center justify-center'>
              <BsCheck2 className='text-white text-[60px]' />
            </div>
            <p className='text-[#3F4254] text-md font-medium my-5'>
              Form {update ? 'saved' : 'created'} successfully!
            </p>
            <p className='text-[#606479] text-center text-base'>
              You may close this pop-up window, the {update && 'updated'} form will be stored with
              all your other forms.
            </p>
          </div>
          <div className='flex justify-end mt-10'>
            <Button
              variant='contained'
              className='bg-[#4AB58E] hover:bg-[#4AB58E] focus:bg-[#4AB58E] normal-case'
              onClick={okClicked}
            >
              ok
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default SuccessDialog
