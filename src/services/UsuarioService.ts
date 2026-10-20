import api from "../config/axios";
import type { Usuario, UsuarioUpdate, UsuarioCreate } from "../data/Usuario";

interface UsuarioResponse {
  id_usuario: number;
  codigo: string;
  nombre: string;
  correo: string;
  estado: "Activo" | "Inactivo";
  id_rol: number;
}

const adaptarUsuario = (datos: UsuarioResponse): Usuario => ({
  id: datos.id_usuario,
  codigo: datos.codigo,
  nombre: datos.nombre,
  correo: datos.correo,
  estado: datos.estado,
  id_rol: datos.id_rol,
});

// Inicializar usuarios
const listarUsuarios = async (): Promise<Usuario[]> => {
  const respuesta = await api.get<UsuarioResponse[]>("/usuarios/");
  return respuesta.data.map(adaptarUsuario);
};

// CREATE user
const crearUsuario = async (
  datos: UsuarioCreate
): Promise<Usuario> => {
  const respuesta = await api.post<UsuarioResponse>(
    "/usuarios/",
    {
      nombre: datos.nombre,
      correo: datos.correo,
      password: datos.password,
      estado: datos.estado,
      id_rol: datos.id_rol,
    }
  );

  return adaptarUsuario(respuesta.data);
};


// UPDATE
const actualizarUsuario = async (
  id_usuario: number,
  datos: UsuarioUpdate
): Promise<Usuario> => {
  const payload: UsuarioUpdate = {
    nombre: datos.nombre,
    correo: datos.correo,
    estado: datos.estado,
    id_rol: datos.id_rol,
  };

  // Solo enviar la contraseña si se escribió una nueva
  if (datos.password?.trim()) {
    payload.password = datos.password;
  }

  const respuesta = await api.put<UsuarioResponse>(
    `/usuarios/${id_usuario}`,
    payload
  );

  return adaptarUsuario(respuesta.data);
};

// DELETE
const eliminarUsuario = async (id: number): Promise<void> => {
  await api.delete(`/usuarios/${id}`);
};

export const UsuarioService = {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};
