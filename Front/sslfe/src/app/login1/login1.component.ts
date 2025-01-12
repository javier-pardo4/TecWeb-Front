import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router'; // Importar Router para la redirección
import { UserService } from '../user.service';

@Component({
  selector: 'app-login1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login1.component.html',
  styleUrls: ['./login1.component.css']
})
export class Login1Component {
  loginForm: FormGroup;
  submitted = false;
  errorMessage: string = '';  // Variable para mostrar mensajes de error

  constructor(private formBuilder: FormBuilder, private user: UserService, private router: Router) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: ['', [Validators.required, Validators.minLength(6), createPasswordStrengthValidator()]]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = ''; // Limpiar cualquier mensaje de error previo

    if (this.loginForm.invalid) {
      console.warn("Formulario inválido");
      return;  // Si el formulario es inválido, no hacer nada
    }

    console.log("todo OK", JSON.stringify(this.loginForm.value, null, 2));
    sessionStorage.setItem('email', this.loginForm.controls['email'].value);

    this.user.login1(this.loginForm.controls['email'].value, this.loginForm.controls['pwd'].value).subscribe(
      (data) => {
        console.log(JSON.stringify(data));
        if (data) {
          // Redirigir a la página de gestor-listas después de un login exitoso
          this.router.navigate(['/gestor-listas']);
        }
      },
      (error) => {
        // Capturamos el error y mostramos un mensaje apropiado
        this.errorMessage = error;
      }
    );
  }

  navigateToRegister() {
    this.router.navigate(['/register1']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  onReset() {
    this.loginForm.reset();
  }
}

// Función para validar la fortaleza de la contraseña
export function createPasswordStrengthValidator() {
  return (control: AbstractControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;
    return !passwordValid ? { passwordStrength: true } : null;
  };
}
