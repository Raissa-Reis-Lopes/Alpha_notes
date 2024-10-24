import React, { useEffect } from 'react';
import { Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import { DescriptionOutlined } from '@mui/icons-material';
import { useUser } from '../../../contexts/UserContext';
import ArchivedNoteCard from '../../Note/ArchiveNoteCard/ArchiveNoteCard'; 
import { useNotes } from '../../../contexts/NotesContext';
import  './ArchivePageContent.css';

interface ArchivePageContentProps {
  drawerOpen: boolean;
  drawerWidth: number;
  miniDrawerWidth: number;
  appBarHeight: number;
  miniAppBarHeight: number;
}

const ArchivePageContent: React.FC<ArchivePageContentProps> = ({
  drawerOpen,
  drawerWidth,
  miniDrawerWidth,
  appBarHeight,
  miniAppBarHeight,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const currentAppBarHeight = isMobile ? miniAppBarHeight : appBarHeight;
  const calculatedMarginLeft = drawerOpen ? drawerWidth : miniDrawerWidth;

  const { user } = useUser();
  const { getAllNotes, archivedNotes } = useNotes();

  useEffect(() => {
    if (user) {
      getAllNotes('archive'); 
    }
  }, [user]);



  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 1,
        p: 3,
        marginTop: `${currentAppBarHeight + 10}px`,
        marginLeft: `${calculatedMarginLeft}px`,
        transition: 'margin-left 0.3s ease, margin-top 0.3s ease',
        gap: "32px",
      }}
     
    > <Typography style={{ fontSize: '2.2rem' , fontFamily: 'Fredoka, sans-serif', color: '#8f5bbd', fontWeight: '500'}} gutterBottom>
   - notas arquivadas -
      </Typography>
      <Box sx={{ display: "flex", alignItems: "start", width: "100%", flexWrap: "wrap", gap: "16px" }}>
        {archivedNotes.length > 0 ? (
          archivedNotes.map(note => (
            <ArchivedNoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              status={note.status}
              images={note.images}
              urls={note.urls}
              is_in_archive={note.is_in_archive}
              is_in_trash={note.is_in_trash}
              created_at={note.created_at}
              updated_at={note.updated_at}
              created_by={note.created_by}
            />
          ))
        ) : (
          <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: "10vh"
          }}>
            <DescriptionOutlined sx={{ fontSize: "100px", opacity: "0.1" }} />
            <Typography sx={{ fontSize: "24px", color: "#5f6368", textAlign: "center" }}>Nenhuma anotação encontrada nos arquivos</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ArchivePageContent;
