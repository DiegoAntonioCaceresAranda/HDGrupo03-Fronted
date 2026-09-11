export interface Rol {
    id: number
    nombre: string
    descripcion: string
}

const rolesMock: Rol[] = [
    {
        id: 1,
        nombre: "Adminstrador",
        descripcion: "Acceso completo a las funciones del sistema."
    },
    {
        id: 2,
        nombre: "Empleado",
        descripcion: "Puede gestionar productos, categorias e inventario"
    }
]

export default rolesMock;