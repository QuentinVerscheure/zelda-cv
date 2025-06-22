import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreComponent } from './game/core/core.component';
import { MenuComponent } from './components/menu/menu.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { SessionStorageService } from './services/session-storage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CoreComponent,
    MenuComponent,
    ContactFormComponent,
    CommentFormComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'zelda-cv';

  constructor(
    private sessionStorageService: SessionStorageService
  ) {}

  ngOnInit() {
    //if the user have token in localStorage, he may not have pseudo in sessionStorage
    //so we sync the pseudo with the token
    this.sessionStorageService.syncPseudoWithToken();
  }
}
