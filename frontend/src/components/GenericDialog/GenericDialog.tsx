import * as React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DeleteForever from '@mui/icons-material/DeleteForever';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';

interface GenericDialogProps {
  dialogTitle: string;
  dialogContent: string;
  onSubmit: () => void;
}

const GenericDialog: React.FC<GenericDialogProps> = ({ dialogTitle, dialogContent, onSubmit }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="danger"
        endDecorator={<DeleteForever />}
        onClick={() => setOpen(true)}
      >
        Discard
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>
            <WarningRoundedIcon />
            {dialogTitle}
          </DialogTitle>
          <Divider />
          <DialogContent>
            {dialogContent}
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={() => { setOpen(false); onSubmit(); }}>
              Excluir
            </Button>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
