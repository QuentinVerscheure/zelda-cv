import {
  Component,
  HostListener,
  OnInit,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { AppConfig } from '../../models/config.model';
import { ApiService } from '../../services/api.service';
import { LoginDTO, LoginResponseDTO } from '../../models/dto/login.dto';
import { Achievement } from '../../models/achievement.model';
import { AchievementService } from '../../services/achievement.service';
import { SessionStorageService } from '../../services/session-storage.service';
import { BehaviorSubject } from 'rxjs';
import { MenuMessageService } from './menu-message.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  menuOpen = true;
  currentSection: string = 'quests';
  isSmartphone: boolean = true;

  config: AppConfig | undefined;

  pseudo = '';
  password = '';

  signUpError: string | null = null;
  loginError: string | null = null;
  changeLoginPassError: string | null = null;
  isAuthenticated: boolean = false;
  tryToDeleteUser: boolean = false;

  achievements$: BehaviorSubject<Achievement | null>;

  constructor(
    private configService: ConfigService,
    private apiService: ApiService,
    private achievementService: AchievementService,
    private sessionStorageService: SessionStorageService,
    private menuMessageService: MenuMessageService
  ) {
    this.achievements$ = this.sessionStorageService.achievements$;
  }

  ngOnInit() {
    this.configService.config$.subscribe((config) => {
      this.config = config;
    });
    // if user try to create a message in guessbook without authentification
    this.menuMessageService.authMessage$.subscribe((message) => {
      if (message) {
        this.loginError = message;
        this.menuOpen = true;
        this.currentSection = 'save';
      }
    });
    this.checkAuth();

    // initialize the achievements BehaviorSubject with the current achievements value.
    //if achievement is update, modify the display in menu
    if (!this.sessionStorageService.getAchievements()) {
      this.sessionStorageService.achievements$.next(
        this.sessionStorageService.getAchievements()
      );
    }
    this.checkIfSmartphone();
    if (this.isSmartphone) {
      this.menuOpen = false;
    }
  }

  checkAuth() {
    this.isAuthenticated = !!localStorage.getItem('accessToken');
  }

  toggleMenu() {
    this.cleanErrorMessages();
    this.menuOpen = !this.menuOpen;
  }

  onSubmit() {}

  changeSection(section: string) {
    this.cleanErrorMessages();
    this.currentSection = section;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkIfSmartphone();
  }

  checkIfSmartphone() {
    this.isSmartphone = window.innerHeight < 850;
  }

  onSignUp() {
    const achievementString = sessionStorage.getItem('achievements');
    const defaultAchievement: Achievement = {
      cv: false,
      cvDownload: false,
      portfolio: false,
      link: false,
      linkClick: false,
      phone: false,
      phoneContact: false,
      guestBook: false,
      guestBookComment: false,
      achievementVarious: false,
      achievementCredit: false,
    };
    const achievement: Achievement = achievementString
      ? { ...defaultAchievement, ...JSON.parse(achievementString) }
      : defaultAchievement;

    const loginDTO: LoginDTO = {
      pseudo: this.pseudo,
      pass: this.password,
      achievement: achievement,
    };

    this.apiService.createUser(loginDTO).subscribe({
      next: (response: LoginResponseDTO) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          this.cleanErrorMessages();
          this.ToggleTemporaryClassToButton(
            'signUpButton',
            'buttonSuccess',
            'buttonReturnNormal'
          );
          this.ToggleFadedAnimAuth(true, 'loginButton', 'signUpButton');
        }
      },
      error: (err) => {
        this.cleanErrorMessages();
        this.signUpError = err.error?.error || "Erreur lors de l'inscription";
      },
    });
  }

  onLogin() {
    const login: LoginDTO = {
      pseudo: this.pseudo,
      pass: this.password,
    };
    this.apiService.login(login).subscribe({
      next: (response: LoginResponseDTO) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
        sessionStorage.setItem('pseudo', this.pseudo);
        this.cleanErrorMessages();
        this.ToggleTemporaryClassToButton(
          'loginButton',
          'buttonSuccess',
          'buttonReturnNormal'
        );
        this.ToggleFadedAnimAuth(true, 'loginButton', 'signUpButton');

        // synchronyse an unlogin user's achievements with database's user's achievement when he authenticates
        this.apiService.getUserAchievement().subscribe({
          next: (apiAchievement) => {
            const merged =
              this.achievementService.mergeAchievementsAndSave(apiAchievement);
            this.apiService.updateAchievement(merged).subscribe();
          },
        });
      },
      error: (err) => {
        this.cleanErrorMessages();
        this.loginError =
          err.error?.error || "Erreur lors de l'authentification";
      },
    });
  }

  onChangeUser() {
    const login: LoginDTO = {
      pseudo: this.pseudo,
      pass: this.password,
    };
    this.apiService.updateUser(login).subscribe({
      next: (response: LoginResponseDTO) => {
        if (response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
        }
        sessionStorage.setItem('pseudo', this.pseudo);
        this.cleanErrorMessages();
        this.ToggleTemporaryClassToButton(
          'changeLoginPassButton',
          'buttonSuccess',
          'buttonReturnNormal'
        );
        this.isAuthenticated = true;
      },
      error: (err) => {
        this.cleanErrorMessages();
        this.changeLoginPassError =
          err.error?.error ||
          'Erreur lors du changement de mot de passe/pseudo';
      },
    });
  }
  onLogout() {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('pseudo');
    this.cleanErrorMessages();
    this.ToggleTemporaryClassToButton(
      'logOutButton',
      'buttonSuccess',
      'buttonReturnNormal'
    );
    this.ToggleFadedAnimAuth(
      false,
      'deleteUserButton',
      'changeLoginPassButton',
      'logOutButton'
    );
  }

  onTriggerDeleteUser() {
    this.cleanErrorMessages();
    this.tryToDeleteUser = true;
    this.ToggleTemporaryClassToButton(
      'deleteUserButton',
      'buttonWarning',
      'buttonReturnNormal'
    );
    this.ToggleFadedAnimAuth(
      false,
      'deleteUserButton',
    );
    this.tryToDeleteUser = true;
  }

  onDeleteUserYes() {
    this.apiService.deleteUser().subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        this.cleanErrorMessages();
        this.ToggleFadedAnimAuth(
          false,
          'changeLoginPassButton',
          'logOutButton'
        );
      },
      error: (err) => {
        this.cleanErrorMessages();
        this.loginError =
          err.error?.error || 'Erreur lors de la suppression du compte';
      },
    });
    this.tryToDeleteUser = false;
  }

    onDeleteUserNo() {
        this.cleanErrorMessages();
        this.ToggleTemporaryClassToButton(
          'deleteUserButton',
          'buttonSuccess',
          'buttonReturnNormal'
        );
        this.ToggleFadedAnimAuth(
          false,
          'deleteUserButton',
          'changeLoginPassButton',
          'logOutButton'
        );
        this.tryToDeleteUser = false;
  }

  cleanErrorMessages() {
    this.signUpError = null;
    this.loginError = null;
    this.changeLoginPassError = null;
  }

  /**
   * Toggle a temporary class to a button (for visual feedback)
   * @param buttonId - The ID of the button to toggle classes on
   * @param className1 - The class to add temporarily
   * @param className2 - The class to remove temporarily
   */
  ToggleTemporaryClassToButton(
    buttonId: string,
    className1: string,
    className2: string
  ) {
    const btn = document.getElementById(buttonId);
    if (btn) {
      btn.classList.add(className1);
      btn.classList.remove(className2);
      setTimeout(() => {
        btn.classList.add(className2);
        btn.classList.remove(className1);
      }, 1500);
    }
  }

  /**
   * Toggle faded animation for buttons based on authentication status
   * @param isAuthenticated - The authentication status
   * @param buttonIds - The IDs of the buttons to toggle the animation on
   */
  ToggleFadedAnimAuth(isAuthenticated: boolean, ...buttonIds: string[]) {
    buttonIds.forEach((buttonId) => {
      const btn = document.getElementById(buttonId);
      if (btn) {
        btn.classList.add('fade-anim');
        setTimeout(() => {
          this.isAuthenticated = isAuthenticated;
          btn.classList.add('fade-anim');
        }, 1500);
      }
    });
  }
}
