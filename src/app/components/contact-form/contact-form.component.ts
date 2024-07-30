import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.scss'
})
export class ContactFormComponent {
  messageForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      pseudo: ['', Validators.required],
      pass: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  onSubmit() {
    if (this.messageForm.valid) {
      console.log('Form Value:', this.messageForm.value);
      // Handle form submission logic here
    }
  }

  hideForm() {
    const form = document.getElementById('messageForm');
    if (form) {
      form.classList.add('hidden');
    }
  }
}
