import { Note } from '../contexts/NotesContext';
import request, { requestOptions } from '../utils/request';

interface GetAllNotesResponse {
  data: Note[];
  error?: string;
}

interface UpdateNoteRequest {
  title?: string;
  content?: string;
}

export async function getAllNotesApi(filter?: string) {
  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes${filter ? `?filter=${filter}` : ''}`,
    method: 'GET',
  };

  try {
    const response = await request(requestParams);


    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "getAllNotesApi : Um erro inesperado aconteceu" };
  }
}

export async function getNoteByIdApi({ id }: { id: string }) {

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes/${id}`,
    method: 'GET',
  };

  try {
    const response = await request(requestParams);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "getNoteByIdApi : Um erro inesperado aconteceu" };
  }
}

export async function searchNotesByQueryApi({ query }: { query: string }) {
  const body = {
    query,
  };

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes/search`,
    method: 'POST',
    body,
  };

  try {
    const response = await request(requestParams);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "searchNotesByQueryApi : Um erro inesperado aconteceu" };
  }
}

export async function createNoteApi({ title, content, images, urls }: Partial<Note>, socketId: string) {
  const body = {
    title,
    content,
    images,
    urls,
  };

  console.log("ENV", process.env.REACT_APP_BACKEND_API_ADDRESS);

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes`,
    method: 'POST',
    body,
    socketId: socketId
  };

  try {
    const response = await request<Note>(requestParams);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "createNoteApi : Um erro inesperado aconteceu" };
  }
}

export async function updateNoteApi({ id, fields }: { id: string, fields: UpdateNoteRequest }) {

  console.log("aaaaaa", fields);
  const body = {
    ...fields
  };

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes/${id}`,
    method: 'PUT',
    body,
  };

  try {
    const response = await request<Note>(requestParams);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "updateNoteApi : Um erro inesperado aconteceu" };
  }
}

export async function updateImageNoteApi({ noteId, images }: { noteId: string, images: any }) {

  console.log("aaaaaa", images);
  const body = {
    noteId,
    images
  };

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes/updateImages`,
    method: 'PUT',
    body,
  };

  try {
    const response = await request<Note>(requestParams);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "updateImageNoteApi : Um erro inesperado aconteceu" };
  }
}

export async function updateUrlNoteApi({ noteId, urls }: { noteId: string, urls: any }) {

  console.log("aaaaaa", urls);
  const body = {
    noteId,
    urls
  };

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes/updateUrls`,
    method: 'PUT',
    body,
  };

  try {
    const response = await request<Note>(requestParams);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "updateUrlNoteApi : Um erro inesperado aconteceu" };
  }
}

export async function deleteNoteApi({ id }: { id: string }) {

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes/${id}`,
    method: 'DELETE',
  };

  try {
    const response = await request(requestParams);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "deleteNoteApi : Um erro inesperado aconteceu" };
  }
}

export async function archiveNoteApi({ id }: { id: string }, socketId: string) {
  const body = { is_in_archive: true };

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes/${id}`,
    method: 'PUT',
    body,
    headers: {
      'Content-Type': 'application/json',
      'x-socket-id': socketId,
    },
  };

  try {
    const response = await request<Note>(requestParams);

    if (response.error) return { data: null as null, error: response.message };
    return { data: response.data, error: null as null };

  } catch (error) {
    return { data: null as null, error: "archiveNoteApi : Um erro inesperado aconteceu" };
  }
}


export async function moveNoteToTrashApi({ id }: { id: string }, socketId: string) {
  const body = { is_in_trash: true };

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes/${id}`,
    method: 'PUT',
    body, //passo o fields
    headers: {
      'Content-Type': 'application/json',
      'x-socket-id': socketId,
    },
  };


  try {
    const response = await request<Note>(requestParams);

    if (response.error) return { data: null as null, error: response.message };
    return { data: response.data, error: null as null };

  } catch (error) {
    return { data: null as null, error: "moveNoteToTrashApi : Um erro inesperado aconteceu" };
  }
}


export async function restoreFromTrashApi({ id }: { id: string }, socketId: string) {
  const body = { is_in_trash: false };

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes/${id}`,
    method: 'PUT',
    body,
    headers: {
      'Content-Type': 'application/json',
      'x-socket-id': socketId,
    },
  };

  try {
    const response = await request<Note>(requestParams);

    if (response.error) {
      console.error("Erro ao restaurar nota do lixo:", response.error);
      return { data: null as null, error: response.message };
    }
    return { data: response.data, error: null as null };

  } catch (error) {
    console.error("restoreFromTrashApi: Um erro inesperado aconteceu", error);
    return { data: null as null, error: "restoreFromTrashApi: Um erro inesperado aconteceu" };
  }
}

export async function restoreFromArchiveApi({ id }: { id: string }, socketId: string) {
  const body = { is_in_archive: false };

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/notes/${id}`,
    method: 'PUT',
    body,
    headers: {
      'Content-Type': 'application/json',
      'x-socket-id': socketId,
    },
  };

  try {
    const response = await request<Note>(requestParams);

    if (response.error) {
      console.error("Erro ao restaurar nota do arquivo:", response.error);
      return { data: null, error: response.message };
    }

    return { data: response.data, error: null };
  } catch (error) {
    console.error("restoreFromArchiveApi: Um erro inesperado aconteceu", error);
    if (error instanceof SyntaxError) {
      console.error("Resposta da API não é um JSON válido.");
    }
    return { data: null, error: "restoreFromArchiveApi: Um erro inesperado aconteceu" };
  }
}

export type { GetAllNotesResponse, UpdateNoteRequest };




