import rolesMock, { type Rol } from "../data/Rol";

const StorageKey = "roles";

// Inicializar roles
const inicializarRoles = () => {
    const rolesGuardadas = localStorage.getItem(StorageKey);

    if (!rolesGuardadas) {
        localStorage.setItem(StorageKey, JSON.stringify(rolesMock));
    }
};

//Obtener roles
const obtenerRoles = (): Rol[] => {
    inicializarRoles();

    const data = localStorage.getItem(StorageKey);
    return data ? JSON.parse(data) : [];
}

//Guardar roles
const guardarRoles = (roles: Rol[]): void => {
    localStorage.setItem(StorageKey, JSON.stringify(roles));
};

//CREATE
const crearRol = (rol: Omit<Rol, "id">): Rol => {
    const roles = obtenerRoles();
    const nuevoId = roles.length > 0 ? Math.max(...roles.map(c => c.id)) + 1 : 1;
    const nuevoRol: Rol = {id: nuevoId, ...rol};
    
    guardarRoles([...roles,nuevoRol]);
    return nuevoRol;
};

//READ
const listarRoles = (): Rol[] => {
    return obtenerRoles();
};

//UPDATE
const actualizarRol = (id: number, datos: Omit<Rol, "id">): Rol | null => {
    const roles = obtenerRoles();
    const rolExiste = roles.find(roles => roles.id === id);

    if (!rolExiste) {
        return null;
    }

    const rolActualizado = roles.map(
        roles => roles.id == id
         ? {
            id,
            ...datos
         }
         :roles
    );

    guardarRoles(rolActualizado);
    return rolActualizado.find(roles => roles.id === id) || null;
};

//DELETE
const eliminarRol = (id: number): boolean => {
    const roles = obtenerRoles();
    const rolesFiltrados = roles.filter(roles => roles.id !== id);

    if (rolesFiltrados.length === roles.length) {
        return false;
    }

    guardarRoles(rolesFiltrados);
    return true;
};

export const rolService = {
    listarRoles,
    crearRol,
    actualizarRol,
    eliminarRol
}