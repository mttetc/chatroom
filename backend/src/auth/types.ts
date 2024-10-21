export interface LoginDto {
  name: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  name: string;
  isAnonymous: boolean;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  isAnonymous: boolean;
}