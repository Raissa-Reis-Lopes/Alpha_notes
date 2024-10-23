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
}
const NoteModal: React.FC<NoteModalProps> = ({ open, onClose, note, onSave, onDelete }) => {
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

  /* const handleBackdropClick = () => {
    if (title !== note?.title || content !== note?.content) {
      handleSave();
    } else {
      onClose();
    }
  }; */

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
          /*  component="div"  */// Adiciona a propriedade component
          keepMounted
          /* open={!['exited', 'exiting'].includes(state)} */
          /*   onClose={() => setOpen(false)} */
          open={open}
          onClose={handleClose} // Utilize onClose
          slotProps={{
            backdrop: {
              sx: {
                opacity: 0,
                backdropFilter: 'none',
                transition: `opacity 400ms, backdrop-filter 400ms`,
                ...{
                  entering: { opacity: 1/* , backdropFilter: 'blur(8px)' */ },
                  entered: { opacity: 1/* , backdropFilter: 'blur(8px)' */ },
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

            {/* Componente isolado */}
            <Card variant="outlined" /* sx={{ width: 320 }} */>

              {/* TODO: Implementar quando for adicionar imagens */}
              {/*       
                <CardOverflow>
                  <AspectRatio ratio="2">
                    <img
                      src="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318"
                      srcSet="https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=318&dpr=2 2x"
                      loading="lazy"
                      alt=""
                    />
                  </AspectRatio>
                </CardOverflow> 
                */}
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
                    disabled={false}
                    minRows={2}
                    variant="outlined"
                    placeholder="Criar nota..."
                    /*  onFocus={handleFocus} */
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

                        sx={{
                          fontSize: "13px"
                        }}
                      >Cancelar</Button>,
                      <Button
                        key="save"
                        color="primary"
                        onClick={handleSave}
                        size="sm"
                        variant="solid"

                        sx={{
                          fontSize: "13px"
                        }}
                      >Salvar</Button>
                    ]}
                    note={note}
                    onDelete={onDelete}
                  />
                </CardContent>
              </CardOverflow>
            </Card>
          </ModalDialog>
        </Modal>
      )}
    </Transition>
  )
};

export default NoteModal;