import './NoteInputV2.css';
import { Box, CardMedia, createTheme } from "@mui/material";
import { Input, Textarea, Button, IconButton, Card, CardContent, Typography, Link, ThemeProvider } from '@mui/joy';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Note, useNotes } from '../../../contexts/NotesContext';
import { deleteImageApi, uploadImageApi } from '../../../api/imagesApi';
import { Menu as MenuIcon, LinkOutlined, Add, Send } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import { IUrl } from '../../../interface/url';
import { deleteUrlApi, uploadUrlApi } from '../../../api/urlsApi';
import { extractYoutubeId } from '../../../utils/utils';
interface UploadedImage {
  id: string;
  note_id?: string;
  filename: string;
  status?: string;
  description?: string;
  nameref: string;
}

const theme = {
  components: {
    JoyInput: {
      styleOverrides: {
        root: {
          border: '2px solid #00bf74', // Cor do contorno padrão
          borderRadius: '4px', // Adicionando um pouco de arredondamento
          '&:hover': {
            border: '2px solid #00bf74', // Cor do contorno ao passar o mouse
          },
          '&.Mui-focused': {
            border: '2px solid #00bf74', // Cor do contorno ao focar
          },
          '&.Mui-error': {
            border: '2px solid #00bf74', // Cor do contorno em caso de erro
          },
          '&:focus': {
            border: '2px solid #00bf74 ', // Cor do contorno ao focar
            boxShadow: 'none', // Remover o efeito de sombra padrão
          },
        },
      },
    },
  },
};

