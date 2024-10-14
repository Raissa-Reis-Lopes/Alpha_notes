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

interface NoteInputProps {
  any: any;
}

const NoteInput: React.FC<NoteInputProps> = ({ any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { notes, createNote } = useNotes();

  const handleFocus = () => {
    setIsExpanded(true); // Expande ao focar no textarea
    console.log('click hadle', isExpanded);
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setIsExpanded(false); // Esconde os elementos adicionais
  };

  const handleClickOutside = (event: MouseEvent) => {
    console.log("0");
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      console.log("1");
      if (isExpanded) {
        console.log("2");
        if (title.trim() || content.trim()) { // Verifica se há conteúdo na nota
          console.log("3");
          createNote({
            id: uuidv4(),
            title: title.trim(),
            content: content.trim(),
            //date: (new Date().getTime()).toString(),
            date: new Date().toISOString(),
            archived: false,
          });
        }
      }




      setTitle('');
      setContent('');
      setIsExpanded(false); // Fecha se clicar fora da Box principal
    }
  };

  useEffect(() => {
    // Adiciona o listener para detectar cliques fora
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Remove o listener ao desmontar o componente
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, title, content]);

  /*   useEffect(() => {
      if (isExpanded) {
        console.log("cria");
        createNote({
          id: uuidv4(),
          title,
          content,
          date: (new Date().getTime()).toString(),
          archived: false,
        })
        console.log("notes", notes);
      }
      console.log('Click outside', isExpanded);
  
  
    }, [isExpanded]); */


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
          <Box>
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
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default NoteInput;