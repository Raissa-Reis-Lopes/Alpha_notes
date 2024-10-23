import './ArchiveNoteCard.css'; // Crie um arquivo CSS se necessário
import { Box, Button } from "@mui/material";
import { Typography } from '@mui/joy';
import { useNotes } from '../../../contexts/NotesContext';

interface ArchivedNoteCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  archived: boolean;
  metadata: object;
  status: 'processing' | 'completed' | 'failed';
}


const ArchivedNoteCard: React.FC<ArchivedNoteCardProps> = ({ id, title, content, date }) => {
  const { restoreNote } = useNotes();

  const handleRestore = () => {
    restoreNote(id, false); // Função para desarquivar a nota
  };

  return (
    <Box className="archived-note-card-component" sx={{ backgroundColor: "#fefcff", padding: "16px", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
      <Typography level="title-md">{title}</Typography>
      <Typography level="body-md">{content}</Typography>
      <Typography level="body-sm" sx={{ color: "gray", marginTop: "8px" }}>{date}</Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "16px" }}>
        <Button variant="contained" color="primary" onClick={handleRestore}>Desarquivar</Button>
      </Box>
    </Box>
  );
};

export default ArchivedNoteCard;
