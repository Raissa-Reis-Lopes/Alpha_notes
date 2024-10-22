
import { Box } from "@mui/material";
import { DescriptionOutlined } from '@mui/icons-material';
import { Typography } from '@mui/joy';
import TrashNoteCard from '../TrashNoteCard/TrashNoteCard';
import { Note, useNotes } from '../../contexts/NotesContext';

interface TrashNoteListProps {
  notes: Note[];
}

const TrashNoteList: React.FC<TrashNoteListProps> = ({ notes }) => {
  return (
    <Box className="trash-note-list-component">
      {!notes || notes.length === 0 ? (
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: "10vh"
        }}>
          <DescriptionOutlined sx={{ fontSize: "100px", opacity: "0.1" }} />
          <Typography sx={{ fontSize: "24px", color: "#5f6368" }}>Nenhuma anotação encontrada na lixeira.</Typography>
        </Box>
      ) : (
        <Box sx={{
          display: "flex",
          flexDirection: 'column',
          gap: "16px",
        }}>
          {notes.map(item => (
            <TrashNoteCard
              key={item.id}
              id={item.id}
              title={item.title}
              content={item.content}
              date={(new Date(item.date).toLocaleString())}
              archived={item.archived}
              metadata={item.metadata}
              status={item.status}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TrashNoteList;
