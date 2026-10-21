# Escuela de Negocios — Sothysalud IPS

Ruta de formación comercial: 14 módulos, examen de certificación con dos
intentos y emisión de diploma.

Publicada en **comercial.sothysaludips.com** (proyecto Vercel
`escueladenegocios-sothysaludips`).

## Estructura

```
index.html                     el sitio: solo marcado
assets/css/escuela.css         estilos
assets/js/escuela.js           navegación, examen, certificado, herramientas
assets/img/                    logo y portada
certificados/                  las tres plantillas de diploma en SVG
vercel.json                    cabeceras de caché
```

Sitio estático sin build ni dependencias. Lo único que pide a la red es la
fuente DM Sans de Google Fonts.

Hasta octubre de 2026 todo esto era un solo `index.html` de 4,2 MB, del
cual el 96% eran dos imágenes en base64. Ningún cambio se podía revisar en
git: cualquier diff mostraba millones de caracteres. Separados, el marcado
queda en 73 KB y se lee.

## Módulos

| Página | Módulo |
|---|---|
| `page-formacion` | Esencia, historia y venta responsable |
| `page-propuesta` | Propuesta de valor |
| `page-mercado` | Mercado de salud ocupacional en Colombia |
| `page-normativa` | Normativa SST |
| `page-perfiles` | Perfiles del equipo comercial |
| `page-estructura` | Estructura y fases de crecimiento |
| `page-prospeccion` | Prospección: primeros 30 días |
| `page-playbook` | Playbook de ventas |
| `page-objeciones` | Manejo de objeciones |
| `page-pipeline` | Pipeline demo |
| `page-scoring` | Scoring de clientes |
| `page-riesgos` | Riesgos y pensamiento estratégico |
| `page-kit` | Kit de activación |
| `page-checklist` | Checklist operativo |
| `page-examen` | Evaluación final y certificado |

La numeración de módulos que se ve en pantalla es la original del curso y
salta algunos números, porque hay contenido que se retiró.

## Qué se retiró, y por qué

De la revisión de octubre de 2026:

- **Comisiones y KPIs**, **Filtros de selección y entrevista** y
  **Onboarding 90 días** salieron de la Escuela. Le dicen al comercial cómo
  se le paga, cómo se le selecciona y cómo se le acompaña: es material del
  administrador, no del estudiante. El marcado se conserva íntegro en
  `escuela-admin/contenido/modulos-administrador.html` para montarlo allí.
- La pestaña **Condiciones de paso** del módulo de estructura, por lo
  mismo: decide cuándo la compañía abre una fase nueva, no qué hace el
  comercial hoy.
- Las cifras de **base salarial y comisión** de los cinco perfiles.
- El bloque **Riesgos de crecer demasiado rápido** y las tarjetas de manual
  de marca de la portada: la escuela habla con autoridad, no justifica por
  qué está hecha como está.

Al retirarse el módulo de comisiones desapareció también la función
`UnlockPrivate`, que llevaba una clave en duro.

## El examen

Toma 15 preguntas al azar de un banco de 30. Aprueba con 80, permite 2
intentos y los cuenta por correo. Con 90 la certificación es destacada y
con 100 es Distinción Estrella Sirio. Agotados los dos intentos,
`ShowAdministrativeReview` arma un reporte para administración en vez de
descartar al aspirante.

**Los intentos se cuentan en `localStorage`**, es decir en el navegador del
estudiante: basta con borrar los datos del sitio para volver a tener dos, y
la administración no se entera. Esto solo se resuelve con la base de datos
del administrador.

## Los diplomas

Las tres plantillas están en `certificados/` como SVG. Van como archivos
aparte y no incrustadas, porque suman 8 MB y en base64 pasarían de 10 MB
que descargaría todo estudiante solo para leer el módulo 1. Así el
navegador las pide únicamente al generar el diploma.

`GenerateCert` elige la plantilla según el puntaje y la aplica como fondo
del `.cert-stage`. Encima se posicionan en absoluto el nombre, la fecha y
el código, con coordenadas propias por plantilla porque las tres
distribuyen el espacio distinto. Los porcentajes del CSS son el **centro**
de cada elemento, no su esquina.

Si no hay plantilla, el diploma se dibuja con un diseño de respaldo en CSS
(clase `cert-plain`), de modo que el examen nunca queda sin certificado.

Al cambiar una plantilla hay que volver a medir sus tres posiciones: poner
una rejilla de porcentajes sobre el SVG y leer dónde cae cada hueco.

## Sobre esta hoja de estilos

`escuela.css` acumula varias generaciones de rediseño, con reglas repetidas
que se pisan entre sí: hay una docena de reglas `.hero-home` y cinco de
`.cert-stage`. Dos defectos salieron de ahí: el diploma nunca mostraba su
plantilla, y la portada dejaba el texto en 268 px porque una regla tardía
le fijaba 500 px mínimos a la imagen.

Antes de añadir una regla conviene buscar si el selector ya existe más
abajo. Los arreglos nuevos van al final, con su comentario, y con dos
clases cuando necesitan ganarle a una regla `!important` previa.
