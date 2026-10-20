import api from "../config/axios";

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface UsuarioAutenticado {
  id_usuario: number;
  codigo: string;
  nombre: string;
  correo: string;
  estado: string;
  id_rol: number;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario: UsuarioAutenticado;
}

export const authService = {
  async login(datos: LoginRequest): Promise<LoginResponse> {
    const respuesta = await api.post<LoginResponse>(
      `${API_URL}/auth/login`,
      datos
    );

    return respuesta.data;
  },

  async obtenerUsuarioActual(): Promise<UsuarioAutenticado> {
    const token = localStorage.getItem("collins_token");

    const respuesta = await api.get<UsuarioAutenticado>(
      `${API_URL}/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return respuesta.data;
  },

  cerrarSesion(): void {
    localStorage.removeItem("collins_token");
    localStorage.removeItem("user");
  },
};
