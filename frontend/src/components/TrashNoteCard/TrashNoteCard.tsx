import './TrashNoteCard.css'; // Você pode criar um arquivo CSS específico se necessário
import { Box, Button } from "@mui/material";
import { Typography } from '@mui/joy';
import { Note, useNotes } from '../../contexts/NotesContext';

interface TrashNoteCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  archived: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

const TrashNoteCard: React.FC<TrashNoteCardProps> = ({ id, title, content, date, archived, status }) => {
  const { restoreNote, deleteNote } = useNotes();

  const handleRestore = () => {
    restoreNote(id, true); // Função para restaurar a nota
  };

  const handleDelete = () => {
    deleteNote(id); // Função para deletar permanentemente
  };

  return (
    <Box className="trash-note-card-component" sx={{ backgroundColor: "#fefcff", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <Typography level="title-md">{title}</Typography>
      <Typography level="body-md">{content}</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
        <Button variant="contained" color="primary" onClick={handleRestore}>Restaurar</Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>Deletar Permanentemente</Button>
      </Box>
    </Box>
  );
};

export default TrashNoteCard;
