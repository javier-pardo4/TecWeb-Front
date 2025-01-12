import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.email;

      // URL del endpoint del backend para enviar el correo
      const emailUrl = `http://localhost:8000/email/recuperar-contraseña?email=${encodeURIComponent(email)}`;

      try {
        // Realizar la solicitud HTTP POST al backend
        const emailResponse = await fetch(emailUrl, { method: 'POST' });

        if (!emailResponse.ok) {
          throw new Error('Error al enviar el correo de restablecimiento');
        }

        alert('Correo de restablecimiento enviado correctamente. Por favor, revisa tu bandeja de entrada.');
      } catch (error) {
        console.error('Error al enviar el correo de restablecimiento:', error);
        alert('Hubo un problema al enviar el correo de restablecimiento.');
      }
    } else {
      alert('Por favor, ingresa un email válido.');
    }
  }
}
