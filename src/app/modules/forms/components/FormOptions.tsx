import clsx from 'clsx'
import { FC, useState } from 'react'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { FaTrash } from 'react-icons/fa'
import { MdEditNote } from 'react-icons/md'

interface Props {
  open: boolean
  canFormAddEdit: boolean
  canFormDelete: boolean
  onClick: () => void
  viewDetails: () => void
  editClicked: () => void
  deleteClicked: () => void
}

const FormOptions: FC<Props> = ({
  open,
  canFormAddEdit,
  canFormDelete,
  onClick,
  viewDetails,
  editClicked,
  deleteClicked,
}) => {
  return (
    <div className='relative'>
      <BiDotsHorizontalRounded
        size={30}
        className={clsx(open ? 'text-[#2BA579]' : 'text-[#B5B5C3]')}
        onClick={onClick}
      />
      {open && (
        <div className='bg-white w-[250px] h-auto absolute z-50 border border-lg shadow-sm rounded-md text-sm right-10 p-[15px]'>
          <div
            className='flex justify-between items-center px-[15px] py-[9px] hover:bg-[#DFF1EB] cursor-pointer rounded'
            onClick={viewDetails}
          >
            <p className='text-skin-base'>View Form Details</p>
            <AiOutlineInfoCircle size={20} color='#A1A5B7' />
          </div>
          {canFormAddEdit && (
            <div
              className='flex justify-between items-center px-[15px] py-[9px] hover:bg-[#DFF1EB] cursor-pointer rounded'
              onClick={editClicked}
            >
              <p className='text-skin-base'>Edit Form</p>
              <MdEditNote size={25} color='#A1A5B7' className='mr-[-7px]' />
            </div>
          )}
          {canFormDelete && (
            <div
              className='flex justify-between items-center px-[15px] py-[9px] hover:bg-[#DFF1EB] cursor-pointer rounded'
              onClick={deleteClicked}
            >
              <p className='text-skin-base'>Delete Form</p>
              <FaTrash size={15} color='#A1A5B7' />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FormOptions
