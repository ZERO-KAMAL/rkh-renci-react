import { Checkbox } from '@mui/material'
import clsx from 'clsx'
import { Dispatch, SetStateAction, memo, useEffect, useState } from 'react'
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai'

type Props = {
  title: string
  datas: Array<string> | [] | any
  values: Array<string>
  setValues: Dispatch<SetStateAction<Array<string>>>
  isObject: boolean
}

const MulitSelectDropdown = ({ title, datas, values, setValues, isObject }: Props) => {
  // console.log(`MulitSelectDropdown => ${JSON.stringify(datas)}`)
  const [active, setActive] = useState(false)

  useEffect(() => {
    // console.log(`value => ${JSON.stringify(values)}`)
  }, [values])
  // Action
  const selectOnClick = (data: string) => {
    if (data) {
      if (values.includes(data)) {
        setValues((prevValue) => prevValue.filter((v) => v != data))
      } else {
        setValues((prevValue) => [...prevValue, data])
      }
    }
  }

  return (
    <div className='flex flex-col items-start'>
      <label
        className='block mb-3 text-sm 
                             font-medium text-gray-900 
                             dark:text-gray-300 '
      >
        {title}
      </label>
      <div
        className={clsx(
          'bg-[#ECF0F3] lg:w-full h-[40px] p-2 rounded-lg flex items-center justify-between '
        )}
        onClick={() => setActive((prevActive) => !prevActive)}
      >
        <span className='text-gray-500 text-sm '>
          {values.length > 0 ? values.toString() : title}
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
      {/* datas */}
      <div className={clsx('relative lg:w-full h-auto', !active && 'hidden')}>
        {!isObject ? (
          <table className='min-w-max w-full bg-white table-auto absolute z-50 border mt-2'>
            {datas &&
              datas.map((data: any) => {
                return (
                  <tr className=' border-gray-200' key={data}>
                    <td className='py-0 px-3 text-left flex  justify-between items-center rounded '>
                      <span
                        className={clsx(
                          'text-gray-500 text-sm select-none',
                          values?.includes(data) && 'text-green-900 font-bold'
                        )}
                      >
                        {data}
                      </span>
                      <Checkbox
                        checked={values?.includes(data)}
                        onClick={() => selectOnClick(data)}
                        style={{
                          color: 'green',
                        }}
                      />
                    </td>
                  </tr>
                )
              })}
          </table>
        ) : (
          <table className='min-w-max w-full bg-white table-auto absolute z-50 border mt-2'>
            {datas &&
              datas.map((data: any) => {
                return (
                  <tr className=' border-gray-200' key={data.id}>
                    <td className='py-0 px-3 text-left flex  justify-between items-center rounded '>
                      <span
                        className={clsx(
                          'text-gray-500 text-sm font-medium select-none',
                          values?.includes(data.title) && 'text-green-900 font-bold'
                        )}
                      >
                        {data.title}
                      </span>
                      <Checkbox
                        checked={values?.includes(data.title)}
                        onClick={() => selectOnClick(data.title)}
                        style={{
                          color: 'green',
                        }}
                      />
                    </td>
                  </tr>
                )
              })}
          </table>
        )}
      </div>
    </div>
  )
}

export default MulitSelectDropdown
