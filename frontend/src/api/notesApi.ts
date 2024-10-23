import { Note } from '../contexts/NotesContext';
import request, { requestOptions } from '../utils/request';

export async function getAllNotesApi() {

  const requestParams: requestOptions = {
    url: `${process.env.REACT_APP_BACKEND_API_ADDRESS}/notes`,
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
    url: `${process.env.REACT_APP_BACKEND_API_ADDRESS}/notes/${id}`,
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
    url: `${process.env.REACT_APP_BACKEND_API_ADDRESS}/notes/search`,
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

  const requestParams: requestOptions = {
    url: `${process.env.REACT_APP_BACKEND_API_ADDRESS}/notes`,
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

export async function updateNoteApi({ id, note }: { id: string; note: Partial<Note> }) {
  const body = {
    note
  };

  const requestParams: requestOptions = {
    url: `${process.env.REACT_APP_BACKEND_API_ADDRESS}/notes/${id}`,
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

export async function deleteNoteApi({ id }: { id: string }) {

  const requestParams: requestOptions = {
    url: `${process.env.REACT_APP_BACKEND_API_ADDRESS}/notes/${id}`,
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





