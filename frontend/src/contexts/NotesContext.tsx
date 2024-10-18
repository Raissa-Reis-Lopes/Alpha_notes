import React, { createContext, useContext, useEffect, useState } from 'react';
import { createNoteApi, deleteNoteApi, getAllNotesApi, updateNoteApi } from '../api/notesApi';
import request, { requestOptions } from '../utils/request';
import { webSocketService } from '../services/WebSocketService';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  archived: boolean;
  status: 'processing' | 'completed' | 'failed';
}

interface NotesContextType {
  notes: Note[];
  //createNote: (note: Partial<Note>) => void;
  getAllNotes: () => void;
  createNote: (note: Partial<Note>) => void;
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



  useEffect(() => {
    // Conecta ao WebSocket ao montar o contexto
    webSocketService.connect();

    // Callback para lidar com mensagens recebidas do WebSocket
    webSocketService.registerCallback('note-status', (data) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === data.noteId ? { ...note, status: data.status } : note
        )
      );
    });

    return () => {
      // Desconecta do WebSocket ao desmontar o contexto
      webSocketService.disconnect();
    };
  }, []);


  const getAllNotes = async () => {
    const { data, error } = await getAllNotesApi();
    if (error) {
      console.log(error);
      return error;
    }

    //Testando CSS
    const nn = data as Note[];

    nn.push({
      id: '1',
      title: 'Teste 1',
      content: 'Conteúdo do teste 1',
      date: new Date().toISOString(),
      archived: false,
      status: 'processing'
    })

    if (data) {
      setNotes(data as Note[]);
      console.log("Successfully got all notes", data);
    }
  };

  const createNote = async (note: Partial<Note>) => {
    const { data, error } = await createNoteApi({ title: note.title, content: note.content });
    if (error) {
      console.log(error);
      return error;
    }

    if (data) {
      const newNote: Note = { ...data, status: 'processing' }; // Define status inicial como 'processing'
      setNotes([...notes, newNote]);
      console.log("Successfully created", data);
    }
  };

  const updateNote = async (id: string, updatedNoteData: Partial<Note>) => {
    const { data, error } = await updateNoteApi({ id, note: updatedNoteData });
    if (error) {
      console.log(error);
      return error;
    }

    if (data) {
      setNotes(notes.map(note => {
        if (note.id === id) {
          return { ...note, ...data };
        }
        return note;
      }));
      console.log("Successfully updated", data);
    }
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

  const deleteNote = async (id: string) => {
    const { error } = await deleteNoteApi({ id });
    if (error) {
      console.log(error);
      return error;
    }

    setNotes(notes.filter(note => note.id !== id));
    console.log("Successfully deleted", id);
  };

  return (
    <NotesContext.Provider value={{ notes, getAllNotes, createNote, updateNote, archiveNote, softDeleteNote, deleteNote }}>
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
