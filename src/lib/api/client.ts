import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_MCSR_API_BASE_URL || 'https://api.mcsrranked.com';

/**
 * Custom error class for API errors
 */
export class McsrApiError extends Error {
  constructor(
    public status: number,
    public data: ApiError,
    public originalError?: AxiosError
  ) {
    super(data.error || 'An unknown error occurred');
    this.name = 'McsrApiError';
  }
}

/**
 * Create axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Add API key if available
      const apiKey = process.env.NEXT_PUBLIC_MCSR_API_KEY;
      if (apiKey) {
        config.headers['X-API-Key'] = apiKey;
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError<ApiError>) => {
      if (error.response) {
        // Server responded with error status
        const apiError: ApiError = {
          error: (error.response.data as ApiError)?.error || error.message,
          status: error.response.status,
          timestamp: Date.now(),
        };

        throw new McsrApiError(error.response.status, apiError, error);
      } else if (error.request) {
        // Request made but no response
        throw new McsrApiError(0, {
          error: 'No response from server. Please check your connection.',
          status: 0,
        });
      } else {
        // Error setting up request
        throw new McsrApiError(0, {
          error: error.message,
          status: 0,
        });
      }
    }
  );

  return client;
};

export const apiClient = createApiClient();

/**
 * Helper function for GET requests
 */
export async function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<T>(url, config);
  return response.data;
}

/**
 * Helper function for POST requests
 */
export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
}
