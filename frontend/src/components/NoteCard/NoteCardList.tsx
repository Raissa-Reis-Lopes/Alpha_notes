import './NoteCardList.css';
import { Box } from "@mui/material";
import { Input, Textarea, Button, Typography } from '@mui/joy';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import VideoCallOutlinedIcon from '@mui/icons-material/VideoCallOutlined';
import { DeleteOutlineOutlined, DescriptionOutlined } from '@mui/icons-material';
import { useEffect, useRef, useState } from 'react';
import { Note, useNotes } from '../../contexts/NotesContext';

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  archived: boolean;
}
const NoteCard: React.FC<NoteCardProps> = ({ id, title, content, date, archived }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const toggleHover = () => {
    setIsHovered(!isHovered); // Expande ao focar no textarea
  };

  return (
    <Box className="NoteCardComponent"
      onMouseEnter={toggleHover}
      onMouseLeave={toggleHover}>

      <Box>
        <Typography level="title-md" padding={"12px 12px 0 12px"}>{title}</Typography>
      </Box>

      <Box>
        <Typography level="body-md" padding={"12px 12px"}>{content}</Typography>
      </Box>
      {true && (
        <Box className="note-toolbar"
          sx={{
            padding: "0 12px",
            display: "flex",
            justifyContent: "space-between",
            visibility: isHovered ? "visible" : "hidden",
          }}>
          <Box sx={{ display: "flex", gap: "8px", alignItems: "end" }}>
            <PhotoOutlinedIcon fontSize="small" sx={{ color: '#0000008a' }} />
            <PaletteOutlinedIcon fontSize="small" sx={{ color: '#0000008a' }} />
            <VideoCallOutlinedIcon fontSize="small" sx={{ color: '#0000008a' }} />
            <span>{date}</span> {/* temporário */}
            <span>{`Arquivado: ${archived}`}</span> {/* temporário */}
          </Box>
          <Box>

          </Box>
        </Box>
      )}
    </Box>
  );
};

interface NoteCardListProps {
  notes: Note[];
}

const NoteCardList: React.FC<NoteCardListProps> = ({ notes }) => {

  // Ordena o array por data (mais recente para o mais antigo)
  const sortedNoteList = notes.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <Box className="NoteCardListComponent">
      {!notes || notes.length === 0 ?
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginTop: "10vh"
        }}>
          <DescriptionOutlined sx={{ fontSize: "100px", opacity: "0.1" }} />
          <Typography sx={{ fontSize: "24px", color: "#5f6368" }}>Nenhuma anotação encontrada.</Typography>
        </Box>
        :
        <Box
          sx={{
            /* display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignItems: "flex-start",
            maxWidth: "100vw",
            gap: "16px", */
            /* overflowY: "auto", */

            display: "flex",
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: "16px",
          }}>
          {sortedNoteList.map(item => (
            <NoteCard
              key={item.id}
              id={item.id}
              title={item.title}
              content={item.content}
              date={(new Date(item.date).toLocaleString())}
              archived={item.archived}
            />
          ))}
        </Box>

      }
    </Box>
  );
};

export default NoteCardList;