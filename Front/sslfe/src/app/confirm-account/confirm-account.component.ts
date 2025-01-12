import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css']
})
export class ConfirmAccountComponent {
  token: string | null = null;
  accountConfirmed: boolean = false;  // Estado para manejar la confirmación

  constructor(private route: ActivatedRoute, private http: HttpClient, private userService: UserService) {}

  ngOnInit() {
    // Obtenemos el token de la URL
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  confirmAccount() {
    if (!this.token) {
      alert('Token no válido');
      return;
    }

    // Llamar al servicio para confirmar la cuenta
    this.userService.confirmAccount(this.token).subscribe({
      next: (response) => {
        this.accountConfirmed = true; // Actualizamos el estado para mostrar el mensaje
      },
      error: (err) => {
        alert('Error al confirmar la cuenta: ' + err.error);
      }
    });
  }
}
