import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ContactComponent } from './pages/contact/contact.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';


export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'PoliPress — Inicio' },
  { path: 'noticia/:id', component: DetailComponent, title: 'PoliPress — Detalle' },
  { path: 'favoritos', component: FavoritesComponent, title: 'PoliPress — Favoritos' },
  { path: 'contacto', component: ContactComponent, canActivate: [authGuard], title: 'PoliPress — Contacto' },
  { path: 'login', component: LoginComponent, title: 'PoliPress — Iniciar Sesión' },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard], title: 'PoliPress — Administración' },
  { path: '**', redirectTo: '' },
];
