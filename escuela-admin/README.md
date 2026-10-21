# Administración — Escuela de Negocios

Prototipo de interfaz del módulo administrador de la Escuela de Negocios.
Un solo `index.html`, sin dependencias ni build, con datos de prueba
escritos en el propio archivo.

**Nada está conectado a una base de datos.** El objetivo de esta etapa es
ver y discutir las pantallas antes de decidir el modelo de datos.

## Por qué vive aquí

Se acordó que el administrador sea un proyecto nuevo e independiente, con
su propio repositorio, base de datos y despliegue. Mientras ese repositorio
existe, el prototipo se guarda en esta carpeta, que está aislada a
propósito: no comparte nada con `escuela-de-negocios/` ni con la raíz, así
que se puede mover entera sin arrastrar historia ajena.

## Pantallas

| Vista | Qué resuelve |
|---|---|
| Panel | Cuántos hay, cuántos certificados, quién exige una decisión hoy |
| Comerciales | Listado con búsqueda y filtros por estado y perfil |
| Ficha | Datos, historial de intentos, certificación y decisiones pendientes |
| Certificados | Emitidos y verificación de un código por un tercero |
| Reentrenamientos | Vencimientos ordenados por fecha |
| Formación | Cuántos comerciales completaron cada módulo |
| Herramientas | Insumos que la administración publica al comercial |
| Auditoría | Quién hizo qué y cuándo |

Los cuatro estados del comercial son *En formación*, *Aprobado*,
*Revisión administrativa* y *Reentrenamiento vencido*. Agotados los dos
intentos nadie queda descartado automáticamente: la ficha ofrece intento
excepcional, validación oral, prueba práctica o banco de talento, que son
las rutas que ya contempla el reporte del examen.

## Decisiones de interfaz

Cada estado se dibuja con **icono y texto**, nunca con color solo: dos de
los cuatro colores de estado no alcanzan 3:1 de contraste sobre el fondo
claro, así que el color acompaña pero no comunica.

El gráfico de certificaciones usa una sola serie, con la escala redondeada
a un número par para que la marca intermedia del eje caiga en un entero, el
extremo superior de la barra redondeado y la base recta sobre la línea
cero, etiqueta directa solo en el máximo y detalle al pasar el cursor.

Las tablas se desplazan dentro de su tarjeta en pantallas pequeñas, de modo
que la página nunca desborda a lo ancho.

El campo de búsqueda ignora tildes y los puntos del documento: *julian*
encuentra a *Julián* y *1018447221* encuentra a *1.018.447.221*.

## Lo que falta para que sea real

1. Esquema en PostgreSQL: comerciales, intentos, certificados,
   reentrenamientos y auditoría.
2. Autenticación con roles de administrador y comercial.
3. Que el examen de la Escuela registre el intento contra la base de datos
   y no contra `localStorage`. **Hoy los intentos se cuentan en el
   navegador del comercial**: basta con borrar los datos del sitio para
   volver a tener dos intentos, y la administración no se entera.
4. Emisión y verificación de certificados del lado del servidor, para que
   el código del diploma se pueda validar sin confiar en quien lo presenta.

El campus de manipulación de alimentos (`campus-sothysalud`) resuelve estos
cuatro puntos sobre PostgreSQL con funciones serverless en Vercel, `pg`,
`jsonwebtoken` y `bcrypt`. Se decidió no construir sobre él, pero su
esquema y su manejo de certificados, reentrenamientos y auditoría sirven
como referencia de lo que ya está probado en producción.
