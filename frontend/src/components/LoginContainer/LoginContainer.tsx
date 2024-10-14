import React from 'react';
import { Box } from '@mui/material';

const LoginContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      sx={{
        backgroundColor: 'white',
        width: '30rem',
        height: '20rem',
        borderRadius:'2rem'
      }}
    >
      {children}
    </Box>
  );
};

export default LoginContainer;
