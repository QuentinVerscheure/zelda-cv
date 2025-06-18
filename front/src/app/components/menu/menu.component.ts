import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { AppConfig } from '../../models/config.model';
import { ApiService } from '../../services/api.service';
import { LoginDTO, LoginResponseDTO } from '../../models/dto/login.dto';
import { Achievement } from '../../models/achievement.model';

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

  signUpError: string | null = null;
  loginError: string | null = null;
  changeLoginPassError: string | null = null;
  isAuthenticated: boolean = false;

  constructor(
    private configService: ConfigService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.configService.config$.subscribe((config) => {
      this.config = config;
    });
    this.checkAuth();
  }

  checkAuth() {
    this.isAuthenticated = !!localStorage.getItem('accessToken');
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
          this.ToggleTemporaryClassToButton('signUpButton', 'buttonSuccess', "buttonReturnNormal");
          this.ToggleFadedAnim(true, 'loginButton', 'signUpButton');
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
        this.cleanErrorMessages();
        this.ToggleTemporaryClassToButton('loginButton', 'buttonSuccess', "buttonReturnNormal");
        this.ToggleFadedAnim(true, 'loginButton', 'signUpButton');
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
        this.cleanErrorMessages();
        this.ToggleTemporaryClassToButton('changeLoginPassButton', 'buttonSuccess', "buttonReturnNormal");
        this.isAuthenticated = true;
      },
      error: (err) => {
        this.cleanErrorMessages();
        this.changeLoginPassError =
          err.error?.error || 'Erreur lors du changement de mot de passe/pseudo';
      },
    });
  }
  onLogout() {
    localStorage.removeItem('accessToken');
    this.cleanErrorMessages();
    this.ToggleTemporaryClassToButton('logOutButton', 'buttonSuccess', "buttonReturnNormal");
    this.ToggleFadedAnim(false,'deleteUserButton', 'changeLoginPassButton', 'logOutButton');
  }

  onDeleteUser(){
    this.apiService.deleteUser().subscribe({
      next: () => {
        localStorage.removeItem('accessToken');
        this.cleanErrorMessages();
        this.ToggleTemporaryClassToButton('deleteUserButton', 'buttonSuccess', "buttonReturnNormal");
        this.ToggleFadedAnim(false,'deleteUserButton', 'changeLoginPassButton', 'logOutButton');
      },
      error: (err) => {
        this.cleanErrorMessages();
        this.loginError = err.error?.error || 'Erreur lors de la suppression du compte';
      },
    });
  }

  cleanErrorMessages() {
    this.signUpError = null;
    this.loginError = null;
    this.changeLoginPassError = null;
  }

  ToggleTemporaryClassToButton(buttonId: string, className1: string, className2: string) {
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

  ToggleFadedAnim(isAuthenticated: boolean, ...buttonIds: string[]) {
    buttonIds.forEach(buttonId => {
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
