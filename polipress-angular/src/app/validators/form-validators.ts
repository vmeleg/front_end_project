import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * validaciones en los formularios
 */

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

const str = (c: AbstractControl): string => (c.value ?? '').toString();


export const requiredTrim: ValidatorFn = (c) =>
  str(c).trim().length > 0 ? null : { required: { message: 'Este campo es obligatorio.' } };


export const emailPattern: ValidatorFn = (c) =>
  EMAIL_PATTERN.test(str(c).trim())
    ? null
    : { email: { message: 'Ingresa un correo electrónico válido (ej: usuario@dominio.com).' } };


export function minLengthTrim(min: number): ValidatorFn {
  return (c) =>
    str(c).trim().length >= min
      ? null
      : { minlength: { message: `Debe tener al menos ${min} caracteres.` } };
}


export const phoneColombiaOptional: ValidatorFn = (c) => {
  const cleaned = str(c).trim().replace(/[\s\-().]/g, '');
  if (cleaned === '' || cleaned === '+57') return null;
  const withoutPrefix = cleaned.startsWith('+57') ? cleaned.slice(3) : cleaned;
  return /^[36][0-9]{9}$/.test(withoutPrefix)
    ? null
    : {
      phone: {
        message: 'Ingresa un número colombiano válido (ej: +57 300 123 4567 o 3001234567).',
      },
    };
};


export function matchField(otherField: string): ValidatorFn {
  return (c) => {
    const other = c.parent?.get(otherField);
    return other && c.value === other.value
      ? null
      : { match: { message: 'Los valores no coinciden.' } };
  };
}


export function firstError(errors: ValidationErrors | null): string {
  if (!errors) return '';
  const first = Object.values(errors)[0] as { message?: string } | undefined;
  return first?.message ?? '';
}


export function validateAll(form: FormGroup): boolean {
  Object.values(form.controls).forEach((c) => c.updateValueAndValidity({ emitEvent: false }));
  form.markAllAsTouched();
  return form.valid;
}


export function isInvalid(form: FormGroup, name: string): boolean {
  const c = form.get(name);
  return !!c && c.touched && c.invalid;
}

export function errorOf(form: FormGroup, name: string): string {
  const c = form.get(name);
  return c && c.touched ? firstError(c.errors) : '';
}
