import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact implements OnInit {

  contactForm!: FormGroup;
  loading = false;
  modalOpen = false;
  modalMessage = '';
  modalSuccess = false;

  SERVICE_ID = 'service_1jq2whj';
  TEMPLATE_ID = 'template_ehnhncc';
  PUBLIC_KEY = '5QOIyI1QaHqmeRg10';

  private readonly DISPOSABLE_DOMAINS = [
    'mailinator.com','10minutemail.com','tempmail.com','yopmail.com',
    'trashmail.com','dispostable.com','getnada.com','moakt.com'
  ];

  private readonly SUSPICIOUS_TLDS = [
    'xyz','top','gq','tk','ml','cf','click','online','biz'
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email,
        this.invalidEmailDomain.bind(this),
        this.emailLengthCheck.bind(this),
        this.disposablePatternValidator.bind(this)
      ]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  // ===========================================
  // VALIDADORES AVANZADOS
  // ===========================================

  private invalidEmailDomain(control: AbstractControl) {
    const value = (control.value || '').toLowerCase();
    if (!value.includes('@')) return null;

    const domain = value.split('@')[1];
    if (this.DISPOSABLE_DOMAINS.includes(domain)) {
      return { invalidDomain: true };
    }
    return null;
  }

  private emailLengthCheck(control: AbstractControl) {
    const value = (control.value || '').toString();
    if (!value.includes('@')) return null;

    const [local, domain] = value.split('@');

    if (local.length < 3 || domain.length < 5) {
      return { emailTooShort: true };
    }
    return null;
  }

  private disposablePatternValidator(control: AbstractControl) {
    const value = (control.value || '').toLowerCase();
    if (!value) return null;

    const regex = /(10minutemail|tempmail|guerrillamail|yopmail|mailinator|trashmail|dropmail)/i;
    if (regex.test(value)) return { disposablePattern: true };

    if (value.includes('@')) {
      const domain = value.split('@')[1];
      const tld = domain.split('.').pop() || '';
      if (this.SUSPICIOUS_TLDS.includes(tld)) {
        return { suspiciousTld: true };
      }
    }

    return null;
  }

  // ===========================================
  // MODAL + ENVÍO EMAILJS
  // ===========================================

  closeModal() {
    this.modalOpen = false;
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    const values = this.contactForm.value;

    emailjs.send(
      this.SERVICE_ID,
      this.TEMPLATE_ID,
      values,
      this.PUBLIC_KEY
    )
    .then(() => {
      this.loading = false;
      this.modalMessage = 'Tu mensaje fue enviado correctamente. ¡Gracias por contactarme!';
      this.modalSuccess = true;
      this.modalOpen = true;

      // Scroll suave al modal
      setTimeout(() => {
        const modal = document.querySelector('.modal-window');
        modal?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);

      this.contactForm.reset();
    })
    .catch(() => {
      this.loading = false;
      this.modalMessage = 'Hubo un error enviando tu mensaje. Intenta nuevamente.';
      this.modalSuccess = false;
      this.modalOpen = true;
    });
  }
}
