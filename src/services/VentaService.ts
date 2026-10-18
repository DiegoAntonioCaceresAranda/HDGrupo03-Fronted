import api from "../config/axios";
import ventasMock, { type Venta } from "../data/Venta";

const STORAGE_KEY = "ventas";

const obtenerVentas = (): Venta[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : ventasMock;
};

const guardarVentas = (ventas: Venta[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ventas));
};

const listarVentas = (): Venta[] => {
  return obtenerVentas();
};

const obtenerVentasAPI = async (): Promise<Venta[]> => {
  try {
    const { data } = await api.get<Venta[]>("/ventas/");
    guardarVentas(data);
    return data;
  } catch (error) {
    console.error("Error al obtener ventas del backend:", error);
    return obtenerVentas();
  }
};

const registrarVenta = async (
  datos: Omit<Venta, "id" | "ticket" | "fecha">,
): Promise<Venta> => {
  const { data } = await api.post<Venta>("/ventas/", datos);
  const actuales = obtenerVentas();
  guardarVentas([data, ...actuales]);
  return data;
};

export const VentaService = {
  listarVentas,
  obtenerVentasAPI,
  registrarVenta,
};