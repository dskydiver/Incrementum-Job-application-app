import { Snackbar, Alert } from '@mui/material'

interface SnackbarAlertProps {
  open: boolean
  onClose: () => void
  message: string
  severity: 'error' | 'success' | 'info' | 'warning'
}

export default function SnackbarAlert(props: SnackbarAlertProps) {
  const { open, onClose, message, severity } = props
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        variant='filled'
        sx={{ minWidth: 220, marginBottom: 6 }}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}
