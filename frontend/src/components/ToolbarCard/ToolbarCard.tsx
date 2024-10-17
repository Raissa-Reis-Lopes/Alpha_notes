import './ToolbarCard.css';
import React from 'react';
import { Box, Dropdown, Menu, IconButton, MenuButton, MenuItem } from "@mui/joy";
import { PhotoOutlined, PaletteOutlined, VideoCallOutlined, ArchiveOutlined, MoreVert } from '@mui/icons-material';
import { Note } from '../../contexts/NotesContext';

interface ToolbarCardProps {
  additionalButtons?: React.ReactNode[];
  note: Note;
  onDelete: (noteToDelete: Note) => void;
}

const ToolbarCard: React.FC<ToolbarCardProps> = ({ note, onDelete, additionalButtons }) => {
  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Box sx={{ display: "flex", gap: "8px", alignItems: "end" }}>
      {/*     
      <PhotoOutlined fontSize="small" sx={{ color: "#0000008a" }} />
      <PaletteOutlined fontSize="small" sx={{ color: "#0000008a" }} />
      <VideoCallOutlined fontSize="small" sx={{ color: "#0000008a" }} />
      <ArchiveOutlined fontSize="small" sx={{ color: "#0000008a" }} /> 
      */}
      <IconButton  /* onClick={} aria-controls={} */ onClick={handleButtonClick}>
        <PhotoOutlined fontSize="small" sx={{ color: "#0000008a" }} />
      </IconButton>
      <IconButton /* onClick={} aria-controls={} */ onClick={handleButtonClick}>
        <PaletteOutlined fontSize="small" sx={{ color: "#0000008a" }} />
      </IconButton>
      <IconButton /* onClick={} aria-controls={} */ onClick={handleButtonClick}>
        <VideoCallOutlined fontSize="small" sx={{ color: "#0000008a" }} />
      </IconButton>
      <IconButton /* onClick={} aria-controls={} */ onClick={handleButtonClick}>
        <ArchiveOutlined fontSize="small" sx={{ color: "#0000008a" }} />
      </IconButton>
      <Dropdown >
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'plain' } }}
          sx={{ color: "#0000008a" }}
          onClick={handleButtonClick}
        >
          <MoreVert />
        </MenuButton>
        <Menu disablePortal >
          {/* TODO: Implementar dialog modal e mudar o softDeleteNote */}
          <MenuItem onClick={() => onDelete(note)}>Excluir nota</MenuItem>
          <MenuItem>Adicionar marcador</MenuItem>
          <MenuItem>Fazer uma cópia</MenuItem>
        </Menu>
      </Dropdown>
      {additionalButtons}
    </Box>
  )
};

export default ToolbarCard;

