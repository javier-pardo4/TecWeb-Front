import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ListaService } from '../lista.service';
import { lista } from '../modelo/lista.model';
import { producto } from '../modelo/producto.model';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ManagerService } from '../manager.service';
import { error } from 'node:console';
import { StripeIbanElement } from '@stripe/stripe-js';


@Component({
  selector: 'app-gestor-listas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestor-listas.component.html',
  styleUrl: './gestor-listas.component.css'
})

  export class GestorListasComponent {
    nuevaLista? : string;
    misListas: lista[]=[];
    listaCreada : lista=new lista;
    ws : WebSocket = new WebSocket('ws://localhost:8080/wsListas');
    productos: producto[] = [];
    usuario: string = '';
    esPremium: boolean = false;
    idLista?: String;
    mensajeError?: string;
  
  
    constructor(private service : ListaService,private router: Router, public manager: ManagerService, private userservice: UserService) { 
      const user = sessionStorage.getItem('email');
      if (user) {
        this.usuario = user;
        this.isPremium();
        this.service.getListas().subscribe(
          result => {
            this.misListas=result;
            console.log('Listas recuperadas', this.misListas);
          },
          error => {
            console.error('Error al recuperar las listas', error);
          }
        )
      }
  
      this.ws.onerror = function(evento){
        alert(evento)
      }
  
      this.ws.onmessage = function(event){
        let data = event.data;
        data = JSON.parse(data);
  
        if (data.tipo == 'actualizacionDeLista'){
          console.log(data.nombre);
        }
      }
    }

    agregarLista() {
      console.log("Voy a almacenar una lista nueva: " + this.nuevaLista);
      this.service.crearLista(this.nuevaLista!).subscribe(
        (response) => {
          this.listaCreada = response;
          console.log('Lista creada', response);
          this.misListas.push(this.listaCreada);
          this.mensajeError = '';
        },
        (error) => {
          console.error('Error al crear la lista', error);
    
          // Manejar específicamente el error 402
          if (error.status === 402) {
            this.mensajeError = 'No puedes crear más listas. Solo los usuarios premium pueden tener más de 2 listas.';
          } else {
            this.mensajeError = 'Ocurrió un error al crear la lista. Por favor, intenta más tarde.';
          }
        }
      );
    }
    

    agregarProducto(indice: number){
      this.manager.listaSeleccionada=this.misListas[indice];
      this.router.navigate(['/DetalleLista']);
    }

    visualizarLista(indice: number) {
      this.manager.listaSeleccionada = this.misListas[indice]; // Selecciona la lista
    
      // Guardar el id de la lista seleccionada en el localStorage
      if (this.manager.listaSeleccionada) {
        localStorage.setItem('listaSeleccionadaId', this.manager.listaSeleccionada.id.toString());
      } else {
        console.error('No se ha seleccionado ninguna lista');
      }    
      this.service.visualizarLista(this.manager.listaSeleccionada!.id).subscribe(
        (response) => {
          console.log('Productos cargados:', response);
          this.manager.productos = response; // Asigna los productos al manager
          this.router.navigate(['/DetalleLista']); // Navega al detalle
        },
        (error) => {
          console.error('Error al visualizar la lista:', error);
        }
      );
    }
    

    usuariosLista(indice: number){
      this.manager.listaSeleccionada=this.misListas[indice];
      this.router.navigate(['/DetalleUsuarios']);
    }

    eliminarLista(indice: number){
      this.manager.listaSeleccionada=this.misListas[indice];
      this.service.eliminarLista(this.manager.listaSeleccionada!.id, this.usuario).subscribe(
        (response) => {
          console.log('Lista eliminada correctamente:', response);
          this.misListas.splice(indice, 1);
          this.service.getListas().subscribe(
            (updatedListas) => {
              this.misListas = updatedListas;
            },
            (error) => {
              console.error('Error al obtener las listas actualizadas', error);
            }
          );
        },
        (error) => {
          console.error('Error al eliminar la lista:', error);
        }
      );

    }

    irHacersePremium() {
      this.router.navigate(['/stripe-payment']);
    }
    
    isPremium() {
      this.userservice.comprobarPremium(this.usuario).subscribe(
        (esPremium) => {
          this.esPremium = esPremium; // Actualiza el estado premium
        },
        (error) => {
          console.error('Error al verificar el estado premium', error);
        }
      );
    }

    cerrarSesion() {
      this.userservice.logout();
      this.router.navigate(['']);
    }
  
}
