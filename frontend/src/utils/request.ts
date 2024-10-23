export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';

export interface requestOptions {
  url: string;
  method: HTTPMethod;
  body?: object | FormData | string | undefined;
  formData?: boolean;
  headers?: { [key: string]: string };
  auth?: boolean;
  socketId?: string;
}

export default async function request<T>({
  url,
  method,
  body,
  formData,
  auth = true,
  socketId,
}: requestOptions): Promise<{
  data: T;
  error: boolean;
  status: number;
  message?: string | string[];
}> {

  const requestOptions: RequestInit = {
    method,
    body: !formData ? JSON.stringify(body) : (body as FormData),
    headers: {
      ...(!formData ? { "Content-type": "application/json" } : {}),
      ...(socketId ? { "x-socket-id": socketId } : {}),
    },
    cache: "no-store",
    credentials: 'include',

  };

  const response = await fetch(url, requestOptions);
  console.log("response, ", response)
  const data = await response.json();
  console.log("data, ", data)

  return {
    data: data.data,
    error: !response.ok,
    status: response.status,
    message: data.message ? data.message : null,
  };
}
