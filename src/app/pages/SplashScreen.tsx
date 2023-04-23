import { Box } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import React from 'react'

// TODO : design a loading page
const SplashScreen = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress color='success' />
    </Box>
  )
}

export default SplashScreen
