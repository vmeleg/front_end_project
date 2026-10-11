import { Injectable, inject, signal } from '@angular/core';
import { Noticia } from '../models/news.model';
import { STORAGE_KEYS, StorageService } from './storage.service';

/** UI compartida*/
@Injectable({ providedIn: 'root' })
export class LayoutService {
  private readonly storage = inject(StorageService);

  readonly sidebarOpen = signal(false);
  readonly searchOpen = signal(false);
  readonly searchQuery = signal('');

  openSidebar(): void {
    this.sidebarOpen.set(true);
    this.storage.setItem(STORAGE_KEYS.sidebarOpen, true);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
    this.storage.setItem(STORAGE_KEYS.sidebarOpen, false);
  }

  toggleSearch(): boolean {
    this.searchOpen.update((v) => !v);
    return this.searchOpen();
  }


  resetSearch(): void {
    this.searchOpen.set(false);
    this.searchQuery.set('');
  }


  readonly detailArticle = signal<Noticia | null>(null);

  openDetail(article: Noticia): void {
    this.detailArticle.set(article);
  }

  closeDetail(): void {
    this.detailArticle.set(null);
  }
}
