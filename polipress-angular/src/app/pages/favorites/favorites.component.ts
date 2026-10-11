import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { Noticia } from '../../models/news.model';
import { NewsCardComponent } from '../../components/news-card/news-card.component';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { NewsService } from '../../services/news.service';

type FavoritesView =
  | { state: 'anonymous' }
  | { state: 'empty' }
  | { state: 'unavailable'; count: number }
  | { state: 'list'; count: number; articles: Noticia[] };


@Component({
  selector: 'app-favorites',
  imports: [RouterLink, NewsCardComponent],
  templateUrl: './favorites.component.html',
})
export class FavoritesComponent {
  private readonly auth = inject(AuthService);
  private readonly favorites = inject(FavoritesService);
  private readonly news = inject(NewsService);

  protected readonly view = toSignal(
    combineLatest([this.auth.currentUser$, this.favorites.favorites$]).pipe(
      switchMap(([session, ids]) => {
        if (!session) return of<FavoritesView>({ state: 'anonymous' });
        if (ids.length === 0) return of<FavoritesView>({ state: 'empty' });

        return this.news.getAllNews().pipe(
          map((all): FavoritesView => {
            const articles = ids
              .map((id) => all.find((n) => n.id === id))
              .filter((a): a is Noticia => a !== null && a !== undefined);

            return articles.length === 0
              ? { state: 'unavailable', count: ids.length }
              : { state: 'list', count: articles.length, articles };
          }),
        );
      }),
    ),
    { initialValue: null },
  );

  protected countLabel(): string {
    const v = this.view();
    const n = v && 'count' in v ? v.count : 0;
    const s = n !== 1 ? 's' : '';
    return `${n} artículo${s} guardado${s}`;
  }
}
