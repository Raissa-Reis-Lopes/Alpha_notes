import './NoteModal.css';
import { Box, Button, Card, CardContent, CardOverflow, Divider, Input, Modal, Textarea } from "@mui/joy";
import { useEffect, useState } from 'react';
import { Note } from '../../../contexts/NotesContext';
import { ModalDialog } from '@mui/joy';
import { Transition } from 'react-transition-group';
import React from 'react';
import ToolbarCard from '../../ToolbarCard/ToolbarCard';

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  note: Note | null;
  onSave: (updatedNote: Note) => void;
  onDelete: (noteToDelete: Note) => void;
  onArchive: (noteToArchive: Note) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ open, onClose, note, onSave, onDelete, onArchive }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSave = () => {
    if (note) {
      onSave({
        ...note,
        title,
        content,
      });
      onClose();
    }
  };

  const handleClose = () => {
    onClose();
  };

  if (!note) {
    return null; // ou retornar um componente de loading ou mensagem de erro
  }

  return (
    <Transition in={open} timeout={400}>
      {(state: string) => (
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          slotProps={{
            backdrop: {
              sx: {
                opacity: 0,
                backdropFilter: 'none',
                transition: `opacity 400ms, backdrop-filter 400ms`,
                ...{
                  entering: { opacity: 1 },
                  entered: { opacity: 1 },
                }[state],
              },
            },
          }}
          sx={[
            state === 'exited'
              ? { visibility: 'hidden' }
              : { visibility: 'visible' },
          ]}
        >
          <ModalDialog
            sx={{
              opacity: 0,
              transition: `opacity 300ms`,
              ...{
                entering: { opacity: 1 },
                entered: { opacity: 1 },
              }[state],
              padding: 0,
            }}
          >
            <Card variant="outlined">
              <CardContent>
                <Box>
                  <Input
                    placeholder="Título"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Box>
                <Box>
                  <Textarea
                    minRows={2}
                    variant="outlined"
                    placeholder="Criar nota..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </Box>
              </CardContent>
              <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
                <Divider inset="context" />
                <CardContent orientation="horizontal">
                  <ToolbarCard
                    additionalButtons={[
                      <Button
                        key="close"
                        color="neutral"
                        onClick={handleClose}
                        size="sm"
                        variant="outlined"
                        sx={{ fontSize: "13px" }}
                      >
                        Cancelar
                      </Button>,
                      <Button
                        key="save"
                        color="primary"
                        onClick={handleSave}
                        size="sm"
                        variant="solid"
                        sx={{ fontSize: "13px" }}
                      >
                        Salvar
                      </Button>
                    ]}
                    note={note}
                    onDelete={onDelete}
                    onArchive={onArchive}
                  />
                </CardContent>
              </CardOverflow>
            </Card>
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  );
};

export default NoteModal;
