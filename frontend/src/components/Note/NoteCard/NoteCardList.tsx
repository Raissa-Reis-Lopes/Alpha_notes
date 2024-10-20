import './NoteCardList.css';
import { Box } from "@mui/material";
import { Typography } from '@mui/joy';
import { DescriptionOutlined } from '@mui/icons-material';
import { useRef, useState } from 'react';
import { Note, useNotes } from '../../../contexts/NotesContext';
import ToolbarCard from '../../ToolbarCard/ToolbarCard';
import NoteModal from '../NoteModal/NoteModal';
import Loader from '../../Loader/Loader';

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  date: string;
  archived: boolean;
  metadata: object;
  status: 'processing' | 'completed' | 'failed';
}
const NoteCard: React.FC<NoteCardProps> = ({ id, title, content, date, archived, metadata, status }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notes, updateNote, archiveNote, softDeleteNote, deleteNote } = useNotes();

  const toggleHover = () => setIsHovered(!isHovered);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleUpdateNote = (updatedNote: Note) => updateNote(updatedNote.id, updatedNote);
  //const handleArchiveNote = (noteToArchive: Note) => archiveNote(noteToArchive.id);
  //const handleSoftDeleteNote = (noteToSoftDelete: Note) => softDeleteNote(noteToSoftDelete.id);
  const handleDeleteNote = (noteToDelete: Note) => deleteNote(noteToDelete.id);

  const darkTheme = true;
  return (
    <>
      <Box className="note-card-component"
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
        onClick={handleOpenModal}
        sx={{ backgroundColor: `${darkTheme ? "#fefcff" : "inital"}` }}
      >

        <Box>
          <Typography level="title-md" padding={"12px 12px 0 12px"}
            sx={{
              outline: "none",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word"
            }}
          >{title}</Typography>
        </Box>

        <Box>
          <Typography level="body-md" padding={"12px 12px"}
            sx={{
              outline: "none",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word"
            }}
          >{content}</Typography>
        </Box>
        {true && (
          <Box className="note-toolbar"
            sx={{
              padding: "0 12px",
              display: "flex",
              justifyContent: "space-between",
              visibility: isHovered ? "visible" : "hidden",
            }}>
            <ToolbarCard note={{ id, title, content, date, archived, metadata, status }} onDelete={handleDeleteNote} />
            <Box>

            </Box>
          </Box>
        )}
        <Loader className={status} title={status} />
      </Box>

      {/* Modal de Edição */}
      <NoteModal
        open={isModalOpen}
        onClose={handleCloseModal}
        note={{ id, title, content, date, archived, metadata, status }}
        onSave={handleUpdateNote}
        onDelete={handleDeleteNote}
      />

    </>
  );
};

interface NoteCardListProps {
  notes: Note[];
}

const NoteCardList: React.FC<NoteCardListProps> = ({ notes }) => {

  const sortedNoteList = notes.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const darkTheme = true;
  return (
    <Box className="NoteCardListComponent"
      sx={{ borderColor: `${darkTheme ? "#828282" : "#e0e0e0"}` }}>
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
              metadata={item.metadata}
              status={item.status}
            />
          ))}
        </Box>

      }
    </Box>
  );
};

export default NoteCardList;