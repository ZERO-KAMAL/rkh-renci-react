import { FormControl, MenuItem, Select, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { BsCheck2 } from "react-icons/bs";


const CustomMultipleSelect = ({
    value,
    margin,
    maxWidth,
    styles,
    label,
    labelStyles,
    handleChange,
    height,
    inputStyles,
    enableAllSelect,
    itemStyles,
    options
  } : any) => {
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
          multiple
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          className={`bg-[#ECF0F3] text-[#A1A5B7] ${
            height ? height : `h-11`
          } rounded-md ${inputStyles} text-sm`}
        >
          {!enableAllSelect ? null : (
            <MenuItem
              value='All'
              className={`text-sm my-1 hover:bg-[#E8FFF3] focus:bg-[#E8FFF3] px-6 rounded-md ${itemStyles} w-full`}
            >
              All
            </MenuItem>
          )}
          {options?.map((item: any, ind: any) => (
            <MenuItem
              value={item}
              key={ind}
              className={`text-sm my-1 text-[#A1A5B7] hover:bg-[#E8FFF3] focus:bg-[#E8FFF3] px-6 rounded-md ${itemStyles} w-full`}
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
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default CustomMultipleSelect