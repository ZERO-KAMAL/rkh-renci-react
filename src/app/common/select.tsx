// MUI
import { Box, Typography } from '@mui/material'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import React, { useEffect, useState } from 'react'

const CustomSelect = ({
  maxWidth,
  margin,
  height,
  label,
  labelStyles,
  inputStyles,
  handleChange,
  value,
  options,
  styles,
  none,
  itemStyles,
}: any) => {

  return (
    <Box
      className={`${margin ? margin : 'm-1'} ${
        maxWidth ? maxWidth : 'max-w-full'
      } w-full ${styles}`}
    >
      {label && (
        <Typography
          className={`font-roboto font-medium text-base text-[#7E8299] mb-4 ${labelStyles}`}
        >
          {label}
        </Typography>
      )}
      <FormControl className='w-full'>
        <Select
          value={value}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          className={`bg-[#ECF0F3] ${
            height ? height : `h-11`
          } rounded-md ${inputStyles} text-sm`}
        >
          {none ? null : (
            <MenuItem
              value=''
              className={`text-sm my-1 text-[#A1A5B7] mx-3 ${itemStyles}`}
            >
              <em>None</em>
            </MenuItem>
          )}
          {options.map((item: any, ind: any) => (
            <MenuItem
              value={item}
              key={ind}
              className={`text-sm my-1 text-[#A1A5B7] mx-3 ${itemStyles}`}
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
              {item?.charAt(0)?.toUpperCase() + item?.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default CustomSelect
