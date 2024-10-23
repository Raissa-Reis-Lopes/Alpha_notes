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

const NoteInput: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { notes, createNote } = useNotes();
  const [images, setImages] = useState<string[]>([]);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // Aqui pode ser null
    if (files) { // Verifica se files não é null
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prevImages => [...prevImages, ...imageUrls]);
    }
  };

  const handlePasteArea = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
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
  };


  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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

  return (
    <Box className="NoteInputComponent" ref={containerRef}>
      {isExpanded && (
        <Box>
          <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onPaste={handlePasteInput}

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
          slotProps={{
            textarea: { onPaste: handlePasteArea },
          }}
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
                  <img className='upload-image' src={image} alt={`Preview ${index}`}
                    style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: "4px" }} />
                  <IconButton
                    /* variant="outlined" */
                    color="neutral"
                    onClick={() => handleRemoveImage(index)}
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
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <label htmlFor="image-upload">
                <PhotoOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
              </label>
              <PaletteOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
              <VideoCallOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
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
