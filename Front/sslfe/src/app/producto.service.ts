import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { producto } from './modelo/producto.model';
import { lista } from './modelo/lista.model';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:8080/productos';

  constructor(private http: HttpClient) { }

  actualizarProducto(idProducto: string, unidadesCompradas: number, unidadesPedidas: number, user:string) {
    const apiUrlEspecifica = this.apiUrl + "/actualizar";
    const body = {
      idProducto: idProducto,
      unidadesCompradas: unidadesCompradas,
      unidadesPedidas: unidadesPedidas,
      user: user
    };
    console.log("Voy a actualizar el producto con id: " + idProducto);
    return this.http.put<producto>(apiUrlEspecifica, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }


  comprarProducto(idProducto: string, unidadesCompradas: number, user: string) {
    const apiUrlEspecifica = this.apiUrl + "/comprar";
    const body = {
      idProducto: idProducto,
      unidadesCompradas: unidadesCompradas,
      user: user
    };
    console.log("Voy a comprar el producto con id: " + idProducto);
    return this.http.put<producto>(apiUrlEspecifica, body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
}

pedirProducto(idProducto: string, unidadesPedidas: number, user: string) {
  const apiUrlEspecifica = this.apiUrl + "/pedir";
  const body = {
    idProducto: idProducto,
    unidadesPedidas: unidadesPedidas,
    user: user
  };
  console.log("Voy a pedir el producto con id: " + idProducto);
  return this.http.put<producto>(apiUrlEspecifica, body, {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  });
}

eliminarProducto(idProducto: string, user: string) {
  const apiUrlEspecifica = this.apiUrl + "/eliminarproducto";
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'idProducto': idProducto
  });
  console.log("Eliminado el producto con id: " + idProducto);
  return this.http.post<any>(apiUrlEspecifica,user,{ headers });

}

crearProducto(nombre: string, unidadesCompradas: number, unidadesPedidas: number) {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  const body = {
    nombre: nombre,
    unidadesCompradas: unidadesCompradas,
    unidadesPedidas: unidadesPedidas,
    usuario: sessionStorage.getItem('email')
  };
  console.log("Voy a almacenar un producto nuevo: " + nombre+ "con email de:" + sessionStorage.getItem('email'));
  return this.http.post<producto>(this.apiUrl + "/crearProducto", body, { headers });
}

}