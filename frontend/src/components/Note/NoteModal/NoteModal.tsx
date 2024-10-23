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


  const handleReloadNotes = () => {
    getAllNotes();
  }

  const handleAddImages = useCallback(async (files: FileList) => {
    const newImages = Array.from(files);
    setImages((prevImages) => [...prevImages, ...newImages]);

    for (const image of newImages) {
      if (!hasImage(image.name)) {
        const data: UploadedImage | null = await uploadImage(image);
        if (data) {
          data.nameref = image.name;
          setUploadedImages((prev) => new Set(prev).add(data));
        } else {
          // Remover a imagem de images caso o upload falhe
          setImages((prevImages) => prevImages.filter((img) => img !== image));
        }
      }
    }
    setImages([]);
    setUploadedImages(new Set());
    handleReloadNotes();
  }, [uploadedImages]);

  const hasImage = (nameref: string) =>
    Array.from(uploadedImages).some((image) => image.nameref === nameref);

  const uploadImage = async (image: File): Promise<UploadedImage | null> => {
    const { data, error } = await uploadImageApi({ image });
    console.log("data", data, error);
    if (error) {
      console.log(error);
      return null;
    }

    if (data) {
      console.log("Successfully uploaded image", data);
      return data as UploadedImage;
    }

    return null;
  };


  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    const files: File[] = [];

    for (const item of items) {
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }

    if (files.length > 0) {
      const renamedImages: File[] = [];

      for (const image of files) {
        const newName = `${Date.now()}_${image.name}`;
        const renamedFile = new File([image], newName, { type: image.type });
        renamedImages.push(renamedFile);

        if (!hasImage(newName)) {
          const data: UploadedImage | null = await uploadImage(renamedFile);
          if (data) {
            data.nameref = newName
            setUploadedImages((prev) => new Set(prev).add(data));
          } else {
            renamedImages.pop();
          }
        }
      }
      // Atualizar a lista de images apenas com as imagens que foram bem-sucedidas
      setImages((prevImages) => [...prevImages, ...renamedImages.filter(img => !hasImage(img.name))]);
    }
    setImages([]);
    setUploadedImages(new Set());
    handleReloadNotes();
  };

  const handleDeleteImage = async (id: string) => {
    const { success, error } = await deleteImageApi(id);

    if (error) {
      console.log(error);
      return;
    }
    if (success) {
      console.log("Successfully deleted image");
    }
  };


  const handleOpenInputUrl = () => {
    if (inputUrlRef.current) {
      inputUrlRef.current.focus();
    }
    setOpenInputUrl(!openInputUrl);
  }


  const handleAddUrl = useCallback(async () => {
    //const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+$/; //sem shorts
    //const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]+$/;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/)[\w-]+$/;

    const cleanedUrl = newUrl.split('&')[0].trim();

    if (!youtubeRegex.test(cleanedUrl)) return;

    const isUrlAlreadyAdded = urls.some((urlObj) => urlObj.url === cleanedUrl);

    if (!isUrlAlreadyAdded) {
      const data: IUrl | null = await uploadUrl(cleanedUrl);

      if (data) {
        setUrls((prevUrls) => [...prevUrls, data]);
      }
    }
    setNewUrl('');
    setOpenInputUrl(false);

    setUrls([]);
    handleReloadNotes();

  }, [newUrl, urls]);

  const uploadUrl = async (url: string): Promise<IUrl | null> => {
    const { data, error } = await uploadUrlApi({ url: url });

    if (error) {
      console.log(error);
      return null;
    }
    if (data) {
      console.log("Successfully uploaded url", data);
      return data as IUrl;
    }
    return null;
  }

  const handleRemoveUrl = async (urlId: string) => {
    const { success, error } = await deleteUrlApi({ id: urlId });

    if (error) {
      console.log(error);
      return;
    }

    if (success) {
      console.log("Successfully deleted url");
      handleReloadNotes();
    }
  };


  const darkTheme = true;
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
