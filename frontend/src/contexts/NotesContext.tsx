import React, { createContext, useContext, useState } from 'react';

interface Note {
    id: string;
    title: string;
    content: string;
    date: string;
    archived: boolean;
}

interface NotesContextType {
    notes: Note[];
    //createNote: (note: Partial<Note>) => void;
    createNote: (note: Note) => void;
    updateNote: (id: string, updatedNoteData: Partial<Note>) => void;
    removeNote: (id: string) => void;

}

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>([
        /* {
            id: '1',
            title: 'Teste 1',
            content: 'Conteúdo do teste 1',
            date: new Date(),
            archived: false,
        } */
    ]);

    const createNote = (note: Note) => {
        setNotes([...notes, note]);
    };

    const updateNote = (id: string, updatedNoteData: Partial<Note>) => {
        setNotes(notes.map(note => {
            if (note.id === id) {
                return { ...note, ...updatedNoteData };
            }
            return note;
        }));
    };

    const removeNote = (id: string) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    return (
        <NotesContext.Provider value={{ notes, createNote, updateNote, removeNote }}>
            {children}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};

export type { Note }
