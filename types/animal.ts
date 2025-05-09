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
