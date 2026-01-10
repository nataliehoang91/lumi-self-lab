export interface FormState {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    rememberMe?: string[];
  };
}

export const initialState: FormState = {};

export const EMAIL_FIELD = "email";
export const PASSWORD_FIELD = "password";
