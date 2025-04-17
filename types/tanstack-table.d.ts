// types/tanstack-table.d.ts
import '@tanstack/table-core';

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    isSelectColumn?: boolean; // Declara tu propiedad personalizada aquí
    // Puedes añadir otras propiedades personalizadas que uses en 'meta'
  }
}