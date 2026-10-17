// Genera images/top-img-light.svg e images/top-img-dark.svg.
// Uso: node scripts/cabecera.mjs
// La ilustración (scripts/escritorio.webp) se recortó de la cabecera PNG anterior y va incrustada en el SVG,
// porque un SVG mostrado como imagen no puede cargar archivos externos.
import { readFileSync, writeFileSync } from 'node:fs';
import { BASE, esc } from './tema.mjs';

const escritorio = readFileSync(new URL('escritorio.webp', import.meta.url)).toString('base64');

const PERFIL = [
  ['usuario', 'benriosdev'],
  ['rol', 'Desarrollador web en formación'],
  ['estudios', 'DAW · Técnico en Telecomunicaciones'],
  ['lenguaje', 'Java'],
  ['enfoque', 'Desarrollo web full-stack'],
  ['ubicación', 'España'],
  ['estado', 'Disponible para colaborar'],
];

const TEMAS = {
  light: { ...BASE.light, prompt: '#1A7F37' },
  dark: { ...BASE.dark, prompt: '#3FB950' },
};

const MONO = `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace`;
const TITULO = 'benriosdev: desarrollador web en formación, estudiante de DAW';
const FS = 27;
const LH = 54;
const CHAR = FS * 0.6; // ancho de un carácter monoespaciado
// Tarjeta en la misma posición que en la cabecera original: las plantas y la mesa de la ilustración tapan su borde derecho.
const CARD = { x: 65, y: 115, w: 920, h: 650, rx: 24, barra: 72 };
const ILUSTRACION = { x: 790, y: 28, w: 978, h: 849 };
const TEXTO_X = 110;
const TEXTO_Y = 240;

function tarjeta(t) {
  const { x, y, w, h, rx, barra } = CARD;
  const cy = y + barra / 2;
  const r = barra * 0.16;
  const puntos = ['#FF5F57', '#FEBC2E', '#28C840']
    .map((c, i) => `<circle cx="${x + barra * 0.6 + i * r * 3.2}" cy="${cy}" r="${r}" fill="${c}"/>`)
    .join('');
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${t.panel}" stroke="${t.borde}" stroke-width="2.7"/>
<path d="M${x} ${y + barra}H${x + w}" stroke="${t.borde}" stroke-width="1.9"/>
${puntos}
<text x="${x + w / 2}" y="${cy}" dominant-baseline="central" text-anchor="middle" font-size="${FS * 0.85}" fill="${t.suave}">benriosdev: ~/perfil</text>`;
}

const prompt = (y, t, comando) =>
  `<text x="${TEXTO_X}" y="${y}" font-size="${FS}"><tspan fill="${t.prompt}" font-weight="700">benriosdev@github</tspan><tspan fill="${t.texto}">:</tspan><tspan fill="${t.acento}" font-weight="700">~</tspan><tspan fill="${t.texto}">$ ${esc(comando)}</tspan></text>`;

function perfil(t) {
  const partes = [prompt(TEXTO_Y, t, './perfil')];
  PERFIL.forEach(([clave, valor], i) => {
    const y = TEXTO_Y + LH * (i + 1.4);
    partes.push(`<text x="${TEXTO_X}" y="${y}" font-size="${FS}" fill="${t.suave}">${esc(clave)}</text>`);
    partes.push(`<text x="${TEXTO_X + CHAR * 11}" y="${y}" font-size="${FS}" fill="${t.texto}">${esc(valor)}</text>`);
  });
  const y = TEXTO_Y + LH * (PERFIL.length + 1.8);
  // "benriosdev@github:~$ " ocupa 21 caracteres.
  partes.push(prompt(y, t, ''));
  partes.push(`<rect class="cursor" x="${TEXTO_X + CHAR * 21}" y="${y - FS * 0.85}" width="${CHAR}" height="${FS * 1.1}" fill="${t.acento}"/>`);
  return partes.join('\n');
}

function svg(tema) {
  const t = TEMAS[tema];
  const { x, y, w, h } = ILUSTRACION;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1734" height="862" viewBox="40 20 1734 862" role="img" aria-label="${TITULO}">
<title>${TITULO}</title>
<style>
.cursor { animation: parpadeo 1.1s steps(1) infinite; }
@keyframes parpadeo { 50% { opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .cursor { animation: none; } }
</style>
<g font-family="${MONO}">
${tarjeta(t)}
${perfil(t)}
</g>
<image href="data:image/webp;base64,${escritorio}" x="${x}" y="${y}" width="${w}" height="${h}"/>
</svg>
`;
}

for (const tema of Object.keys(TEMAS)) {
  writeFileSync(new URL(`../images/top-img-${tema}.svg`, import.meta.url), svg(tema));
  console.log(`images/top-img-${tema}.svg`);
}
