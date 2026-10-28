// Valida la clave impresa en el libro y, sólo si es correcta, devuelve el plan.
//
// POR QUÉ ESTO ES UNA FUNCIÓN Y NO UN ARCHIVO ESTÁTICO. Si el plan viviera como
// un .json dentro del sitio, cualquiera podría pedir esa dirección directamente y
// la clave quedaría de adorno. Aquí los datos sólo salen con la clave correcta, y
// la clave nunca está en el código: vive en una variable de entorno de Netlify.
//
// LA CLAVE SE CONFIGURA EN NETLIFY, NO AQUÍ: Site settings → Environment variables
// → CLAVE_LIBRO. Si no está configurada, el sitio responde 503 a propósito, para
// que nadie crea que está protegido cuando no lo está.

const plan = require('./plan.json');

const json = (code, body) => ({
  statusCode: code,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  },
  body: JSON.stringify(body),
});

// Comparación de tiempo constante. Comparar con === filtra por la longitud y por
// el primer carácter distinto, lo que deja medir intentos. Con una clave de
// edición el riesgo es menor, pero no cuesta nada hacerlo bien.
function igual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const A = Buffer.from(a), B = Buffer.from(b);
  if (A.length !== B.length) {
    // Se compara de todos modos contra sí mismo para no revelar la longitud.
    require('crypto').timingSafeEqual(A, A);
    return false;
  }
  return require('crypto').timingSafeEqual(A, B);
}

const normaliza = (s) => String(s || '').trim().toUpperCase().replace(/\s+/g, '');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Método no permitido.' });

  const esperada = process.env.CLAVE_LIBRO;
  if (!esperada) {
    return json(503, {
      error: 'El sitio todavía no tiene configurada la clave de acceso. ' +
             'Si eres quien lo administra: Netlify → Site settings → Environment variables → CLAVE_LIBRO.',
    });
  }

  let cuerpo;
  try { cuerpo = JSON.parse(event.body || '{}'); }
  catch { return json(400, { error: 'Solicitud mal formada.' }); }

  if (!igual(normaliza(cuerpo.clave), normaliza(esperada))) {
    return json(401, {
      error: 'Esa clave no es la de este libro. Está impresa en el colofón, al final. ' +
             'Cópiala tal cual, con el guion.',
    });
  }

  // El correo se pide. Quien entra deja una dirección donde avisarle si un formato
  // cambia por una reforma o si se publica una corrección al libro.
  //
  // AQUÍ NO SE GUARDA NADA. El correo lo recibe Netlify Forms, al que la página lo
  // manda por separado (buzón «acceso-libro», en Netlify → Forms). Esta función
  // nada más comprueba que venga algo con forma de correo, y ni lo escribe en los
  // logs: dos copias del mismo dato personal en dos lugares distintos es una copia
  // de más.
  //
  // SI ALGÚN DÍA SE QUIERE QUE EL CORREO VUELVA A SER OPCIONAL, se quita este
  // bloque y el atributo «required» del campo en index.html. Son dos cambios.
  const correo = String(cuerpo.correo || '').trim().slice(0, 254);
  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(correo)) {
    return json(400, {
      error: 'Falta tu correo, o está incompleto. Es donde te avisamos si un ' +
             'formato cambia por una reforma.',
    });
  }

  return json(200, plan);
};
