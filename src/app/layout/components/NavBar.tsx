// MUI
import { Badge, Box, Menu, MenuItem, Typography } from '@mui/material'
import { createTheme } from '@mui/material/styles'
// components
import CustomModal from 'app/common/modal'
import NAVIGATE_LINKS from 'app/constants/router-links'
import useAuth from 'app/modules/auth/login/hooks/useAuth'
import useNotificationPollService from 'app/modules/notification/useNotificationPollService'
import { useAppDispatch, useAppSelector } from 'app/redux/store'
import React, { useEffect, useRef, useState } from 'react'
import { AiOutlineGoogle } from 'react-icons/ai'
// react icons
import { BiMenu, BiX } from 'react-icons/bi'
import { IoMdNotifications } from 'react-icons/io'
import { shallowEqual, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import Logo from '../../assets/images/renci/company-logo-small.svg'
import NotificationModal from '../../modules/notification/NotificationModal'
import NavLinks from './NavLinks'

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 375, // phone
      sm: 425, // tablets
      md: 767, // small laptop
      lg: 1024, // desktop
      xl: 1440, // large screens
    },
  },
})

const style = {
  position: 'absolute',
  top: '7.2%',
  right: '5%',
  width: 345,
  bgcolor: 'background.paper',
  background: '#FFFFFF',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
  borderRadius: '5px',
  p: '23px 20px 0px 20px',
  [theme.breakpoints.down('md')]: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  [theme.breakpoints.down('xs')]: {
    width: '90%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}

const NavBar = () => {
  const [open, setOpen] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleOpen = () => setOpenModal(true)
  const handleClose = () => setOpenModal(false)
  const navigate = useNavigate()
  const { unreadNotifications } = useAppSelector((state) => state.notifications)

  const menuBarRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuBarRef.current && !menuBarRef.current.contains(event.target)) {
        // console.log('click outside ', open)
        setOpen(false)
      } else {
        // console.log('clicked inside')
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  const { user } = useSelector(
    (state: any) => ({
      user: state.user.currentUser.userInfo,
    }),
    shallowEqual
  )

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const dispatch = useAppDispatch()
  const defaultRoute = useAppSelector((state) => state.app.defaultRoute)

  useNotificationPollService()

  return (
    <>
      <nav className='fixed bg-skin-navbar w-screen'>
        <div className='flex items-center font-medium justify-between py-1 h-16 md:px-8 max-w-[1200px] w-full mx-auto'>
          {/* Desktop nav */}
          <div className='flex justify-start'>
            <div
              className='z-50 p-2 md:w-auto w-full flex justify-between'
              onClick={() => navigate(defaultRoute)}
            >
              {/* logo */}
              <img
                src={Logo}
                alt='logo'
                className='md:inline md:cursor-pointer mr-4 bg-white rounded-lg px-2 py-1'
              />
            </div>
            <div className='md:flex hidden items-center md:gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 '>
              <NavLinks />
            </div>
          </div>

          {/* TODO: replace with notification and user profile */}
          <Box className='md:flex hidden justify-center items-center'>
            {/* <Box className='hover w-10 h-10 flex justify-center items-center mx-[2px] pointer'>
              <img src='/assets/svgs/search.svg' alt='search' width='24px' />
            </Box> */}
            <Box
              className='hover w-10 h-10 flex justify-center items-center mx-[2px] pointer'
              onClick={handleOpen}
            >
              <Badge
                badgeContent={unreadNotifications.count}
                color='alertBadge'
                className='text-white text-bold'
              >
                {/* <MailIcon color='action' /> */}
                <IoMdNotifications size='24px' color='white' />
              </Badge>
            </Box>
            <Box className='mx-2 flex items-center pointer' onClick={handleMenu}>
              <Typography className='font-semibold text-sm text-[#DFF1EB] mr-2'>
                {user.fullName}
              </Typography>
              {user?.avatarUri ? (
                <figure>
                  <img
                    className='w-[40px] h-[40px] object-cover rounded'
                    src={user?.avatarUri}
                    alt='Loading'
                  />
                </figure>
              ) : (
                <Box className='hover w-[40px] h-[40px] flex justify-center items-center bg-[#ffffff14] rounded'>
                  <Typography className='text-[20px] font-medium font-poppins text-white'>
                    {user?.fullName[0]}
                  </Typography>
                </Box>
              )}
            </Box>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>
                <Link to='/user-profile'>Profile</Link>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  useAuth.logout(dispatch)
                }}
              >
                Log Out
              </MenuItem>
            </Menu>
          </Box>

          {/* Mobile nav */}
          {/* hamburger / close icon */}
          <div
            className={`text-4xl md:hidden pr-2 text-white`}
            onClick={() => setOpen((open) => !open)}
          >
            {open ? <BiX /> : <BiMenu />}
          </div>
          <div
            className={`md:hidden bg-white fixed w-[60%] top-16 overflow-y-auto bottom-0 
            pl-4 duration-200 ${open ? 'left-0' : 'left-[-60%]'}`}
            ref={menuBarRef}
          >
            <div>
              <NavLinks setOpen={setOpen} />
            </div>
            {/* TODO: replace with notification and user profile */}
            <Box className='flex justify-center items-center flex-wrap bg-skin-navbar rounded-xl w-11/12 py-2 mt-8'>
              <Box className='mx-2 flex items-center pointer' onClick={handleMenu}>
                <Typography className='font-semibold text-sm text-[#DFF1EB] mr-2'>
                  {user.fullName}
                </Typography>
                {user?.avatarUri ? (
                  <figure>
                    <img
                      className='w-[40px] h-[40px] object-cover rounded'
                      src={user?.avatarUri}
                      alt='Loading'
                    />
                  </figure>
                ) : (
                  <Box className='hover w-[40px] h-[40px] flex justify-center items-center bg-[#ffffff14] rounded'>
                    <Typography className='text-[20px] font-medium font-poppins text-white'>
                      {user?.fullName[0]}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose()
                    setOpen(false)
                    navigate(NAVIGATE_LINKS.UserDetails.ROOT_PATH)
                  }}
                >
                  {/* <Link className='w-full h-full mx-2' to='/user-profile'>Profile</Link> */}
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    useAuth.logout(dispatch)
                  }}
                >
                  Log Out
                </MenuItem>
              </Menu>
              {/* <Box className='hover w-10 h-10 flex justify-center items-center mx-[2px] pointer'>
                <img src='/assets/svgs/search.svg' alt='search' width='24px' />
              </Box> */}
              <Box
                className='hover w-10 h-10 flex justify-center items-center mx-[2px] pointer'
                onClick={handleOpen}
              >
                <IoMdNotifications size='24px' color='white' />
              </Box>
            </Box>
          </div>
        </div>
      </nav>
      <CustomModal
        open={openModal}
        handleClose={handleClose}
        style={style}
        children={<NotificationModal handleClose={handleClose} />}
      />
      {/* Invisble div is added here to reserve space and prevent
      react childrens from writing over it,
      because navbar used absolute property for dropdown, */}
      <div id='navbar-patch' className='h-32 md:w-full'></div>
    </>
  )
}

export default NavBar
