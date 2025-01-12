import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = "http://localhost:8000/users";
  private token: string | null = null;

  constructor(private http: HttpClient) { }

  checkCookie(): Observable<any> {
    return this.http.get(this.apiUrl + "/checkCookie", 
      { responseType : "text", withCredentials : true })
      .pipe(catchError(this.handleError));
  }

  register1(email: string, pw1: string, pw2: string): Observable<any> {
    let infoJSN = { email: email, pwd1: pw1, pwd2: pw2 };
    let urlRegister1 = this.apiUrl + "/registrar1";
    return this.http.post(urlRegister1, infoJSN, { responseType: 'text' })
    .pipe(catchError(this.handleError));
  }

  login1(email: string, pwd: string): Observable<any> {
    let info = { email: email, pwd: pwd };
    let urlIniciarSesion1 = this.apiUrl + '/login1';
    return this.http.put<any>(urlIniciarSesion1, info,  
      { responseType: 'text' as 'json', withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  comprobarPremium(email: string): Observable<boolean> {
    const urlPremium = this.apiUrl + '/premium';
    return this.http.put<boolean>(urlPremium, email, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  confirmAccount(token: string): Observable<string> {
    const urlConfirmAccount = this.apiUrl + `/confirmar-cuenta?token=${token}`;
    return this.http.get<string>(urlConfirmAccount, { responseType: 'text' as 'json' })
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    localStorage.removeItem('token');
    sessionStorage.removeItem('email');
  }

  // Función para manejar errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      if (error.status === 403) {
        errorMessage = 'Credenciales incorrectas o cuenta no confirmada.';
      } else if (error.status === 500) {
        errorMessage = 'Hubo un error en el servidor. Intenta más tarde.';
      } else {
        errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }
}
