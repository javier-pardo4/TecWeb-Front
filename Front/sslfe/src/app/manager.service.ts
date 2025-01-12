import { Injectable } from '@angular/core';
import { lista } from './modelo/lista.model';
import { producto } from './modelo/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  listaSeleccionada? : lista;
  productoSeleccionado? : producto;
  productos: producto[] = [];

  constructor() { }
}
