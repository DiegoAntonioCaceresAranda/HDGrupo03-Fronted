export interface Rol {
    id_rol: number
    nombre: string
    descripcion: string | null;
}

export type RolCreate = Omit<Rol, "id_rol">;