import type { ApiResponse } from '../types/common';
import { axiosInstance } from './axios';

export const checkHealth = async (): Promise<ApiResponse<string>> => {
  const { data } = await axiosInstance.get<ApiResponse<string>>('/health');
  return data;
};
