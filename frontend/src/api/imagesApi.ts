import request, { requestOptions } from '../utils/request';

export async function uploadImageApi({
  image,
}: { image: File }) {
  const body = new FormData();
  body.append("image", image);

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:443/api/image`,
    method: 'POST',
    body,
    formData: true,
  };

  try {
    const response = await request(requestParams);
    console.log("response", response);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "uploadImageApi : Um erro inesperado aconteceu" };
  }
}

export async function deleteImageApi(imageId: string) {

  const requestParams: requestOptions = {
    url: `https://alpha04.alphaedtech.org.br:443/api/image/${imageId}`,
    method: 'DELETE',
  };

  try {
    const response = await request(requestParams);

    if (response.error) return { data: null as null, success: false, error: response.message };
    return { data: response.data, success: true, error: null as null };

  } catch (error) {
    return { data: null as null, success: false, error: "deleteImageApi : Um erro inesperado aconteceu" };
  }
}
