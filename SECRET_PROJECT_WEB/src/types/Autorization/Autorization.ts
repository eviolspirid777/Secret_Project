export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  expirationDate: string;
  userId: string;
};
