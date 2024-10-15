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
    archiveNote: (id: string) => void;
    softDeleteNote: (id: string) => void;
    deleteNote: (id: string) => void;

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

    const archiveNote = (id: string) => {
        setNotes(notes.map(note => {
            if (note.id === id) {
                return { ...note, archived: !note.archived };
            }
            return note;
        }));
    };

    const softDeleteNote = (id: string) => {
        /* setNotes(notes.map(note => {
            if (note.id === id) {
                return {...note, deleted: true };
            }
            return note;
        })); */
    };

    const deleteNote = (id: string) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    return (
        <NotesContext.Provider value={{ notes, createNote, updateNote, archiveNote, softDeleteNote, deleteNote }}>
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
