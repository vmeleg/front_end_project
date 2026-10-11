import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay } from 'rxjs';
import { AuthSession, Usuario } from '../models/user.model';
import { STORAGE_KEYS, StorageService } from './storage.service';

export type RegisterResult = 'ok' | 'exists';

/**
 * Estado global y persistencia de la sesión
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  private readonly session$ = new BehaviorSubject<AuthSession | null>(this.readSession());
  readonly currentUser$: Observable<AuthSession | null> = this.session$.asObservable();

  private readonly seedUsers$: Observable<Usuario[]> = this.http
    .get<Usuario[]>('/assets/data/usuarios.json')
    .pipe(
      catchError((e) => {
        console.warn('No se pudo cargar usuarios.json', e);
        return of([] as Usuario[]);
      }),
      shareReplay(1),
    );


  getAllUsers(): Observable<Usuario[]> {
    return this.seedUsers$.pipe(
      map((seed) => [...seed, ...(this.storage.getItem<Usuario[]>(STORAGE_KEYS.usersCustom) ?? [])]),
    );
  }

  login(email: string, password: string): Observable<boolean> {
    return this.getAllUsers().pipe(
      map((users) => {
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) return false;
        this.startSession(user);
        return true;
      }),
    );
  }

  register(data: { nombre: string; email: string; password: string }): Observable<RegisterResult> {
    return this.getAllUsers().pipe(
      map((users) => {
        if (users.some((u) => u.email === data.email)) return 'exists';
        const newUser: Usuario = {
          id: 'user-' + Date.now(),
          nombre: data.nombre,
          email: data.email,
          password: data.password,
          rol: 'user',
        };
        this.storage.appendToArray(STORAGE_KEYS.usersCustom, newUser);
        this.startSession(newUser);
        return 'ok';
      }),
    );
  }

  logout(): void {
    this.storage.removeItem(STORAGE_KEYS.authSession);
    this.session$.next(null);
  }


  updateSession(session: AuthSession): void {
    this.storage.setItem(STORAGE_KEYS.authSession, session);
    this.session$.next(session);
  }

  isLoggedIn(): boolean {
    return this.session$.value?.loggedIn === true;
  }

  hasAdminRole(): boolean {
    const s = this.session$.value;
    return !!s && s.loggedIn === true && s.rol === 'admin';
  }

  getCurrentUser(): AuthSession | null {
    return this.session$.value;
  }

  private startSession(user: Usuario): void {
    this.updateSession({
      loggedIn: true,
      user: user.nombre,
      email: user.email,
      rol: user.rol || 'user',
    });
  }

  private readSession(): AuthSession | null {
    const s = this.storage.getItem<AuthSession>(STORAGE_KEYS.authSession);
    return s && s.loggedIn ? s : null;
  }
}
