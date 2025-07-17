# Pok-mon-CRUD-api
Evaluación 2 Mario campos 
<div style="background-color: #000000; color: #3B4CCA; border: 3px solid #FFDE00; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px #FFDE00; font-family: 'Arial', sans-serif;">

# <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png" width="40"> Pokémon Team Builder CRUD

![Pokémon Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/1200px-International_Pok%C3%A9mon_logo.svg.png)

Aplicación web para construir y gestionar equipos Pokémon con funcionalidades CRUD completas, conexión a PokeAPI y almacenamiento local.

## 🌟 Características Principales

| Funcionalidad               | Descripción                                                                 |
|-----------------------------|-----------------------------------------------------------------------------|
| **Listado de Pokémon**      | 151 Pokémon de la primera generación con imágenes de 8 bits                 |
| **Sistema de Equipos**      | Selección de hasta 6 Pokémon con persistencia en LocalStorage               |
| **Búsqueda Inteligente**    | Filtrado en tiempo real por nombre o número                                 |
| **Gestión de Equipos**      | CRUD completo: Crear, Leer, Actualizar y Eliminar equipos guardados         |
| **Validación de Datos**     | Verificación de correo electrónico y campos obligatorios                    |
| **Diseño Responsive**       | Adaptable a móviles y tablets                                               |

## 🚀 Cómo Usar

1. **Selecciona Pokémon**: Haz clic en cualquier Pokémon de la lista izquierda
2. **Organiza tu equipo**: Verás tus selecciones en el panel derecho (máx. 6)
3. **Personaliza**: 
   - Añade apodos a tus Pokémon
   - Elimina Pokémon no deseados
4. **Guarda tu equipo**:
   - Completa tu nombre y correo
   - Haz clic en "Guardar equipo"

```javascript
// Ejemplo de estructura de datos guardada
{
  nombre: "Entrenador",
  correo: "entrenador@pokemon.com",
  equipo: [
    {nombre: "pikachu", sprite: "url", apodo: "Rayito"},
    // ... hasta 6 Pokémon
  ]
}
