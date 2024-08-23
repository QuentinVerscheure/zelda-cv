import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    FormsModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  menuOpen = false;
  pseudo = '';
  password = '';

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onSubmit() {

  }
}
