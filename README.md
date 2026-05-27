Perfecto, Black 🙌. Te dejo el **README final para el frontend**, ya integrado con las secciones útiles y manteniendo el encabezado y enlaces que tenías. Este archivo reemplaza el actual `frontend/README.md` y está pensado para que cualquier desarrollador nuevo pueda levantar el proyecto sin perder tiempo.

---

```markdown
[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/yEbgfP-q)

# ✈️ Frontend - Next.js

Frontend de la aplicación construido con **Next.js 14** + **TailwindCSS**, dentro de un monorepo con **Express**, **MongoDB** y **Docker**.

---

## 📚 Documentación

- **Backend:** Para información completa sobre la API de backend, consulta la [documentación completa del backend](../backend/src/README.md).
- **Frontend:** Este documento explica cómo lanzar y usar el frontend.

---

## 🚀 Tecnologías principales

- [Next.js 14](https://nextjs.org/) con router `app/`.
- [React](https://react.dev/) para componentes.
- [TailwindCSS](https://tailwindcss.com/) para estilos.
- [Docker](https://www.docker.com/) para despliegue reproducible.
- [pnpm](https://pnpm.io/) como gestor de dependencias.

---

## 📂 Estructura de carpetas
```

frontend/
app/ # Páginas con el router de Next.js
home/ # Página principal
login/ # Login
register/ # Registro
users/ # Gestión de usuarios
flights/ # Listado de vuelos
new/ # Crear vuelo
[id]/ # Detalle de vuelo
components/ # Componentes reutilizables
auth/ # Login/Logout
flights/ # FlightCard, FlightForm, etc.
ui/ # Button, Input, Loader, Navbar...
context/ # Contextos globales (Auth, Theme)
utils/ # Funciones auxiliares (API, config)
public/images/ # Recursos estáticos (destinos)
styles/ # CSS global

````

---

## ⚙️ Configuración

### Variables de entorno
El archivo `.env.local` define las variables necesarias:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
API_BASE_URL=http://backend:4000/api/v1
````

Ejemplo en `.env.local.example`.

---

## 🐳 Levantar con Docker

Desde la raíz del proyecto:

```bash
docker compose build
docker compose up -d
```

El frontend estará disponible en:

```
http://localhost:3000
```

---

## 🖥️ Levantar en local (sin Docker)

```bash
pnpm install
pnpm dev
```

Abrir en navegador:

```
http://localhost:3000
```

---

## 🔑 Autenticación

- El contexto `AuthContext.jsx` gestiona login/logout y token JWT.
- El token se añade en las peticiones al backend (`Authorization: Bearer <token>`).
- Rutas protegidas usan el componente `ProtectedRoute`.

---

## ✨ Funcionalidades principales

- **Usuarios**: registro, login, listado, edición y eliminación.
- **Vuelos**: creación, listado, detalle, edición y eliminación.
- **UI**: componentes reutilizables (`Button`, `Input`, `FormContainer`, `Loader`).
- **Temas**: `ThemeToggle` para modo claro/oscuro.

---

## 🛠️ Comandos útiles

### Desarrollo local

```bash
pnpm dev        # Levanta el frontend en modo desarrollo
pnpm build      # Compila para producción
pnpm start      # Arranca el build en producción
pnpm lint       # Linter
```

### Docker

```bash
docker compose build        # Construye imágenes
docker compose up -d        # Levanta stack completo
docker compose logs -f      # Sigue logs en tiempo real
docker compose down         # Apaga contenedores
```

---

## 🔍 Ejemplos de curl

### Crear vuelo

```bash
curl -X POST http://localhost:4000/api/v1/flights \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "origin": "Madrid",
    "destination": "Paris",
    "time_departure": "2026-01-01T09:00:00.000Z",
    "status": "on-time"
  }'
```

### Editar vuelo

```bash
curl -X PUT http://localhost:4000/api/v1/flights/<ID> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "origin": "Madrid",
    "destination": "Roma",
    "time_departure": "2026-01-02T10:00:00.000Z",
    "status": "delayed"
  }'
```

---

## 🌙 Dark Mode

Tailwind está configurado con `dark: 'class'`.
Para evitar parpadeo al cargar, añade en `app/layout.jsx`:

```jsx
<script
  dangerouslySetInnerHTML={{
    __html: `
      if (localStorage.theme === 'dark' ||
          (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    `,
  }}
/>
```

---

## 🧪 Depuración y problemas comunes

- **Tailwind**: si no ves cambios, revisa `globals.css` y recompila (`pnpm dev` / `pnpm build`).
- **API**: comprueba `NEXT_PUBLIC_API_BASE_URL`, CORS y que el backend esté levantado.
- **Auth**: revisa `localStorage` (`token`, `user`) y el manejo en `AuthContext`.

---

## 👨‍💻 Contribución

1. Crear rama: `git checkout -b feature/nueva-funcionalidad`.
2. Hacer cambios y pruebas locales.
3. Validar con Docker.
4. Abrir PR en GitHub.

---

## 📌 Notas finales

Este frontend está diseñado para ser **minimalista, reutilizable y fácil de mantener**.
El objetivo es que cualquier desarrollador pueda levantarlo en minutos y entender la estructura sin perder tiempo.

```

```
