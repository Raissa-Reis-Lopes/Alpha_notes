import './NoteInputV2.css';
import { Box } from "@mui/material";
import { Input, Textarea, Button, IconButton } from '@mui/joy';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';

import { useEffect, useRef, useState } from 'react';
import { useNotes } from '../../../contexts/NotesContext';

interface UploadedImage {
  id: string;
  note_id?: string,
  filename: string;
  status?: string;
  description?: string;
  nameref: string;
}

const NoteInput: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { notes, createNote } = useNotes();
  //const [images, setImages] = useState<string[]>([]);
  //const [images, setImages] = useState<File[]>([]);
  const [images, setImages] = useState<(string | File)[]>([]);
  const [uploadedImages, setUploadedImages] = useState<Set<UploadedImage>>(new Set());

  const handleFocus = () => {
    setIsExpanded(true);
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setImages([]);
    setIsExpanded(false);
  };

  const handleSave = () => {
    if (title.trim() || content.trim() || images.length > 0) {
      createNote({
        title: title.trim(),
        content: content.trim(),
        /* images: images, */ // Adiciona as imagens ao objeto da nota
      });

      setTitle('');
      setContent('');
      setImages([]);
      setIsExpanded(false);
    }
  };


  const handleAddImages = async (files: FileList) => {
    const newImages = Array.from(files);

    // Atualiza o estado com as novas imagens
    setImages((prevImages) => [...prevImages, ...newImages]);

    // Envia cada nova imagem para o backend
    for (const image of newImages) {
      if (!hasImage(image.name)) {
        const data: UploadedImage = await uploadImage(image);
        data.nameref = image.name;
        uploadedImages.add(data); // Marca como enviado
        console.log('images', images);
        console.log('uploadedImages', uploadedImages);
      }
    }
  };

  const hasImage = (nameref: string) => {
    return Array.from(uploadedImages).some((image) => image.nameref === nameref);
  };


  async function uploadImage(image: File) {
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:3001/api/image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Imagem enviada com sucesso:', data);
        return data;
      } else {
        console.error('Erro ao enviar imagem:', response.statusText);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  /* const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // Aqui pode ser null
    if (files) { // Verifica se files não é null
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prevImages => [...prevImages, ...imageUrls]);
    }
  }; */

  /* const handlePasteArea = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const clipboardItems = event.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setImages(prevImages => [...prevImages, imageUrl]);
        }
      }
    }
  };

  const handlePasteInput = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const clipboardItems = event.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setImages(prevImages => [...prevImages, imageUrl]);
        }
      }
    }
  }; */

  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData.items;
    const files: File[] = [];

    // Processar itens colados
    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Verifica se o item é um arquivo de imagem
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length > 0) {
      // Adicionar as imagens coladas ao estado de imagens
      setImages((prevImages) => [...prevImages, ...files]);

      for (const image of files) {
        if (!hasImage(image.name)) {
          const data: UploadedImage = await uploadImage(image);
          data.nameref = image.name;
          uploadedImages.add(data); // Marca como enviado
          console.log('images', images);
          console.log('uploadedImages', uploadedImages);
        }
      }
    }
  };


  /*  const handleRemoveImage = (index: number) => {
     setImages(images.filter((_, i) => i !== index));
   }; */
  const handleRemoveImage = (imageToRemove: string | File) => {

    handleRemoveUploadedImage(imageToRemove);

    setImages((prevImages) => prevImages.filter((image) => {
      if (typeof image === 'string') {
        return image !== imageToRemove;
      } else {
        return image.name !== (imageToRemove as File).name;
      }
    }));
  };

  const handleRemoveUploadedImage = (imageToRemove: string | File) => {
    setUploadedImages((prevUploadedImages) => {
      const newSet = new Set(prevUploadedImages);

      if (typeof imageToRemove === 'string') {
        newSet.forEach((image) => {
          if (image.nameref === imageToRemove) {
            newSet.delete(image); // Remover o objeto correspondente
          }
        });
      } else {
        newSet.forEach((image) => {
          if (image.nameref === imageToRemove.name) {
            newSet.delete(image); // Remover o objeto correspondente
          }
        });
      }

      return newSet;
    });
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      if (isExpanded) {
        handleSave();
      }

      setTitle('');
      setContent('');
      setImages([]);
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    return
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, title, content, images]);

  function consoleimage() {
    console.log("console images", images);
    console.log("console imagesuploaded", uploadedImages);
  }

  return (
    <Box className="NoteInputComponent" ref={containerRef}>
      {isExpanded && (
        <Box>
          <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onPaste={handlePaste}
          /* onPaste={handlePasteInput} */

          />
        </Box>
      )}
      <Box>
        <Textarea
          disabled={false}
          minRows={2}
          variant="outlined"
          placeholder="Criar nota..."
          onFocus={handleFocus}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onPaste={handlePaste}
        /*   slotProps={{
            textarea: { onPaste: handlePasteArea },
          }} */
        /*   slotProps={{
            textarea: { onPaste: handlePasteArea },
          }} */
        />
      </Box>
      {isExpanded && (
        <>
          {images.length > 0 && (
            <Box sx={{
              display: 'flex', flexWrap: 'wrap', marginTop: 2, backgroundColor: "#fbfcfe",
              borderRadius: "4px", p: "2px", gap: '2px'
            }}>
              {images.map((image, index) => (
                <Box key={index} sx={{ position: 'relative', /* marginRight: 1, marginBottom: 1 */ }}>
                  {/* <img className='upload-image' src={image.url} alt={`Preview ${index}`} */}
                  {/* <img className='upload-image' src={URL.createObjectURL(image)} alt={`Preview ${index}`} */}
                  <img className='upload-image' src={typeof image === "string" ? image : URL.createObjectURL(image)} alt={`Preview ${index}`}
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: "4px" }} />
                  <IconButton
                    /* variant="outlined" */
                    color="neutral"
                    //onClick={() => handleRemoveImage(index)}
                    onClick={() => handleRemoveImage(image)}
                    sx={{
                      position: 'absolute', top: "3px", right: "3px", borderRadius: "3px", backgroundColor: "#f0f4f84f",
                      ":hover": {
                        backgroundColor: "#ff0000", //#f0f4f84f
                        color: "white",
                      }, width: "24px", height: "24px", minWidth: "0", minHeight: "0",
                    }}

                  ><DeleteIcon sx={{ fontSize: "16px" }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
          <Box className="note-toolbar" sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: "8px", alignItems: "end" }}>
              <input
                accept="image/*"
                id="image-upload"
                type="file"
                multiple
                //onChange={handleAddImages}
                onChange={(e) => {
                  if (e.target.files) {
                    handleAddImages(e.target.files);
                  }
                }}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload">
                <PhotoOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
              </label>
              <PaletteOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
              <VideoCallOutlinedIcon onClick={consoleimage} fontSize="small" sx={{ color: 'white' }} />
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


/* {images.length > 0 && (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', marginTop: 2 }}>
    {images.map((image, index) => (
      <Box key={index} sx={{ position: 'relative', marginRight: 1, marginBottom: 1 }}>

        {typeof image === 'object' && 'url' in image ? (
          <img src={image.url} alt={`Preview ${index}`} style={{ width: 100, height: 100, objectFit: 'cover' }} />
        ) : null}
        <Button
          variant="outlined"
          color="danger"
          onClick={() => handleRemoveImage(index)}
          sx={{ position: 'absolute', top: 0, right: 0 }}
        >X</Button>
      </Box>
    ))}
  </Box>
)} */