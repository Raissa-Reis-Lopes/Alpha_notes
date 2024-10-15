import { Note } from '../contexts/NotesContext';


export const getAllNotes = async () => {
  try {
    //TODO: Filtrar pelo usuário logado
    const response = await fetch(`${process.env.BACKEND_API_ADDRESS}/notes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { data: data, error: null }

    } else {
      const errorData = await response.json();
      return { data: null, error: errorData.message }
    }

  } catch (error) {
    return { data: null, error: error }
  }
};

export const getNoteById = async (id: string) => {
  try {
    //TODO: Filtrar pelo usuário logado
    const response = await fetch(`${process.env.BACKEND_API_ADDRESS}/notes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { data: data, error: null }

    } else {
      const errorData = await response.json();
      return { data: null, error: errorData.message }
    }

  } catch (error) {
    return { data: null, error: error }
  }
};

export const searchNotesByQuery = async (query: string) => {
  try {
    //TODO: Filtrar pelo usuário logado
    const response = await fetch(`${process.env.BACKEND_API_ADDRESS}/notes/search/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(query),
    });

    if (response.ok) {
      const data = await response.json();
      return { data: data, error: null }

    } else {
      const errorData = await response.json();
      return { data: null, error: errorData.message }
    }

  } catch (error) {
    return { data: null, error: error }
  }
};

export const createNote = async (note: Note) => {
  try {
    //TODO: Filtrar pelo usuário logado
    const response = await fetch(`${process.env.BACKEND_API_ADDRESS}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });

    if (response.ok) {
      const data = await response.json();
      return { data: data, error: null }

    } else {
      const errorData = await response.json();
      return { data: null, error: errorData.message }
    }

  } catch (error) {
    return { data: null, error: error }
  }
};

export const updateNote = async (id: string, note: Note) => {
  try {
    //TODO: Filtrar pelo usuário logado
    const response = await fetch(`${process.env.BACKEND_API_ADDRESS}/notes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    });

    if (response.ok) {
      const data = await response.json();
      return { data: data, error: null }

    } else {
      const errorData = await response.json();
      return { data: null, error: errorData.message }
    }

  } catch (error) {
    return { data: null, error: error }
  }
};

export const deleteNote = async (id: string) => {
  try {
    //TODO: Filtrar pelo usuário logado
    const response = await fetch(`${process.env.BACKEND_API_ADDRESS}/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { data: data, error: null }

    } else {
      const errorData = await response.json();
      return { data: null, error: errorData.message }
    }

  } catch (error) {
    return { data: null, error: error }
  }
};



