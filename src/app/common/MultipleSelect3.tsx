import {
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import { Box } from '@mui/system'
import { FC, memo, useEffect, useState } from 'react'

/* Usage example
const [locationPlaceholder, setLocationPlaceholder] = useState(LOCATION_DEFAULT)

const handleLocationChange = (ids: any[]) => {
  console.log('handleLocationChange: ', ids)
}

const LocationData: DropdownOptions[] = [
  {
    id: 31,
    label: 'HH10A',
  },
  {
    id: 32,
    label: 'HH10B',
  },
  {
    id: 33,
    label: 'HH10C',
  },
]

<CustomMultipleSelect3
  maxWidth='max-w-[323px]'
  label='Location'
  handleChange={handleLocationChange}
  placeholderText={locationPlaceholder}
  enableAllSelect
  options={LocationData}
/>

*/
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export interface DropdownOptions {
  id: any
  label: any
}

interface Props {
  placeholderText: string
  margin?: string
  maxWidth?: string
  label?: string
  height?: string
  enableAllSelect?: boolean
  options: DropdownOptions[]
  multiple: boolean
  initialValue?: string[]
  loading?: boolean
  handleChange: (ids: string[]) => void
}

export const ALL = 'ALL'

const CustomMultipleSelect3: FC<Props> = (props: Props) => {
  const {
    placeholderText,
    margin,
    maxWidth,
    label,
    height,
    enableAllSelect,
    options,
    initialValue,
    handleChange,
  } = props

  const [data, setData] = useState<string[]>([])
  const handleDataChange = (event: SelectChangeEvent<any>, options: DropdownOptions[]) => {
    const value = event.target.value
    if (value[value.length - 1] === ALL) {
      setData(data.length === options.length ? [] : options.map((item) => item.id))
      return
    }
    setData(typeof value === 'string' ? value.split(',') : value)
  }

  useEffect(() => {
    setData([])
  }, [options])

  useEffect(() => {
    if (initialValue) {
      setData(initialValue)
    }
  }, [initialValue])

  useEffect(() => {
    handleChange(data)
  }, [data])

  const [placeholder, setPlaceholder] = useState('')
  useEffect(() => {
    setPlaceholder(placeholderText)
    setData([])
  }, [placeholderText])

  return (
    <Box className={`${margin ? margin : 'm-1'} ${maxWidth ? maxWidth : 'max-w-full'} w-full`} >
      {label && (
        <Typography className={`font-roboto font-medium text-base text-[#7E8299] mb-4`}>
          {label}
        </Typography>
      )}
      <FormControl className='w-full'>
        <Select
          sx={{ width: "100%" }}
          value={data}
          multiple={props.multiple}
          onChange={(e: SelectChangeEvent<typeof data>) => {
            handleDataChange(e, options)
          }}
          displayEmpty
          renderValue={(value) =>
            value.length
              ? options
                  .filter((item) => value.includes(item.id))
                  .map((item) => item.label)
                  .join(', ')
              : placeholder
          }
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' }}
          className={`bg-[#ECF0F3] ${height ? height : `h-11`} rounded-md text-sm `}
        >
          {enableAllSelect && options.length ? (
            <MenuItem
              value={ALL}
              divider={true}
              className={'text-sm my-1 text-[#A1A5B7] px-6 ${props.itemStyles} w-full'}
            >
              Select All
            </MenuItem>
          ) : null}
          {options?.map((item: any, ind: any) => (
            <MenuItem
              value={item.id}
              key={ind}
              className={'text-sm my-1 text-[#A1A5B7] px-6 ${props.itemStyles} w-full'}
              sx={{
                '&.Mui-selected': {
                  bgcolor: '#2BA579 !important',
                  color: 'white',
                },
                '&.Mui-selected:hover': {
                  bgcolor: '#2BA579',
                  color: 'white',
                },
              }}
            >
              {item.label}
            </MenuItem>
          ))}
          {props.loading && (
            <div className='text-center'>
              <CircularProgress color='success' />
            </div>
          )}
        </Select>
      </FormControl>
    </Box>
  )
}

export default memo(CustomMultipleSelect3)
