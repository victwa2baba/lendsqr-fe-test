import { ApiResponse, RequestParams } from '@/lib/types';
import axios, { AxiosError } from 'axios';
import { getCookie } from 'cookies-next';

class ApiService {
  baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  api = axios.create();

  public async makeRequest<T>({ url, method, data }: RequestParams) {
    try {
      const token = getCookie('token');
      const response = await this.api.request({
        data,
        url: this.baseUrl + url,
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data as ApiResponse<T>;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || 'An error occurred');
      } else if (error instanceof Error) {
        throw new Error('An error occurred');
      }
    }
  }
}

const api = new ApiService();
export default api;