const NoteInput: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  //const contImageRef = useRef<HTMLDivElement | null>(null);
  //const contUrlRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { createNote } = useNotes();
  const [images, setImages] = useState<(string | File)[]>([]);
  //const [urls, setUrls] = useState<string[]>([]);
  const [urls, setUrls] = useState<IUrl[]>([]);
  //'https://www.youtube.com/watch?v=s_IwrqvM618', 'https://www.youtube.com/watch?v=s_IwrqvM618', 'https://www.youtube.com/watch?v='
  const [uploadedImages, setUploadedImages] = useState<Set<UploadedImage>>(new Set());
  const [openInputUrl, setOpenInputUrl] = useState<boolean>(false);
  const inputUrlRef = useRef<HTMLInputElement>(null);
  const [newUrl, setNewUrl] = useState('');
  //const [isScrollVisible, setIsScrollVisible] = useState(false);
  //const [isImageScrollVisible, setImageIsScrollVisible] = useState(false);
  //const [isUrlScrollVisible, setUrlIsScrollVisible] = useState(false);

  const handleFocus = () => setIsExpanded(true);

  const handleClose = () => {

    setTitle('');
    setContent('');
    setImages([]);
    setUrls([]);
    setNewUrl('');
    setUploadedImages(new Set());
    setIsExpanded(false);
  };

  const handleSave = useCallback(async () => {
    if ((title.trim() && content.trim())/*  || images.length > 0 */) {
      const uploadedImagesArray = Array.from(uploadedImages);

      const createdNote: Note | null = await createNote({ title: title.trim(), content: content.trim(), images: uploadedImagesArray, urls: urls });

      if (createdNote && createdNote.urls) { // Remove imagens do array após criar nota
        const createdUrlIds = createdNote.urls.map((url) => url.id);
        const updatedUrls = urls.filter((url) => !createdUrlIds.includes(url.id));
        setUrls(updatedUrls);
        console.log("updatedUrls: ", updatedUrls)
      }

      handleClose();
      setImages([]);
      setUploadedImages(new Set());
      setUrls([]);
    }
  }, [title, content, images, urls, createNote, uploadedImages]);


  function isUploadedImage(image: string | File | UploadedImage): image is UploadedImage {
    return (image as UploadedImage).id !== undefined;
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
      //setImages((prevImages) => [...prevImages, ...renamedImages]);
    }
  };

  const handleRemoveImage = async (imageToRemove: string | File) => {
    const uploadedImage = Array.from(uploadedImages).find((image) => {
      if (typeof imageToRemove === 'string') {
        return image.nameref === imageToRemove;
      } else if (imageToRemove instanceof File) {
        return image.nameref === imageToRemove.name;
      }
      return false;
    });

    if (uploadedImage) {
      const { success, error } = await deleteImageApi(uploadedImage.id); // Função que fará a remoção no backend

      if (error) {
        console.log(error);
        return;
      }

      if (success) {
        console.log("Successfully deleted image");
        handleRemoveUploadedImage(imageToRemove);

        setImages((prevImages) => prevImages.filter((image) =>
          typeof image === 'string' ? image !== imageToRemove : image.name !== (imageToRemove as File).name
        ));
      }
    }
  };

  const handleRemoveUploadedImage = (imageToRemove: string | File) => {
    setUploadedImages((prevUploadedImages) => {
      const newSet = new Set(prevUploadedImages);
      newSet.forEach((image) => {
        if (typeof imageToRemove === 'string' && image.nameref === imageToRemove) {
          newSet.delete(image);
        } else if (imageToRemove instanceof File && image.nameref === imageToRemove.name) {
          newSet.delete(image);
        }
      });
      return newSet;
    });
  };

  const deleteAllImages = () => {
    uploadedImages.forEach(async (image) => {
      if (!image.id) return

      const { error } = await deleteImageApi(image.id)
      if (error) {
        console.log(error);
        return;
      }
    })
  }








  /* const handleClickOutside = useCallback((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      if (isExpanded) handleSave();
      handleClose();
    }
  }, [isExpanded, handleSave]); */

  /* useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]); */

  /* useEffect(() => {
    const handleScrollCheck = () => {
      if (containerRef.current) {
        const hasScroll = containerRef.current.scrollHeight > containerRef.current.clientHeight;
        setIsScrollVisible(hasScroll);
      }
    };

    // Check scroll on mount and when videos change
    handleScrollCheck();
    window.addEventListener('resize', handleScrollCheck);

    return () => window.removeEventListener('resize', handleScrollCheck);
  }, [urls]); */

  /* useEffect(() => {
    const handleScrollCheck = () => {
      if (contUrlRef.current) {
        setUrlIsScrollVisible(contUrlRef.current.scrollHeight > contUrlRef.current.clientHeight);
      }
      if (contImageRef.current) {
        setImageIsScrollVisible(contImageRef.current.scrollHeight > contImageRef.current.clientHeight);
      }
    };

    handleScrollCheck();
    window.addEventListener('resize', handleScrollCheck);

    return () => window.removeEventListener('resize', handleScrollCheck);
  }, [images, urls]); */

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
    } else {
      //TODO: Notificação de vídeo repetido
      setNewUrl('');
    }
    setNewUrl('');
    setOpenInputUrl(false);

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
      setUrls((prevUrls) => prevUrls.filter((urlObj) => urlObj.id !== urlId));
    }
  };

  const deleteAllUrls = () => {
    urls.forEach(async (url) => {
      if (!url.id) return

      const { error, success } = await deleteUrlApi({ id: url.id });

      if (error) {
        console.log(error);
        return;
      }
    })
  }


  /* const extractYoutubeId = (url: string) => {
    // Primeiro, garantir que a URL comece com http/https para evitar problemas
    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith('http')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    // Expressões regulares para diferentes formatos de URL do YouTube
    const regExpPatterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i,
    ];

    for (const pattern of regExpPatterns) {
      const match = formattedUrl.match(pattern);
      if (match && match[1]) {
        return match[1]; // Retorna o ID do vídeo se encontrado
      }
    }

    return null; // Retorna null se não for uma URL válida do YouTube
  }; */



  function consoleimage() {
    console.log("image", images);
    console.log("uploadedimages", uploadedImages);
  }

  const darkTheme = true;
  return (
    <Box className="NoteInputComponent" ref={containerRef}>
      {isExpanded && (
        <Box>
          <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onPaste={handlePaste}
          />
        </Box>
      )}
      <Box>
        <Textarea
          minRows={2}
          variant="outlined"
          placeholder="Criar nota..."
          onFocus={handleFocus}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
        />
      </Box>
      {isExpanded && (
        <>
          {images.length > 0 && (
            <Box className="scrollable" //ref={contImageRef}
              sx={{
                maxHeight: 300, overflowY: 'auto',
                //pr: isImageScrollVisible ? 1 : 0,
                mb: 1
              }}>
              <Box
                sx={{
                  display: 'flex', flexWrap: 'wrap', marginTop: 2, backgroundColor: "#fbfcfe",
                  borderRadius: "8px", p: "2px", gap: '2px',

                }}>

                {images.map((image, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img
                      className='upload-image'
                      src={typeof image === "string" ? image : URL.createObjectURL(image)}
                      alt={`Preview ${index}`}
                      style={{
                        width: 100, height: 100, objectFit: 'cover', borderRadius: "4px",
                        border: '1px solid gainsboro'
                      }}
                    />
                    <IconButton
                      color="neutral"
                      onClick={() => handleRemoveImage(image)}
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
          {urls.length > 0 && (
            <Box className="scrollable" //ref={contUrlRef} //Monitorar se a reutilização desse ref causará problemas
              sx={{
                maxHeight: 200, overflowY: 'auto',
                //pr: isUrlScrollVisible ? 1 : 0,

              }}>
              {urls.map((url) => (
                <Card key={url.id} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', p: 1, mb: 1 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', bgcolor: '#e7ebf0', borderRadius: '4px', gap: 1, width: '100%' }}>
                    <CardMedia
                      component="img"
                      image={`https://img.youtube.com/vi/${extractYoutubeId(url.url)}/hqdefault.jpg`}
                      alt={url.title}
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
                        }}>{url.title}</Typography>
                        <Typography sx={{ fontSize: 11, color: '#00a162' }}>
                          {url.url}
                        </Typography>
                      </Link>
                    </CardContent>
                    <IconButton
                      color="neutral"
                      onClick={() => handleRemoveUrl(url.id)}
                      sx={{
                        //position: 'absolute', top: "3px", right: "3px",
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

          <Box sx={{
            display: `${openInputUrl ? 'flex' : 'none'}`, gap: 1
          }}>
            <ThemeProvider theme={theme}>
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
                  <PhotoOutlinedIcon />
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
                startDecorator={<DeleteOutlineOutlinedIcon fontSize="small" />}
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
      )}
    </Box>
  );
};

export default NoteInput;
