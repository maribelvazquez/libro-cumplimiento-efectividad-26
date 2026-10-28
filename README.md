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

**El sitio es el que ya existe: `libro-cumplimiento-efectividad.netlify.app`.**
Ésa es la dirección impresa en el colofón de la edición preliminar, así que no se
cambia el nombre del proyecto en Netlify. Si algún día se cambia, hay que corregir
el colofón **antes** de mandar a imprenta: son treinta y siete caracteres que
alguien va a teclear a mano desde una hoja de papel.

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
aviso-privacidad.html          Aviso de privacidad integral, LFPDPPP
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

**Se pide, y es obligatorio.** Los correos llegan al buzón `acceso-libro` de
**Netlify Forms** (*Netlify → Forms → acceso-libro*), donde se ven uno por uno y se
exportan a CSV con un botón. Cada renglón trae tres cosas: el correo, la fecha con
hora de la Ciudad de México, y si la persona marcó o no la casilla de no querer
publicidad.

**La clave no viaja en ese formulario.** El formulario oculto que Netlify detecta
declara nada más `correo`, `publicidad` y `fecha`; la clave va por separado, a la
función, y no queda registrada junto a los correos. La función tampoco escribe el
correo en sus logs: dos copias del mismo dato personal en dos lugares distintos es
una copia de más.

**Si el buzón falla, la puerta se abre igual.** El envío a Forms no se espera: lo
que el colofón prometió es el plan, no la lista de correos.

**Si algún día se quiere que el correo vuelva a ser opcional** son dos cambios:
quitar el atributo `required` del campo en `index.html` y el bloque de validación
marcado en `plan.js`.

### El aviso de privacidad

Un correo es un dato personal y la LFPDPPP pide avisar para qué se usa, así que la
puerta liga a `aviso-privacidad.html`, redactado con la misma estructura que el del
Laboratorio de Casos. Dice tres cosas que conviene no perder al editarlo:

- Las fracciones del artículo 17 que la persona marca **no se guardan en ninguna
  parte**: el plan se arma en su navegador. Esa selección revelaría a qué
  Actividades Vulnerables se dedica su empresa.
- La oposición a la publicidad se ejerce con la casilla de la puerta o escribiendo
  a `claudia@gmc360.com.mx`, y no afecta el acceso.
- Los derechos ARCO se ejercen en `claudia@gmc360.com.mx`, y la autoridad es la
  Secretaría Anticorrupción y Buen Gobierno.

El domicilio, la razón social y el correo de contacto salen del aviso que ya usa
GMC 360. Si cambian allá, cambian aquí.

---

## Cómo se actualiza el plan

Los 246 renglones salen del libro. Si cambia la norma y cambia un capítulo, el
plan se regenera desde el inventario del proyecto y se reemplaza `plan.json`.
Al subirlo, Netlify reconstruye el sitio solo.

Cada archivo que se agregue a `descargables/` queda disponible en cuanto se suba.

---

## El dominio, más adelante

La edición preliminar imprime `libro-cumplimiento-efectividad.netlify.app` porque
no había tiempo de registrar un dominio propio. Para la edición con ISBN conviene cambiarlo a un
subdominio de `gmc360.com.mx`: un libro dura años y un subdominio prestado dura
lo que dure la cuenta. Se hace en *Domain management → Add a domain* y con un
registro CNAME en el DNS del dominio. El sitio no cambia; sólo la dirección.

---

## Pendiente

- Los nueve formatos en Excel que los capítulos citan por su nombre.
- Que `CLAVE_LIBRO` esté configurada **antes** de imprimir el colofón, y que alguien
  entre una vez con la clave para comprobar que la puerta abre.
- Que el buzón `acceso-libro` aparezca en *Netlify → Forms* después del primer
  despliegue. Si no aparece, es que Netlify no detectó el formulario oculto de
  `index.html`: se arregla volviendo a desplegar.
- El ISBN, para la página legal de la edición comercial.
