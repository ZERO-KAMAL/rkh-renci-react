// MUI
import { Box } from '@mui/material'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Modal from '@mui/material/Modal'
import React from 'react'

// interface Props {
//     open?: any,
//     handleClose?: any;
//     style?: object;
//     children?: any;
// }

const CustomModal = ({ open, handleClose, style, children, mobileStyle }: any) => {
  return (
    <Modal
      aria-labelledby='transition-modal-title'
      aria-describedby='transition-modal-description'
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      disableAutoFocus
      BackdropProps={{
        timeout: 500,
      }}
      component={Box}
      sx={{
        position: 'relative,',
        '& .MuiBackdrop-root': {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>{children}</Box>
      </Fade>
    </Modal>
  )
}

export default CustomModal
