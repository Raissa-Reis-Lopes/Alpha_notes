import request, { requestOptions } from '../utils/request';

export async function uploadUrlApi({ url }: { url: string }) {
  const body = {
    url,
  };

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/url`,
    method: 'POST',
    body,
  };

  try {
    const response = await request(requestParams);
    console.log("response", response);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "uploadUrlApi : Um erro inesperado aconteceu" };
  }
}

export async function deleteUrlApi({ id }: { id: string }) {

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/url/${id}`,
    method: 'DELETE',
  };

  try {
    const response = await request(requestParams);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "deleteUrlApi : Um erro inesperado aconteceu" };
  }
}
