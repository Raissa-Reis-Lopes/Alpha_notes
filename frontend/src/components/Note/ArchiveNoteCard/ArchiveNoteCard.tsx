import './ArchiveNoteCard.css';
import { Box } from "@mui/material";
import { Typography } from '@mui/joy';
import { useNotes, Note } from '../../../contexts/NotesContext';
import { useState } from 'react';
import ImageCard from '../NoteImage/NoteImage';
import VideoLink from '../../VideoLink/VideoLink';
import UnarchiveOutlinedIcon from '@mui/icons-material/UnarchiveOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Tooltip from '@mui/material/Tooltip';

const ArchivedNoteCard: React.FC<Note> = ({ ...note }) => {
  const { restoreNote, deleteNote } = useNotes();
  const [isHovered, setIsHovered] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    if (isRestoring) return;

    setIsRestoring(true);
    try {
      await restoreNote(note.id, false); 
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDelete = () => {
    deleteNote(note.id);
  };

  return (
    <Box
      className="note-card-component"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ backgroundColor: "#fefcff" }}
    >
      <ImageCard images={note.images} />
      <VideoLink urls={note.urls} />

      <Box>
        <Typography className="card-title" level="title-md" padding={"12px 12px 0 12px"}
          sx={{ display: '-webkit-box' }}
        >
          {note.title}
        </Typography>
      </Box>

      <Box sx={{ overflow: 'hidden' }}>
        <Typography className="note-card-content" level="body-md" padding={"12px 12px"}
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {note.content}
        </Typography>
      </Box>

      <Box className="note-toolbar"
        sx={{
          padding: "0 12px",
          display: "flex",
          visibility: isHovered ? "visible" : "hidden",
          marginLeft: "auto"
        }}
      >
        <Tooltip title="Restaurar Nota">
          <span>
            <UnarchiveOutlinedIcon 
              className='unarchived' 
              onClick={handleRestore} 
              style={{ cursor: isRestoring ? 'not-allowed' : 'pointer', opacity: isRestoring ? 0.5 : 1 }}
            />
          </span>
        </Tooltip>
        <Tooltip title="Excluir permanentemente">
          <span>
            <DeleteForeverOutlinedIcon 
              className='delete' 
              onClick={handleDelete} 
            />
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ArchivedNoteCard;
