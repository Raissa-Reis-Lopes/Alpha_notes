import React, { useEffect } from 'react';
import { Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import { DescriptionOutlined } from '@mui/icons-material';
import { useUser } from '../../../contexts/UserContext';
import ArchivedNoteCard from '../../Note/ArchiveNoteCard/ArchiveNoteCard'; // Importe o novo componente
import { useNotes } from '../../../contexts/NotesContext';

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
      getAllNotes('archive'); // Sempre busca notas arquivadas quando o usuário está logado
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
    >
      <Box sx={{ display: "flex", alignItems: "start", width: "100%", flexWrap: "wrap", gap: "16px" }}>
        {archivedNotes.length > 0 ? (
          archivedNotes.map(note => (
            <ArchivedNoteCard
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              status={note.status}
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
