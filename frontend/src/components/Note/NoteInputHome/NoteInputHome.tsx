import React from 'react';
import './NoteInputHome.css';

interface NoteInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  placeholder: string;
}

const NoteInput: React.FC<NoteInputProps> = ({ placeholder, ...props }) => {
  return (
    <div className="note-container">
      <div className="note-bubbles">
        <div className="bubble"></div>
        <div className="bubble"></div>
        <div className="bubble"></div>
      </div>
      <textarea
        className="note-input"
        placeholder={placeholder}
        {...props}
      />

    </div>
  );
};

export default NoteInput;
