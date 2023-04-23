import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { FC } from 'react'

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
  value: string[]
  placeholderText: string
  margin?: string
  maxWidth?: string
  label: string
  height?: string
  enableAllSelect?: boolean
  options: DropdownOptions[]
  handleChange: (event: SelectChangeEvent<any>, options: DropdownOptions[]) => void
}

export const ALL = 'ALL'

const CustomMultipleSelect2: FC<Props> = (props: Props) => {
  const {
    value,
    placeholderText,
    margin,
    maxWidth,
    label,
    height,
    enableAllSelect,
    options,
    handleChange,
  } = props
  return (
    <Box className={`${margin ? margin : 'm-1'} ${maxWidth ? maxWidth : 'max-w-full'} w-full`}>
      {label && (
        <Typography className={`font-roboto font-medium text-base text-[#7E8299] mb-4`}>
          {label}
        </Typography>
      )}
      <FormControl className='w-full'>
        <Select
          value={value}
          multiple
          onChange={(e: SelectChangeEvent<typeof value>) => {
            handleChange(e, options)
          }}
          displayEmpty
          renderValue={(value) =>
            value.length
              ? options
                  .filter((item) => value.includes(item.id))
                  .map((item) => item.label)
                  .reduce((a, b) => a + ' ' + b + ',', '')
              : placeholderText
          }
          MenuProps={MenuProps}
          inputProps={{ 'aria-label': 'Without label' }}
          className={`bg-[#ECF0F3] ${height ? height : `h-11`} rounded-md text-sm`}
        >
          {!enableAllSelect ? null : (
            <MenuItem
              value={ALL}
              divider={true}
              className={'text-sm my-1 text-[#A1A5B7] px-6 ${props.itemStyles} w-full'}
            >
              Select All
            </MenuItem>
          )}
          {options?.map((item: any, ind: any) => (
            <MenuItem
              value={item.id}
              key={ind}
              className={'text-sm my-1 text-[#A1A5B7] px-6 ${props.itemStyles} w-full'}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "#2BA579 !important",
                  color: "white"
                },
                "&.Mui-selected:hover": {
                  bgcolor: "#2BA579",
                  color: "white"
                }
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default CustomMultipleSelect2
