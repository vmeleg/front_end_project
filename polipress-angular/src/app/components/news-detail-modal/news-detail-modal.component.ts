import { Component, DestroyRef, HostListener, effect, inject, signal, untracked } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Noticia } from '../../models/news.model';
import { LayoutService } from '../../services/layout.service';
import { NewsDetailContentComponent } from '../news-detail-content/news-detail-content.component';


const CLOSE_DELAY_MS = 300;

/** modal global de detalle de noticia (port de NewsRenderer.openDetailModal). */
@Component({
  selector: 'app-news-detail-modal',
  imports: [NewsDetailContentComponent],
  templateUrl: './news-detail-modal.component.html',
})
export class NewsDetailModalComponent {
  private readonly layout = inject(LayoutService);


  protected readonly article = signal<Noticia | null>(null);
  protected readonly active = signal(false);
  private closeTimer: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    effect(() => {
      const next = this.layout.detailArticle();
      untracked(() => {
        if (next) this.open(next);
        else if (this.article()) this.animateClose();
      });
    });

    inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => {
        if (this.layout.detailArticle()) this.close();
      });
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.closeTimer);
      document.body.style.overflow = '';
    });
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.active()) this.close();
  }

  protected close(): void {
    this.layout.closeDetail();
  }

  private open(next: Noticia): void {
    clearTimeout(this.closeTimer);
    this.active.set(false);
    this.article.set(next);

    requestAnimationFrame(() => this.active.set(true));
    document.body.style.overflow = 'hidden';
  }

  private animateClose(): void {
    this.active.set(false);
    document.body.style.overflow = '';
    this.closeTimer = setTimeout(() => this.article.set(null), CLOSE_DELAY_MS);
  }
}
