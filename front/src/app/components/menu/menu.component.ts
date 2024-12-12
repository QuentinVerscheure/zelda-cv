import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { AppConfig } from '../../models/config.enum';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menuOpen = false;
  currentSection: string = 'quests';
  isSmartphone: boolean = true;

  config: AppConfig | undefined;

  pseudo = '';
  password = '';

  constructor(private configService: ConfigService) {}

  ngOnInit() {
    this.configService.config$.subscribe((config) => {
      this.config = config;
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onSubmit() {}

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
