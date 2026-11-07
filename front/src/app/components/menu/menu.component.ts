import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../services/config.service';
import { AppConfig } from '../../models/config.model';
import { Achievement } from '../../models/achievement.model';
import { AchievementStorageService } from '../../services/achievement-storage.service';
import { BehaviorSubject } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-menu',
    imports: [RouterModule, CommonModule],
    templateUrl: './menu.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menuOpen = true;
  currentSection: string = 'quests';
  isSmartphone: boolean = true;

  config: AppConfig | undefined;

  achievements$: BehaviorSubject<Achievement | null>;

  constructor(
    private configService: ConfigService,
    private achievementStorageService: AchievementStorageService
  ) {
    this.achievements$ = this.achievementStorageService.achievements$;
  }

  ngOnInit() {
    this.configService.config$.subscribe((config) => {
      this.config = config;
    });
    this.checkIfSmartphone();
    if (this.isSmartphone) {
      this.menuOpen = false;
    }
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
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
