import { FC, memo, useState } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import ReactPaginate from 'react-paginate'

const ALL = 'All'

interface Props {
  count: number | undefined
  limit: number
  setLimit: (size: number) => void
  page: number
  setPage: (page: number) => void
}

const Pagination: FC<Props> = (props: Props) => {
  const count = props.count || 0
  const [showAll, setShowAll] = useState(false)

  const handleChangeRowsPerPage = (event: any) => {
    if (event.target.value !== ALL) {
      props.setLimit(parseInt(event.target.value, 10))
      setShowAll(false)
    } else {
      props.setLimit(count)
      setShowAll(true)
    }
  }

  const pageCount = Math.ceil(count / props.page)
  const displayedPages = []
  for (let i = 0; i < pageCount; i++) displayedPages.push(i)

  return (
    <span id='paginate-container' className='flex justify-between w-full flex-wrap-reverse mt-3'>
      <div id='left-container' className='flex text-sm'>
        <select
          id='dropdown'
          className='bg-[#F2F3F7] border rounded-md border-gray-300'
          style={{ width: '6.5rem' }}
          value={showAll ? ALL : props.limit}
          onChange={(event) => handleChangeRowsPerPage(event)}
        >
          {[10, 20, 30, 50, 100, 'All'].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <div className='mx-2'>
          {showAll && <p className='mt-2'>Showing {count} Entries</p>}
          {!showAll && (
            <p className='mt-2'>
              {props.page > 1 ? `Showing ${props.page * props.limit + 1} to ` : `Showing 1 to `}
              {props.page * props.limit < count ? (props.page + 1) * props.limit : count} of {count}{' '}
              entries
            </p>
          )}
        </div>
      </div>
      <div id='right-container' className=''>
        <ReactPaginate
          containerClassName='flex gap-1'
          nextLabel={<AiOutlineRight size={14} />} // Node: Label for the next button.
          breakLabel='' // Node: Label for ellipsis.
          previousLabel={<AiOutlineLeft size={14} />} // Node: Label for the previous button.
          pageRangeDisplayed={4} // The range of pages displayed.
          marginPagesDisplayed={0} // The number of pages to display for margins.
          pageCount={Math.ceil(count / props.limit)} // Required. The total number of pages.
          onPageChange={(event: any) => {
            // method to call when a page is changed
            props.setPage(event.selected + 1)
          }}
          nextLinkClassName='block w-8 h-8 text-center pt-2 pl-2 rounded-lg text-xl bg-gray-200 text-skin-muted'
          previousLinkClassName='block w-8 h-8 text-center pt-2 pl-2 rounded-lg text-xl bg-gray-200 text-skin-muted'
          pageLinkClassName='block w-8 h-8 text-center pt-1 rounded-lg text-skin-muted'
          activeLinkClassName='bg-green-500 !text-white'
        />
      </div>
    </span>
  )
}

export default memo(Pagination)
