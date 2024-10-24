import './NoteModal.css';
import { Box, Button, Card, CardContent, IconButton, Input, Link, Modal, Textarea, ThemeProvider, Typography } from "@mui/joy";
import { useCallback, useEffect, useRef, useState } from 'react';
import { Note, useNotes } from '../../../contexts/NotesContext';
import { ModalDialog } from '@mui/joy';
import { Transition } from 'react-transition-group';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { CardMedia } from '@mui/material';
import { extractYoutubeId } from '../../../utils/utils';
import { deleteUrlApi, uploadUrlApi } from '../../../api/urlsApi';
import { IUrl } from '../../../interface/url';
import { DeleteOutlineOutlined, LinkOutlined, PhotoOutlined } from '@mui/icons-material';
import { deleteImageApi, uploadImageApi } from '../../../api/imagesApi';
import { inputBorder } from '../../../styles/Components';
import { UpdateNoteRequest } from '../../../api/notesApi';

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  note: Note;
  onSave: (id: string, fields: UpdateNoteRequest) => void;
  onDelete: (noteToDelete: Note) => void;
  onArchive: (noteToArchive: Note) => void;
}


interface UploadedImage {
  id: string;
  note_id?: string;
  filename: string;
  status?: string;
  description?: string;
  nameref: string;
}

