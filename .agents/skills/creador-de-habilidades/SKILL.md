---
name: creador-de-habilidades
description: >-
  Úsalo cuando el usuario te pida crear una nueva habilidad (skill) en el workspace. 
  Proporciona instrucciones paso a paso para estructurar y escribir los archivos necesarios de una nueva habilidad.
---

# Creador de Habilidades

Esta habilidad te proporciona las instrucciones necesarias para crear nuevas habilidades (skills) dentro del workspace.

## Estructura del Directorio

Una habilidad debe estar estructurada como un directorio dentro de la carpeta `skills/` en la raíz de personalización (por ejemplo, `.agents/skills/`).

```text
.agents/skills/<nombre-de-la-habilidad>/
├── SKILL.md          # Requerido: Archivo principal de instrucciones con frontmatter
├── scripts/          # Opcional: Scripts auxiliares
├── examples/         # Opcional: Implementaciones de referencia
├── resources/        # Opcional: Assets o plantillas adicionales
└── references/       # Opcional: Documentación detallada o manuales
```

## El Archivo Principal (`SKILL.md`)

El archivo `SKILL.md` debe comenzar con un bloque frontmatter en formato YAML que contenga los campos `name` y `description`.

### Plantilla de SKILL.md

```markdown
---
name: nombre-de-la-habilidad
description: >-
  Describe cuándo el agente debe usar esta habilidad. Usa tercera persona.
  Ejemplo: "Úsalo cuando el usuario pida ejecutar las pruebas de integración del servicio XYZ."
---

# Título de la Habilidad

Proporciona instrucciones claras, paso a paso, para que el agente las siga aquí.

## Pasos

1. Primer paso
2. Segundo paso
```

### Campos del Frontmatter

*   **`name`** (cadena, requerido): Un identificador único para la habilidad. Debe estar en minúsculas y separado por guiones (kebab-case).
*   **`description`** (cadena, requerido): Es el campo más crítico. El agente principal lee esta descripción para decidir si activa la habilidad para una solicitud dada por el usuario. Debe indicar claramente **qué** hace la habilidad y **cuándo** debe usarse.

## Mejores Prácticas para Escribir Habilidades

1.  **Divulgación Progresiva**: Mantén el archivo `SKILL.md` principal conciso. Usa el subdirectorio `references/` para documentación extensa y enlaza hacia él desde `SKILL.md`. El agente solo leerá esos archivos de referencia si los necesita, ahorrando contexto.
2.  **Scripts Ejecutables**: Encapsula secuencias de comandos complejas en scripts dentro del directorio `scripts/`. Enlázalos usando enlaces relativos para que el agente pueda encontrarlos y ejecutarlos fácilmente.
3.  **Pasos de Validación**: Siempre incluye instrucciones sobre cómo el agente puede verificar que un paso fue exitoso (por ejemplo, revisando un archivo de registro, ejecutando un comando de prueba).
4.  **No Duplicar**: No instruyas al agente en prácticas de programación generales o cosas que ya sabe. Enfócate estrictamente en los procedimientos únicos de tu flujo de trabajo.

Para crear una nueva habilidad, simplemente utiliza la herramienta de creación de archivos para generar el directorio correspondiente dentro de `.agents/skills/` y escribir el archivo `SKILL.md` siguiendo estas reglas.
