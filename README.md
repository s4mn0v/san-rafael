# Nuxt

**Version:** 3.17.2

# Icons

[HeroIcons](https://icon-sets.iconify.design/heroicons/)

```bash
bun i -D @iconify-json/heroicons
```

<br>

[HealthIcons](https://icon-sets.iconify.design/healthicons/)

```bash
bun i -D @iconify-json/healthicons
```

<br>

[Lucide](https://icon-sets.iconify.design/lucide/)

```bash
bun i -D @iconify-json/lucide
```

# Supabase

## Get db structure

```bash
bunx supabase login
```

```bash
bunx supabase gen types typescript --project-id "yhydjqxtnqinaxnqnegn" --schema public > types/supabase.ts
```

---

# POR HACER

## Genealogia (La tabla es la de reproduccion)

- [ ] Tabla de genalogia con (Buscador pero en la misma tabla, Dropdown con el VueFlow Tree, Modal para agregar genealogias, checkbox con la funcionalidad de eliminar uno o varios y en seleccion unica opcion para editar).

- [ ] Modal para agregar registros genealogicos (Condicional de que no puede agregar registros masculinos o bebes en campos femeninos y en campos femeninos no se puede agregar registros masculinos o bebes).

- [ ] Genearar la posibilidad de asignar un registro genealogico a un registro animal mediante el checkbox en seleccion unica. Ademas de agregar la condicional de poder eliminar ese asignacion o mostrar alertas para cuando se intenta generar una doble asignacion a un mismo registro.

## Animal

- [ ] Agregar la funcionalidad a la columna de checkbox, para eliminar varios o un solo registro.

- [ ] Agregar el modal para la creacion de un registro animal.

## Inventario

- [ ] Mostrar de manera visual el inventario con diferentes colores en la tabla.

## Proveedores

- [ ] Agregar de manera visual los proveedores en forma de cartas con paginacion.

## Usuarios

- [X] Agregar la tabla de usuarios y funcionalidad de eliminar
- [X] Agregar componentes de busqueda de usuarios
- [ ] Modal para agregar usuarios
- [ ] Modal para editar usuarios
- [X] Agregar el apartado de usuarios de la version (prueba) a la version (stable).
