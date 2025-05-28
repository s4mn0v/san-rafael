# Estructura de carpetas
```
├── app.config.ts                       # Configuración global del UI en Nuxt
├── app.vue                             # Componente raíz de la app Vue
├── bun.lock                            # Lockfile del gestor Bun
├── error.vue                           # Vista de manejo de errores
├── EXPLAINED.md                        # Documentación detallada de la arquitectura del proyecto
├── nuxt.config.ts                      # Configuración principal de Nuxt
├── package.json                        # Dependencias y scripts del proyecto
├── tsconfig.json                       # Opciones de compilación TypeScript
├── README.md                           # Documentación inicial del proyecto
├── public/                             # Archivos públicos estáticos
│   ├── favicon.ico                     # Ícono de la aplicación
│   └── robots.txt                      # Reglas de rastreo para buscadores
├── assets/                             # Recursos estáticos (CSS, imágenes)
│   ├── css/
│   │   └── main.css                    # Estilos globales de la app
│   └── img/
│       ├── login/
│       │   └── orion.webp              # Imagen para login
│       └── logo/
│           ├── logo-black.webp         # Logotipo versión negra
│           └── logo-white.webp         # Logotipo versión blanca
├── components/                         # Componentes Vue reutilizables
│   ├── animal/                         # Componentes de gestión animal
│   │   ├── AnimalAddModal.vue          # Modal para registrar nuevo animal
│   │   ├── AnimalDetailsCard.vue       # Tarjeta de detalles de animal
│   │   ├── AnimalExpandedCard.vue      # Tarjeta expandida con detalles completos
│   │   ├── AnimalSearch.vue            # Buscador de animales
│   │   ├── AnimalTable.vue             # Tabla de animales
│   │   ├── DeleteAnimalCard.vue        # Confirmación de eliminación individual
│   │   ├── DeleteAnimals.vue           # Modal para eliminar múltiples animales
│   │   ├── DrawerGenealogy.vue         # Drawer para visualzar id de reproducciones
│   │   ├── GenealogyTree.vue           # Árbol genealógico
│   │   ├── HealthHistoryCard.vue       # Historial de salud
│   │   ├── SaleInfoCard.vue            # Información de venta del animal
│   │   └── SaleModal.vue               # Modal de gestión de venta
│   ├── dashboard/                      # Componentes para el dashboard principal
│   │   ├── MetricsCards.vue            # Métricas clave de la app
│   │   ├── SalesCharts.vue             # Gráficos de ventas
│   │   └── StadisticCards.vue          # Tarjetas estadísticas del sistema
│   ├── genealogy/                      # Componentes relacionados con reproducción/genealogía
│   │   ├── DeleteReproductions.vue     # Modal para eliminar reproducciones
│   │   ├── DrawerGenealogy.vue         # Drawer para visualizar id de madre y padre 
│   │   ├── EditReproduction.vue        # Modal para editar una reproducción
│   │   ├── GenealogyTable.vue          # Tabla de genealogías
│   │   └── ReproductionCreateModal.vue # Modal para crear reproducción
│   ├── navigation/                     # Componentes de navegación
│   │   ├── BreadNav.vue                # Migas de pan
│   │   ├── NavButtons.vue              # Botones de navegación
│   │   └── Sidebar.vue                 # Barra lateral
│   ├── profiles/                       # Componentes de perfil de usuario
│   │   ├── DeleteProfiles.vue          # Modal para eliminar perfiles
│   │   ├── EditProfile.vue             # Modal para editar perfil
│   │   ├── ProfileCreateModal.vue      # Modal para crear nuevo perfil
│   │   ├── ProfileEditor.vue           # Editor de perfil
│   │   ├── ProfilesTable.vue           # Tabla de perfiles
│   │   └── SearchProfile.vue           # Buscador de perfiles
│   ├── providers/                      # Componentes de proveedores
│   │   ├── DeleteProvider.vue          # Modal para eliminar provedores
│   │   ├── ProviderAddModal.vue        # Modal para crear nuevo proveedor
│   │   ├── providerExpanded.vue        # Expanded para editar un proveedor
│   │   ├── ProviderTable.vue           # Tabla de proveedores
│   ├── stock/                          # Componentes de inventario
│   │   └── StockTable.vue              # Tabla de stock
│   ├── theming/                        # Componentes de personalización de temas
│   │   ├── Theming.vue                 # Selector de tema
│   │   └── ThemingText.vue             # Textos para personalización
│   └── Logout.vue                      # Componente de logout
├── composables/                        # Funciones reutilizables (composables)
│   └── arestricted.ts                  # Lógica de restricciones de acceso
├── layouts/                            # Plantillas de diseño de páginas
│   ├── default.vue                     # Layout por defecto
│   └── logged.vue                      # Layout para usuarios autenticados
├── middleware/                         # Middlewares de rutas
│   ├── auth.global.ts                  # Autenticación global
│   └── restricted.ts                   # Verificación de acceso
├── pages/                              # Vistas y rutas de la aplicación
│   ├── index.vue                       # Página de inicio ("/")
│   ├── login.vue                       # Página de inicio de sesión
│   ├── about.vue                       # Página "Acerca de"
│   ├── reproduction.vue                # Página de reproducción general
│   ├── sales.vue                       # Página de ventas
│   ├── settings.vue                    # Página de configuración
│   ├── profiles.vue                    # Gestión de perfiles
│   ├── animals/                        # Rutas de animales
│   │   ├── genealogy.vue               # Página de genealogía de animales
│   │   ├── index.vue                   # Listado de animales
│   │   ├── reproduction.vue            # Página de reproducción animal
│   │   └── specific/
│   │       └── [id].vue                # Detalle de animal específico (ruta dinámica)
│   └── stock/                          # Rutas de inventario
│       ├── index.vue                   # Listado de stock
│       └── providers.vue               # Gestión de proveedores
├── server/                             # Backend (API) del proyecto
│   ├── tsconfig.json                   # Configuración TS del backend
│   └── api/                            # Endpoints de la API
│       ├── animal/
│       │   ├── animals.get.ts          # Obtener todos los animales
│       │   ├── animals.delete.ts       # Eliminar múltiples animales
│       │   └── specific/
│       │       ├── [id].get.ts         # Obtener animal por ID
│       │       ├── [id].put.ts         # Actualizar animal por ID
│       │       └── [id].delete.ts      # Eliminar animal por ID
│       ├── dashboard/
│       │   └── metrics.get.ts          # Métricas para el dashboard
│       ├── genealogy/
│       │   └── id/
│       │       └── [id].get.ts         # Obtener genealogía por ID
│       ├── health/
│       │   ├── health.post.ts          # Crear registro de salud
│       │   └── specific/
│       │       ├── [id].put.ts         # Actualizar registro de salud
│       │       └── [id].delete.ts      # Eliminar registro de salud
│       ├── profiles/
│       │   ├── delete.delete.ts        # Eliminar perfiles
│       │   ├── profile.post.ts         # Crear nuevo perfil
│       │   ├── profile.put.ts          # Actualizar perfil
│       │   ├── profiles.get.ts         # Obtener lista de perfiles
│       │   └── search.get.ts           # Buscar perfiles
│       ├── providers/
│       │   ├── providers.get.ts        # Obtener lista de proveedores
│       │   ├── providers.post.ts       # Crear nuevo proveedor
│       │   ├── providers.delete.ts     # Elimina  proveedor
│       │   ├── providers.put.ts        # Edita  proveedor
│       ├── reproduction/
│       │   ├── reproductions.get.ts    # Listar reproducciones
│       │   ├── reproductions.post.ts   # Crear reproducción
│       │   ├── reproductions.delete.ts # Eliminar reproducciones
│       │   └── specific/
│       │       ├── [id].delete.ts      # Eliminar reproducción por ID
│       │       └── [id].put.ts         # Actualizar reproducción por ID
│       ├── sales/
│       │   └── specific/
│       │       ├── [id].post.ts        # Registrar venta por ID
│       │       └── [id].put.ts         # Actualizar venta por ID
│       ├── stock/
│       │   ├── stock.get.ts            # Obtener stock
│       │   └── specific/
│       │       └── [id].get.ts         # Obtener stock por ID
│       └── test.get.ts                 # Endpoint de prueba
└── types/                              # Definiciones de tipos TypeScript
    ├── animal.ts                       # Interfaces relacionadas con animales
    ├── supabase.ts                     # Tipos generados desde Supabase
    └── types.d.ts                      # Tipos globales del proyecto
```


# ESTADO DE SALUD DE LOS ANIMALES

1. **EXCELENTE** – Salud óptima, sin signos de enfermedad ni lesiones.
2. **BUENO** – Salud general buena, sin problemas significativos.
3. **REGULAR** – Algunos signos menores de enfermedad o debilidad.
4. **MALO** – Enfermedad evidente o condición física deficiente.
5. **CRITICO** – Riesgo de muerte inminente, requiere atención urgente.
6. **RECUPERACION** – Animal que estuvo enfermo y está en proceso de mejora.
7. **OBSERVACION** – Aún sin diagnóstico claro, pero muestra posibles signos de enfermedad.

