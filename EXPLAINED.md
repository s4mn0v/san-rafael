# Estructura de carpetas
```
├── app.config.ts                       # Configuración global del UI en Nuxt
├── app.vue                             # Componente raíz de la app Vue
├── error.vue                           # Vista de manejo de errores
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
│   │   ├── AnimalDetailsCard.vue       # Tarjeta de detalles de animal
│   │   ├── AnimalSearch.vue            # Buscador de animales
│   │   ├── AnimalTable.vue             # Tabla de animales
│   │   ├── DeleteAnimalCard.vue        # Confirmación de eliminación
│   │   ├── GenealogyTree.vue           # Árbol genealógico
│   │   ├── HealthHistoryCard.vue       # Historial de salud
│   │   ├── SaleInfoCard.vue            # Info de venta de animal
│   │   └── SaleModal.vue               # Modal de gestión de venta
|   |__ dashboard/                      # Componentes para la pagina principal         
|   |   |__ StadisticCards.vue          # Componente para la estadistica
|   |   |__ MetricsCards.vue            # Componente para la informacion de el inicio metricas          
│   ├── navigation/                     # Componentes de navegación
│   │   ├── BreadNav.vue                # Migas de pan
│   │   ├── NavButtons.vue              # Botones de navegación
│   │   └── Sidebar.vue                 # Barra lateral
│   ├── profile/                        # Componentes de perfil de usuario
│   │   └── ProfileEditor.vue           # Editor de perfil
│   │   └── DeleteProfiles.vue          # Modal para eliminiar uno o varios usuarios
│   │   └── ProfilesTable.vue          # Tabla apra enlisatar los usuarios dentro de la tabla profiles
│   ├── stock/                          # Componentes de inventario
│   │   └── StockTable.vue              # Tabla de stock
│   ├── theming/                        # Componentes de temas
│   │   ├── Theming.vue                 # Selector de tema
│   │   └── ThemingText.vue             # Textos de personalización
│   └── Logout.vue                      # Botón/componente de logout
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
│   ├── reproduction.vue                # Página de reproducción general
│   ├── sales.vue                       # Página de ventas
│   ├── settings.vue                    # Página de configuración
│   ├── profiles.vue                    # Gestión de usuarios
│   ├── animals/                        # Rutas de animales
│   │   ├── genealogy.vue               # Vista de genealogía
│   │   ├── index.vue                   # Listado de animales
│   │   ├── reproduction.vue            # Reproducción de animales
│   │   └── specific/
│   │       └── [id].vue                # Detalles de un animal (dinámico)
│   └── stock/                          # Rutas de inventario
│       ├── index.vue                   # Listado de stock
│       └── providers.vue               # Proveedores de inventario
├── server/                             # Backend (API) del proyecto
│   ├── api/                            # Rutas y controladores de la API
│   │   ├── animal/                     # Endpoints de animales
│   │   │   ├── animals.get.ts          # Obtener todos los animales
│   │   │   └── specific/
│   │   │       ├── [id].get.ts         # Obtener animal por ID
│   │   │       ├── [id].put.ts         # Actualizar animal por ID
│   │   │       └── [id].delete.ts      # Eliminar animal por ID
│   │   ├── dashboard/                  # Endpoints de la pagina de inicio de las metricas y estadistica
│   │   │   ├── metrics.get.ts          # Obtener animales, inventario, ventas
│   │   ├── genealogy/                  # Endpoints de genealogía
│   │   │   └── id/
│   │   │       └── [id].get.ts         # Obtener genealogía por ID
│   │   ├── health/                     # Endpoints de salud
│   │   │   ├── health.post.ts          # Registrar nuevo registro de salud
│   │   │   └── specific/
│   │   │       ├── [id].put.ts         # Actualizar record de salud
│   │   │       └── [id].delete.ts      # Eliminar record de salud
│   │   ├── sales/                      # Endpoints de ventas
│   │   │   └── specific/
│   │   │       ├── [id].post.ts        # Registrar venta por ID
│   │   │       └── [id].put.ts         # Actualizar venta por ID
│   │   ├── stock/                      # Endpoints de stock
│   │   │   ├── stock.get.ts            # Listar stock
│   │   │   └── specific/
│   │   │       └── [id].get.ts         # Stock por ID
│   │   ├── profiles/                   # Endpoints del apartado de usuarios (Profiles en la tabla)
│   │   │   ├── delete.delete.ts        # Eliminar usuarios (Authentication | Table Profiles)
│   │   │   └── profiles.get.ts         # Obtener usuarios
│   │   └── test.get.ts                 # Endpoint de prueba
│   └── tsconfig.json                   # Configuración TS para el servidor
└── types/                              # Definiciones de tipos TypeScript
    ├── animal.ts                       # Interfaces de animal
    ├── supabase.ts                     # Tipos generados de Supabase
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

