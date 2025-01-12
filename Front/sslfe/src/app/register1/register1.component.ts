import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { FormsModule } from '@angular/forms'; 
import { UserService } from '../user.service';
import { Router } from '@angular/router'; // Importar Router para la redirección

@Component({
  selector: 'app-register1',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register1.component.html',
  styleUrls: ['./register1.component.css'] // Asumimos que tienes este archivo para los estilos
})
export class Register1Component {
  email?: string;
  pwd1?: string;
  pwd2?: string;
  respuestaOK?: boolean;
  contraseniascoinciden?: boolean;
  mensajeError?: string; // Nueva variable para mostrar mensajes de error
  link?: string;

  constructor(private service: UserService, private router: Router) { 
    this.respuestaOK = false;
    this.contraseniascoinciden = false;
    this.mensajeError = '';
  }

  registrar() {
    this.respuestaOK = false;
    this.contraseniascoinciden = false;
    this.mensajeError = ''; // Reiniciar mensaje de error

    // Verificar si las contraseñas coinciden
    if (this.pwd1 !== this.pwd2) {
      this.contraseniascoinciden = true;
      return;
    }

    // Llamada al servicio para registrar al usuario
    this.service.register1(this.email!, this.pwd1!, this.pwd2!).subscribe(
      ok => {
        console.log('Registro exitoso', ok);
        this.link = ok;
        this.respuestaOK = true;
      },
      error => {
        console.error('Error en el registro', error);

        // Verificar si el error es un 403 para usuario existente
        if (error === 'Credenciales incorrectas o cuenta no confirmada.') {
          this.mensajeError = 'Ya existe un usuario con este correo electrónico.';
        } else {
          this.mensajeError = 'Ocurrió un error. Por favor, intenta más tarde.';
        }
      }
    );
  }

  navigateToLogin() {
    // Redirigir al login después de un registro exitoso
    this.router.navigate(['login']);
  }
}
