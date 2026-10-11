import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  emailPattern,
  errorOf,
  isInvalid,
  matchField,
  minLengthTrim,
  requiredTrim,
  validateAll,
} from '../../validators/form-validators';


const REGISTER_REDIRECT_MS = 1500;

type Tab = 'login' | 'register';


@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly tab = signal<Tab>('login');
  protected readonly error = signal('');
  protected readonly successMsg = signal('');
  private redirectTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly loginForm = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [requiredTrim, emailPattern] }),
    password: new FormControl('', { nonNullable: true, validators: [requiredTrim] }),
  });

  protected readonly registerForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [requiredTrim, minLengthTrim(3)] }),
    email: new FormControl('', { nonNullable: true, validators: [requiredTrim, emailPattern] }),
    password: new FormControl('', { nonNullable: true, validators: [requiredTrim, minLengthTrim(6)] }),
    confirm: new FormControl('', { nonNullable: true, validators: [requiredTrim, matchField('password')] }),
  });

  protected readonly invalid = (form: FormGroup, name: string) => isInvalid(form, name);
  protected readonly errorOf = (form: FormGroup, name: string) => errorOf(form, name);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.redirectTimer));
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) this.router.navigate(['/'], { replaceUrl: true });
  }

  protected selectTab(tab: Tab): void {
    this.tab.set(tab);
    this.hideAlerts();
  }

  protected onBlur(form: FormGroup): void {
    validateAll(form);
  }

  protected onLogin(): void {
    this.hideAlerts();
    if (!validateAll(this.loginForm)) return;
    const { email, password } = this.loginForm.getRawValue();
    this.auth.login(email.trim(), password).subscribe((ok) => {
      if (ok) this.goAfterAuth();
      else this.error.set('✕ Correo electrónico o contraseña incorrectos.');
    });
  }

  protected onRegister(): void {
    this.hideAlerts();
    if (!validateAll(this.registerForm)) return;
    const { name, email, password } = this.registerForm.getRawValue();
    this.auth.register({ nombre: name.trim(), email: email.trim(), password }).subscribe((result) => {
      if (result === 'exists') {
        this.error.set('✕ Este correo electrónico ya está registrado.');
        return;
      }
      this.successMsg.set('✓ ¡Registro exitoso! Redirigiendo...');
      this.redirectTimer = setTimeout(() => this.goAfterAuth(), REGISTER_REDIRECT_MS);
    });
  }

  private hideAlerts(): void {
    this.error.set('');
    this.successMsg.set('');
  }


  private goAfterAuth(): void {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    const target = redirect && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/';
    this.router.navigateByUrl(target, { replaceUrl: true });
  }
}
