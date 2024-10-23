import React from 'react';
import { Box } from '@mui/material';

interface HomeContainerProps {
  children: React.ReactNode;
  width?: string; 
  height?: string;
}

const HomeContainer: React.FC<HomeContainerProps> = ({ 
  children, 
  width = '30rem',
  height = '20rem' 
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="50vh"
      width="100vw" 
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={width}
        height={height}
        borderRadius="2rem"
        bgcolor="transparent" 
      >
        {children}
      </Box>
    </Box>
  );
};

export default HomeContainer;
