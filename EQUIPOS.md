# Equipos de trabajo — Sothysalud IPS

Computadores desde los que se trabajan **todos** los proyectos de Sothysalud
(Sirio, campus, sitio web, comerciales, escuela de negocios, base documental…).
Sirve para que Claude sepa desde qué equipo se trabaja y para saber desde dónde
se hizo cada cambio: cada equipo firma sus commits con su nombre, por ejemplo
`Sirio (Equipo Consultorio 1 Sothysalud)`.

> **Este archivo es el mismo en todos los repositorios.** Al agregar o cambiar
> un equipo, se actualiza en todos a la vez (lista abajo).

| Nombre del equipo | Nombre técnico (COMPUTERNAME) | Descripción | Registrado |
|---|---|---|---|
| Equipo Consultorio 1 Sothysalud | DESKTOP-39PDHO4 | ASUS ExpertCenter P440VA · Windows | 2026-11-11 |
| Equipo Recepción Sothysalud | DESKTOP-T8LQ5PV | ASUS ExpertCenter P440VA · Recepción · Windows 11 Pro | 2026-11-12 |

## Cómo agregar un equipo

1. En PowerShell, `$env:COMPUTERNAME` muestra el nombre técnico.
2. Se agrega una fila a esta tabla con el nombre que se le quiera dar.
3. Se copia este archivo actualizado a todos los repositorios de la lista.
4. En ese equipo, dentro de la carpeta de cada proyecto, los commits se firman con ese nombre:
   `git config user.name "Sirio (Nombre del equipo)"`.
   Para todos los proyectos de ese equipo de una vez: `git config --global user.name "Sirio (Nombre del equipo)"`.

## Sesiones en la nube

Cuando Claude trabaja desde claude.ai/code (en la nube) no corre en ningún
computador de esta lista: su nombre técnico es el del servidor (p. ej. `vm`).
Eso **no** se registra como equipo nuevo.

## Repositorios que llevan este registro

- SirioSalud/sirio-2026
- SirioSalud/campus-sothysalud
- SirioSalud/sothysaludips-web
- SirioSalud/sothysalud-comercial-maestro
- SirioSalud/sothysalud-comercial-
- SirioSalud/escuela-de-negocios
- SirioSalud/como-llegar-sothysalud
- SirioSalud/Base-Documental-Sothysalud-IPS
