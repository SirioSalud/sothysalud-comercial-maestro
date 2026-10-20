# Escuela de Negocios — Sothysalud IPS

Ruta de formación comercial en una sola página. 19 módulos, examen final
con dos intentos y generación de certificado.

Publicada en **comercial.sothysaludips.com** (proyecto Vercel
`escueladenegocios-sothysaludips`). Este `index.html` es el fuente recuperado
del deployment de producción del 2 de septiembre de 2026, byte por byte.

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

## Funcionamiento

La navegación la maneja `gp(id)`, que alterna la clase `active` entre los
`.page` y marca el botón del menú; `visited` lleva el progreso sobre 19
páginas.

El examen final arranca en `StartFinalExam()`, baraja con `Shuffle()` y se
recorre con `QRender` / `QAnswer` / `QNext`. Hay un máximo de 2 intentos
(`MAX_ATTEMPTS`).

Al aprobar, `GenerateCert()` arma el diploma: `GetCertificationType()`
decide el nivel según el puntaje, `GetCertTemplate()` elige la plantilla
(`aprobada`, `destacada` o `sirio`) y `GetCertificateCode()` genera el
código de verificación.

El resultado sale por dos vías independientes: `SendCommercialReport()`
abre el cliente de correo del estudiante con el reporte ya redactado, y
`TryWebhookNotification()` hace POST a un Google Apps Script que registra
la aprobación.

## Despliegue

Sitio estático sin build. El deployment de producción se hizo con Vercel
Drop (arrastrando la carpeta), no desde Git.

Para desplegarlo desde este repositorio, en el proyecto de Vercel hay que
apuntar **Root Directory** a `escuela-de-negocios/`, o el build tomará la
raíz del repo, que contiene el Sistema Comercial Maestro.
