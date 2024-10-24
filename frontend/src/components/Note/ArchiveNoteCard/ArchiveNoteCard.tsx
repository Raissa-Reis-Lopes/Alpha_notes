import './ArchiveNoteCard.css'; // Crie um arquivo CSS se necessário
import { Box, Button } from "@mui/material";
import { Typography } from '@mui/joy';
import { useNotes } from '../../../contexts/NotesContext';

interface ArchivedNoteCardProps {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

const ArchivedNoteCard: React.FC<ArchivedNoteCardProps> = ({ id, title, content }) => {
  const { restoreNote, deleteNote } = useNotes();

  const handleRestore = () => {
    restoreNote(id, false); // Função para desarquivar a nota
  };

  const handleDelete = () => {
    deleteNote(id); // Função para deletar permanentemente
  };

  return (
    <Box className="archived-note-card-component" sx={{ backgroundColor: "#fefcff", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <Typography level="title-md">{title}</Typography>
      <Typography level="body-md">{content}</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
        <Button variant="contained" color="primary" onClick={handleRestore}>Desarquivar</Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>Excluir Permanentemente</Button>
      </Box>
    </Box>
  );
};

export default ArchivedNoteCard;
