import './TrashNoteCard.css';
import { Box } from "@mui/material";
import { Typography } from '@mui/joy';
import { Note, useNotes } from '../../contexts/NotesContext';
import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import RestoreFromTrashOutlinedIcon from '@mui/icons-material/RestoreFromTrashOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

const TrashNoteCard: React.FC<Note> = ({ id, title, content }) => {
  const { restoreNote, deleteNote } = useNotes();
  const [isHovered, setIsHovered] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    if (isRestoring) return; 
    setIsRestoring(true);
    try {
      await restoreNote(id, true);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleDelete = () => {
    deleteNote(id);
  };

  return (
    <Box
      className="trash-note-card-component"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ backgroundColor: "#fefcff" }}
    >
      <Box>
        <Typography className="card-title" level="title-md" padding={"12px 12px 0 12px"}
          sx={{ display: '-webkit-box' }}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ overflow: 'hidden' }}>
        <Typography className="trash-note-card-content" level="body-md" padding={"12px 12px"}
          sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {content}
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
            <RestoreFromTrashOutlinedIcon
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

export default TrashNoteCard;
