// src/components/NoteBox/NoteBox.tsx

import React from 'react';
import { Box } from '@mui/material';
import './NoteBox.css';

interface NoteBoxProps {
  children: React.ReactNode;
}

const NoteBox: React.FC<NoteBoxProps> = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ textAlign: 'center', width: '100%' }}
    >
      <p className='text'>Faça seu login!</p>
      {children}
    </Box>
  );
};

export default NoteBox;
