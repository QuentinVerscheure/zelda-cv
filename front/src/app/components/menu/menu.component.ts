import { Component, HostListener, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfigService } from '../../services/config.service';
import { AppConfig } from '../../models/config.model';
import { Achievement } from '../../models/achievement.model';
import { AchievementStorageService } from '../../services/achievement-storage.service';
import { BehaviorSubject } from 'rxjs';
import { RouterModule } from '@angular/router';
import { PseudoService } from '../../services/pseudo.service';
import { GameTextInputDirective } from '../../utils/game-text-input.directive';
import { COMMENT_RULES } from '../../game/scenes/guestBookHouse/comment-rules';

@Component({
    selector: 'app-menu',
    imports: [RouterModule, CommonModule, GameTextInputDirective],
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

  readonly pseudoMaxLength = COMMENT_RULES.PSEUDO_MAX_LENGTH;

  constructor(
    private configService: ConfigService,
    private achievementStorageService: AchievementStorageService,
    readonly pseudoService: PseudoService
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

  /** No confirm button: every keystroke updates the pseudo (multiplayer label, guestbook form). */
  onPseudoInput(event: Event) {
    this.pseudoService.set((event.target as HTMLInputElement).value);
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
