import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {
  emailPattern,
  errorOf,
  isInvalid,
  minLengthTrim,
  phoneColombiaOptional,
  requiredTrim,
  validateAll,
} from '../../validators/form-validators';


const SUCCESS_TIMEOUT_MS = 5000;


@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  private readonly auth = inject(AuthService);

  protected readonly form = new FormGroup({
    nombre: new FormControl('', { nonNullable: true, validators: [requiredTrim, minLengthTrim(3)] }),
    correo: new FormControl('', { nonNullable: true, validators: [requiredTrim, emailPattern] }),
    telefono: new FormControl('', { nonNullable: true, validators: [phoneColombiaOptional] }),
    asunto: new FormControl('', { nonNullable: true, validators: [requiredTrim, minLengthTrim(5)] }),
    mensaje: new FormControl('', { nonNullable: true, validators: [requiredTrim, minLengthTrim(20)] }),
  });

  protected readonly success = signal(false);
  private userEmail = '';
  private userName = '';
  private successTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly isInvalid = (name: string) => isInvalid(this.form, name);
  protected readonly errorOf = (name: string) => errorOf(this.form, name);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.successTimer));
  }

  ngOnInit(): void {
    const session = this.auth.getCurrentUser();
    if (!session) return;
    this.userName = session.user ?? '';
    this.userEmail = session.email ?? '';

    if (this.userEmail) {
      this.prefill();
      return;
    }
    this.auth.getAllUsers().subscribe((users) => {
      const found = users.find((u) => u.nombre === session.user || u.email === session.user);
      if (found?.email) {
        this.userEmail = found.email;
        this.auth.updateSession({ ...session, email: found.email });
      }
      this.prefill();
    });
  }


  protected onBlur(): void {
    validateAll(this.form);
  }

  protected onSubmit(): void {
    if (!validateAll(this.form)) return;

    /* Simular envío exitoso */
    this.success.set(true);
    this.form.reset();
    this.prefill();
    this.form.markAsUntouched();

    clearTimeout(this.successTimer);
    this.successTimer = setTimeout(() => this.success.set(false), SUCCESS_TIMEOUT_MS);
  }

  private prefill(): void {
    this.form.patchValue({ correo: this.userEmail, nombre: this.userName });
  }
}
