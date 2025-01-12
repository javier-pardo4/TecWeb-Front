// reset-password.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  token: string = '';
  email: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Obtener el token de la URL
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    // Validar el token
    this.validarToken(this.token);
  }

  validarToken(token: string) {
    console.log("Token que se envía:", token); // Imprime el token antes de enviarlo
  
    this.http.put('http://localhost:8000/tokens/validar', token, { responseType: 'text' }).subscribe(
      (response: string) => {
        console.log("Respuesta del backend:", response); // Aquí se imprime directamente el string
        this.email = response; // Almacena el email recibido en la variable
      },
      error => {
        console.log("Error recibido:", error); // Imprime detalles del error
        if (error.error) {
          console.log("Detalles del error:", error.error);
        }
        if (error.status) {
          console.log("Código de estado:", error.status); // Imprime el código HTTP
        }
        console.log("Token no válido");
      }
    );
  }
  
  

  onSubmit() {
    if (this.resetPasswordForm.valid) {
      const { password, confirmPassword } = this.resetPasswordForm.value;

      if (password !== confirmPassword) {
        console.log('Las contraseñas no coinciden'); // Mensaje en consola
        return;
      }

      const url = `http://localhost:8000/users/restablecer-password?email=${this.email}&nuevaContraseña=${password}&confirmarContraseña=${confirmPassword}`;
      this.http.put(url, {}, { responseType: 'text' }).subscribe(
        response => {
          console.log('Contraseña cambiada con éxito:', response); // Imprime la respuesta del backend
          this.router.navigate(['/login']); // Navega al login
        },
        error => {
          console.log('Error al cambiar la contraseña:', error.error); // Detalles del error
        }
      );
    }
  }


  
}
