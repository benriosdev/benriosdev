// Colores y utilidades comunes de las imágenes generadas (cabecera y tech stack).
// Mismos azules que los botones de buttons/.
export const BASE = {
  light: { panel: '#F8FBFF', borde: '#CFE2FF', texto: '#1F2328', suave: '#59636E', acento: '#1769D1' },
  dark: { panel: '#0F1626', borde: '#1E3A5F', texto: '#E6EDF3', suave: '#8B949E', acento: '#38A8FF' },
};

export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
