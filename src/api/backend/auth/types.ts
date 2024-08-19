export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface VerifyAuthKeyResponse {
  stk: string;
}

export interface GenerateUserResponse {
  code: string;
}
