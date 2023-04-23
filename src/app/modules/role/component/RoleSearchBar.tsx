import { setText } from 'app/http/roles-modules/roleModuleSlice'
import { useAppDispatch } from 'app/redux/store'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { useDebounce } from 'usehooks-ts'

const RoleSearchBar = () => {
  const [searchText, setSearchTest] = useState<string>('')
  const debouncedText = useDebounce(searchText, 500)

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (debouncedText !== undefined && searchText !== undefined) {
      // console.log(`debounceTest => ${debouncedText}`)
      dispatch(setText(debouncedText))
    }
  }, [debouncedText])
  return (
    <div className='flex items-center justify-between '>
      <div
        className='w-[300px] h-[40px] flex items-center bg-[#ECF0F3] 
        rounded-lg pl-2 '
      >
        <AiOutlineSearch size={20} />
        <input
          type='text'
          name='search'
          id='search'
          placeholder='Search Roles'
          className='bg-[#ECF0F3] w-full h-full ml-2 focus:outline-none rounded-md'
          onChange={(e) => {
            setSearchTest(e.target.value)
          }}
          autoComplete='off'
          required
        />
      </div>
    </div>
  )
}

export default RoleSearchBar
