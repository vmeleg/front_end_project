import { Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest, distinctUntilChanged, map, of, switchMap, timer } from 'rxjs';
import { Noticia } from '../../models/news.model';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { formatUpdatedNow } from '../../pipes/date-es.pipe';
import { LayoutService } from '../../services/layout.service';
import { NewsService } from '../../services/news.service';

interface HomeView {
  title: string;
  articles: Noticia[];
}


@Component({
  selector: 'app-home',
  imports: [NewsCardComponent, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly news = inject(NewsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly layout = inject(LayoutService);

  protected readonly updated = formatUpdatedNow();

  private readonly category$ = this.route.queryParamMap.pipe(
    map((p) => p.get('cat') ?? 'all'),
    distinctUntilChanged(),
  );


  private readonly query$ = toObservable(this.layout.searchQuery);
  private readonly search$ = this.query$.pipe(
    map((q) => q.trim()),
    distinctUntilChanged(),
    switchMap((q) => (q === '' ? of('') : timer(300).pipe(map(() => q)))),
  );

  protected readonly view = toSignal<HomeView | null>(
    combineLatest([this.category$, this.search$]).pipe(
      switchMap(([category, search]) => {
        if (search) {
          return this.news.searchByTitle(search).pipe(
            map((list) => ({
              title: `Resultados: "${search}"`,
              articles: category === 'all' ? list : list.filter((a) => a.categoria === category),
            })),
          );
        }
        if (category === 'all') {
          return this.news.getAllNews().pipe(map((articles) => ({ title: 'Últimas Noticias', articles })));
        }
        return this.news
          .getNewsByCategory(category)
          .pipe(map((articles) => ({ title: category, articles })));
      }),
    ),
    { initialValue: null },
  );

  protected resetSearchAndGoHome(): void {
    this.layout.resetSearch();
    this.router.navigate(['/']);
  }

  protected countLabel(n: number): string {
    const s = n !== 1 ? 's' : '';
    return `${n} artículo${s} encontrado${s}`;
  }
}
