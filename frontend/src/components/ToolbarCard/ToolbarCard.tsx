import './ToolbarCard.css';
import React from 'react';
import { Box, Dropdown, Menu, IconButton, MenuButton, MenuItem } from "@mui/joy";
import { PhotoOutlined, PaletteOutlined, LinkOutlined, ArchiveOutlined, MoreVert } from '@mui/icons-material';
import { Note } from '../../contexts/NotesContext';

interface ToolbarCardProps {
  additionalButtons?: React.ReactNode[];
  note: Note;
  onDelete: (noteToDelete: Note) => void;
  onArchive: (noteToArchive: Note) => void; // Prop para arquivar
}

const ToolbarCard: React.FC<ToolbarCardProps> = ({ note, onDelete, onArchive }) => {
  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Box sx={{ display: "flex", gap: "8px", alignItems: "end" }}>
      <IconButton onClick={() => onArchive(note)}>
        <ArchiveOutlined fontSize="small" sx={{ color: "#0000008a" }} />
      </IconButton>
      <IconButton onClick={handleButtonClick}>
        <PhotoOutlined fontSize="small" sx={{ color: "#0000008a" }} />
      </IconButton>

      <IconButton /* onClick={} aria-controls={} */ onClick={handleButtonClick}>
        <LinkOutlined fontSize="small" sx={{ color: "#0000008a" }} />

      </IconButton>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'plain' } }}
          sx={{ color: "#0000008a" }}
          onClick={handleButtonClick}
        >
          <MoreVert />
        </MenuButton>
        <Menu disablePortal>
          <MenuItem onClick={() => onDelete(note)}>Excluir nota</MenuItem>
          <MenuItem>Adicionar marcador</MenuItem>
          <MenuItem>Fazer uma cópia</MenuItem>
        </Menu>
      </Dropdown>
    </Box>
  );
};

export default ToolbarCard;
