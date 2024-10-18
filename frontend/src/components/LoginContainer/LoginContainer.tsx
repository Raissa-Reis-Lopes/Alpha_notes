import React from 'react';
import { Box } from '@mui/material';

interface LoginContainerProps {
  children: React.ReactNode;
  width?: string; 
  height?: string;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ 
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
      height="100vh"
      sx={{
        backgroundColor: 'white',
        width: width,
        height: height,
        borderRadius: '2rem',
        boxShadow: 2, 
      }}
    >
      {children}
    </Box>
  );
};

export default LoginContainer;
