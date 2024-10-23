import './NoteCardList.css';
import { Box } from "@mui/material";
import { AspectRatio, Card, CardOverflow, Typography } from '@mui/joy';
import { DescriptionOutlined } from '@mui/icons-material';

import { useEffect, useRef, useState } from 'react';
import { Note, useNotes } from '../../../contexts/NotesContext';
import ToolbarCard from '../../ToolbarCard/ToolbarCard';
import NoteModal from '../NoteModal/NoteModal';
import { Loader, LoadIA } from '../../Loader/Loader';
import ImageCard from '../NoteImage/NoteImage';
import VideoLink from '../../VideoLink/VideoLink';
import { UpdateNoteRequest } from '../../../api/notesApi';


const NoteCard: React.FC<Note> = ({ ...note }) => {
  /* console.log("note no notecrdlist", note); */
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notes, updateNote, archiveNote, softDeleteNote, deleteNote, processStatus } = useNotes();
  const [loaderStatus, setLoaderStatus] = useState<string>('');


  /* useEffect(() => {
    console.log("loading status", note.status)
    setLoaderStatus(note.status);
  }, [note]); */



  //~const toggleHover = () => setIsHovered(!isHovered);


  const toggleHover = () => setIsHovered(prev => !prev);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleUpdateNote = (id: string, fields: UpdateNoteRequest) => updateNote(id, fields);
  const handleSoftDeleteNote = (noteToSoftDelete: Note) => softDeleteNote(noteToSoftDelete.id);
  const handleArchiveNote = (noteToArchive: Note) => archiveNote(noteToArchive.id);

  useEffect(() => {
    for (const ps of processStatus) {
      if (ps.noteId === note.id) {
        console.log("777", ps)
        setLoaderStatus(ps.status);
      }
    }
  }, [processStatus]);



  const darkTheme = true;

  return (
    <>
      <Box
        className="note-card-component"
        onMouseEnter={toggleHover}
        onMouseLeave={toggleHover}
        onClick={handleOpenModal}
        sx={{ backgroundColor: "#fefcff" }}
      >


        <ImageCard images={note.images} />
        <VideoLink urls={note.urls} />

        <Box>
          <Typography className="card-title" level="title-md" padding={"12px 12px 0 12px"}
            sx={{
              /*               outline: "none",
                            whiteSpace: "pre-wrap",
                            wordWrap: "break-word", */
              display: '-webkit-box',
            }}
          >{note.title}</Typography>
        </Box>

        <Box sx={{ overflow: 'hidden' }}>
          <Typography className="note-card-content" level="body-md" padding={"12px 12px"}
            sx={{
              /*   outline: "none",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word" */
            }}
          >{note.content}</Typography>
        </Box>
        {true && (
          <Box className="note-toolbar"
            sx={{
              padding: "0 12px",
              display: "flex",
              justifyContent: "space-between",
              visibility: isHovered ? "visible" : "hidden",
            }}>
            <ToolbarCard note={{ ...note }} onDelete={handleSoftDeleteNote} onArchive={handleArchiveNote} />
            <Box>

            </Box>

          </Box>
        )}
        {/* <Loader className={loaderStatus} title={loaderStatus} /> */}
        <LoadIA status={loaderStatus} />
      </Box>

      <NoteModal
        open={isModalOpen}
        onClose={handleCloseModal}
        note={{ ...note }}
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

  const sortedNoteList = notes.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
  const darkTheme = true
  return (

    <Box className="note-card-list-component"
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
        <Box className="card-list"
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
          {sortedNoteList.map(item => ( //TODO: voltar o sortedNoteList / notes
            <NoteCard
              key={item.id}
              id={item.id}
              title={item.title}
              content={item.content}
              status={item.status}
              images={item.images}
              urls={item.urls}
              is_in_trash={item.is_in_trash}
              is_in_archive={item.is_in_archive}
              created_at={item.created_at}
              updated_at={item.updated_at}
              created_by={item.created_by}
            />
          ))}
        </Box>

      }
    </Box>
  );
};

export default NoteCardList;
