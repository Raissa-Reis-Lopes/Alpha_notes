import './NoteInput.css';
import { Box } from "@mui/material";
import { Input, Textarea, Button } from '@mui/joy';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useEffect, useRef, useState } from 'react';
import { useNotes } from '../../contexts/NotesContext';
import { v4 as uuidv4 } from 'uuid';

const NoteInput: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { notes, createNote } = useNotes();

  const handleFocus = () => {
    setIsExpanded(true); // Expande ao focar no textarea
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setIsExpanded(false); // Esconde os elementos adicionais
  };

  const handleSave = () => {
    if (title.trim() || content.trim()) {
      createNote({
        title: title.trim(),
        content: content.trim(),
      });

      setTitle('');
      setContent('');
      setIsExpanded(false);
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      if (isExpanded) {
        handleSave();
      }

      setTitle('');
      setContent('');
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, title, content]);

  return (
    <Box className="NoteInputComponent" ref={containerRef}>
      {isExpanded && (
        <Box>
          <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
        />
      </Box>
      {isExpanded && (
        <Box className="note-toolbar"
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}>
          <Box sx={{ display: "flex", gap: "8px", alignItems: "end" }}>
            <PhotoOutlinedIcon fontSize="small" sx={{ color: 'white' }} />
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
              sx={{
                fontSize: "13px"
              }}
            >Fechar</Button>
            <Button
              key="save"
              color="neutral"
              onClick={handleSave}
              size="sm"
              variant="soft"
              sx={{
                fontSize: "13px"
              }}
            >Salvar</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NoteInput;