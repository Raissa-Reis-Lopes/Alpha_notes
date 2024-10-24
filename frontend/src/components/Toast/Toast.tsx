import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Typography from '@mui/material/Typography';

interface ToastProps {
  message: string;
  color?: string;
  isActive: boolean;
}

const ToastContainer = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  bottom: '2rem',
  right: '2rem',
  zIndex: 1000,
  backgroundColor: '#fff', // Cor de fundo do toast
  color: '#333', // Cor de texto padrão
  padding: '1rem 1.5rem',
  borderRadius: '8px',
  boxShadow: 'box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;',
  minWidth: '200px',
  textAlign: 'center',
}));

const Toast: React.FC<ToastProps> = ({ message, color = '#fff', isActive }) => {
  const [showToast, setShowToast] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 3000); 
      return () => clearTimeout(timer); 
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {showToast && (
        <ToastContainer
          initial={{ opacity: 0, y: 50 }} // Começa invisível e fora da tela
          animate={{ opacity: 1, y: 0 }}  // Aparece e sobe suavemente
          exit={{ opacity: 0, y: 50 }}    // Desaparece e desce suavemente
          transition={{ duration: 0.5 }}  // Duração da animação
        >
          <Typography sx={{ color }}>{message}</Typography>
        </ToastContainer>
      )}
    </AnimatePresence>
  );
};

export default Toast;
