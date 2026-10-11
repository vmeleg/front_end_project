import { Injectable } from '@angular/core';


export const STORAGE_KEYS = {
  authSession: 'auth_session',
  newsCustom: 'news_custom',
  deletedNews: 'deleted_news',
  usersCustom: 'users_custom',
  sidebarOpen: 'sidebar_open',
  favoritesPrefix: 'favorites_',
} as const;

/** wrapper */
@Injectable({ providedIn: 'root' })
export class StorageService {
  /** parsea JSON de localStorage */
  getItem<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch (e) {
      console.warn(`StorageService.getItem: error al leer "${key}"`, e);
      return null;
    }
  }

  /** serializa a JSON y guarda. */
  setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`StorageService.setItem: error al escribir "${key}"`, e);
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }


  appendToArray<T>(key: string, item: T): void {
    const arr = this.getItem<T[]>(key) ?? [];
    arr.push(item);
    this.setItem(key, arr);
  }

  /** eliminación por `id` (arrays de objetos) o por igualdad (arrays de strings). */
  removeFromArray(key: string, id: string): void {
    const arr = this.getItem<unknown[]>(key) ?? [];
    const filtered = arr.filter((item) => {
      if (typeof item === 'object' && item !== null) {
        return (item as { id?: string }).id !== id;
      }
      return item !== id;
    });
    this.setItem(key, filtered);
  }
}
