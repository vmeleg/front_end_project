import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { NewsDetailModalComponent } from './components/news-detail-modal/news-detail-modal.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent, NewsDetailModalComponent],
  templateUrl: './app.component.html',
})
export class AppComponent { }
