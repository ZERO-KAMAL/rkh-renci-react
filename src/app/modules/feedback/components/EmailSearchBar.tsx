import { useAppDispatch, useAppSelector } from 'app/redux/store'
import clsx from 'clsx'
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import { setConstantValue } from 'typescript'
import { useDebounce } from 'usehooks-ts'

import { fetchUserList } from '../../../http/users/userSlice'

type Props = {
  values: Array<string>
  setValues: Dispatch<SetStateAction<Array<string>>>
}

const EmailSearchBar = (prop: Props) => {
  const { values, setValues } = prop
  const [inputList, setInputList] = useState([''])
  const [searchText, setSearchText] = useState<string | undefined>(undefined)
  const debouncedText = useDebounce(searchText, 500)
  const [margin, setMargin] = useState(0)
  const dispatch = useAppDispatch()
  const { userListDataTable } = useAppSelector((state) => state.user)

  const fetchUser = useCallback(async (email: string) => {
    const parms = {
      page: 1,
      limit: 10,
      order: { sortDir: 'asc', sortBy: 'email' },
      fullName: '',
      email: email,
      phoneNumber: '',
    }
    await dispatch(fetchUserList(parms))
  }, [])

  useEffect(() => {
    if (debouncedText !== undefined && searchText !== undefined) {
      console.log(`debounceTest => ${debouncedText}`)
      if (debouncedText.length == 0) fetchUser('default')
      else fetchUser(debouncedText)
    }
  }, [debouncedText])

  // Action

  const handleSelect = (data: string) => {
    // console.log(`data => ${data}`)
    setValues((prev) => [...prev, data])
    // add new input
    setInputList([...inputList, ''])
    fetchUser('default')
    setMargin((prev) => prev + 200)
  }

  const handleOnChange = (e: any, index: number) => {
    setSearchText(e.target.value)
  }

  return (
    <div className='flex px-4 flex-wrap'>
      {inputList &&
        inputList.map((data: any, index: number) => (
          <div>
            <input
              type={'text'}
              value={values[index]}
              className='w-[200px] h-[30px]'
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        ))}
      {userListDataTable
        ? userListDataTable.map((data: any) => (
            <div
              className={clsx(
                'w-[200px] h-[40px] absolute mt-[40px] z-50 flex  items-center',
                'justify-center bg-gray-100 text-black',
                'hover:bg-gray-500 hover:text-white hover:cursor-pointer',
                `ml-[${200}px]`
              )}
              onClick={() => {
                handleSelect(data.email)
              }}
            >
              <span>{data.email}</span>
            </div>
          ))
        : null}
    </div>
  )
}

export default EmailSearchBar
