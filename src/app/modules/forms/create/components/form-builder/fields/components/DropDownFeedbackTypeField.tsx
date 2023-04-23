import { Checkbox } from '@mui/material'
import { fetchFeedbackType } from 'app/http/feedbacks/feedBackSlice'
import { useAppSelector } from 'app/redux/store'
import { FC, useEffect, useState } from 'react'
import { GrFormDown, GrFormUp } from 'react-icons/gr'
import { useDispatch } from 'react-redux'

interface Props {
  value: any
  onChange: (v: any) => void
}

const DropDownFeedbackTypeField: FC<Props> = ({ value: prevValue, onChange }) => {
  const [dropDownOn, setDropDownOn] = useState(false)
  const [options, setOptions] = useState<any>(undefined)
  const [value, setValue] = useState({
    fieldName: 'Feedback Type',
    text: '',
    options: options,
    required: true,
  })

  const dispatch = useDispatch()
  const {
    feedbackTypeList
  } = useAppSelector((state) => state.feedback)

  useEffect(()=> {
    if(feedbackTypeList) {
      const tempOptions = feedbackTypeList.map(({name}: any, index: any)=> ({id: index, value: name === "Appeals/MP letters" ? "Appeals" : name}))
      setOptions(tempOptions as any)
      setValue({...value, options: tempOptions})
      onChange({...value, text: prevValue?.text || value.text, options: tempOptions})
    }
  }, [feedbackTypeList])

  useEffect(() => {
    if (prevValue) {
      setValue(prevValue)
      setOptions(prevValue.options)
      onChange(prevValue)
    }
    else {
      dispatch(fetchFeedbackType() as any)
      onChange(value)
    }
  }, [])

  return (
    <div className='w-full bg-white py-[24px] max-md:py-[15px] px-[32px] max-md:px-[16px] disabled:bg-white'>
      <div className='text-[14px] font-medium mb-3 border-none outline-none w-full'>
        {value.fieldName}
      </div>
      <div
        className='bg-[#ECF0F3] h-[40px] w-full focus:outline-none rounded-md text-sm flex-1 px-4 cursor-pointer flex justify-between items-center'
        onClick={() => setDropDownOn(!dropDownOn)}
      >
        <input
          type='text'
          className='text-[#A1A5B7] text-base font-normal leading-10 border-none outline-none bg-transparent w-full'
          value={value.text}
          placeholder='Please select a feedback type'
          onChange={(e: any) => {
            setValue({ ...value, text: e.target.value })
            onChange({ ...value, text: e.target.value })
          }}
        />
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
      </div>
      {dropDownOn && (
        <div className='w-full h-auto pt-[25px] px-[28px] z-10'>
          {options?.filter((f: any)=> f.value !== 'Appreciations')?.map((item: any, index: number) => {
            return (
              <div className='w-full border-none outline-none text-sm text-[#A1A5B7] font-medium pb-[22px]' key={index}>
                {item?.value.slice(0, -1)}
              </div>
            )
          })}
        </div>
      )}
      <div className='flex mt-6'>
        <Checkbox
          color='success'
          sx={{
            p: '0',
            color: '#A1A5B7',
            '&.Mui-checked': {
              color: '#2BA579',
            },
          }}
          checked={value.required}
          disabled
        />
        <p className='text-base text-[#7E8299] ml-3 font-sm'>Compulsory Field</p>
      </div>
    </div>
  )
}

export default DropDownFeedbackTypeField
