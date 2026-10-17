export interface Usuario {
  id: number;
  codigo: string;
  nombre: string;
  correo: string;
  id_rol: number;
  estado: "Activo" | "Inactivo";
}

export interface UsuarioCreate {
  nombre: string;
  correo: string;
  password: string;
  estado: "Activo" | "Inactivo";
  id_rol: number;
}

export interface UsuarioUpdate {
  nombre?: string;
  correo?: string;
  password?: string;
  estado?: "Activo" | "Inactivo";
  id_rol?: number;
}