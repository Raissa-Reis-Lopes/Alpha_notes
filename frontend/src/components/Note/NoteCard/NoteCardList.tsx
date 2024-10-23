import './NoteCardList.css';
import { Box } from "@mui/material";
import { Typography } from '@mui/joy';
import { DescriptionOutlined } from '@mui/icons-material';
import { useState } from 'react';
import { Note, useNotes } from '../../../contexts/NotesContext';
import ToolbarCard from '../../ToolbarCard/ToolbarCard';
import NoteModal from '../NoteModal/NoteModal';
import Loader from '../../Loader/Loader';

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { id, title, content, date, archived, metadata, status } = note;
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { updateNote, softDeleteNote, archiveNote } = useNotes();

  const toggleHover = () => setIsHovered(prev => !prev);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleUpdateNote = (updatedNote: Note) => updateNote(updatedNote.id, updatedNote);
  const handleSoftDeleteNote = (noteToSoftDelete: Note) => softDeleteNote(noteToSoftDelete.id);
  const handleArchiveNote = (noteToArchive: Note) => archiveNote(noteToArchive.id);

  return (
    <>
      <Box
        className="note-card-component"
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
        onClick={handleOpenModal}
        sx={{ backgroundColor: "#fefcff" }}
      >
        <Typography level="title-md" sx={{ p: 2, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {title}
        </Typography>

        <Typography level="body-md" sx={{ p: 2, whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {content}
        </Typography>

        {isHovered && (
          <Box className="note-toolbar" sx={{ padding: "0 12px", display: "flex", justifyContent: "space-between" }}>
            <ToolbarCard
              note={note}
              onDelete={handleSoftDeleteNote}
              onArchive={handleArchiveNote}
            />
          </Box>
        )}
        <Loader className={status} title={status} />
      </Box>

      <NoteModal
        open={isModalOpen}
        onClose={handleCloseModal}
        note={note}
        onSave={handleUpdateNote}
        onDelete={handleSoftDeleteNote}
        onArchive={handleArchiveNote}
      />
    </>
  );
};

interface NoteCardListProps {
  notes: Note[];
}

const NoteCardList: React.FC<NoteCardListProps> = ({ notes }) => {
  const sortedNoteList = notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!notes || notes.length === 0) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", marginTop: "10vh" }}>
        <DescriptionOutlined sx={{ fontSize: "100px", opacity: "0.1" }} />
        <Typography sx={{ fontSize: "24px", color: "#5f6368" }}>Nenhuma anotação encontrada.</Typography>
      </Box>
    );
  }

  return (
    <Box className="NoteCardListComponent" sx={{ display: "flex", flexDirection: 'row', flexWrap: 'wrap', gap: "16px" }}>
      {sortedNoteList.map(item => (
        <NoteCard key={item.id} note={item} />
      ))}
    </Box>
  );
};

export default NoteCardList;
