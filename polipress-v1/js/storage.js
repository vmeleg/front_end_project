/* ==========================================================================
   storage.js — Helper modular para lectura/escritura en localStorage
   API global: Storage.getItem(), Storage.setItem(), etc.
   ========================================================================== */

const Storage = {
  /**
   * Obtiene y parsea un valor de localStorage.
   * @param {string} key — Clave a buscar.
   * @returns {*} Valor parseado o null si no existe / error.
   */
  getItem(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn(`Storage.getItem: error al leer "${key}"`, e);
      return null;
    }
  },

  /**
   * Serializa y guarda un valor en localStorage.
   * @param {string} key — Clave destino.
   * @param {*} value — Valor a guardar (se serializa a JSON).
   */
  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Storage.setItem: error al escribir "${key}"`, e);
    }
  },

  /**
   * Elimina una clave de localStorage.
   * @param {string} key — Clave a eliminar.
   */
  removeItem(key) {
    localStorage.removeItem(key);
  },

  /**
   * Añade un item a un array almacenado en localStorage.
   * Si la clave no existe, crea un array nuevo.
   * @param {string} key — Clave del array.
   * @param {*} item — Item a añadir.
   */
  appendToArray(key, item) {
    const arr = this.getItem(key) || [];
    arr.push(item);
    this.setItem(key, arr);
  },

  /**
   * Elimina un item de un array almacenado en localStorage por su propiedad "id"
   * o por igualdad directa (para arrays de strings).
   * @param {string} key — Clave del array.
   * @param {string} id — ID del item o valor directo a eliminar.
   */
  removeFromArray(key, id) {
    const arr = this.getItem(key) || [];
    const filtered = arr.filter(item => {
      if (typeof item === 'object' && item !== null) {
        return item.id !== id;
      }
      return item !== id;
    });
    this.setItem(key, filtered);
  }
};
