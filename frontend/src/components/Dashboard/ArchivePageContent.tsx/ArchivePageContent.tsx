import './ArchivePageContent.css';
import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useUser } from '../../../contexts/UserContext';
import NoteInput from '../../Note/NoteInput/NoteInput';
import NoteCardList from '../../Note/NoteCard/NoteCardList';
import { Note, useNotes } from '../../../contexts/NotesContext';
import { CssBaseline } from '@mui/joy';
import NoteInputV2 from '../../Note/NoteInputV2/NoteInputV2';


interface ArchivePageContentProps {
  drawerOpen: boolean;
  drawerWidth: number;
  miniDrawerWidth: number;
  appBarHeight: number
  miniAppBarHeight: number;
}

const ArchivePageContent: React.FC<ArchivePageContentProps> = ({ drawerOpen, drawerWidth, miniDrawerWidth, appBarHeight, miniAppBarHeight }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const currentAppBarHeight = isMobile ? miniAppBarHeight : appBarHeight;
  const calculatedMarginLeft = drawerOpen ? drawerWidth : miniDrawerWidth;

  const { user } = useUser();
  const [archivedNotes, setArchivedNotes] = useState<Note[]>([]);

  /* useEffect(() => {
    if (!user) return;

    (async function fetchNotes() {
      try {
        const notes = await getAllNotes();
      } catch (error) {
        console.error('Erro ao buscar notas:', error);
      }
    }());
  }, [user]); */

  return (
    <Box
      className='archive-page-content'
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        p: 3,
        marginTop: `${currentAppBarHeight + 10}px`,
        marginLeft: `${calculatedMarginLeft}px`,
        /* marginLeft: "60px", */
        transition: 'margin-left 0.3s ease, margin-top 0.3s ease',
        gap: "32px"
      }}
    >
      <p>Notas arquivadas!</p>
      <Box sx={{ display: "flex", alignItems: "start", width: "100%" }}>
        <NoteCardList notes={archivedNotes} />
      </Box>
    </Box>
  )
};

export default ArchivePageContent;
