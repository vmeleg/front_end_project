import { Component, ElementRef, computed, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { CATEGORIAS } from '../../models/news.model';
import { AuthService } from '../../services/auth.service';
import { LayoutService } from '../../services/layout.service';

const PROTECTED_PATHS = ['/admin', '/contacto'];

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  protected readonly layout = inject(LayoutService);

  protected readonly categorias = CATEGORIAS;
  protected readonly user = toSignal(this.auth.currentUser$, { initialValue: null });

  private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  );

  private lastPath = '';

  protected readonly isHome = computed(() => this.path(this.url()) === '/');

  protected readonly activeCategory = computed(() => {
    const tree = this.router.parseUrl(this.url());
    return (tree.queryParams['cat'] as string | undefined) ?? 'all';
  });

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const path = this.path(e.urlAfterRedirects);
        if (this.lastPath && path !== this.lastPath) this.layout.resetSearch();
        this.lastPath = path;
      });
  }

  protected selectCategory(cat: string): void {
    this.layout.resetSearch();
    this.router.navigate(['/'], { queryParams: cat === 'all' ? {} : { cat } });
  }

  protected toggleSearch(): void {
    if (this.layout.toggleSearch()) this.searchInput().nativeElement.focus();
  }

  protected onSearchInput(event: Event): void {
    this.layout.searchQuery.set((event.target as HTMLInputElement).value);
  }

  protected onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.searchInput().nativeElement.value = '';
      this.layout.resetSearch();
    }
  }

  protected logout(): void {
    this.auth.logout();
    if (PROTECTED_PATHS.includes(this.path(this.router.url))) {
      this.router.navigate(['/login']);
    }
  }

  private path(url: string): string {
    return url.split(/[?#]/)[0] || '/';
  }
}
