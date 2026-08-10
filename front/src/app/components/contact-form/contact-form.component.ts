import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { AppConfig } from '../../models/config.model';
import { ConfigService } from '../../services/config.service';
import { ApiService } from '../../services/api.service';
import { MailDTO } from '../../models/dto/mail.dto';
import { MovementService } from '../../game/core/movement.service';
import { SceneContactService } from '../../game/scenes/contactHouse/scene-contact.service';

@Component({
    selector: 'app-contact-form',
    imports: [ReactiveFormsModule],
    templateUrl: './contact-form.component.html',
    styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent implements OnInit {
  messageForm: FormGroup;

  config: AppConfig | undefined;

  isSubmitting = false;
  submitStatus: 'success' | 'error' | null = null;

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private apiService: ApiService,
    private movementService: MovementService,
    private sceneContactService: SceneContactService
  ) {
    this.messageForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
    });
  }

  ngOnInit() {
    this.configService.config$.subscribe((config) => {
      this.config = config;
    });
  }

  onSubmit() {
    if (this.messageForm.invalid || this.isSubmitting) {
      return;
    }

    const { nom, email, subject, message } = this.messageForm.value;
    const mailDto: MailDTO = {
      from: email,
      subject: `[${nom}] ${subject}`,
      text: message,
    };

    this.isSubmitting = true;
    this.submitStatus = null;

    this.apiService
      .sendMailToOwner(mailDto)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.submitStatus = 'success';
          this.messageForm.reset();
        },
        error: (err) => {
          console.error('sendMailToOwner failed', err);
          this.submitStatus = 'error';
        },
      });
  }

  isInvalid(controlName: string): boolean {
    const control = this.messageForm.get(controlName);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  hideForm() {
    const form = document.getElementById('contact-container');
    if (form) {
      form.classList.add('hidden');
    }
    // clicking the close button doesn't reliably fire focusout on every browser,
    // and a hidden field can stay the activeElement, so force both explicitly
    (document.activeElement as HTMLElement | null)?.blur?.();
    this.enablePhaserKeyDownEvent();
  }

  disablePhaserKeyDownEvent() {
    this.sceneContactService.isEditingComment = true;
    this.movementService.disableMovementKeys();

    // forbid Phaser keydown events (e.g. SPACE/arrows) while a field of the form is focused
    window.addEventListener('keydown', this.stopPhaserKeydown, true);
  }

  enablePhaserKeyDownEvent() {
    this.sceneContactService.isEditingComment = false;
    this.movementService.enableMovementKeys();

    window.removeEventListener('keydown', this.stopPhaserKeydown, true);
  }

  private stopPhaserKeydown = (event: KeyboardEvent) => {
    const active = document.activeElement;
    if (active && active.closest('#contact-container')) {
      event.stopImmediatePropagation();
    }
  };
}
