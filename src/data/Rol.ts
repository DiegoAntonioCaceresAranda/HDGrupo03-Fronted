export interface Rol {
    id: number
    nombre: string
    descripcion: string | null;
}

export type RolCreate = Omit<Rol, "id_rol">;