import request, { requestOptions } from '../utils/request';

export async function validateAuthApi() {

  const requestParams: requestOptions = {
    url: `${process.env.REACT_APP_BACKEND_API_ADDRESS}/api/auth/validate`,
    method: 'POST',
  };

  try {
    const response = await request(requestParams);

    if (response.error) return { data: null as null, error: response.message };
    return { data: response.data, error: null as null };

  } catch (error) {
    return { data: null as null, error: "validateAuthApi : Um erro inesperado aconteceu" };
  }
}





