import request, { requestOptions } from '../utils/request';

export async function validateAuthApi() {

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:3001/api/auth/validate`,
    method: 'POST',
  };

  try {
    const response = await request(requestParams);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "validateAuthApi : Um erro inesperado aconteceu" };
  }
}





