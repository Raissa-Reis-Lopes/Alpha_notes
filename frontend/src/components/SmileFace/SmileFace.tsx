import React from 'react';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledSmile = styled(motion.img)(({ theme }) => ({
  position: 'absolute',
}));

interface SmileFaceProps {
  src: string;
  alt: string;
  size: string;
  top: string;
  left: string;
  initialScale?: number;
  animateScale?: number;
  transitionDuration?: number;
  transitionDelay?: number;
}

const SmileFace: React.FC<SmileFaceProps> = ({
  src,
  alt,
  size,
  top,
  left,
  initialScale = 0,
  animateScale = 1,
  transitionDuration = 0.5,
  transitionDelay = 0,
}) => {
  return (
    <StyledSmile
      src={src}
      alt={alt}
      style={{ width: size, top, left }}
      initial={{ scale: initialScale }}
      animate={{ scale: animateScale }}
      transition={{ duration: transitionDuration, delay: transitionDelay }}
    />
  );
};

export default SmileFace;
