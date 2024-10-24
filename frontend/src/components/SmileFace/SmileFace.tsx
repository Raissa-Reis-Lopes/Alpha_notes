import React from 'react';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledSmile = styled(motion.img)<{
  size: string;
  top: string;
  left: string;
}>(({ size, top, left }) => ({
  position: 'absolute',
  width: size,
  height: size,
  // Garantir que a posição top e left não ultrapassem a tela
  top: `min(${top}, calc(100vh - ${size}))`,
  left: `min(${left}, calc(100vw - ${size}))`,
  maxWidth: '100vw',
  maxHeight: '100vh',
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
      size={size}
      top={top}
      left={left}
      initial={{ scale: initialScale }}
      animate={{ scale: animateScale }}
      transition={{ duration: transitionDuration, delay: transitionDelay }}
    />
  );
};

export default SmileFace;




// import React from 'react';
// import { styled } from '@mui/material/styles';
// import { motion } from 'framer-motion';

// const StyledSmile = styled(motion.img)(({ theme }) => ({
//   position: 'absolute',
// }));

// interface SmileFaceProps {
//   src: string;
//   alt: string;
//   size: string;
//   top: string;
//   left: string;
//   initialScale?: number;
//   animateScale?: number;
//   transitionDuration?: number;
//   transitionDelay?: number;
// }

// const SmileFace: React.FC<SmileFaceProps> = ({
//   src,
//   alt,
//   size,
//   top,
//   left,
//   initialScale = 0,
//   animateScale = 1,
//   transitionDuration = 0.5,
//   transitionDelay = 0,
// }) => {
//   return (
//     <StyledSmile
//       src={src}
//       alt={alt}
//       style={{ width: size, top, left }}
//       initial={{ scale: initialScale }}
//       animate={{ scale: animateScale }}
//       transition={{ duration: transitionDuration, delay: transitionDelay }}
//     />
//   );
// };

// export default SmileFace;