const NoteModal: React.FC<NoteModalProps> = ({ open, onClose, note, onSave, onDelete, onArchive }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);



  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { getAllNotes } = useNotes();
  const [images, setImages] = useState<(string | File)[]>([]);
  const [urls, setUrls] = useState<IUrl[]>([]);
  const [uploadedImages, setUploadedImages] = useState<Set<UploadedImage>>(new Set());

  const [openInputUrl, setOpenInputUrl] = useState<boolean>(false);
  const inputUrlRef = useRef<HTMLInputElement>(null);
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, []);

  const handleClose = () => {
    //setTitle('');
    //setContent('');
    //setImages([]);
    //setUrls([]);
    setUploadedImages(new Set());
    setNewUrl('');
    setIsExpanded(false);
    setOpenInputUrl(false);
    onClose();
  };

  const handleSave = () => {
    let updatedFields: UpdateNoteRequest = {};

    if (title !== note.title) {
      updatedFields.title = title;
    }
    if (content !== note.content) {
      updatedFields.content = content;
    }
    onSave(note.id, updatedFields);
    handleClose();
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
              backgroundColor: "#371C44",
              p: '8px',
              width: '100%',
              minWidth: '400px',
              maxWidth: '580px',
              maxHeight: '480px',
              boxShadow: '0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.4);'
            }}
          >


            <>
              {/* Images */}
              {note.images && note.images.length > 0 && (
                <Box className="scrollable" //ref={contImageRef}
                  sx={{
                    maxHeight: 400, overflowY: 'auto',
                    //pr: isImageScrollVisible ? 1 : 0,
                  }}>
                  <Box
                    sx={{
                      display: 'flex', flexWrap: 'wrap', backgroundColor: "#210f2999",
                      borderRadius: "8px", p: "2px", gap: '2px',
                      boxShadow: 'inset 1px 1px 0px black;'

                    }}>

                    {note.images.map((image) => (
                      <Box key={image.id} sx={{ position: 'relative' }}>
                        <img
                          className='upload-image'
                          src={"http://localhost:3001/" + image.filename}
                          //src={typeof image === "string" ? todoimage : URL.createObjectURL(todoimage)}
                          alt={`Preview ${image.id}`}
                          style={{
                            width: 100, height: 100, objectFit: 'cover', borderRadius: "4px",
                            border: '1px solid gainsboro'
                          }}
                        />
                        <IconButton
                          color="neutral"
                          onClick={() => handleDeleteImage(image.id)}
                          sx={{
                            position: 'absolute', top: "3px", right: "3px",
                            borderRadius: "3px", backgroundColor: "#f0f4f84f",
                            ":hover": { backgroundColor: "#ff0000", color: "white" },
                            width: "24px", height: "24px", minWidth: "0", minHeight: "0",
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: "16px" }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Youtube URL*/}
              {note.urls && note.urls.length > 0 && (
                <Box className="scrollable" ////ref={contUrlRef} //Monitorar se a reutilização desse ref causará problemas
                  sx={{
                    maxHeight: 200, overflowY: 'auto',
                    ////pr: isUrlScrollVisible ? 1 : 0,

                  }}>
                  {note.urls.map((url) => (
                    <Card key={url.id} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 1, mb: 1 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', bgcolor: '#e7ebf0', borderRadius: '4px', gap: 1, width: '100%' }}>
                        <CardMedia
                          component="img"
                          image={`https://img.youtube.com/vi/${extractYoutubeId(url.url)}/hqdefault.jpg`}
                          alt={"Lorem Ipsum - Título aqui - urls.title"}
                          sx={{ width: 80, height: 45 }}
                        />
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', p: 1, overflow: 'hidden' }}>
                          <Link
                            href={url.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden',
                              fontSize: 12, textDecoration: 'none', color: 'black', '&:hover': { textDecoration: 'underline' }
                            }}
                          >
                            <Typography sx={{
                              fontSize: 13, textWrap: 'nowrap', overflow: 'hidden',
                              fontWeight: 'bold'
                            }}>{"Lorem Ipsum - Título aqui - urls.title"}</Typography>
                            <Typography sx={{ fontSize: 11, color: '#00a162' }}>
                              {url.url}
                            </Typography>
                          </Link>
                        </CardContent>
                        <IconButton
                          color="neutral"
                          onClick={() => handleRemoveUrl(url.url)}
                          sx={{
                            ////position: 'absolute', top: "3px", right: "3px",
                            borderRadius: "3px", backgroundColor: "#f0f4f84f",
                            ":hover": { backgroundColor: "#ff0000", color: "white" },
                            width: "24px", height: "24px", minWidth: "0", minHeight: "0", mr: '12px'
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: "16px" }} />
                        </IconButton>
                      </Box>
                    </Card>
                  ))}
                </Box>
              )}

              {/* Title and Content */}
              <Box>
                <Input
                  placeholder="Título"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onPaste={handlePaste}
                />
              </Box>
              <Box>
                <Textarea
                  minRows={2}
                  variant="outlined"
                  placeholder="Criar nota..."
                  //onFocus={handleFocus}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onPaste={handlePaste}
                />
              </Box>

              {/* Upload URL */}
              <Box sx={{
                display: `${openInputUrl ? 'flex' : 'none'}`, gap: 1
              }}>
                <ThemeProvider theme={inputBorder}>
                  <Input
                    placeholder="URL"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    ref={inputUrlRef}
                    sx={{
                      width: '100%',
                    }}
                  />
                </ThemeProvider>
                <IconButton variant="soft" color="primary" size="sm" onClick={handleAddUrl} sx={{ padding: '4px 8px' }}>
                  OK
                </IconButton>
              </Box>

              {/* Toolbar and Buttons */}
              <Box className="note-toolbar" sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", gap: "6px", alignItems: "end" }}>
                  <input
                    accept="image/*"
                    id="image-upload"
                    type="file"
                    multiple
                    onChange={(e) => e.target.files && handleAddImages(e.target.files)}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="image-upload">
                    <IconButton component="span" sx={{ color: `${darkTheme ? 'white' : 'initial'}` }} >
                      <PhotoOutlined />
                    </IconButton>
                  </label>
                  <IconButton onClick={handleOpenInputUrl} component="span" sx={{ color: `${darkTheme ? 'white' : 'initial'}` }} >
                    <LinkOutlined />
                  </IconButton>
                </Box>
                <Box sx={{ display: "flex", gap: "8px" }}>
                  <Button
                    color="neutral"
                    onClick={handleClose}
                    size="sm"
                    variant="soft"
                    startDecorator={<DeleteOutlineOutlined fontSize="small" />}
                    sx={{ fontSize: "13px" }}
                  >Fechar</Button>
                  <Button
                    key="save"
                    color="neutral"
                    onClick={handleSave}
                    size="sm"
                    variant="soft"
                    sx={{ fontSize: "13px" }}
                  >Salvar</Button>
                </Box>
              </Box>
            </>


            {/* <Card variant="outlined" //</ModalDialog>sx={{ width: 320 }} >
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

                   //  onFocus={handleFocus}

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
            </Card> */}
          </ModalDialog>
        </Modal>
      )
      }
    </Transition >
  )
};

export default NoteModal;
