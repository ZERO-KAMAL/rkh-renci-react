import { Checkbox } from '@mui/material'
import { green, teal } from '@mui/material/colors'
import {
  Components,
  StyledEngineProvider,
  ThemeProvider,
  createTheme,
  styled,
} from '@mui/material/styles'
import { FC } from 'react'

// MUI custom theme palette
// https://mui.com/material-ui/customization/color/
declare module '@mui/material' {
  interface ButtonPropsColorOverrides {
    sampleBtn: any
  }
}
declare module '@mui/material' {
  interface BadgePropsColorOverrides {
    alertBadge: any
  }
}
declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    alertBadge?: PaletteColorOptions
  }

  interface Palette {
    alertBadge: PaletteColor
  }
}

const MuiCheckbox: Components['MuiCheckbox'] = {
  styleOverrides: {
    root: {
      '& .MuiSvgIcon-root': {
        zIndex: 1,
      },

      '& .PrivateSwitchBase-input': {
        width: 'auto',
        height: 'auto',
        top: 'auto',
        left: 'auto',
        opacity: '1',
        visibility: 'hidden', // optional

        '&::before': {
          content: '""',
          position: 'absolute',
          background: '#ECF0F3',
          height: '100%',
          width: '100%',
          visibility: 'visible', // optional
        },
      },
    },
  },
}

const renciTheme = createTheme({
  palette: {
    primary: {
      main: green[700],
    },
    secondary: {
      main: '#1de9b6',
    },
    alertBadge: {
      main: teal[700],
    },
  },
  components: {
    // MuiCheckbox: MuiCheckbox,
  },
})

const MasterTheme: FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className={import.meta.env.VITE_APP_THEME}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={renciTheme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    </div>
  )
}

export default MasterTheme
