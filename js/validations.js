/* ==========================================================================
   validations.js — Validación de formularios
   Validación inline, mensajes de error, formatos de email y teléfono.
   ========================================================================== */

const Validations = {

  /**
   * Valida que un valor no esté vacío.
   * @param {string} value
   * @returns {{ valid: boolean, message: string }}
   */
  validateRequired(value) {
    const trimmed = (value || '').trim();
    return {
      valid: trimmed.length > 0,
      message: 'Este campo es obligatorio.'
    };
  },

  /**
   * Valida formato de correo electrónico.
   * @param {string} value
   * @returns {{ valid: boolean, message: string }}
   */
  validateEmail(value) {
    const pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    return {
      valid: pattern.test((value || '').trim()),
      message: 'Ingresa un correo electrónico válido (ej: usuario@dominio.com).'
    };
  },

  /**
   * Valida formato de teléfono.
   * Acepta: +52 (55) 1234-5678, 5551234567, +1-800-555-0123, etc.
   * @param {string} value
   * @returns {{ valid: boolean, message: string }}
   */
  validatePhone(value) {
    const cleaned = (value || '').replace(/[\s\-\(\)\.]/g, '');
    const pattern = /^\+?[0-9]{7,15}$/;
    return {
      valid: pattern.test(cleaned),
      message: 'Ingresa un número de teléfono válido (ej: +1 (800) 555-0123).'
    };
  },

  /**
   * Valida longitud mínima.
   * @param {string} value
   * @param {number} min — Longitud mínima requerida.
   * @returns {{ valid: boolean, message: string }}
   */
  validateMinLength(value, min) {
    const trimmed = (value || '').trim();
    return {
      valid: trimmed.length >= min,
      message: `Debe tener al menos ${min} caracteres.`
    };
  },

  /**
   * Valida que dos valores coincidan (para confirmar contraseña).
   * @param {string} value
   * @param {string} confirmValue
   * @returns {{ valid: boolean, message: string }}
   */
  validateMatch(value, confirmValue) {
    return {
      valid: value === confirmValue,
      message: 'Los valores no coinciden.'
    };
  },

  /**
   * Muestra un error inline debajo de un campo de formulario.
   * @param {HTMLElement} inputElement — El input con error.
   * @param {string} message — Mensaje de error.
   */
  showFieldError(inputElement, message) {
    const formGroup = inputElement.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.add('form-group--invalid');

    let errorEl = formGroup.querySelector('.form-group__error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.classList.add('form-group__error');
      formGroup.appendChild(errorEl);
    }
    errorEl.textContent = message;
  },

  /**
   * Limpia el error inline de un campo.
   * @param {HTMLElement} inputElement
   */
  clearFieldError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.remove('form-group--invalid');
    const errorEl = formGroup.querySelector('.form-group__error');
    if (errorEl) errorEl.textContent = '';
  },

  /**
   * Valida todos los campos de un formulario según sus atributos data-validate.
   * Atributos soportados:
   *   data-validate="required"
   *   data-validate="email"
   *   data-validate="phone"
   *   data-validate="minlength" data-min="5"
   *   data-validate="match" data-match-target="#confirm-password"
   *   Múltiples reglas separadas por coma: data-validate="required,email"
   *
   * @param {HTMLFormElement} formElement
   * @returns {boolean} — true si todos los campos son válidos.
   */
  validateForm(formElement) {
    const fields = formElement.querySelectorAll('[data-validate]');
    let allValid = true;

    fields.forEach(field => {
      const rules = field.dataset.validate.split(',').map(r => r.trim());
      const value = field.value;
      let fieldValid = true;
      let errorMessage = '';

      for (const rule of rules) {
        let result;

        switch (rule) {
          case 'required':
            result = this.validateRequired(value);
            break;
          case 'email':
            result = this.validateEmail(value);
            break;
          case 'phone':
            result = this.validatePhone(value);
            break;
          case 'minlength': {
            const min = parseInt(field.dataset.min || '3', 10);
            result = this.validateMinLength(value, min);
            break;
          }
          case 'match': {
            const targetSelector = field.dataset.matchTarget;
            const targetEl = targetSelector ? formElement.querySelector(targetSelector) : null;
            const targetVal = targetEl ? targetEl.value : '';
            result = this.validateMatch(value, targetVal);
            break;
          }
          default:
            result = { valid: true, message: '' };
        }

        if (!result.valid) {
          fieldValid = false;
          errorMessage = result.message;
          break; /* Solo muestra el primer error */
        }
      }

      if (fieldValid) {
        this.clearFieldError(field);
      } else {
        this.showFieldError(field, errorMessage);
        allValid = false;
      }
    });

    return allValid;
  },

  /**
   * Inicializa validación inline en tiempo real para un formulario.
   * Valida al perder foco (blur) y al escribir (input) si ya tiene error.
   * @param {HTMLFormElement} formElement
   */
  initInlineValidation(formElement) {
    const fields = formElement.querySelectorAll('[data-validate]');

    fields.forEach(field => {
      field.addEventListener('blur', () => {
        this.validateForm(formElement);
      });

      field.addEventListener('input', () => {
        const formGroup = field.closest('.form-group');
        if (formGroup && formGroup.classList.contains('form-group--invalid')) {
          this.validateForm(formElement);
        }
      });
    });
  }
};
