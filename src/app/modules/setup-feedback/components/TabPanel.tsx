import { FC, ReactNode } from 'react'

interface Props {
  value: number
  children?: ReactNode
  index: number
  [other: string | number | symbol]: any
}

const TabPanel: FC<Props> = (props: Props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      className='rounded-lg min-h-[30rem]'
      {...other}
    >
      {children}
      {/* {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )} */}
    </div>
  )
}

export default TabPanel
