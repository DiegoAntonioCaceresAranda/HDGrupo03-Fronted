export interface Usuario {
    id: number;
    codigo: string;
    nombre: string;
    correo: string;
    contraseña: string;
    rol: string;
    estado: 'Activo' | 'Inactivo';
}

export const usuariosMock: Usuario[] = [
    {
        id: 1,
        codigo: "USR-001",
        nombre: "Administrador",
        correo: "admin@collinscafe.com",
        contraseña: "usuario123",
        rol: "Administrador",
        estado: "Activo"
    },
    {
        id: 2,
        codigo: "USR-002",
        nombre: "Christopher Ramirez",
        correo: "Christopher@collinscafe.com",
        contraseña: "usuario123",
        rol: "Empleado",
        estado: "Activo"
    }
];