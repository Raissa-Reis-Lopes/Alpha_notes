import React, { createContext, useContext, useEffect, useState } from 'react';
import { createNoteApi, deleteNoteApi, getAllNotesApi, searchNotesByQueryApi, updateNoteApi } from '../api/notesApi';
import { useWebSocket } from './WebSocketContext';
import { IUrl } from '../interface/url';
import { IImage } from '../interface/image';

interface Note {
  id: string;
  title: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  images: IImage[];
  urls: IUrl[];
  is_in_trash: boolean;
  is_in_archive: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: string;
}

interface ProcessStatus {
  noteId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

interface NotesContextType {
  notes: Note[];
  searchedNotes: Note[];
  processStatus: ProcessStatus[];
  setSearchedNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  getAllNotes: () => void;
  searchNotesByQuery: (query: string) => void;
  createNote: (note: Partial<Note>) => void;
  updateNote: (id: string, updatedNoteData: Partial<Note>) => void;
  archiveNote: (id: string) => void;
  softDeleteNote: (id: string) => void;
  deleteNote: (id: string) => void;
}

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchedNotes, setSearchedNotes] = useState<Note[]>([]);
  const [processStatus, setProcessStatus] = useState<ProcessStatus[]>([]);
  const [notes, setNotes] = useState<Note[]>([
    /* {
        id: '1',
        title: 'Teste 1',
        content: 'Conteúdo do teste 1',
        date: new Date(),
        archived: false,
    } */
  ]);

  const { webSocketService, socketId } = useWebSocket();

  useEffect(() => {
    webSocketService.registerCallback('processing', (data) => {
      //console.log(`PROCESSANDO: ${JSON.stringify(data)}`);
      console.log(`PROCESSANDO: ${data}`);

      const datas = JSON.stringify(data.noteId);
      console.log("processing datas", datas);

      /* setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === data.id ? { ...note, status: 'processing' } : note
        )
      ); */
      setProcessStatus((prevStatus) => [
        ...prevStatus,
        { noteId: data.noteId, status: 'processing' }
      ]);
    });

    webSocketService.registerCallback('completed', (data) => {
      //console.log(`COMPLETOU: ${JSON.stringify(data)}`);
      console.log(`COMPLETOU: ${data}`);

      const datas = JSON.stringify(data);
      console.log("completed datas", datas);

      /* setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === data.id ? { ...note, status: 'completed' } : note
        )
      ); */
      setProcessStatus((prevStatus) => [
        ...prevStatus,
        { noteId: data.noteId, status: 'completed' }
      ]);
    });

  }, [webSocketService]);

  const searchNotesByQuery = async (query: string) => {
    const { data, error } = await searchNotesByQueryApi({ query: query });

    if (error) {
      console.log(error);
      return error;
    }

    if (data) {
      setSearchedNotes(data as Note[]);
      console.log("Successfully searched notes by query", data);
    }
  };


  const getAllNotes = async () => {
    const { data, error } = await getAllNotesApi();
    if (error) {
      console.log(error);
      return error;
    }
    console.log("xxxxxxxxx", data);
    //Testando CSS
    const x = data as Note[];

    x.push({
      id: '1',
      title: 'Teste 1',
      content: 'Conteúdo do teste 1',
      status: 'processing',
      images: [],
      urls: [],
      is_in_trash: false,
      is_in_archive: false,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'User Teste'
    })

    if (data) {
      setNotes(data as Note[]);
      console.log("Successfully got all notes", data);
    }
  };

  const createNote = async (note: Partial<Note>) => {
    if (!socketId) {
      console.log("Socket ID não encontrado, não posso enviar o createNote");
      return;
    }
    console.log("X:", note);
    const { data, error } = await createNoteApi({

      title: note.title, content: note.content, images: note.images, urls: note.urls
    }, socketId);

    if (error) {
      console.log(error);
      return error;
    }

    if (data) {
      /* const newNote: Note = { ...data, status: 'processing' }; */ // Define status inicial como 'processing'
      setNotes([...notes, data]);
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
    /* setNotes(notes.map(note => {
      if (note.id === id) {
        return { ...note, archived: !note.archived };
      }
      return note;
    })); */
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
    <NotesContext.Provider value={{ notes, searchedNotes, processStatus, setSearchedNotes, getAllNotes, searchNotesByQuery, createNote, updateNote, archiveNote, softDeleteNote, deleteNote }}>
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
