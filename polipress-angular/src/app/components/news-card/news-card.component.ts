import { Component, computed, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Noticia, badgeClass } from '../../models/news.model';
import { DateEsPipe } from '../../pipes/date-es.pipe';
import { FavoritesService } from '../../services/favorites.service';
import { LayoutService } from '../../services/layout.service';


@Component({
  selector: 'app-news-card',
  imports: [DateEsPipe],
  templateUrl: './news-card.component.html',
})
export class NewsCardComponent {
  readonly noticia = input.required<Noticia>();

  private readonly favorites = inject(FavoritesService);
  private readonly layout = inject(LayoutService);
  private readonly favIds = toSignal(this.favorites.favorites$, { initialValue: [] });

  protected readonly imgFailed = signal(false);
  protected readonly badge = computed(() => badgeClass(this.noticia().categoria));
  protected readonly isFav = computed(() => this.favIds().includes(this.noticia().id));

  protected onImgError(): void {
    this.imgFailed.set(true);
  }

  protected toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favorites.toggleFavorite(this.noticia().id);
  }

  protected openDetail(): void {
    this.layout.openDetail(this.noticia());
  }
}
