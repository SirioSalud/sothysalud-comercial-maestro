# Escuela de Negocios — Sothysalud IPS

Ruta de formación comercial en una sola página: 18 módulos navegables,
examen final con certificado, módulo de comisiones protegido por clave y
una herramienta de scoring de clientes.

Publicada en **comercial.sothysaludips.com** (proyecto Vercel
`escueladenegocios-sothysaludips`). Este `index.html` es el fuente recuperado
del deployment de producción del 2 de septiembre de 2026, con las
correcciones de la revisión de octubre aplicadas.

## Estructura

Archivo único y autocontenido: no carga nada de la red salvo la fuente
DM Sans desde Google Fonts. CSS y JavaScript van en línea, y las dos
imágenes (logo y plantilla de diploma) van embebidas en base64 — que es
el 96% de los 4 MB del archivo. El código real son unas 182 KB.

## Módulos

| Página | Módulo |
|---|---|
| `page-formacion` | 1 · Esencia, historia y venta responsable |
| `page-propuesta` | 1 · Propuesta de valor |
| `page-mercado` | 2 · Mercado de salud ocupacional en Colombia |
| `page-normativa` | 3 · Normativa SST |
| `page-perfiles` | 4 · Perfiles del equipo comercial |
| `page-estructura` | 5 · Estructura y fases de crecimiento |
| `page-comisiones` | 6 · Comisiones y KPIs |
| `page-prospeccion` | 7 · Prospección: primeros 30 días |
| `page-playbook` | 8 · Playbook de ventas |
| `page-objeciones` | 9 · Manejo de objeciones |
| `page-pipeline` | 10 · Pipeline demo |
| `page-seleccion` | 11 · Filtros de selección y entrevista |
| `page-onboarding` | 12 · Onboarding 90 días |
| `page-scoring` | 13 · Scoring de clientes |
| `page-riesgos` | 14 · Riesgos y pensamiento estratégico |
| `page-kit` | 16 · Kit de activación |
| `page-checklist` | 17 · Checklist operativo |
| `page-examen` | Evaluación final y certificado |

El módulo 15 no existe en esta versión; la numeración salta del 14 al 16.

## Funcionamiento

La navegación la maneja `gp(id)`, que alterna la clase `active` entre los
`.page` y marca el botón del menú; `visited` lleva el progreso sobre los
módulos.

El módulo de comisiones está detrás de una clave (`UnlockPrivate`), y el
scoring de clientes calcula en vivo sobre los selectores del módulo 13.

### Examen final y certificado

El módulo `page-examen` fue reconstruido en octubre de 2026. El
JavaScript conservaba toda la lógica, pero su HTML no existía en el
deployment de producción: de los 45 elementos que el script busca por id,
37 faltaban. Se rehízo el marcado contra el CSS original, que sí había
sobrevivido.

El examen toma 15 preguntas al azar de un banco de 30, aprueba con 80 y
permite 2 intentos, contados por correo en `localStorage`. Con 90 la
certificación es destacada y con 100 es Distinción Estrella Sirio. Agotados
los dos intentos, `ShowAdministrativeReview` arma un reporte de revisión
administrativa en vez de descartar al aspirante.

### Los diplomas

Las tres plantillas están en `certificados/` como SVG: `aprobada.svg`,
`destacada.svg` y `sirio.svg`. Van como archivos aparte y no incrustadas en
base64 porque suman 8 MB, que en base64 pasarían de 10 MB y los
descargaría todo estudiante solo para leer el módulo 1. Así el navegador
los pide únicamente al generar el diploma.

`GenerateCert` elige la plantilla según el puntaje y la aplica como fondo
del `.cert-stage`. Sobre ella se posicionan en absoluto el nombre, la
fecha y el código de verificación, con un juego de coordenadas por
plantilla porque las tres distribuyen el espacio distinto.

Tres cosas que hubo que corregir para que esto funcionara:

- `GenerateCert` leía la constante de la plantilla pero nunca la usaba.
- Una regla `.cert-stage` suelta, de un diseño anterior de tres columnas,
  dejaba el contenedor en `display:grid` con `aspect-ratio:auto` y
  `background:transparent`, todo `!important`. Comparte especificidad con
  `.exact-diploma` y va después, así que ganaba ella y el fondo nunca se
  veía. El contenedor se fija ahora con `.cert-stage.exact-diploma`, que
  lleva dos clases y gana siempre.
- El nombre se medía en `vw`, es decir contra el ancho de la ventana y no
  del diploma, y en pantallas grandes se desbordaba sobre el cuerpo del
  texto. Ahora va en `cqw`, y si aun así no cabe en una línea,
  `AjustaNombre` lo reduce hasta que quepa.

Al cambiar una plantilla hay que volver a medir sus tres posiciones. El
método rápido es poner una rejilla de porcentajes sobre el SVG y leer
dónde cae cada hueco; los valores del CSS son el **centro** de cada
elemento, no su esquina.

## Despliegue

Sitio estático sin build. El deployment de producción se hizo con Vercel
Drop (arrastrando la carpeta), no desde Git.

Para desplegarlo desde este repositorio, en el proyecto de Vercel hay que
apuntar **Root Directory** a `escuela-de-negocios/`, o el build tomará la
raíz del repo, que contiene el Sistema Comercial Maestro.
