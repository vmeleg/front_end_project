import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Noticia, badgeClass } from '../../models/news.model';
import { DateEsPipe } from '../../pipes/date-es.pipe';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-news-detail-content',
  imports: [DateEsPipe],
  templateUrl: './news-detail-content.component.html',
})
export class NewsDetailContentComponent {
  readonly noticia = input.required<Noticia>();
  readonly variant = input<'page' | 'modal'>('page');

  private readonly favorites = inject(FavoritesService);
  private readonly favIds = toSignal(this.favorites.favorites$, { initialValue: [] });

  protected readonly heroFailed = signal(false);
  protected readonly badge = computed(() => badgeClass(this.noticia().categoria));
  protected readonly isFav = computed(() => this.favIds().includes(this.noticia().id));
  protected readonly initial = computed(() => this.noticia().autor.charAt(0).toUpperCase());

  protected toggleFavorite(): void {
    this.favorites.toggleFavorite(this.noticia().id);
  }
}
