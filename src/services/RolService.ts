import api from "../config/axios";
import type {Rol, RolCreate} from "../data/Rol"


// Inicializar roles
const listarRoles = async (): Promise<Rol[]> => {
    const respuesta = await api.get<Rol[]>("/roles/");
    return respuesta.data;
};


//Crear roles
const crearRol = async (datos: RolCreate): Promise<Rol> => {
  const respuesta = await api.post<Rol>("api/roles/", datos);
  return respuesta.data;
};


//UPDATE
const actualizarRol = async (id_rol: number, datos: Partial<RolCreate>): Promise<Rol> => {
  const respuesta = await api.put<Rol>(
    `api/roles/${id_rol}`,
    datos
  );
  return respuesta.data;
};

//DELETE
const eliminarRol = async (id_rol: number): Promise<void> => {
  await api.delete(`api/roles/${id_rol}`);
};

export const rolService = {
    listarRoles,
    crearRol,
    actualizarRol,
    eliminarRol
}