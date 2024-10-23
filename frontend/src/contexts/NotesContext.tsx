import React, { createContext, useContext, useEffect, useState } from 'react';
import { createNoteApi, deleteNoteApi, getAllNotesApi, searchNotesByQueryApi, updateNoteApi, moveNoteToTrashApi, restoreFromArchiveApi, restoreFromTrashApi, archiveNoteApi } from '../api/notesApi';
import { useWebSocket } from './WebSocketContext';
import { IUrl } from '../interface/url';
import { IImage } from '../interface/image';
import { GetAllNotesResponse } from '../api/notesApi';

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
  archivedNotes: Note[];
  searchedNotes: Note[];
  setSearchedNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  getAllNotes: (filter?: string) => void;
  searchNotesByQuery: (query: string) => void;
  createNote: (note: Partial<Note>) => void;
  updateNote: (id: string, updatedNoteData: Partial<Note>) => void;
  archiveNote: (id: string) => void;
  softDeleteNote: (id: string) => void;
  deleteNote: (id: string) => void;
  restoreNote: (id: string, fromTrash: boolean) => void;
  trashNotes: Note[];
}

export const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchedNotes, setSearchedNotes] = useState<Note[]>([]);
  const [processStatus, setProcessStatus] = useState<ProcessStatus[]>([]);
  const [trashNotes, setTrashNotes] = useState<Note[]>([]);
  const [archivedNotes, setArchivedNotes] = useState<Note[]>([]);


  const { webSocketService, socketId } = useWebSocket();

  useEffect(() => {
    webSocketService.registerCallback('processing', (data) => {
      console.log(`PROCESSANDO: ${JSON.stringify(data)}`);
    });

    webSocketService.registerCallback('completed', (data) => {
      console.log(`COMPLETOU: ${JSON.stringify(data)}`);
    });
  }, [webSocketService]);

  useEffect(() => {
    const fetchNotes = async () => {
      console.log('Fetching notes...');
      await getAllNotes();
    };
    fetchNotes();
  }, []);


  const getAllNotes = async (filter: string = '') => {
    const { data, error } = await getAllNotesApi(filter);
    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      if (filter === 'trash') {
        setTrashNotes(data as Note[]);
        console.log("Successfully got trash notes", data);
      } else if (filter === 'archive') {
        setArchivedNotes(data as Note[]);
        console.log("Successfully got archived notes", data);
      } else {
        setNotes(data as Note[]); // Este deve ser apenas para notas ativas
        console.log("Successfully got all notes", data);
      }
    }
  };



  const getAllNotes2 = async () => {
    const { data, error } = await getAllNotesApi();
    if (error) {
      console.log(error);
      return error;
    }

    if (data) {
      setNotes(data as Note[]);
      console.log("Successfully got all notes", data);
    }
  }

  const getTrashNotes = async () => {
    await getAllNotes('trash'); // Chama com o filtro de lixo
  };

  const createNote = async (note: Partial<Note>) => {
    if (!socketId) {
      console.log("Socket ID não encontrado, não posso enviar o createNote");
      return;
    }

    const { data, error } = await createNoteApi({
      title: note.title, content: note.content, images: note.images, urls: note.urls
    }, socketId);

    if (error) {
      console.log(error);
      return error;
    }
    if (data) {
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
      setNotes(notes.map(note => (note.id === id ? { ...note, ...data } : note)));
      console.log("Successfully updated", data);
    }
  };


  const archiveNote2 = (id: string) => {
    /* setNotes(notes.map(note => {
      if (note.id === id) {
        return { ...note, archived: !note.archived };
      }
      return note;
    })); */
  };

  const archiveNote = async (id: string) => {
    console.log('Archiving note with ID:', id);
    if (!socketId) {
      console.log("Socket ID não encontrado");
      return;
    }

    const { data, error } = await archiveNoteApi({ id }, socketId);
    if (error) {
      console.log(error);
      return error;
    }

    if (data) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id)); // Remove da lista de notas ativas
      setArchivedNotes(prevArchived => [...prevArchived, data]); // Adiciona à lista de notas arquivadas
      console.log('Nota movida para arquivadas:', data);
    }
  };

  const softDeleteNote = async (id: string) => {
    if (!socketId) {
      console.log("Socket ID não encontrado");
      return;
    }

    const { data, error } = await moveNoteToTrashApi({ id }, socketId);
    if (error) {
      console.log(error);
      return error;
    }

    if (data) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      setTrashNotes(prevTrash => [...prevTrash, data]);
      console.log('Nota movida para o lixo:', data);
    }
  };



  const searchNotesByQuery = async (query: string) => {
    const { data, error } = await searchNotesByQueryApi({ query });
    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      setSearchedNotes(data as Note[]);
      console.log("Successfully searched notes by query", data);
    }
  };


  const deleteNote = async (id: string) => {
    const response = await deleteNoteApi({ id });
    if (!response.error) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      setArchivedNotes(prevArchived => prevArchived.filter(note => note.id !== id));
      setTrashNotes(prevTrash => prevTrash.filter(note => note.id !== id));
    } else {
      console.error(response.error);
    }
  };

  const restoreNote = async (id: string, fromTrash: boolean) => {
    if (!socketId) {
      console.log("Socket ID não encontrado, não posso restaurar a nota");
      return;
    }

    const apiFunction = fromTrash ? restoreFromTrashApi : restoreFromArchiveApi;
    const { data, error } = await apiFunction({ id }, socketId);

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      console.log("Nota restaurada:", data);

      // Adiciona a nota restaurada às notas ativas
      setNotes(prevNotes => [...prevNotes, data]);

      // Remove a nota do lixo
      if (fromTrash) {
        setTrashNotes(prevTrash => {
          const updatedTrash = prevTrash.filter(note => note.id !== id);
          console.log("Notas no lixo após restauração:", updatedTrash);
          return updatedTrash;
        });
      } else {
        setArchivedNotes(prevArchived => {
          const updatedArchived = prevArchived.filter(note => note.id !== id);
          console.log("Notas arquivadas após restauração:", updatedArchived);
          return updatedArchived;
        });
      }
      await getAllNotes();
    }
  };



  return (
    <NotesContext.Provider value={{
      notes, searchedNotes, processStatus, trashNotes, archivedNotes,
      setSearchedNotes, getAllNotes, searchNotesByQuery, createNote, updateNote, archiveNote, softDeleteNote, deleteNote, restoreNote,
    }}>
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

export type { Note };