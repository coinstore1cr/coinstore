import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Ensure correct path
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule,RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  captchaCode = '';
  captchaImageUrl: SafeUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).*$/)
      ]],
      confirmPassword: ['', [Validators.required]],
      invitationCode: ['', [Validators.required]],
      verificationCode: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
    this.generateCaptcha();
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field?.errors) return '';
    if (field.hasError('required')) return 'This field is required';
    if (field.hasError('email')) return 'Invalid email format';
    if (field.hasError('minlength')) return `Minimum length is ${field.errors?.['minlength'].requiredLength}`;
    if (field.hasError('maxlength')) return `Maximum length is ${field.errors?.['maxlength'].requiredLength}`;
    if (field.hasError('pattern')) return 'Password must contain letters and numbers';
    if (field.hasError('mismatch')) return 'Passwords do not match';
    return 'Invalid field';
  }

  generateCaptcha() {
    this.captchaCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.captchaImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.createCaptchaImage(this.captchaCode));
  }

  createCaptchaImage(text: string): string {
    const width = 100;
    const height = 40;
    const bgColor = '#f7f7d0';
    const fontColor = '#44446b';
    const fontSize = 28;
    const fontWeight = 'bold';
    let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>`;
    svg += `<rect width='${width}' height='${height}' fill='${bgColor}'/>`;
    for (let i = 0; i < 3; i++) {
      const x1 = Math.random() * width;
      const y1 = Math.random() * height;
      const x2 = Math.random() * width;
      const y2 = Math.random() * height;
      svg += `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='#b0b0b0' stroke-width='2'/>`;
    }
    for (let i = 0; i < 25; i++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      svg += `<circle cx='${cx}' cy='${cy}' r='1.2' fill='#888'/>`;
    }
    const charSpace = width / (text.length + 1);
    for (let i = 0; i < text.length; i++) {
      const x = charSpace * (i + 1) + (Math.random() * 4 - 2);
      const y = height / 2 + fontSize / 2 - 4 + (Math.random() * 4 - 2);
      const rotate = (Math.random() * 30 - 15).toFixed(1);
      svg += `<text x='${x}' y='${y}' font-size='${fontSize}' font-family='Arial' font-weight='${fontWeight}' fill='${fontColor}' transform='rotate(${rotate} ${x} ${y})'>${text[i]}</text>`;
    }
    svg += `</svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  refreshCaptcha() {
    this.generateCaptcha();
    this.registerForm.get('verificationCode')?.setValue('');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.errorMessage = null;
    if (this.registerForm.invalid) {
      this.markAllAsTouched();
      return;
    }
    const userInput = this.registerForm.value.verificationCode?.toUpperCase();
    if (userInput !== this.captchaCode) {
      alert('Captcha does not match!');
      this.refreshCaptcha();
      return;
    }
    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }

  private markAllAsTouched() {
    Object.values(this.registerForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}