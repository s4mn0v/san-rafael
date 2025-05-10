export interface GenealogyResponse {
  animal: Animal;
  genealogia: {
    tipo_registro: string;
    documento: string;
    observaciones: string;
  } | null;
  reproduccion: {
    tipo_concepcion: string;
    fecha_evento: string;
    madre: Animal;
    padre: Animal;
  } | null;
}

export interface Animal {
  id_animal: string;
  fecha_nacimiento: string;
  raza: string;
  tipo_animal: string;
  peso_actual: number;
  estado_salud: string;
  venta: boolean;
  peso_inicial: number;
  id_reproduccion: string | null;
  fecha_fallecimiento: string | null;
}

export interface Venta {
  id_venta: number;
  animal_id: string;
  fecha_venta: string;
  monto: number | null;
  notas: string | null;
}

export interface HistorialSalud {
  id_historial: number;
  animal_id: string;
  fecha_evento: string;
  descripcion: string;
  observaciones: string | null;
}
