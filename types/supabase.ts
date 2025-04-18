export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      // Tabla existente de perfiles (ejemplo)
      profiles: {
        Row: {
          id: string;
          role: string;
          email: string;
        };
        Insert: {
          id: string; // Generalmente coincide con auth.users.id
          role: string;
          email: string;
        };
        Update: {
          id?: string;
          role?: string;
          email?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      // --- INICIO: Definiciones para Gestor Ganadero ---

      animals: {
        Row: {
          // Datos como vienen de la BD
          id_animal: string;
          fecha_nacimiento: string; // DATE se maneja como string (ISO 8601)
          fecha_fallecimiento: string | null;
          raza: string;
          tipo_animal: "NOVILLO" | "TERNERO" | "TERNERA" | "VACA" | "TORO";
          peso_inicial: number; // DECIMAL se maneja como number
          peso_actual: number;
          estado_salud: string;
          venta: boolean;
          // Columnas añadidas por ALTER TABLE
          id_reproduccion: string | null;
        };
        Insert: {
          // Datos necesarios para crear un animal
          id_animal: string; // ID manual, debe ser proporcionado
          fecha_nacimiento: string;
          fecha_fallecimiento?: string | null; // Opcional al crear
          raza: string;
          tipo_animal: "NOVILLO" | "TERNERO" | "TERNERA" | "VACA" | "TORO";
          peso_inicial: number;
          peso_actual: number; // Usualmente igual al inicial al crear, pero requerido
          estado_salud: string;
          venta?: boolean; // Opcional, default es false
          id_reproduccion?: string | null;
        };
        Update: {
          // Datos que se pueden actualizar (todos opcionales)
          id_animal?: string; // Generalmente no se actualiza la PK
          fecha_nacimiento?: string;
          fecha_fallecimiento?: string | null;
          raza?: string;
          tipo_animal?: "NOVILLO" | "TERNERO" | "TERNERA" | "VACA" | "TORO";
          peso_inicial?: number;
          peso_actual?: number;
          estado_salud?: string;
          venta?: boolean;
          id_reproduccion?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "animals_id_reproduccion_fkey";
            columns: ["id_reproduccion"];
            referencedRelation: "reproduccion";
            referencedColumns: ["id_reproduccion"];
          }
        ];
      };

      tratamientos: {
        Row: {
          id_tratamiento: number;
          animal_id: string;
          nombre: string;
          descripcion: string | null;
          fecha: string | null; // DATE se maneja como string
        };
        Insert: {
          id_tratamiento?: number; // SERIAL es autogenerado
          animal_id: string;
          nombre: string;
          descripcion?: string | null;
          fecha?: string | null;
        };
        Update: {
          id_tratamiento?: number;
          animal_id?: string;
          nombre?: string;
          descripcion?: string | null;
          fecha?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_tratamiento_animal";
            columns: ["animal_id"];
            referencedRelation: "animals";
            referencedColumns: ["id_animal"];
          }
        ];
      };

      ventas: {
        Row: {
          id_venta: number;
          animal_id: string;
          fecha_venta: string; // DATE
          monto: number | null; // DECIMAL
        };
        Insert: {
          id_venta?: number; // SERIAL
          animal_id: string;
          fecha_venta: string;
          monto?: number | null;
        };
        Update: {
          id_venta?: number;
          animal_id?: string;
          fecha_venta?: string;
          monto?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_venta_animal";
            columns: ["animal_id"];
            referencedRelation: "animals";
            referencedColumns: ["id_animal"];
          }
        ];
      };

      vacunas: {
        Row: {
          id_vacuna: number;
          nombre: string;
          cantidad_implementada: number; // INTEGER
          animal_id: string | null;
          fecha_aplicacion: string | null; // DATE
        };
        Insert: {
          id_vacuna?: number; // SERIAL
          nombre: string;
          cantidad_implementada: number;
          animal_id?: string | null;
          fecha_aplicacion?: string | null;
        };
        Update: {
          id_vacuna?: number;
          nombre?: string;
          cantidad_implementada?: number;
          animal_id?: string | null;
          fecha_aplicacion?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_vacuna_animal";
            columns: ["animal_id"];
            referencedRelation: "animals";
            referencedColumns: ["id_animal"];
          }
        ];
      };

      historial_salud: {
        Row: {
          id_historial: number;
          animal_id: string;
          descripcion: string;
          observaciones: string | null;
          fecha_evento: string; // DATE
        };
        Insert: {
          id_historial?: number; // SERIAL
          animal_id: string;
          descripcion: string;
          observaciones?: string | null;
          fecha_evento: string;
        };
        Update: {
          id_historial?: number;
          animal_id?: string;
          descripcion?: string;
          observaciones?: string | null;
          fecha_evento?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_historial_animal";
            columns: ["animal_id"];
            referencedRelation: "animals";
            referencedColumns: ["id_animal"];
          }
        ];
      };

      proveedores: {
        // Definir Proveedores ANTES de Inventario
        Row: {
          id_proveedor: string;
          nombre_empresa: string;
          correo_empresa: string;
          telefono: string;
          direccion: string;
        };
        Insert: {
          id_proveedor: string; // Manual
          nombre_empresa: string;
          correo_empresa: string;
          telefono: string;
          direccion: string;
        };
        Update: {
          id_proveedor?: string;
          nombre_empresa?: string;
          correo_empresa?: string;
          telefono?: string;
          direccion?: string;
        };
        Relationships: []; // No tiene FKs salientes directas aquí
      };

      inventario: {
        Row: {
          id_inventario: number;
          tipo: "SALUD" | "ALIMENTOS" | "ELEMENTOS";
          descripcion: string;
          cantidad: number; // INTEGER
          precio: number; // DECIMAL
          proveedor_id: string;
        };
        Insert: {
          id_inventario?: number; // SERIAL
          tipo: "SALUD" | "ALIMENTOS" | "ELEMENTOS";
          descripcion: string;
          cantidad: number;
          precio: number;
          proveedor_id: string;
        };
        Update: {
          id_inventario?: number;
          tipo?: "SALUD" | "ALIMENTOS" | "ELEMENTOS";
          descripcion?: string;
          cantidad?: number;
          precio?: number;
          proveedor_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_inventario_proveedor";
            columns: ["proveedor_id"];
            referencedRelation: "proveedores";
            referencedColumns: ["id_proveedor"];
          }
        ];
      };

      reproduccion: {
        Row: {
          id_reproduccion: number;
          madre_id: string;
          padre_id: string | null;
          tipo_concepcion: "NATURAL" | "INSEMINACION";
          fecha_evento: string; // DATE
          raza: string;
        };
        Insert: {
          id_reproduccion?: number; // SERIAL
          madre_id: string;
          padre_id?: string | null;
          tipo_concepcion: "NATURAL" | "INSEMINACION";
          fecha_evento: string;
          raza: string;
        };
        Update: {
          id_reproduccion?: number;
          madre_id?: string;
          padre_id?: string | null;
          tipo_concepcion?: "NATURAL" | "INSEMINACION";
          fecha_evento?: string;
          raza?: string;
        };
        Relationships: [
          {
            foreignKeyName: "fk_reproduccion_madre";
            columns: ["madre_id"];
            referencedRelation: "animals";
            referencedColumns: ["id_animal"];
          },
          {
            foreignKeyName: "fk_reproduccion_padre";
            columns: ["padre_id"];
            referencedRelation: "animals";
            referencedColumns: ["id_animal"];
          }
        ];
      };

      genealogia: {
        Row: {
          id_documento: number;
          animal_id: string;
          tipo_registro: "CON_REGISTRO" | "SIN_REGISTRO";
          documento: string | null;
          observaciones: string | null;
        };
        Insert: {
          id_documento?: number; // SERIAL
          animal_id: string;
          tipo_registro: "CON_REGISTRO" | "SIN_REGISTRO";
          documento?: string | null;
          observaciones?: string | null;
        };
        Update: {
          id_documento?: number;
          animal_id?: string;
          tipo_registro?: "CON_REGISTRO" | "SIN_REGISTRO";
          documento?: string | null;
          observaciones?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "fk_genealogia_animal";
            columns: ["animal_id"];
            referencedRelation: "animals";
            referencedColumns: ["id_animal"];
          }
        ];
      };

      // --- FIN: Definiciones para Gestor Ganadero ---
    }; // Fin de Tables
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  }; // Fin de public
}; // Fin de Database

// Helper para extraer los tipos específicos si los necesitas
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

// Puedes exportar tipos específicos para facilitar su uso
export type Profile = Tables<"profiles">;
export type Animal = Tables<"animals">;
export type AnimalInsert = Database["public"]["Tables"]["animals"]["Insert"];
export type AnimalUpdate = Database["public"]["Tables"]["animals"]["Update"];
