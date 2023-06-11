import * as React from 'react'
export * from '@mui/material'
import {
  ThemeProvider as MUIThemeProvider,
  useMediaQuery,
  createTheme,
  responsiveFontSizes,
  CssBaseline,
} from '@mui/material'

export * as FontAwesomeProIcon from '@fortawesome/pro-duotone-svg-icons'
export * as FontAwesomeIcon from '@fortawesome/fontawesome-svg-core'

export { default as createEmotionServer } from '@emotion/server/create-instance'

export { default as createEmotionCache } from './utils/createEmotionCache'

export { CacheProvider, type EmotionCache } from '@emotion/react'

export { default as Icon } from './components/Icon'
export { default as SnackbarAlert } from './components/SnackbarAlert'

export function ThemeProvider({ children }: { children?: React.ReactNode }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = React.useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            mode: prefersDarkMode ? 'dark' : 'light',
            background: {
              default: prefersDarkMode ? '#000000' : '#f4f4f4',
            },
            primary: {
              main: prefersDarkMode ? '#76E9A6' : '#004346',
              contrastText: prefersDarkMode ? '#000000' : '#FFFFFF',
            },
            secondary: {
              main: '#413C58',
              dark: '#413C58',

              // this is so light it needs its own contrastText before it's usable tbh.
              // source: beta figma -- https://www.figma.com/file/GKUedFEmpiFHool7Q0oCbU/Class-Companion?node-id=0%3A1&t=iF0dpUKubp91QGZ0-0
              light: '#E3E6F2',
              contrastText: '#FFFFFF',
            },
          },
          typography: {
            fontFamily: `"Karla", "Helvetica", "Arial", sans-serif`,
            fontSize: 16,
            h1: {
              fontSize: 32,
              fontFamily: `"new-spirit", serif`,
              fontWeight: 400,
              color: prefersDarkMode ? '#76E9A6' : '#004346',
            },
            h2: {
              fontSize: 24,
              fontFamily: `"new-spirit", serif`,
              fontWeight: 400,
              color: prefersDarkMode ? '#76E9A6' : '#004346',
            },
            h3: {
              fontSize: 20,
              fontFamily: `"new-spirit", serif`,
              fontWeight: 400,
              color: prefersDarkMode ? '#76E9A6' : '#004346',
            },
            subtitle1: {
              lineHeight: 1.2,
            },
          },
          components: {
            MuiButton: {
              defaultProps: {
                variant: 'contained',
              },
              styleOverrides: {
                root: {
                  textTransform: 'none',
                  fontWeight: 700,
                },
              },
            },
            MuiLink: {
              styleOverrides: {
                root: {
                  textDecoration: 'none',
                  color: 'inherit',
                  fontWeight: 700,
                },
              },
            },
            MuiTextField: {
              defaultProps: {
                InputLabelProps: {
                  shrink: true,
                },
              },
            },
            MuiDialogActions: {
              styleOverrides: {
                root: {
                  padding: 24,
                },
              },
            },
            MuiDialog: {
              styleOverrides: {
                paper: {
                  width: '100%',
                },
              },
            },
            MuiTableSortLabel: {
              styleOverrides: {
                icon: {
                  opacity: 1,
                },
              },
            },
          },
        })
      ),
    [prefersDarkMode]
  )

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
