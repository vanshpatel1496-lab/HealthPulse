export interface ApiErrorDetail {
  code: string;
  message: string;
  safeUserMessage: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    timestamp?: string;
  };
}

export type StandardApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
