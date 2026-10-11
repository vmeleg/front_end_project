/** categorías de noticias permitidas */
export type Categoria =
  | 'Deportes'
  | 'Finanzas'
  | 'Educación'
  | 'Tecnología'
  | 'Política'
  | 'Cultura'
  | 'Salud';

export interface Noticia {
  id: string;
  titulo: string;
  resumen: string;
  contenido: string;
  categoria: Categoria;
  imagen: string;
  autor: string;
  fecha: string; // ISO 8601: YYYY-MM-DD
  destacada: boolean;
  tiempoLectura: number; // minutos
}

/** orden de las pestañas de categoría en el header. */
export const CATEGORIAS: readonly Categoria[] = [
  'Deportes',
  'Finanzas',
  'Educación',
  'Tecnología',
  'Política',
  'Cultura',
  'Salud',
];

/**
 * mapa categoría → clase de badge (idéntico a NewsRenderer._categoryClass).
 */
export const CATEGORY_BADGE_CLASS: Readonly<Record<string, string>> = {
  Deportes: 'badge--deportes',
  Finanzas: 'badge--finanzas',
  Educación: 'badge--educacion',
  Tecnología: 'badge--tecnologia',
  Política: 'badge--politica',
  Cultura: 'badge--cultura',
  Salud: 'badge--salud',
  'Últimas Noticias': 'badge--ultimas',
};

export function badgeClass(categoria: string): string {
  return CATEGORY_BADGE_CLASS[categoria] ?? 'badge--ultimas';
}
