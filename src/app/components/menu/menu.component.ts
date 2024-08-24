import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  menuOpen = false;
  currentSection: string = 'quests';
  isSmartphone:boolean= true;

  pseudo = '';
  password = '';

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onSubmit() {

  }

  changeSection(section: string) {
    this.currentSection = section;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfSmartphone();
  }

  checkIfSmartphone() {
    this.isSmartphone = window.innerHeight < 850;
  }
  
}
