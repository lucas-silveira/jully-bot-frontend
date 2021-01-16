import { forwardRef } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';

type DefaultDialogProps = {
  open: boolean;
  handleClose: (...args: any[]) => any;
  handleSubmit: (...args: any[]) => any;
  appId: number;
  appTitle: string;
  loading: boolean;
};

const Transition = forwardRef(function Transition(
  props: TransitionProps,
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function AppRemoveDialog({
  open,
  handleClose,
  handleSubmit,
  appId,
  appTitle,
  loading,
}: DefaultDialogProps): JSX.Element {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      transitionDuration={{
        enter: 500,
        exit: 500,
      }}
      keepMounted
      onClose={handleClose}
      aria-labelledby="app-install-dialog-title"
      aria-describedby="app-install-dialog-description"
    >
      <DialogTitle id="app-install-dialog-title">
        Remover aplicativo {appTitle}?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="app-install-dialog-description">
          Ao confirmar, você removerá o aplicativo da sua conta. Após a remoção,
          o aplicativo não estará mais disponível.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {loading ? (
          <Button>
            <CircularProgress size={20} />
          </Button>
        ) : (
          <>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSubmit(appId)} color="primary">
              Remover
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
