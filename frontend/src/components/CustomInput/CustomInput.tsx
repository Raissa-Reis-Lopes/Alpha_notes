import React, { forwardRef } from 'react';
import './CustomInput.css';

interface CustomInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(({ type, placeholder, value, onChange }, ref) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      ref={ref}
      className="custom-input"
    />
  );
});

CustomInput.displayName = 'CustomInput'; 

export default CustomInput;
