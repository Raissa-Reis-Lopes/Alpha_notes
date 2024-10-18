import React, { useState } from 'react';
import './CustomButton.css';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  color?: string; 
  hoverColor?: string; 
  margin?: string;
  width?: string; 
}

const CustomButton: React.FC<CustomButtonProps> = ({ 
  children, 
  color = '#8f5bbd',
  hoverColor = '#7e4aad', 
  margin, 
  width,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button 
      className="custom-button" 
      style={{ 
        backgroundColor: isHovered ? hoverColor : color,
        margin,
        width
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
