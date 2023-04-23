import { LoadingButton } from '@mui/lab'
import { Button, Dialog } from '@mui/material'
import { FC } from 'react'
import { IoClose } from 'react-icons/io5'

interface Props {
  open: boolean
  isLoading: boolean
  onSubmit: () => void
  onClose: () => void
}

const DeleteDialog: FC<Props> = (props: Props) => {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '650px',
          borderRadius: '12px',
        },
      }}
    >
      <div className='px-7 py-8'>
        <div className='flex justify-end'>
          <IoClose size={'30px'} color={'rgba(0, 0, 0, 0.54)'} onClick={props.onClose} />
        </div>
        {
          <>
            <div className='p-9'>
              <p className='text-[24px] font-semibold'>
                Are you sure you’d like to delete selected?
              </p>
              <p className='text-[#A7A8BB] text-center mt-2 mb-3'>
                This action cannot be undone,<br></br>so please be sure before proceeding.
              </p>
            </div>
            <div className='flex items-center justify-center'>
              <div className='flex gap-5'>
                <Button
                  variant='contained'
                  className='!bg-[#4AB58E] !hover:bg-[#4AB58E] !focus:bg-[#4AB58E] normal-case'
                  onClick={props.onClose}
                >
                  Go Back
                </Button>
                <LoadingButton
                  variant='contained'
                  className='!bg-[#F1416C] !hover:bg-[#F1416C] !focus:bg-[#F1416C] normal-case'
                  loading={props.isLoading}
                  loadingPosition='center'
                  onClick={props.onSubmit}
                >
                  Delete
                </LoadingButton>
              </div>
            </div>
          </>
        }
      </div>
    </Dialog>
  )
}

export default DeleteDialog
