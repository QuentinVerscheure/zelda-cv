import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreComponent } from './game/core/core.component';
import { MenuComponent } from './components/menu/menu.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';

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
export class AppComponent {
  title = 'zelda-cv';
}
