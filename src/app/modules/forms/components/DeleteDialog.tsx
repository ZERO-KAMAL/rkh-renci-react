import LoadingButton from '@mui/lab/LoadingButton'
import { Button, Dialog } from '@mui/material'
import {
  defParamsForm,
  deleteFeedbackForm,
  fetchFeedbackForm,
} from 'app/http/feedback-form/feedBackFormSlice'
import { useAppSelector } from 'app/redux/store'
import { FC, useEffect } from 'react'
import { IoClose } from 'react-icons/io5'
import { useDispatch } from 'react-redux'

interface Props {
  open: boolean
  formId: Array<number> | undefined
  handleClose: () => void
  multiple: boolean
}

const DeleteDialog: FC<Props> = ({ open, formId, handleClose, multiple }) => {
  const dispatch = useDispatch()
  const { deleteStatus } = useAppSelector((state) => state.feedbackForm)

  const deleteHandler = () => {
    if (formId && formId.length > 0) {
      dispatch(deleteFeedbackForm(formId) as any)
    }
  }

  useEffect(() => {
    if (deleteStatus === 'success') {
      dispatch(fetchFeedbackForm(defParamsForm) as any)
    }
  }, [deleteStatus])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          m: '10px',
          maxWidth: '650px',
          borderRadius: '12px',
        },
      }}
    >
      <div className='px-7 max-md:px-4 py-8 max-md:py-4'>
        <div className='flex justify-end'>
          <IoClose size={'30px'} color={'rgba(0, 0, 0, 0.54)'} onClick={handleClose} />
        </div>
        {deleteStatus === 'error' ? (
          <div className='p-9'>
            <p className='text-[24px] font-semibold'>Something went wrong!</p>
          </div>
        ) : deleteStatus === 'success' ? (
          <div className='p-9 max-md:p-0'>
            <p className='text-[24px] font-semibold'>Deleted successfully!</p>
          </div>
        ) : (
          <>
            <div className='p-9 max-md:p-0'>
              <p className='text-[24px] font-semibold'>
                Are you sure you’d like to delete {multiple ? 'selected' : 'this'}?
              </p>
              <p className='text-[#A7A8BB] text-center mt-2 mb-3'>
                This action cannot be undone,<br></br>so please be sure before proceeding.
              </p>
            </div>
            <div className='flex items-center justify-center'>
              <div className='flex gap-5'>
                <Button
                  variant='contained'
                  className='bg-[#4AB58E] hover:bg-[#4AB58E] focus:bg-[#4AB58E] normal-case'
                  onClick={handleClose}
                >
                  Go Back
                </Button>
                <LoadingButton
                  variant='contained'
                  className='bg-[#F1416C] hover:bg-[#F1416C] focus:bg-[#F1416C] normal-case'
                  loading={deleteStatus === 'loading'}
                  loadingPosition='center'
                  onClick={deleteHandler}
                >
                  Delete
                </LoadingButton>
              </div>
            </div>
          </>
        )}
      </div>
    </Dialog>
  )
}

export default DeleteDialog
