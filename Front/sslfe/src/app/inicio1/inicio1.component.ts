import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio1',
  templateUrl: './inicio1.component.html',
  styleUrls: ['./inicio1.component.css'],
})
export class Inicio1Component {
  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Cambiar la ruta según tu configuración de rutas
  }
}

