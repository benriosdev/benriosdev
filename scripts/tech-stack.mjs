// Genera images/tech-stack-light.svg e images/tech-stack-dark.svg.
// Uso: node scripts/tech-stack.mjs
// Los logos salen de scripts/icons.json (simple-icons 16.30.0, CC0).
import { readFileSync, writeFileSync } from 'node:fs';

const icons = JSON.parse(readFileSync(new URL('icons.json', import.meta.url), 'utf8'));

const ESTADOS = {
  aprendiendo: { titulo: 'Aprendiendo', texto: 'Explorando y adquiriendo conocimientos.' },
  aplicando: { titulo: 'Aplicándolo en proyectos', texto: 'Poniéndolo en práctica en proyectos reales.' },
  consolidando: { titulo: 'Consolidando fundamentos', texto: 'Reforzando la base y profundizando.' },
  flujo: { titulo: 'Parte de mi flujo de trabajo', texto: 'Uso habitual en mi día a día.' },
};

// color: un hex para los dos temas, { light, dark } o 'texto' para usar el color del texto.
const BLOQUES = [
  {
    titulo: 'Backend & Datos',
    sub: 'Lógica · Bases de datos · Servicios en la nube',
    items: [
      { nombre: 'Java', icono: 'taza', color: '#E76F00', estados: ['consolidando'], proyectos: ['Fundamentos Básicos', 'Piedra, Papel o Tijera'] },
      { nombre: 'PostgreSQL', icono: 'postgresql', estados: ['aprendiendo', 'aplicando'], proyectos: ['MiFP'] },
      { nombre: 'Supabase', icono: 'supabase', color: { light: '#24B47E', dark: '#3FCF8E' }, estados: ['aprendiendo', 'aplicando'], proyectos: ['MiFP'] },
      { nombre: 'SQL', icono: 'database', estados: ['aprendiendo', 'aplicando'], proyectos: ['Base de datos de Estudiantes'] },
    ],
  },
  {
    titulo: 'Frontend',
    sub: 'Interfaz · Estilos · Experiencia de usuario',
    items: [
      { nombre: 'JavaScript', icono: 'javascript', color: { light: '#D4B400', dark: '#F7DF1E' }, estados: ['aprendiendo', 'aplicando'], proyectos: ['Portfolio Web', 'Guía interactiva de JS'] },
      { nombre: 'TypeScript', icono: 'typescript', estados: ['aprendiendo', 'aplicando'], proyectos: ['MiFP', 'FP Docs', 'Tests Interactivos App'] },
      { nombre: 'HTML5', icono: 'html5', estados: ['consolidando'], proyectos: ['Portfolio Web'] },
      { nombre: 'CSS', icono: 'css', color: { light: '#663399', dark: '#A77BDB' }, estados: ['consolidando'], proyectos: ['Portfolio Web', 'Tests Interactivos App'] },
      { nombre: 'Tailwind CSS', icono: 'tailwindcss', estados: ['aplicando'], proyectos: ['MiFP'] },
    ],
  },
  {
    titulo: 'Frameworks & Librerías',
    sub: 'Desarrollo web · Componentes · Aplicaciones',
    items: [
      { nombre: 'Bootstrap', icono: 'bootstrap', estados: ['aprendiendo'], proyectos: ['Modernización de páginas'] },
      { nombre: 'Astro', icono: 'astro', estados: ['aprendiendo', 'aplicando'], proyectos: ['FP Docs', 'Tests Interactivos App'] },
      { nombre: 'React', icono: 'react', color: { light: '#0A8FB8', dark: '#61DAFB' }, estados: ['aprendiendo', 'aplicando'], proyectos: ['MiFP'] },
      { nombre: 'Next.js', icono: 'nextdotjs', color: 'texto', estados: ['aprendiendo', 'aplicando'], proyectos: ['MiFP'] },
      { nombre: 'Angular', icono: 'angular', color: '#DD0031', estados: ['aprendiendo'], proyectos: [] },
    ],
  },
  {
    titulo: 'Herramientas & Otros',
    sub: 'Productividad · Control de versiones · Entorno',
    items: [
      { nombre: 'Git & GitHub', icono: 'git', estados: ['flujo'], proyectos: ['Todos mis proyectos'] },
      { nombre: 'Node.js', icono: 'nodedotjs', estados: ['aprendiendo', 'aplicando'], proyectos: ['MiFP'] },
      { nombre: 'Vitest', icono: 'vitest', color: { light: '#1FA463', dark: '#00FF74' }, estados: ['aprendiendo', 'aplicando'], proyectos: ['Tests Interactivos App'] },
      { nombre: 'Cloudflare', icono: 'cloudflare', estados: ['aprendiendo', 'aplicando'], proyectos: ['MiFP', 'Portfolio Web'] },
      { nombre: 'Vercel', icono: 'vercel', color: 'texto', estados: ['aprendiendo', 'aplicando'], proyectos: ['MiFP'] },
    ],
  },
];

