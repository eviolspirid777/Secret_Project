export type RegisterRequest = {
  email: string;
  password: string;
  displayName: string;
};

export type RegisterResponse = {
  message: string;
};
