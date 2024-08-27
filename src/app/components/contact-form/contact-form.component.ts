import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppConfig } from '../../models/config.enum';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss',
})
export class ContactFormComponent implements OnInit {
  messageForm: FormGroup;

  config: AppConfig | undefined;

  constructor(private fb: FormBuilder, private configService: ConfigService) {
    this.messageForm = this.fb.group({
      pseudo: ['', Validators.required],
      pass: ['', Validators.required],
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
    if (this.messageForm.valid) {
      console.log('Form Value:', this.messageForm.value);
    }
  }

  hideForm() {
    const form = document.getElementById('contact-container');
    if (form) {
      form.classList.add('hidden');
    }
  }
}