// Mismos azules que los botones de buttons/.
const TEMAS = {
  light: {
    panel: '#F8FBFF', borde: '#CFE2FF', texto: '#1F2328', suave: '#59636E', acento: '#1769D1',
    pill: '#EEF6FF', pillBorde: '#CFE2FF', pillTexto: '#0B4FA8',
    estados: { aprendiendo: '#1A7F37', aplicando: '#9A6700', consolidando: '#BC4C00', flujo: '#1769D1' },
  },
  dark: {
    panel: '#0F1626', borde: '#1E3A5F', texto: '#E6EDF3', suave: '#8B949E', acento: '#38A8FF',
    pill: '#16233A', pillBorde: '#24406A', pillTexto: '#CFE6FF',
    estados: { aprendiendo: '#3FB950', aplicando: '#D29922', consolidando: '#F0883E', flujo: '#38A8FF' },
  },
};

// Trazos en caja de 24, adaptados de Lucide (ISC). Sirven para los estados y como logo propio.
const GLIFOS = {
  aprendiendo: '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>',
  aplicando: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  consolidando: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M12 9v6M8 3v6M16 3v6M8 15v6M16 15v6"/>',
  flujo: '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7"/><path d="M12 2v3M12 19v3M4.9 4.9 7 7M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1"/>',
  taza: '<path d="M10 2v2M14 2v2M6 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/>',
  database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>',
};

const FUENTE = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif`;
const W = 1200;
const GAP = 16;
const COL = (W - GAP) / 2;
const LEYENDA_H = 76;
const CABECERA_H = 58;
const PAD = 20;
const FILA_MIN = 46;
const PILL = { h: 26, fuente: 12.5, pad: 10, gap: 8, linea: 6 };
const PILLS_X = 236;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
// Estimación del ancho del texto (sin métricas reales), con algo de margen.
const ancho = (s, size) => [...s].length * size * 0.53;

const glifo = (clave, x, y, color, size = 18, grosor = 2.2) =>
  `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="${grosor}" stroke-linecap="round" stroke-linejoin="round">${GLIFOS[clave]}</g>`;

function colorDe(item, tema, t) {
  const c = item.color ?? (GLIFOS[item.icono] ? t.acento : `#${icons[item.icono].hex}`);
  if (c === 'texto') return t.texto;
  return typeof c === 'object' ? c[tema] : c;
}

function logo(item, x, y, tema, t) {
  if (GLIFOS[item.icono]) return glifo(item.icono, x, y, colorDe(item, tema, t), 26, 2);
  return `<svg x="${x}" y="${y}" width="26" height="26" viewBox="0 0 24 24"><path fill="${colorDe(item, tema, t)}" d="${icons[item.icono].path}"/></svg>`;
}

// Reparte los proyectos en líneas que caben en el hueco de la fila.
function lineasDePills(proyectos) {
  const max = COL - PAD - PILLS_X;
  const lineas = [[]];
  let usado = 0;
  for (const p of proyectos) {
    const w = ancho(p, PILL.fuente) + PILL.pad * 2;
    if (usado > 0 && usado + PILL.gap + w > max) {
      lineas.push([]);
      usado = 0;
    }
    lineas.at(-1).push({ texto: p, w });
    usado += (usado > 0 ? PILL.gap : 0) + w;
  }
  return lineas;
}

function altoFila(item) {
  const n = lineasDePills(item.proyectos).length;
  return Math.max(FILA_MIN, n * PILL.h + (n - 1) * PILL.linea + 20);
}

const altoBloque = (b) => CABECERA_H + 8 + b.items.reduce((s, i) => s + altoFila(i), 0) + 10;

