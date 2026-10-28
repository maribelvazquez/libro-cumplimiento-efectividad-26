# Del cumplimiento a la efectividad · sitio de descargables

Acompaña al libro de Maribel Vázquez Menchaca y Sandro García Rojas Castillo.
Quien tiene el libro entra con la clave impresa en el colofón, marca qué
fracciones del artículo 17 realiza, y el sitio le arma **su** plan de
implementación: nada más los papeles que le tocan, con sus plazos y quién los
firma. De ahí lo baja en Excel o lo imprime.

---

## Lo que hay que hacer en Netlify, una sola vez

**1. Conectar el repositorio.** En Netlify: *Add new site → Import an existing
project → GitHub*, y escoger `libro-cumplimiento-efectividad-26`. No hay que
configurar comando de build ni carpeta: el `netlify.toml` ya lo dice.

**Al crear el sitio, ponle de nombre `libro360`**, para que la dirección quede
`libro360.netlify.app`: es la que está impresa en el colofón de la edición
preliminar. Si ese nombre ya está ocupado, hay que escoger otro **y corregir el
colofón antes de mandar a imprenta**, porque son veinte caracteres que alguien
va a teclear a mano desde una hoja de papel.

**2. Poner la clave.** En *Site settings → Environment variables*, crear:

| Variable | Valor |
|---|---|
| `CLAVE_LIBRO` | la clave de la edición |

Para la primera edición es `CUMPLE360-2026`.

**La clave no está en este repositorio, y no debe estarlo.** Si viviera en el
código, el sitio publicado la enseñaría a cualquiera que abriera el código
fuente, y daría igual que el repositorio fuera privado. Existe en dos lugares
nada más: impresa en el colofón del libro, y en esa variable.

Mientras la variable no exista, el sitio contesta con un aviso que lo dice. Es a
propósito: más vale que avise a que parezca protegido sin estarlo.

**3. Cada tiraje, otra clave.** La clave lleva el año de la edición al final
justamente para eso. Se cambia el valor de la variable y se imprime la nueva en
el colofón del tiraje siguiente; la anterior deja de servir sin tocar el código.

---

## Qué hay aquí

```
index.html                     La página: puerta, selector de fracciones y plan
netlify/functions/plan.js      Valida la clave y entrega el plan
netlify/functions/plan.json    Los 246 renglones del libro, por capítulo y sector
netlify.toml                   Configuración del sitio
descargables/                  Los formatos en Excel (pendientes)
```

El plan **no** es un archivo del sitio: lo devuelve la función y sólo con la
clave correcta. Por eso `plan.json` vive dentro de `netlify/functions/` y el
`netlify.toml` niega cualquier petición directa a esa ruta.

---

## El correo de quien entra

Es opcional. Quien no lo quiera dar, entra igual: el libro ya se pagó y la
puerta no está para cobrar dos veces. Quien sí lo deja queda registrado en los
logs de la función (*Netlify → Functions → plan*). Si más adelante se quiere una
lista de verdad, el lugar para mandarla a una hoja o a un CRM está marcado en
`plan.js`.

---

## Cómo se actualiza el plan

Los 246 renglones salen del libro. Si cambia la norma y cambia un capítulo, el
plan se regenera desde el inventario del proyecto y se reemplaza `plan.json`.
Al subirlo, Netlify reconstruye el sitio solo.

Cada archivo que se agregue a `descargables/` queda disponible en cuanto se suba.

---

## El dominio, más adelante

La edición preliminar imprime `libro360.netlify.app` porque no había tiempo de
registrar un dominio propio. Para la edición con ISBN conviene cambiarlo a un
subdominio de `gmc360.com.mx`: un libro dura años y un subdominio prestado dura
lo que dure la cuenta. Se hace en *Domain management → Add a domain* y con un
registro CNAME en el DNS del dominio. El sitio no cambia; sólo la dirección.

---

## Pendiente

- Los diez formatos en Excel que los capítulos citan por su nombre.
- Que el sitio se llame `libro360`, o corregir el colofón si no se pudo.
- Que `CLAVE_LIBRO` esté configurada antes de imprimir el colofón.
- El ISBN, para la página legal de la edición comercial.
