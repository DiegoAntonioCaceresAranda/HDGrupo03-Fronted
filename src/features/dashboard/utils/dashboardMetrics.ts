export function formatoMoneda(amount: number, currency = "PEN"): string {
  return new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(amount);
}

export function formatoPorcentaje(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}
