import clsx from 'clsx'
import React, { useEffect, useRef, useState } from 'react'
import { AiFillCaretDown, AiFillCaretUp, AiOutlineSearch } from 'react-icons/ai'

interface IData {
  id: number
  name: string | null
}

interface IProps {
  placeHolder: string
  data: Array<IData> | undefined
  setSelectedValue: (v: IData) => void
  setSearch: (v: string) => void
  reset?: boolean
  resetClicked?: () => void
  selectAll?: boolean
  disabled?: boolean
  searchValue?: string
}

const CustomSelectWithSearch: React.FC<IProps> = ({
  placeHolder,
  data,
  setSelectedValue,
  setSearch,
  reset,
  resetClicked,
  selectAll,
  disabled,
  searchValue,
}) => {
  const [dropDownOn, setDropDownOn] = useState<boolean>(false)
  const dropDownRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => {
    const handleClick = (e: any) => {
      const ref: any = dropDownRef.current
      const search: any = searchRef.current

      if (!ref?.contains(e.target) && !search?.contains(e.target)) {
        setDropDownOn(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const handleClick = () => {
    if (!disabled) {
      setDropDownOn((prevState) => !prevState)
    }
  }

  return (
    <div className='w-full relative'>
      <div
        ref={dropDownRef}
        className={clsx(
          'w-full h-[40px] px-1 flex items-center justify-between rounded-lg mb-4 static',
          disabled ? 'bg-gray-50' : 'bg-[#ECF0F3]'
        )}
        onClick={() => {
          handleClick()
        }}
      >
        <span className={clsx(`ml-2 text-sm`, disabled ? 'text-gray-400' : 'text-gray-500')}>
          {placeHolder}
        </span>
        {dropDownOn ? (
          <AiFillCaretUp
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bold',
              marginRight: '5px',
            }}
          />
        ) : (
          <AiFillCaretDown
            size={12}
            style={{
              color: 'black',
              fontWeight: 'bold',
              marginRight: '5px',
            }}
          />
        )}
      </div>
      {/* options */}
      {dropDownOn && (
        <div className='absolute w-full h-auto bg-white border rounded-lg z-10 max-h-[400px] overflow-y-scroll'>
          {/* search bar */}
          <div className='bg-[#ECF0F3] m-4 h-[40px] rounded-lg flex items-center' ref={searchRef}>
            <AiOutlineSearch size={20} style={{ marginLeft: '10px' }} />
            <input
              type='text'
              placeholder='Search'
              className='bg-[#ECF0F3] w-full h-full ml-2 focus:outline-none rounded-lg '
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              value={searchValue}
              autoComplete='off'
              required
            />
          </div>
          {/* data table */}
          <div className='m-4'>
            {data && data.length > 0 && reset && (
              <table className='min-w-max w-full table-auto' key={'key1'}>
                <tbody>
                  <tr
                    className='border-b border-gray-100 h-[35px] hover:bg-green-50  '
                    onClick={resetClicked}
                  >
                    <td className='font-700 text-sm hover:font-bold hover:rounded-lg'>
                      <span className='ml-2 w-full h-full '>Reset</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            {selectAll && (
              <table className='min-w-max w-full table-auto'>
                <tbody>
                  <tr
                    className='border-b border-gray-100 h-[35px] hover:bg-green-50  '
                    onClick={() => setSelectedValue({ id: 0, name: 'All Selected' })}
                  >
                    <td className='text-gray-500 text-sm hover:font-bold hover:rounded-lg'>
                      <span className='ml-2 w-full h-full '>Select All</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
            {data &&
              data.map((row: any) => {
                return (
                  <div className='w-full' key={row.id}>
                    <div
                      className='border-b border-gray-100 hover:bg-green-50 cursor-pointer'
                      onClick={() => setSelectedValue(row)}
                    >
                      <div className='text-gray-500 text-sm hover:font-bold hover:rounded-lg flex items-center px-2 py-2'>
                        {row.name}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
export default CustomSelectWithSearch
