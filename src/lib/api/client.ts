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
      // Add private key if the user provided one in their local app session.
      // Note: MCSR Ranked API uses "Private-Key" header (not "X-API-Key")
      const userApiKey = (config as any).userApiKey;
      
      if (userApiKey) {
        config.headers['Private-Key'] = userApiKey;
      }

      // Remove the temporary userApiKey from config
      delete (config as any).userApiKey;

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
    (error: AxiosError<ApiError | { status: string; data: string }>) => {
      if (error.response) {
        // Server responded with error status
        // Handle both direct error format and wrapped format { status: "error", data: "..." }
        const responseData = error.response.data as any;
        let errorMessage: string;
        
        if (responseData?.status === 'error' && typeof responseData?.data === 'string') {
          // Wrapped error format: { status: "error", data: "message" }
          errorMessage = responseData.data;
        } else if (typeof responseData?.error === 'string') {
          // Direct error format: { error: "message" }
          errorMessage = responseData.error;
        } else if (typeof responseData === 'string') {
          // Plain string error
          errorMessage = responseData;
        } else {
          errorMessage = error.message;
        }
        
        const apiError: ApiError = {
          error: errorMessage,
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
 * MCSR API response wrapper
 */
interface McsrApiResponse<T> {
  status: 'success' | 'error';
  data: T;
}

/**
 * Helper function for GET requests
 */
export async function get<T>(url: string, config?: AxiosRequestConfig & { userApiKey?: string }): Promise<T> {
  // If userApiKey is provided, add it to the config
  const requestConfig = config ? { ...config } : {};
  if (config?.userApiKey) {
    (requestConfig as any).userApiKey = config.userApiKey;
  }
  
  const response = await apiClient.get<McsrApiResponse<T> | T>(url, requestConfig);

  // Check if response is wrapped in { status, data } format
  if (response.data && typeof response.data === 'object' && 'status' in response.data) {
    const wrappedResponse = response.data as McsrApiResponse<T>;
    
    // Unwrap the MCSR API response
    if (wrappedResponse.status === 'error') {
      throw new McsrApiError(400, {
        error: typeof wrappedResponse.data === 'string' ? wrappedResponse.data : 'Unknown error',
        status: 400,
      });
    }

    return wrappedResponse.data;
  }

  // Response is direct data (no wrapper)
  return response.data as T;
}

/**
 * Helper function for POST requests
 */
export async function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig & { userApiKey?: string }
): Promise<T> {
  // If userApiKey is provided, add it to the config
  const requestConfig = config ? { ...config } : {};
  if (config?.userApiKey) {
    (requestConfig as any).userApiKey = config.userApiKey;
  }
  
  const response = await apiClient.post<T>(url, data, requestConfig);
  return response.data;
}
