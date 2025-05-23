export type LoginRequest = {
  login: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  expiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt?: Date;
};
