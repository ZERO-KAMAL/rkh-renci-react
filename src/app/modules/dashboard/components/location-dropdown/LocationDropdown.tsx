import { Box, Grid } from '@mui/material'
import CustomMultipleSelect3, { DropdownOptions } from 'app/common/MultipleSelect3'
import { FC, memo } from 'react'

interface Props {
  // location
  handleLocationChange: (ids: any[]) => void
  locationData: DropdownOptions[]
  locationPlaceholder: string

  // area
  handleAreaChange: (ids: any[]) => void
  areaData: DropdownOptions[]
  areaPlaceholder: string

  // department
  handleDeptChange: (ids: any[]) => void
  deptData: DropdownOptions[]
  deptPlaceholder: string
}

const LocationDropdown: FC<Props> = (props: Props) => {
  return (
    <Box className='flex justify-between items-center bg-white px-6 py-8 mb-6 rounded-xl flex-wrap'>
      <Grid container spacing={2}>
        <Grid item sm={12} md={4} lg={4} className='w-full'>
          <CustomMultipleSelect3
            label='Location'
            handleChange={props.handleLocationChange}
            placeholderText={props.locationPlaceholder}
            enableAllSelect
            multiple={true}
            options={props.locationData}
          />
        </Grid>
        <Grid item sm={12} md={4} lg={4} className='w-full'>
          <CustomMultipleSelect3
            label='Area'
            handleChange={props.handleAreaChange}
            placeholderText={props.areaPlaceholder}
            enableAllSelect
            multiple={true}
            options={props.areaData}
          />
        </Grid>
        <Grid item sm={12} md={4} lg={4} className='w-full'>
          <CustomMultipleSelect3
            label='Department'
            placeholderText={props.deptPlaceholder}
            handleChange={props.handleDeptChange}
            enableAllSelect
            multiple={true}
            options={props.deptData}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default memo(LocationDropdown)
