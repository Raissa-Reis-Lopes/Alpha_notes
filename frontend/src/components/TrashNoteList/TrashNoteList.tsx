import { Box } from "@mui/material";
import TrashNoteCard from '../TrashNoteCard/TrashNoteCard';
import { Note } from '../../contexts/NotesContext';

interface TrashNoteListProps {
  notes: Note[];
}

const TrashNoteList: React.FC<TrashNoteListProps> = ({ notes }) => {
  return (
    <Box className="trash-note-list-component">
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
    </Box>
  );
};

export default TrashNoteList;
