import clsx from 'clsx'
import React, { Dispatch, SetStateAction, memo, useCallback, useState } from 'react'
import { AiFillCaretDown, AiFillCaretUp, AiOutlineDown, AiOutlineUp } from 'react-icons/ai'

import { CustomObj } from '../../../http/feedbacks/feedBack.model'

type Props = {
  title: string
  datas: Array<CustomObj> | any
  value: string
  setValue: Dispatch<SetStateAction<string>>
  setFieldName: string
  formik: any
  touch: any
  error: any
}

const CustomDropdown = ({
  title,
  datas,
  value,
  setValue,
  setFieldName,
  formik,
  touch,
  error,
}: Props) => {
  // console.log(`CustomDropdown rendering...${value}`)
  const [active, setActive] = useState(false)

  const handleOnClick = useCallback(
    (data: any) => {
      if (formik) {
        formik.setFieldValue(setFieldName, data)
      }

      setValue(data)
      setActive(false)
    },
    [value]
  )

  return (
    <>
      <div className='static flex flex-col items-start  '>
        {/* <span className='mb-3 text-gray-400 text-sm'> {title} </span> */}
        {formik ? (
          <div
            className={clsx(
              'bg-[#ECF0F3] w-full h-[45px] px-1 flex items-center justify-between rounded-lg'
              // {'is-invalid': touch && error},
              // {'is-valid': touch && !error},
            )}
            onClick={() => setActive((prevActive) => !prevActive)}
            {...formik.getFieldProps(`${setFieldName}`)}
          >
            <span className={clsx(`ml-2 text-sm text-gray-500`, value && 'text-black')}>
              {value ? value : title}
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
        ) : (
          <div
            className={clsx(
              'bg-[#ECF0F3] w-full h-[45px] px-1 flex items-center justify-between rounded-lg'
              // {'is-invalid': touch && error},
              // {'is-valid': touch && !error},
            )}
            onClick={() => setActive((prevActive) => !prevActive)}
          >
            <span className={clsx(`ml-2 text-sm text-gray-500`, value && 'text-black')}>
              {value ? value : title}{' '}
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
        )}

        {/* Data Table */}

        <div
          className={clsx(
            'absolute w-[80%] md:w-[90%] border rounded-lg bg-white mt-[60px]  z-50',
            !active && 'hidden '
          )}
        >
          {/* table */}
          {title === 'FeedbackType' ? (
            <table className='min-w-max w-full table-auto '>
              <tbody>
                {datas &&
                  datas.map((data: any) => {
                    return (
                      <tr
                        className='border-b border-gray-200
                    hover:bg-green-100 hover:font-bold'
                        key={data.name}
                        onClick={() => handleOnClick(data.name)}
                      >
                        <td className=' text-gray-400 text-sm py-3 px-3 text-left flex z-50 justify-between items-center rounded hover:text-green-800 w-full'>
                          {data.name}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          ) : (
            <table className='min-w-max w-full table-auto '>
              <tbody>
                {datas &&
                  datas.map((data: any) => {
                    return (
                      <tr
                        className='border-b border-gray-200
                    hover:bg-green-100 hover:font-bold'
                        key={data}
                        onClick={() => handleOnClick(data)}
                      >
                        <td className=' text-gray-400 text-sm py-3 px-3 text-left flex z-50 justify-between items-center rounded hover:text-green-800 w-full'>
                          {data}
                        </td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          )}
          {/* <table className='min-w-max w-full table-auto '>
            {datas &&
              datas.map((data: any) => {
                return (
                  <tr
                    className='border-b border-gray-200
                      hover:bg-green-100 hover:font-bold'
                    key={data}
                    onClick={() => handleOnClick(data)}
                  >
                    <td
                      className=' text-gray-400 text-sm py-3 px-3 text-left flex z-50 justify-between items-center rounded hover:text-green-800 w-full'
                    >
                     {data}
                     
                    </td>
                  </tr>
                )
              })}
          </table> */}
        </div>
      </div>
      {touch && error && (
        <div className='text-red-600 text-sm'>
          <span role='alert'>{error}</span>
        </div>
      )}
    </>
  )
}

export default memo(CustomDropdown)
