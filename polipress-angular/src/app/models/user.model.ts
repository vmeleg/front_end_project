export type Rol = 'admin' | 'user';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password?: string;
  rol: Rol;
}

/** forma persistida en localStorage bajo `auth_session`. */
export interface AuthSession {
  loggedIn: boolean;
  user: string;
  email: string;
  rol: Rol;
}
