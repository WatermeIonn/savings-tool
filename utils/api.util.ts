import { addToast } from '@heroui/toast';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

interface ApiCallConfig {
  url: string;
  options?: ApiOptions;
  errorMessage: string;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

export const apiCall = async ({
  url,
  options = {},
  errorMessage,
  onSuccess,
  onError,
  onFinally,
}: ApiCallConfig): Promise<void> => {
  const { method = 'GET', body, headers = {} } = options;

  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    onSuccess?.(data);
  } catch (error) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    addToast({
      title: 'An error has occurred',
      description: `${errorMessage}: ${errorObj.message}`,
      color: 'danger',
    });
    onError?.(errorObj);
  } finally {
    onFinally?.();
  }
};
