import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, combineLatest, map, of, shareReplay } from 'rxjs';
import { Noticia } from '../models/news.model';
import { STORAGE_KEYS, StorageService } from './storage.service';

/** seed (assets/data/noticias.json) + news_custom - deleted_news. */
@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  /** trigger */
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  /** seed cacheado */
  private readonly seed$: Observable<Noticia[]> = this.http
    .get<Noticia[]>('/assets/data/noticias.json')
    .pipe(
      catchError((e) => {
        console.error('NewsService: error al cargar noticias.json', e);
        return of([] as Noticia[]);
      }),
      shareReplay(1),
    );

  /** Seed filtrado + custom */
  getAllNews(): Observable<Noticia[]> {
    return combineLatest([this.seed$, this.refresh$]).pipe(
      map(([seed]) => {
        const custom = this.storage.getItem<Noticia[]>(STORAGE_KEYS.newsCustom) ?? [];
        const deletedIds = this.storage.getItem<string[]>(STORAGE_KEYS.deletedNews) ?? [];
        const customIds = new Set(custom.map((n) => n.id));

        // excluye las eliminadas Y las que ya tienen versión editada en custom:
        const filteredSeed = seed.filter(
          (n) => !deletedIds.includes(n.id) && !customIds.has(n.id),
        );

        return [...filteredSeed, ...custom].sort(
          (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
        );
      }),
    );
  }

  getNewsById(id: string): Observable<Noticia | null> {
    return this.getAllNews().pipe(map((all) => all.find((n) => n.id === id) ?? null));
  }

  getNewsByCategory(category: string): Observable<Noticia[]> {
    return this.getAllNews().pipe(map((all) => all.filter((n) => n.categoria === category)));
  }

  getFeaturedNews(): Observable<Noticia[]> {
    return this.getAllNews().pipe(map((all) => all.filter((n) => n.destacada === true)));
  }

  /** búsqueda case-insensitive, por título. */
  searchByTitle(query: string): Observable<Noticia[]> {
    const q = query.toLowerCase().trim();
    return this.getAllNews().pipe(
      map((all) => (q ? all.filter((n) => n.titulo.toLowerCase().includes(q)) : all)),
    );
  }


  addNews(data: Omit<Noticia, 'id'>): Noticia {
    const article: Noticia = {
      ...data,
      id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    };
    this.storage.appendToArray(STORAGE_KEYS.newsCustom, article);
    this.refresh$.next();
    return article;
  }


  updateNews(id: string, data: Partial<Noticia>): void {
    const custom = this.storage.getItem<Noticia[]>(STORAGE_KEYS.newsCustom) ?? [];
    const index = custom.findIndex((n) => n.id === id);
    if (index !== -1) {
      custom[index] = { ...custom[index], ...data };
      this.storage.setItem(STORAGE_KEYS.newsCustom, custom);
    } else {
      this.storage.appendToArray(STORAGE_KEYS.newsCustom, { ...data, id } as Noticia);
    }
    this.refresh$.next();
  }

  /** se elimina de news_custom y se marca en deleted_news. */
  deleteNews(id: string): void {
    this.storage.removeFromArray(STORAGE_KEYS.newsCustom, id);

    if (!id.startsWith('custom-')) {
      const deletedIds = this.storage.getItem<string[]>(STORAGE_KEYS.deletedNews) ?? [];
      if (!deletedIds.includes(id)) {
        this.storage.appendToArray(STORAGE_KEYS.deletedNews, id);
      }
    }
    this.refresh$.next();
  }
}
