/* eslint-disable @typescript-eslint/no-explicit-any */
import { Method } from 'axios';

export interface RequestParams {
  url: string;
  method: Method;
  data?: any;
  headers?: any;
}

export interface ApiResponse<T = unknown> {
  error: boolean;
  message: string;
  data: T;
}
