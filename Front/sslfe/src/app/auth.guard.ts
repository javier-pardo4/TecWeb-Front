import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verificamos si estamos en el navegador
    const isBrowser = typeof window !== 'undefined';

    // Si estamos en el navegador, podemos usar sessionStorage
    const isLoggedIn = isBrowser ? !!sessionStorage.getItem('email') : false;

    if (!isLoggedIn) {
      // Si no está autenticado, redirige al login
      this.router.navigate(['/']);
      return false;
    }
    
    // Si está autenticado, permite el acceso
    return true;
  }
}
