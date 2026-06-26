export type ApiSuccess<T> = {
  success: true;
} & T;

export type ApiError = {
  success?: false;
  message?: string;
};

