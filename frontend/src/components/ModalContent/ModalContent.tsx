import './ModalContent.css';
import { Note } from '../../contexts/NotesContext';
import React from 'react';

interface ModalContentProps {
  open: boolean;
  onClose: () => void;
  note: Note;
  onSave: (updatedNote: Note) => void;
}
const ModalContent: React.FC<ModalContentProps> = ({ open, onClose, note, onSave }) => {

  return (
    <></>
  )
};

export default ModalContent;