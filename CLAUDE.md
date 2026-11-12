# sothysalud-comercial-maestro — instrucciones para Claude

## Al empezar cada sesión: identificar el equipo
Los proyectos de Sothysalud se trabajan desde varios computadores. El registro
está en [EQUIPOS.md](EQUIPOS.md), igual en todos los repositorios. Al comenzar:
1. Lee el nombre técnico del equipo (`$env:COMPUTERNAME` en PowerShell).
   - Si la sesión corre en la nube (claude.ai/code), no hay computador local: díselo al usuario y no lo registres como equipo.
2. Búscalo en [EQUIPOS.md](EQUIPOS.md).
   - Si está, dile al usuario desde qué equipo está trabajando (por su nombre, por ejemplo "Estás en el Equipo Consultorio 1 Sothysalud").
   - Si no está, avísale que está en un computador nuevo y pregúntale cómo quiere llamarlo. Agrégalo a EQUIPOS.md **en todos los repositorios de la lista** (no solo en este), configura `git config user.name "Sirio (<nombre>)"` y publica el registro.
3. Revisa que `git config user.name` corresponda a ese equipo.
