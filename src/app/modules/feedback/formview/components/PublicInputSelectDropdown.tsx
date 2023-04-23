import { FORM_FIELD_TYPE } from 'app/constants'
import { FC, useEffect, useRef, useState } from 'react'
import { GrFormDown, GrFormUp } from 'react-icons/gr'

interface Props {
  id?: number
  type?: string
  data: any
  setField: any
  name: string
  value: any
  dropdownType?: string
  isError: boolean
}

const PublicInputSelectDropDown: FC<Props> = ({ data, setField, name, value, dropdownType, isError }) => {
  const [dropDownOn, setDropDownOn] = useState(false)
  const [selectedValue, setSelectedValue] = useState(undefined)

  useEffect(()=> {
    if(!value) {
      setSelectedValue(undefined)
    }
  }, [value])

  const dropDownRef = useRef(null)
  useEffect(() => {
    const handleClick = (e: any) => {
      const ref: any = dropDownRef.current

      if (!ref?.contains(e.target)) {
        setDropDownOn(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className='w-full mb-5' id={name}>
      <p className='text-[14px] font-medium mb-3'>
        {data.fieldName}
        {data.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <div
        className='bg-[#ECF0F3] h-[40px] w-full relative focus:outline-none rounded-md text-sm flex-1 px-4 cursor-pointer flex justify-between items-center'
        onClick={() => setDropDownOn(!dropDownOn)}
        ref={dropDownRef}
        style={{border: isError ? "1px solid" : "", boxShadow: isError ? "2px 2px 10px #ff2d55" : ""}}
      >
        <p className='text-[#A1A5B7] text-base font-normal leading-10'>
          {selectedValue ? <span className='text-black'>{selectedValue}</span> :
          (data.text !== '' ? data.text : dropdownType === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE
          ? 'Please select a feedback type' : 'Dropdown list text')}
        </p>
        {dropDownOn ? (
          <GrFormUp
            size={16}
            style={{
              color: '#A1A5B7',
              fontWeight: 'bold',
              pointerEvents: 'none'
            }}
          />
        ) : (
          <GrFormDown
            size={16}
            style={{
              color: '#A1A5B7',
              fontWeight: 'bold',
              pointerEvents: 'none'
            }}
          />
        )}
        {dropDownOn && (
          <div
            className='absolute w-full h-auto
              bg-white border rounded-lg z-10 top-10 left-0'
          >
            <div className='m-4'>
              {data?.options?.filter((f: any)=> f.value !== 'Appreciations').map((row: any) => {
                return (
                  <table className='min-w-max w-full table-auto' key={row.id}>
                    <tbody>
                      <tr
                        className='border-b border-gray-100 h-[35px] hover:bg-green-50  '
                        onClick={() => {
                          setSelectedValue(dropdownType === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE ? row.value.slice(0, -1) : row.value)
                          setField(`${name}`, row.value)
                        }}
                      >
                        <td className='text-gray-500 text-sm hover:font-bold hover:rounded-lg'>
                          <span className='ml-4 w-full h-full '> {dropdownType === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE ? row.value.slice(0, -1) :row.value}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicInputSelectDropDown
