import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { CATEGORIAS, Categoria, Noticia, badgeClass } from '../../models/news.model';
import { DateEsPipe } from '../../pipes/date-es.pipe';
import { AuthService } from '../../services/auth.service';
import { NewsService } from '../../services/news.service';
import {
  errorOf,
  isInvalid,
  minLengthTrim,
  requiredTrim,
  validateAll,
} from '../../validators/form-validators';


const SUCCESS_TIMEOUT_MS = 3000;

type ModalName = 'form' | 'confirm' | 'denied';


@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, RouterLink, DateEsPipe],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly news = inject(NewsService);

  protected readonly categorias = CATEGORIAS;
  protected readonly badgeClass = badgeClass;

  protected readonly articles = signal<Noticia[]>([]);
  protected readonly loaded = signal(false);
  protected readonly activeModal = signal<ModalName | null>(null);
  protected readonly modalTitle = signal('Nueva Noticia');
  protected readonly successMsg = signal('');
  protected readonly confirmMessage = signal('Esta acción no se puede deshacer.');

  private editingId: string | null = null;
  private deleteTargetId: string | null = null;
  private successTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly form = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [requiredTrim, minLengthTrim(10)] }),
    resumen: new FormControl('', { nonNullable: true, validators: [requiredTrim, minLengthTrim(20)] }),
    contenido: new FormControl('', { nonNullable: true, validators: [requiredTrim, minLengthTrim(50)] }),
    categoria: new FormControl('', { nonNullable: true, validators: [requiredTrim] }),
    imagen: new FormControl('', { nonNullable: true }),
    autor: new FormControl('', { nonNullable: true, validators: [requiredTrim] }),
    fecha: new FormControl('', { nonNullable: true, validators: [requiredTrim] }),
    destacada: new FormControl(false, { nonNullable: true }),
  });

  protected readonly isInvalid = (name: string) => isInvalid(this.form, name);
  protected readonly errorOf = (name: string) => errorOf(this.form, name);

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(this.successTimer);
      document.body.style.overflow = '';
    });
  }

  ngOnInit(): void {
    if (!this.auth.isLoggedIn()) return;
    if (!this.auth.hasAdminRole()) {
      this.openModal('denied');
      return;
    }
    this.renderTable();
  }

  protected countLabel(): string {
    const n = this.articles().length;
    return `${n} noticia${n !== 1 ? 's' : ''}`;
  }

  protected truncate(text: string, max: number): string {
    return text.length > max ? text.substring(0, max) + '...' : text;
  }


  protected openNew(): void {
    this.editingId = null;
    this.modalTitle.set('Nueva Noticia');
    this.form.reset();
    this.form.patchValue({ fecha: new Date().toISOString().split('T')[0] });
    this.openModal('form');
  }

  protected openEdit(article: Noticia): void {
    this.editingId = article.id;
    this.modalTitle.set('Editar Noticia');
    this.form.reset({
      titulo: article.titulo,
      resumen: article.resumen,
      contenido: article.contenido.replace(/<\/?p>/g, '\n').trim(),
      categoria: article.categoria,
      imagen: article.imagen || '',
      autor: article.autor,
      fecha: article.fecha,
      destacada: article.destacada || false,
    });
    this.openModal('form');
  }

  protected askDelete(article: Noticia): void {
    this.deleteTargetId = article.id;
    this.confirmMessage.set(
      `¿Estás seguro de que quieres eliminar "${article.titulo.substring(0, 40)}..."?`,
    );
    this.openModal('confirm');
  }

  protected closeModal(): void {
    this.activeModal.set(null);
    document.body.style.overflow = '';
  }

  protected onBlur(): void {
    validateAll(this.form);
  }


  protected onSave(): void {
    if (!validateAll(this.form)) return;
    const v = this.form.getRawValue();
    const contenidoRaw = v.contenido;
    const contenido = contenidoRaw
      .split('\n')
      .filter((p) => p.trim())
      .map((p) => `<p>${p.trim()}</p>`)
      .join('');

    const data: Omit<Noticia, 'id'> = {
      titulo: v.titulo.trim(),
      resumen: v.resumen.trim(),
      contenido,
      categoria: v.categoria as Categoria,
      imagen: v.imagen.trim() || '/assets/img/default.jpg',
      autor: v.autor.trim(),
      fecha: v.fecha,
      destacada: v.destacada,
      tiempoLectura: Math.max(1, Math.ceil(contenidoRaw.split(/\s+/).length / 200)),
    };

    if (this.editingId) {
      this.news.updateNews(this.editingId, data);
      this.showSuccess('Noticia actualizada correctamente.');
    } else {
      this.news.addNews(data);
      this.showSuccess('Noticia creada correctamente.');
    }
    this.closeModal();
    this.renderTable();
  }

  protected confirmDelete(): void {
    if (!this.deleteTargetId) return;
    this.news.deleteNews(this.deleteTargetId);
    this.deleteTargetId = null;
    this.closeModal();
    this.showSuccess('Noticia eliminada correctamente.');
    this.renderTable();
  }

  private renderTable(): void {
    this.news
      .getAllNews()
      .pipe(take(1))
      .subscribe((list) => {
        this.articles.set(list);
        this.loaded.set(true);
      });
  }

  private openModal(name: ModalName): void {
    this.activeModal.set(name);
    document.body.style.overflow = 'hidden';
  }

  private showSuccess(message: string): void {
    this.successMsg.set(`✓ ${message}`);
    clearTimeout(this.successTimer);
    this.successTimer = setTimeout(() => this.successMsg.set(''), SUCCESS_TIMEOUT_MS);
  }
}
