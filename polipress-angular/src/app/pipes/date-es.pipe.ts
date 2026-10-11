import { Pipe, PipeTransform } from '@angular/core';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** formato de fecha para fechas ISO (YYYY-MM-DD) */
export function formatDateEs(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}


export function formatUpdatedNow(now = new Date()): string {
  return `⏱ Actualizado: ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}, ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
}

@Pipe({ name: 'dateEs' })
export class DateEsPipe implements PipeTransform {
  transform(value: string): string {
    return formatDateEs(value);
  }
}
