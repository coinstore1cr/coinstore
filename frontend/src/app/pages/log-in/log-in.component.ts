import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-log-in',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {
  loginForm: FormGroup;
  showPassword = false;
  captchaCode = '';
  captchaImageUrl: SafeUrl = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      verificationCode: ['', Validators.required]
    });
    this.generateCaptcha();
  }

  generateCaptcha() {
    // Generate a random 4-character code
    this.captchaCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.captchaImageUrl = this.sanitizer.bypassSecurityTrustUrl(this.createCaptchaImage(this.captchaCode));
  }

  createCaptchaImage(text: string): string {
    // SVG properties
    const width = 100;
    const height = 40;
    const bgColor = '#f7f7d0';
    const fontColor = '#44446b';
    const fontSize = 28;
    const fontWeight = 'bold';
    let svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>`;
    // Background
    svg += `<rect width='${width}' height='${height}' fill='${bgColor}'/>`;
    // Add random lines
    for (let i = 0; i < 3; i++) {
      const x1 = Math.random() * width;
      const y1 = Math.random() * height;
      const x2 = Math.random() * width;
      const y2 = Math.random() * height;
      svg += `<line x1='${x1}' y1='${y1}' x2='${x2}' y2='${y2}' stroke='#b0b0b0' stroke-width='2'/>`;
    }
    // Add random dots
    for (let i = 0; i < 25; i++) {
      const cx = Math.random() * width;
      const cy = Math.random() * height;
      svg += `<circle cx='${cx}' cy='${cy}' r='1.2' fill='#888'/>`;
    }
    // Draw each digit with random rotation and position
    const charSpace = width / (text.length + 1);
    for (let i = 0; i < text.length; i++) {
      const x = charSpace * (i + 1) + (Math.random() * 4 - 2);
      const y = height / 2 + fontSize / 2 - 4 + (Math.random() * 4 - 2);
      const rotate = (Math.random() * 30 - 15).toFixed(1); // -15 to +15 degrees
      svg += `<text x='${x}' y='${y}' font-size='${fontSize}' font-family='Arial' font-weight='${fontWeight}' fill='${fontColor}' transform='rotate(${rotate} ${x} ${y})'>${text[i]}</text>`;
    }
    svg += `</svg>`;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  refreshCaptcha() {
    this.generateCaptcha();
    this.loginForm.get('verificationCode')?.setValue('');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const userInput = this.loginForm.value.verificationCode?.toUpperCase();
      if (userInput !== this.captchaCode) {
        alert('Captcha does not match!');
        this.refreshCaptcha();
        return;
      }
      this.authService.login({
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      }).subscribe({
        next: (response) => {
          console.log('Login successful');
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });
    }
  }
}





