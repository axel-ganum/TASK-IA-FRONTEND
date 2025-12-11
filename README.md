# Task Manager - Gestor de Tareas

![Task Manager](https://img.shields.io/badge/status-en%20desarrollo-yellow)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4.0.0-646CFF?logo=vite)

Una aplicación moderna de gestión de tareas construida con React, TypeScript y Vite. Esta aplicación te permite crear, ver, editar y eliminar tareas de manera sencilla e intuitiva.

## 🚀 Características

- 📝 Crear nuevas tareas con título, descripción y estado
- ✅ Marcar tareas como completadas
- ✏️ Editar tareas existentes
- 🗑️ Eliminar tareas
- 🔍 Filtrar tareas por estado (todas, pendientes, completadas)
- 📱 Diseño responsivo que funciona en cualquier dispositivo

## 🛠️ Tecnologías utilizadas

- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - React Router DOM
  - Styled Components / CSS Modules (según la configuración del proyecto)

## 📦 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión 16 o superior)
- npm o yarn

## 🚀 Cómo comenzar

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/task-manager.git
   cd task-manager
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   ```

4. **Abrir en el navegador**
   La aplicación estará disponible en [http://localhost:5173](http://localhost:5173)

## 🏗️ Estructura del proyecto

```
src/
├── components/         # Componentes reutilizables
│   ├── TaskList.tsx    # Lista de tareas
│   ├── TaskItem.tsx    # Elemento individual de tarea
│   ├── TaskForm.tsx    # Formulario para crear/editar tareas
│   └── TaskDetail.tsx  # Vista detallada de una tarea
├── pages/             
│   └── Home.tsx       # Página principal
├── App.tsx            # Componente raíz de la aplicación
└── main.tsx           # Punto de entrada de la aplicación
```

## 🧪 Ejecutar pruebas

```bash
npm test
# o
yarn test
```

## 🏗️ Construir para producción

```bash
npm run build
# o
yarn build
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, lee las [pautas de contribución](CONTRIBUTING.md) antes de enviar un pull request.

## 📧 Contacto

Si tienes alguna pregunta o sugerencia, no dudes en abrir un issue o contactarme directamente.

---

Hecho con ❤️ por [Tu Nombre]
