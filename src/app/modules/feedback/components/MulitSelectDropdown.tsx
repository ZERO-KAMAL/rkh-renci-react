import { Checkbox } from '@mui/material'
import clsx from 'clsx'
import React, { Dispatch, SetStateAction, memo, useCallback, useState, useEffect, useRef } from 'react'
import { AiFillCaretDown, AiFillCaretUp, AiOutlineDown, AiOutlineUp } from 'react-icons/ai'

type Props = {
  title: string
  datas: Array<string> | [] | any
  values: Array<string>
  styles?: string
  setValues: Dispatch<SetStateAction<Array<string>>>
}
const MulitSelectDropdown = ({ title, datas, values, styles, setValues }: Props) => {
  // console.log('MultiSelectDropdown rendering.......')
  //  console.log(`datas => ${JSON.stringify(datas)}`)
  const [active, setActive] = useState(false)

  // Action
  // const selectOnClick = useCallback( (data: string) => {
  //    console.log(`value => ${JSON.stringify(values)}`)
  //   if (data) {
  //     if (values.includes(data)) {
  //       setValues((prevValue) => prevValue.filter((v) => v != data))
  //     } else {
  //       setValues((prevValue) => [...prevValue, data])
  //     }
  //   }
  // },[])

  const selectOnClick = (data: string) => {
    // console.log(`value => ${JSON.stringify(values)}`)
    if (data) {
      if (values.includes(data)) {
        setValues((prevValue) => prevValue.filter((v) => v != data))
      } else {
        setValues((prevValue) => [...prevValue, data])
      }
    }
  }
  const dropDownRef = useRef(null)
  const optionsRef = useRef(null)
  useEffect(() => {
    const handleClick = (e: any) => {
      const ref: any = dropDownRef.current
      const optRef: any = optionsRef.current

      if (!ref?.contains(e.target) && !optRef.contains(e.target)) {
        setActive(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className={`flex flex-col items-start w-full relative ${styles}`}>
      <span className='mb-3 text-gray-400 text-sm'> {title} </span>
      <div
        className='bg-[#ECF0F3] 
        h-[34px] px-2
           md:mr-2
          flex items-center justify-between rounded w-[100%]'
        onClick={() => setActive((prevActive) => !prevActive)}
        ref={dropDownRef}
      >
        <span className='text-sm'>
          {values.length === 0
            ? <span className='text-gray-400'>Select</span>
            : values.toString().length > 17
            ? `${values.toString().substring(0, 17)}...`
            : values.toString()}
        </span>
        {active ? (
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
      <div
        className={clsx(
          'absolute lg:w-full md:[100px] bg-[#ECF0F3] mt-[80px] z-50',
          !active && 'hidden '
        )}
        ref={optionsRef}
      >
        {/* table */}
        {title === 'Feedback Type' ? (
          <table className='min-w-max w-full table-auto z-50 '>
            <tbody>
              {datas &&
                datas.map((data: any, index: number) => {
                  return (
                    <tr className='border-b border-gray-200' key={index}>
                      <td className='py-0 px-3 text-left flex  justify-between items-center rounded '>
                        <span
                          className={clsx(
                            'text-gray-400 text-sm',
                            values?.includes(data.name) && 'text-green-900 font-bold select-none'
                          )}
                        >
                          {data.name}
                        </span>
                        <Checkbox
                          onClick={() => selectOnClick(data.name)}
                          style={{
                            color: 'green',
                          }}
                        />
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        ) : (
          <table className='min-w-max w-full table-auto z-50 '>
            <tbody>
              {datas &&
                datas.map((data: any) => {
                  return (
                    <tr className='border-b border-gray-200 z-50' key={data}>
                      <td className='py-0 px-3 text-left flex  justify-between items-center rounded '>
                        <span
                          className={clsx(
                            'text-gray-400 text-sm',
                            values?.includes(data) && 'text-green-900 font-bold select-none'
                          )}
                        >
                          {data}
                        </span>
                        <Checkbox
                          onClick={() => selectOnClick(data)}
                          style={{
                            color: 'green',
                          }}
                        />
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        )}
        {/* <table className='min-w-max w-full table-auto '>
          {datas &&
            datas.map((data :any) => {
              return (
                <tr className='border-b border-gray-200' key={data}>
                  <td className='py-0 px-3 text-left flex  justify-between items-center rounded '>
                    <span
                      className={clsx(
                        'text-gray-400 text-sm',
                        values.includes(data) && 'text-green-900 font-bold'
                      )}
                    >
                      {data}
                    </span>
                    <Checkbox
                      onClick={() => selectOnClick(data)}
                      style={{
                        color: 'green',
                      }}
                    />
                  </td>
                </tr>
              )
            })}
        </table> */}
      </div>
    </div>
  )
}

export default memo(MulitSelectDropdown)