function bloque(b, x, y, h, tema, t) {
  const partes = [
    `<rect x="${x + 0.75}" y="${y + 0.75}" width="${COL - 1.5}" height="${h - 1.5}" rx="14" fill="${t.panel}" stroke="${t.borde}" stroke-width="1.5"/>`,
    `<text x="${x + PAD}" y="${y + 36}" font-size="20" font-weight="700" fill="${t.texto}">${esc(b.titulo)}</text>`,
    `<text x="${x + COL - PAD}" y="${y + 36}" font-size="13" fill="${t.suave}" text-anchor="end">${esc(b.sub)}</text>`,
    `<path d="M${x + PAD} ${y + CABECERA_H}H${x + COL - PAD}" stroke="${t.borde}"/>`,
  ];
  let fy = y + CABECERA_H + 8;
  for (const item of b.items) {
    const fh = altoFila(item);
    const cy = fy + fh / 2;
    partes.push(logo(item, x + PAD, cy - 13, tema, t));
    partes.push(`<text x="${x + 60}" y="${cy}" dominant-baseline="central" font-size="15" font-weight="600" fill="${t.texto}">${esc(item.nombre)}</text>`);
    item.estados.forEach((e, i) => partes.push(glifo(e, x + 176 + i * 24, cy - 9, t.estados[e])));
    const lineas = lineasDePills(item.proyectos);
    let py = cy - (lineas.length * PILL.h + (lineas.length - 1) * PILL.linea) / 2;
    for (const linea of lineas) {
      let px = x + PILLS_X;
      for (const p of linea) {
        partes.push(`<rect x="${px}" y="${py}" width="${p.w}" height="${PILL.h}" rx="${PILL.h / 2}" fill="${t.pill}" stroke="${t.pillBorde}"/>`);
        partes.push(`<text x="${px + p.w / 2}" y="${py + PILL.h / 2}" dominant-baseline="central" text-anchor="middle" font-size="${PILL.fuente}" font-weight="500" fill="${t.pillTexto}">${esc(p.texto)}</text>`);
        px += p.w + PILL.gap;
      }
      py += PILL.h + PILL.linea;
    }
    fy += fh;
  }
  return partes.join('\n');
}

// Cada celda de la leyenda mide lo que su texto, y el sobrante se reparte.
function leyenda(tema, t) {
  const entradas = Object.entries(ESTADOS);
  const base = entradas.map(([, e]) => 66 + Math.max(ancho(e.titulo, 14.5), ancho(e.texto, 12)));
  const extra = (W - base.reduce((s, w) => s + w, 0)) / entradas.length;
  const partes = [`<rect x="0.75" y="0.75" width="${W - 1.5}" height="${LEYENDA_H - 1.5}" rx="14" fill="${t.panel}" stroke="${t.borde}" stroke-width="1.5"/>`];
  let x = 0;
  entradas.forEach(([clave, e], i) => {
    if (i > 0) partes.push(`<path d="M${x} 18V${LEYENDA_H - 18}" stroke="${t.borde}"/>`);
    partes.push(glifo(clave, x + 18, LEYENDA_H / 2 - 12, t.estados[clave], 24, 2));
    partes.push(`<text x="${x + 52}" y="32" font-size="14.5" font-weight="700" fill="${t.estados[clave]}">${esc(e.titulo)}</text>`);
    partes.push(`<text x="${x + 52}" y="52" font-size="12" fill="${t.suave}">${esc(e.texto)}</text>`);
    x += base[i] + extra;
  });
  return partes.join('\n');
}

function svg(tema) {
  const t = TEMAS[tema];
  const filas = [BLOQUES.slice(0, 2), BLOQUES.slice(2, 4)];
  const partes = [leyenda(tema, t)];
  let y = LEYENDA_H + GAP;
  for (const par of filas) {
    const h = Math.max(...par.map(altoBloque));
    par.forEach((b, i) => partes.push(bloque(b, i * (COL + GAP), y, h, tema, t)));
    y += h + GAP;
  }
  const H = y - GAP;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tech stack de benriosdev">
<title>Tech stack de benriosdev</title>
<g font-family="${FUENTE}">
${partes.join('\n')}
</g>
</svg>
`;
}

for (const tema of Object.keys(TEMAS)) {
  const destino = new URL(`../images/tech-stack-${tema}.svg`, import.meta.url);
  writeFileSync(destino, svg(tema));
  console.log(`images/tech-stack-${tema}.svg`);
}
