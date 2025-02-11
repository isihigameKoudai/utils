const request = async <T = any>(url: RequestInfo | URL, options?: RequestInit): Promise<T> => {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    return json as T;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const api = {
  request,
  get: async <T = any>(url: RequestInfo | URL, options?: RequestInit): Promise<T> => {
    return request(url, { ...options, method: 'GET' });
  },
  post: async <T = any>(url: RequestInfo | URL, options?: RequestInit): Promise<T> => {
    return request(url, { ...options, method: 'POST' });
  },
  put: async <T = any>(url: RequestInfo | URL, options?: RequestInit): Promise<T> => {
    return request(url, { ...options, method: 'PUT' });
  },
  delete: async <T = any>(url: RequestInfo | URL, options?: RequestInit): Promise<T> => {
    return request(url, { ...options, method: 'DELETE' });
  },
}

export default api;

