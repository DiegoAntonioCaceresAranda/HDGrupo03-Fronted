export interface Usuario {
    id: number;
    codigo: string;
    nombre: string;
    correo: string;
    rol: 'Administrador' | 'Empleado';
    estado: 'Activo' | 'Inactivo';
}

export const usuariosMock: Usuario[] = [
    {
        id: 1,
        codigo: "USR-001",
        nombre: "Administrador",
        correo: "admin@collinscafe.com",
        rol: "Administrador",
        estado: "Activo"
    },
    {
        id: 2,
        codigo: "USR-002",
        nombre: "Christopher Ramirez",
        correo: "Christopher@collinscafe.com",
        rol: "Empleado",
        estado: "Activo"
    }
];