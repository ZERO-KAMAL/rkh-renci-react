import { FORM_FIELD_TYPE } from 'app/constants'
import { FC, useState } from 'react'
import { GrFormDown, GrFormUp } from 'react-icons/gr'

interface Props {
  id?: number
  type?: string
  value: any
}

const InputSelectDropDown: FC<Props> = ({ type, value }) => {
  const [dropDownOn, setDropDownOn] = useState(false)
  const [selectedValue, setSelectedValue] = useState(undefined)

  return (
    <div className='w-full mb-5'>
      <p className='text-[14px] font-medium mb-3'>
        {value.fieldName}
        {value.required && <span className='text-[#FD3D00]'>*</span>}
      </p>
      <div
        className='bg-[#ECF0F3] h-[40px] w-full relative focus:outline-none rounded-md text-sm flex-1 px-4 cursor-pointer flex justify-between items-center'
        onClick={() => setDropDownOn(!dropDownOn)}
      >
        <p className='text-[#A1A5B7] text-base font-normal leading-10'>
          {selectedValue ?
          <span className='text-black'>{selectedValue}</span> 
          : (value.text !== '' ? value.text
            : type === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE ?
              'Please select a feedback type'
              : type === FORM_FIELD_TYPE.DROPDOWN_LOCATION ?
              'Please select a location'
              : type === FORM_FIELD_TYPE.DROPDOWN_AREA ?
              'Please select an area'
              : type === FORM_FIELD_TYPE.DROPDOWN_DEPARTMENT ?
              'Please select a department'
            : 'Dropdown list text')
          }
        </p>
        {dropDownOn ? (
          <GrFormUp
            size={16}
            style={{
              color: '#A1A5B7',
              fontWeight: 'bold',
            }}
          />
        ) : (
          <GrFormDown
            size={16}
            style={{
              color: '#A1A5B7',
              fontWeight: 'bold',
            }}
          />
        )}
        {dropDownOn && (
          <div
            className='absolute w-full h-auto bg-white border rounded-lg z-10 top-10 left-0 max-h-[200px] overflow-y-auto'
          >
            <div className='m-4'>
              {(type === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE ? value?.options.filter((f: any)=> f.value !== 'Appreciations') : value?.options)?.map((row: any) => {
                return (
                  <table className='min-w-max w-full table-auto' key={row.id}>
                    <tbody>
                      <tr
                        className='border-b border-gray-100 h-[35px] hover:bg-green-50  '
                        onClick={() => setSelectedValue(type === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE ? row.value.slice(0, -1) : row.value)}
                      >
                        <td className='text-gray-500 text-sm hover:font-bold hover:rounded-lg'>
                          <span className='ml-4 w-full h-full '> {type === FORM_FIELD_TYPE.DROPDOWN_FEEDBACK_TYPE ? row.value.slice(0, -1) : row.value}</span>
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

export default InputSelectDropDown
