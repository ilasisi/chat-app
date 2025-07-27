export interface AxiosErrorWithMessage {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
}
