import { usuariosMock, type Usuario } from "../data/Usuario";

const STORAGE_KEY = "usuarios";

// Inicializar usuarios
const inicializarUsuarios = (): void => {
    const usuariosGuardados = localStorage.getItem(STORAGE_KEY);

    if (!usuariosGuardados) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(usuariosMock)
        );
    }
};

// Obtener usuarios
const obtenerUsuarios = (): Usuario[] => {
    inicializarUsuarios();

    const data = localStorage.getItem(STORAGE_KEY);

    return data ? JSON.parse(data) : [];
};

// Guardar usuarios
const guardarUsuarios = (usuarios: Usuario[]): void => {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(usuarios)
    );
};

// CREATE user
const crearUsuario = (
    usuario: Omit<Usuario, "id" | "codigo">
): Usuario => {
    const usuarios = obtenerUsuarios();
    const nuevoId =
        usuarios.length > 0
            ? Math.max(...usuarios.map(u => u.id)) + 1
            : 1;
            
    // Autogeneramos el código del usuario
    const codigo = `USR-${String(nuevoId).padStart(3, '0')}`;

    const nuevoUsuario: Usuario = {
        id: nuevoId,
        codigo,
        ...usuario
    };

    guardarUsuarios([
        ...usuarios,
        nuevoUsuario
    ]);
    return nuevoUsuario;
};

// READ
const listarUsuarios = (): Usuario[] => {
    return obtenerUsuarios();
};

// UPDATE
const actualizarUsuario = (
    id: number,
    datos: Omit<Usuario, "id" | "codigo">
): Usuario | null => {
    const usuarios = obtenerUsuarios();
    const usuarioExiste = usuarios.find(
        usuario => usuario.id === id
    );

    if (!usuarioExiste) {
        return null;
    }

    const usuariosActualizados = usuarios.map(
        usuario =>
            usuario.id === id
                ? {
                    id,
                    codigo: usuario.codigo,
                    ...datos
                }
                : usuario
    );

    guardarUsuarios(usuariosActualizados);
    return (
        usuariosActualizados.find(
            usuario => usuario.id === id
        ) || null
    );
};

// DELETE
const eliminarUsuario = (id: number): boolean => {
    const usuarios = obtenerUsuarios();
    const usuariosFiltrados = usuarios.filter(
        usuario => usuario.id !== id
    );

    if (usuariosFiltrados.length === usuarios.length) {
        return false;
    }
    guardarUsuarios(usuariosFiltrados);

    return true;
};

export const UsuarioService = {
    listarUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
};