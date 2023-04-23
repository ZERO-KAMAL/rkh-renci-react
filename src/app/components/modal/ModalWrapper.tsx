import { Dialog } from '@mui/material'
import React, { FC, ReactNode } from 'react'
import { IoClose } from 'react-icons/io5'

interface Props {
  title: string
  children?: ReactNode
  onSubmit: () => void
  onClose: () => void
}

/* Usage example

<ModalWrapper title={'Add User'} onClose={() => {}} onSubmit={formik.handleSubmit}>
  // my content here
<ModalWrapper/>

*/

const ModalWrapper: FC<Props> = (props: Props) => {
  return (
    <Dialog
      open={true}
      onClose={props.onClose}
      sx={{
        '& .MuiDialog-paper': {
          maxWidth: '680px',
          borderRadius: '12px',
        },
      }}
    >
      <div
        className='w-full bg-white rounded box-border'
        style={{ maxHeight: 'calc(100vh - 144px)' }}
      >
        {/* header */}
        <div className='px-[40px] pt-[30px] pb-[15px] flex justify-between items-center border-b-2 box-border'>
          <p className='text-md font-semibold '>{props.title}</p>
          <IoClose size={'25px'} color={'rgba(0, 0, 0, 0.54)'} onClick={props.onClose} />
        </div>

        {/* body */}
        <div className='overflow-auto mb-4'>
          <div
            className='flex justify-start align-middle'
            style={{ maxHeight: 'calc(100vh - 333px)' }}
          >
            {/* main content */}
            <div className='my-5 mx-10'>{props.children}</div>
          </div>
        </div>

        {/* footer*/}
        <div className='flex items-center justify-end py-4 px-3 border-t border-solid border-slate-200 rounded-b'>
          <button
            className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
            type='button'
            onClick={props.onClose}
          >
            Discard
          </button>
          <button
            className='bg-emerald-500 text-white active:bg-emerald-600 uppercase text-sm px-3 md:px-5 py-2 md:py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
            type='button'
            onClick={(e: any) => {
              e.preventDefault()
              props.onSubmit()
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </Dialog>
  )
}

export default ModalWrapper
