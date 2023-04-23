import { deleteAllLocationDetails, setPage, setText } from 'app/http/location-datas/locationDetailSlice'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import Swal from 'sweetalert2'
import { useDebounce } from 'usehooks-ts'

const SearchBar = () => {
  const dispatch = useAppDispatch()
  const { selected } = useAppSelector((state) => state.locationDetail)

  const [searchText, setSearchTest] = useState<string>('')
  const debouncedText = useDebounce(searchText, 500)
  // const searchOnChange = (e : any) => {
  //     console.log(`Search Text =>${e.target.value}`)
  //     dispatch(setText(e.target.value))
  // }
  useEffect(() => {
    if (debouncedText !== undefined && searchText !== undefined) {
      // console.log(`debounceTest => ${debouncedText}`)
      dispatch(setPage(1))
      dispatch(setText(debouncedText))
    }
  }, [debouncedText])

  // action
  const deleteOnClick = () => {
    Swal.fire({
      title: ' </br>Are you sure you’d like to delete these location data?',

      text: 'This action cannot be undone, so please be sure before proceeding.',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: 'green',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Go Back',
      reverseButtons: true,
      showCloseButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAllLocationDetails(selected)).then((response) => {
          const status = response.meta.requestStatus
          if (status === 'rejected') {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response?.payload?.data?.message || 'Something went wrong!',
            })
          } else if (status === 'fulfilled') {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
          }
        })
      }
    })
  }

  return (
    <div className='flex items-center justify-between '>
      {/* Search bar */}
      <div
        className='w-[500px] h-[40px] flex items-center bg-[#ECF0F3] 
        rounded-lg pl-2 '
      >
        <AiOutlineSearch size={20} />
        <input
          type='text'
          name='search'
          id='search'
          placeholder='Search Location,area,department'
          className='bg-[#ECF0F3] w-full h-full ml-2 focus:outline-none rounded-lg '
          onChange={(e) => {
            setSearchTest(e.target.value)
          }}
          autoComplete='off'
          required
        />
      </div>
      {/* Selected Button */}
      <button
        className={clsx(
          'bg-red-600 text-white rounded-lg w-[150px] h-[40px] ',
          selected.length == 0 && 'hidden'
        )}
        onClick={() => deleteOnClick()}
      >
        Delete Selected
      </button>
    </div>
  )
}

export default SearchBar
