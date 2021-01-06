import { Snackbar } from '@material-ui/core';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

type ToastProps = {
  open: boolean;
  message: string;
};

type FormErrorToastProps = {
  toast: ToastProps;
  handleClose: (...args: any[]) => any;
};

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ToastFormError({
  toast,
  handleClose,
}: FormErrorToastProps): JSX.Element {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={5000}
      open={toast.open}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="error">
        {toast.message}
      </Alert>
    </Snackbar>
  );
}
