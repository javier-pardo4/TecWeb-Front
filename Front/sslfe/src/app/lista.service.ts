import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { producto } from './modelo/producto.model';
import { lista } from './modelo/lista.model';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  private apiUrl = `http://localhost:8080/listas`;
  private token: string | null = null;

  constructor(private http: HttpClient, private userService: UserService) {
    this.userService.checkCookie().subscribe(
      token=> {
        this.token = token;
        console.log('Token recibido:', token);
      }
    )
  }

  eliminarLista(idLista: string, email: string) {
    let apiUrlEspecifica= this.apiUrl+"/eliminarLista";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idLista': idLista
    });
    console.log("Voy a eliminar la lista con id: " + idLista);
    return this.http.post<any>(apiUrlEspecifica,email,{ headers });
  }

  getListas() {
    const email = typeof window !== 'undefined' && sessionStorage.getItem('email');
    if (!email) {
      console.error('Email no disponible en sessionStorage');
      return this.http.get<lista[]>(`${this.apiUrl}/getListas?email=`);
    }
    return this.http.get<lista[]>(`${this.apiUrl}/getListas?email=${email}`);
  }
  
  crearLista(nombre : string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl + "/crearLista", nombre, { headers });
  }

  aniadirProducto(idLista: string, producto: producto): Observable<lista> {
    let apiUrlEspecifica= this.apiUrl+"/addProducto";
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
      'idLista': idLista  // Se pasa el IdLista en la cabecera
    });
    return this.http.post<any>(apiUrlEspecifica, producto, { headers });
  }

  aniadirInvitado(idLista: string, email: string){
    let apiUrlEspecifica= this.apiUrl+"/addInvitado";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idLista': idLista  // Se pasa el IdLista en la cabecera
    });
    return this.http.post<any>(apiUrlEspecifica, email, { headers , responseType: 'text' as 'json'});
  }

  aceptarInvitacion(idLista: string, email: string) {
    const apiUrlEspecifica = `${this.apiUrl}/aceptarInvitacion`;
  
    const body = { idLista, email }; // Usar body en vez de parámetros en la URL
  
    return this.http.post<any>(apiUrlEspecifica, body, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' // Esto asegura que se reciban los encabezados y el cuerpo
    });
  }
  
  visualizarLista(idLista: string): Observable<producto[]> {
    let apiUrlEspecifica= this.apiUrl+"/verDetalles";
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idLista': idLista
    });

    return this.http.get<producto[]>(apiUrlEspecifica, { headers });
  }

}