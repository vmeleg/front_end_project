import { Component, OnInit, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { Noticia } from '../../models/news.model';
import { NewsDetailContentComponent } from '../../components/news-detail-content/news-detail-content.component';
import { NewsService } from '../../services/news.service';


@Component({
  selector: 'app-detail',
  imports: [RouterLink, NewsDetailContentComponent],
  templateUrl: './detail.component.html',
})
export class DetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly news = inject(NewsService);
  private readonly title = inject(Title);

  protected readonly article = signal<Noticia | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/'], { replaceUrl: true });
      return;
    }
    this.news
      .getNewsById(id)
      .pipe(take(1))
      .subscribe((found) => {
        if (!found) {
          this.router.navigate(['/'], { replaceUrl: true });
          return;
        }
        this.title.setTitle(`${found.titulo} — PoliPress`);
        this.article.set(found);
      });
  }
}
