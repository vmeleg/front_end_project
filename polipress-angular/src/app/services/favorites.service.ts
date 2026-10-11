import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AuthSession } from '../models/user.model';
import { AuthService } from './auth.service';
import { STORAGE_KEYS, StorageService } from './storage.service';

/**
 * logica listado por `favorites_<userEmail>`.
 */
@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly storage = inject(StorageService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private readonly ids$ = new BehaviorSubject<string[]>([]);
  readonly favorites$: Observable<string[]> = this.ids$.asObservable();

  constructor() {
    this.auth.currentUser$.subscribe((session) => this.ids$.next(this.read(session)));
  }

  isFavorite(id: string): boolean {
    return this.ids$.value.includes(id);
  }


  toggleFavorite(id: string): boolean {
    const session = this.auth.getCurrentUser();
    const key = this.storageKey(session);
    if (!key) {
      this.router.navigate(['/login'], { queryParams: { redirect: this.router.url } });
      return false;
    }
    const favorites = [...this.ids$.value];
    const index = favorites.indexOf(id);
    const nowFavorite = index === -1;
    if (nowFavorite) favorites.push(id);
    else favorites.splice(index, 1);

    this.storage.setItem(key, favorites);


    if (session?.user) {
      const slugKey =
        STORAGE_KEYS.favoritesPrefix + session.user.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      if (slugKey !== key) {
        this.storage.setItem(slugKey, favorites);
      }
    }

    this.ids$.next(favorites);
    return nowFavorite;
  }

  getFavoriteIds(): string[] {
    return [...this.ids$.value];
  }

  getFavoritesCount(): Observable<number> {
    return this.ids$.pipe(map((ids) => ids.length));
  }

  private storageKey(session: AuthSession | null): string | null {
    if (!session || !session.loggedIn) return null;
    if (session.email) return STORAGE_KEYS.favoritesPrefix + session.email.toLowerCase();
    const slug = (session.user || 'user').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    return STORAGE_KEYS.favoritesPrefix + slug;
  }

  private read(session: AuthSession | null): string[] {
    if (!session || !session.loggedIn) return [];
    const emailKey = session.email ? STORAGE_KEYS.favoritesPrefix + session.email.toLowerCase() : null;
    const userSlugKey = session.user
      ? STORAGE_KEYS.favoritesPrefix + session.user.replace(/[^a-z0-9]/gi, '_').toLowerCase()
      : null;

    if (emailKey) {
      const fromEmail = this.storage.getItem<string[]>(emailKey);
      if (fromEmail && Array.isArray(fromEmail) && fromEmail.length > 0) return fromEmail;
    }

    if (userSlugKey) {
      const fromUser = this.storage.getItem<string[]>(userSlugKey);
      if (fromUser && Array.isArray(fromUser) && fromUser.length > 0) return fromUser;
    }

    const legacy = this.storage.getItem<string[]>('favorites');
    if (legacy && Array.isArray(legacy) && legacy.length > 0) return legacy;

    return [];
  }
}
