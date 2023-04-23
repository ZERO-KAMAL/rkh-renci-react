import { Tooltip } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import CustomSelect from 'app/common/select'
import { useAppSelector } from 'app/redux/store'
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { AiOutlineReload, AiOutlineSearch } from 'react-icons/ai'
import { MdLabel, MdOutlineMarkEmailUnread } from 'react-icons/md'
import { RiInboxArchiveLine, RiMailLine } from 'react-icons/ri'

import LabelSelect from './LabelSelect'

interface ActionItemProps {
  children: React.ReactNode
  onClick?: () => void
  tooltip: string
}

export const ActionItem = ({ children, onClick, tooltip }: ActionItemProps) => {
  return (
    <Tooltip title={tooltip}>
      <div
        className='w-6 h-6 bg-[#F3F6F9] flex justify-center items-center rounded cursor-pointer'
        onClick={onClick}
      >
        {children}
      </div>
    </Tooltip>
  )
}

const FeedbackInboxHeader = ({
  value,
  checked,
  setChecked,
  onSearchChange,
  onDataRangeChange,
  dateRange,
  showFilters,
  handleFilterChange,
  handleChangePage,
  showItems,
  handleDelete,
  refetch,
  checkedMails,
  setCheckedMails,
  handleMultipleUnRead,
  handleMultipleArchive,
  isSelect,
  handleMultipleRead,
  refetchEmails,
  isArchive
}: any) => {
  const { page, counts } = useAppSelector((state) => state.feedbackEmail)
  const [startDate, endDate] = dateRange

  return (
    <div className='flex w-full h-[150px] lg:h-[80px] lg:flex-nowrap flex-wrap items-center text-gray-400'>
      {/* button group */}
      <div className='flex items-center flex-1 mx-2'>
        {showItems ? (
          <div className=''>
            <Checkbox
              inputProps={{ 'aria-label': 'controlled' }}
              sx={{
                p: '0',
                color: '#A1A5B7',
                '&.Mui-checked': {
                  color: '#2BA579',
                },
              }}
              checked={checked}
              onChange={() => setChecked(!checked)}
              color='success'
            />
          </div>
        ) : null}
        {!isSelect && (
          <div className=''>
            <CustomSelect
              handleChange={handleFilterChange}
              value={value}
              maxWidth='max-w-max'
              options={['All', 'Read', 'Unread']}
              inputStyles='bg-transparent text-black'
              itemStyles='text-black'
              none
            />
          </div>
        )}
        <Tooltip title='Reload'>
          <div className='mr-3' onClick={refetch}>
            <AiOutlineReload
              size={20}
              style={{
                fontWeight: 'bolder',
                fontSize: '3px',
                marginRight: '5px',
                cursor: 'pointer',
              }}
            />
          </div>
        </Tooltip>
        {showFilters ? (
          <div className='flex gap-3 items-center mx-3  text-gray-400'>
            <ActionItem onClick={handleMultipleUnRead} tooltip='Unread'>
              <MdOutlineMarkEmailUnread className='cursor-pointer w-4 h-4' />
            </ActionItem>
            <ActionItem tooltip='Read' onClick={handleMultipleRead}>
              <RiMailLine className='cursor-pointer w-4 h-4' />
            </ActionItem>
            <ActionItem onClick={handleMultipleArchive} tooltip={isArchive? 'Unarchive' :'Archive'}>
              <RiInboxArchiveLine size={20} className='cursor-pointer w-4' />
            </ActionItem>
            <LabelSelect checkedMails={checkedMails} setCheckedMails={setCheckedMails} refetchEmails={refetchEmails}>
              {(handleClick) => (
                <ActionItem onClick={handleClick} tooltip='Label'>
                  <MdLabel size={20} className='cursor-pointer w-4' />
                </ActionItem>
              )}
            </LabelSelect>
          </div>
        ) : null}
      </div>
      <div className='flex overflow-auto items-center mx-2'>
        {/* Search Box */}
        <div className='flex items-start flex-col mr-2'>
          <div className='min-w-[150px] max-w-[400px] lg:w-[300px] w-full h-[40px] flex items-center bg-[#ECF0F3] rounded-lg pl-2'>
            <AiOutlineSearch size={20} />
            <input
              type='text'
              name='search'
              id='search'
              placeholder='Search in emails...'
              className='bg-[#ECF0F3] text-black w-full h-full ml-2 focus:outline-none rounded-md text-sm'
              onChange={onSearchChange}
              autoComplete='off'
              required
            />
          </div>
        </div>
        {/* Filter by Date */}
        <div className='pl-3 bg-[#ECF0F3] rounded-lg h-[40px]'>
          <DatePicker
            selectsRange={true}
            placeholderText='Select date range'
            startDate={startDate}
            endDate={endDate}
            onChange={onDataRangeChange}
            dateFormat='yyyy-MM-dd'
            className='h-[40px] w-[250px] text-black bg-transparent rounded-sm ml-2 focus:outline-none'
            isClearable={true}
          />
        </div>
        {/* total count */}
        <div className='flex items-center mr-4 '>
          <TablePagination
            component='div'
            count={counts}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={10}
            className='pagination-pointer'
          />
        </div>
      </div>
    </div>
  )
}

export default FeedbackInboxHeader
