import { Component, OnInit } from '@angular/core';
import { producto } from '../modelo/producto.model';
import { ListaService } from '../lista.service';
import { ManagerService } from '../manager.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../producto.service';
import { Router } from '@angular/router';
import { lista } from '../modelo/lista.model';

@Component({
  selector: 'app-detalle-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-lista.component.html',
  styleUrls: ['./detalle-lista.component.css']
})
export class DetalleListaComponent implements OnInit {
  nuevoProducto: string = '';
  unidadesPedidas: number = 0;
  unidadesCompradas: number = 0;
  productocreado: producto = new producto();
  lista?: string = '';  // Guardamos el nombre de la lista
  productos: producto[] = [];
  emailInvitado: string = '';
  chatAbierto: boolean = false; // Controla la visibilidad del chat
  mensajes: { email: string; contenido: string }[] = []; // Mensajes del chat
  nuevoMensaje: string = ''; // Mensaje que escribe el usuario
  emailUsuario: string = '';
  idLista: string = '';
  private ws: WebSocket | null = null;
  private wsLista: WebSocket | null = null;
  misListas: lista[]=[];
  invitado: boolean = false;
  linkInv: string = '';

  constructor(
    private listaService: ListaService,
    public manager: ManagerService,
    private productoService: ProductoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Recuperamos el id de la lista desde localStorage
    const listaId = localStorage.getItem('listaSeleccionadaId');
    console.log('Lista seleccionada:', listaId);
  
    // Recuperamos todas las listas disponibles
    this.listaService.getListas().subscribe(
      result => {
        this.misListas = result;
  
        if (listaId) {
          // Buscar la lista seleccionada usando el id desde el localStorage
          const listaSeleccionada = this.misListas.find(lista => lista.id.toString() === listaId);
  
          if (listaSeleccionada) {
            // Asignamos la lista seleccionada al ManagerService
            this.manager.listaSeleccionada = listaSeleccionada;
            this.lista=this.manager.listaSeleccionada?.nombre;
            this.idLista = this.manager.listaSeleccionada!.id;
            this.productos=this.manager.productos;
            this.emailUsuario = sessionStorage.getItem('email') || '';
            this.iniciarwsLista();
            console.log('Lista seleccionada encontrada:', listaSeleccionada);
  
            // Ahora, podemos cargar los productos de la lista
            this.visualizarLista(listaSeleccionada.id); // Llamamos a visualizarLista con el id de la lista
          } else {
            console.error('No se encontró la lista con el id en las listas disponibles.');
          }
        } else {
          console.error('No se encontró el id de la lista en el localStorage.');
        }
      },
      error => {
        console.error('Error al recuperar las listas', error);
      }
    );
  }
  
  // Visualizamos la lista y sus productos
  visualizarLista(id: string): void {
    console.log('Visualizando lista con id:', id);
  
    this.listaService.visualizarLista(id).subscribe(
      (response) => {
        console.log('Lista visualizada correctamente con los productos:', response);
  
        // Actualizamos los productos en el ManagerService
        this.manager.productos = response;
        this.productos = this.manager.productos;  // Asignamos los productos a la variable
  
        // Recuperamos la lista seleccionada desde ManagerService
        const listaSeleccionada = this.manager.listaSeleccionada;
        console.log('Lista seleccionada en ManagerService:', listaSeleccionada);
  
        if (listaSeleccionada) {
          this.lista = listaSeleccionada.nombre;  // Asignamos el nombre de la lista
        } else {
          console.error('No se encontró la lista seleccionada en ManagerService.');
        }
      },
      (error) => {
        console.error('Error al visualizar la lista:', error);
      }
    );
  }
  

  aniadirProducto(): void {
    console.log('Voy a almacenar el producto');
    const nuevoProductoNombreLower = this.nuevoProducto.toLowerCase();
  
    const productoExistente = this.manager.productos.find(
      (producto) => producto.nombre.toLowerCase() === nuevoProductoNombreLower
    );
  
    if (productoExistente) {
      console.log('El producto ya existe, actualizando unidades...');
      const nuevasUnidadesPedidas = productoExistente.unidadesPedidas + this.unidadesPedidas;
      const nuevasUnidadesCompradas = productoExistente.unidadesCompradas + this.unidadesCompradas;
  
      this.productoService.actualizarProducto(
        productoExistente.id,
        nuevasUnidadesCompradas,
        nuevasUnidadesPedidas,
        this.emailUsuario
      ).subscribe(
        (response) => {
          console.log('Producto actualizado correctamente:', response);
          productoExistente.unidadesPedidas = nuevasUnidadesPedidas;
          productoExistente.unidadesCompradas = nuevasUnidadesCompradas;
  
          // Limpiar el formulario
          this.limpiarFormulario();
        },
        (error) => {
          console.error('Error al actualizar el producto existente:', error);
        }
      );
    } else {
      this.productoService.crearProducto(
        this.nuevoProducto,
        this.unidadesCompradas,
        this.unidadesPedidas
      ).subscribe(
        (response) => {
          this.productocreado = response;
          console.log('Producto creado:', response);
  
          console.log('Voy a añadir el producto a la lista');
          this.listaService.aniadirProducto(
            this.manager.listaSeleccionada!.id,
            this.productocreado
          ).subscribe(
            (response) => {
              console.log('Producto agregado correctamente:', response);
              this.manager.productos.push(this.productocreado);
  
              // Limpiar el formulario
              this.limpiarFormulario();
            },
            (error) => {
              console.error('Error al almacenar el producto:', error);
            }
          );
        },
        (error) => {
          console.error('Error al crear el producto:', error);
        }
      );
    }
  }
  
  // Método para limpiar el formulario
  limpiarFormulario(): void {
    this.nuevoProducto = '';
    this.unidadesPedidas = 0;
    this.unidadesCompradas = 0;
  }

// Aumentar las unidades compradas
  aumentarUnidadesCompradas(producto: producto): void {
    producto.unidadesCompradas++;
    this.productoService.comprarProducto(producto.id, producto.unidadesCompradas, this.emailUsuario).subscribe(
      (response) => {
        console.log('Producto comprado:', response);
      },
      (error) => {
        console.error('Error al comprar el producto:', error);
      }
    );
  }

  // Aumentar las unidades pedidas
  aumentarUnidadesPedidas(producto: producto): void {
    producto.unidadesPedidas++;
    this.productoService.pedirProducto(producto.id, producto.unidadesPedidas, this.emailUsuario).subscribe(
      (response) => {
        console.log('Producto sumado:', response);
      },
      (error) => {
        console.error('Error al sumar el producto:', error);
      }
    );
  }

  // Volver a la página anterior
  volverAtras(): void {
    this.router.navigate(['/gestor-listas']);
  }

  // Eliminar un producto
  eliminarProducto(producto: producto): void {
    console.log('Voy a eliminar producto con id:', producto.id);
    this.productoService.eliminarProducto(producto.id, this.emailUsuario).subscribe(
      (response) => {
        console.log('Producto eliminado:', response);
        const index = this.manager.productos.findIndex(p => p.id === producto.id);

        // Si el producto existe en la lista
        if (index !== -1) {
          // Eliminar el producto de la lista de productos
          this.manager.productos.splice(index, 1);
        }
      },
      (error) => {
        console.error('Error al eliminar el producto:', error);
      }
    );
  }

  iniciarwsLista() {
    this.wsLista = new WebSocket(
      `ws://localhost:8080/wsListas?email=${this.emailUsuario}&idLista=${this.idLista}`
    );

    this.wsLista.onopen = () => {
      console.log('WebSocket WSListas conectado');
    };

    this.wsLista.onerror = (error) => {
      console.error('Error en WebSocket WSListas:', error);
    };

    this.wsLista.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Mensaje recibido del WebSocket WSListas:', data);
      if (data.tipo === 'actualizacionDeLista' && data.idLista === this.idLista) {
        this.actualizarListaDesdeWS(data);
      }
    };    

    this.wsLista.onclose = () => {
      console.log('WebSocket WSListas cerrado');
    };
  }

  actualizarListaDesdeWS(data: { idLista: string; nombre: string, idProducto: string; unidadesCompradas?: number; unidadesPedidas?: number;email: string; accion: string }) {
    console.log('Actualización recibida del WebSocket:', data);
  
    switch (data.accion) {
      case 'nuevo': {
        if (data.nombre && data.idProducto) {
          const nuevoProducto = {
            id: data.idProducto,
            nombre: data.nombre,
            unidadesCompradas: data.unidadesCompradas || 0,
            unidadesPedidas: data.unidadesPedidas || 0,
          };
          this.productos.push(nuevoProducto);
        } else {
          console.warn('Datos incompletos para agregar un producto nuevo:', data);
        }
        break;
      }
      case 'actualizar': {
        // Actualizar un producto existente
        const productoActualizado = this.productos.find(p => p.id === data.idProducto);
        if (productoActualizado) {
          productoActualizado.unidadesCompradas = data.unidadesCompradas || 0;
          productoActualizado.unidadesPedidas = data.unidadesPedidas || 0;
        }
        break;
      }
      case 'eliminar': {
        // Eliminar un producto
        const index = this.productos.findIndex(p => p.id === data.idProducto);
        if (index !== -1) {
          this.productos.splice(index, 1);
        }
        break;
      }
      default:
        console.warn('Acción desconocida recibida en el WebSocket:', data.accion);
    }
  }
  

  notificarCambio(producto: producto) {
    if (this.wsLista && this.wsLista.readyState === WebSocket.OPEN) {
      const mensaje = {
        tipo: 'actualizacionDeProducto',
        idLista: this.idLista,
        idProducto: producto.id,
        unidadesCompradas: producto.unidadesCompradas,
        unidadesPedidas: producto.unidadesPedidas,
      };
      this.wsLista.send(JSON.stringify(mensaje));
    }
  }

  abrirChat() {
    if (this.chatAbierto) {
      this.cerrarChat();
      return;
    }

    this.chatAbierto = true;

    this.ws = new WebSocket(
      `ws://localhost:8080/wsChat?nombre=${this.emailUsuario}&idLista=${this.idLista}`
    );

    this.ws.onopen = () => {
      console.log('WebSocket conectado');
    };

    this.ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    this.ws.onmessage = (event) => {
      const mensajeRecibido = JSON.parse(event.data);
      this.recibirMensajeWS(mensajeRecibido);
    };

    this.ws.onclose = () => {
      console.log('WebSocket cerrado');
      this.chatAbierto = false;
    };
  }

  cerrarChat() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.chatAbierto = false;
  }

  enviarMensaje() {
    if (this.nuevoMensaje.trim() === '') return;

    const mensaje = {
      tipo: "difusion",
      email: this.emailUsuario,
      contenido: this.nuevoMensaje.trim(),
      idLista: this.idLista
    };

    this.mensajes.push(mensaje); // Añadir mensaje localmente

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(mensaje));
    } else {
      console.warn('WebSocket no está conectado');
    }

    this.nuevoMensaje = ''; // Limpiar el campo de mensaje
  }

  recibirMensajeWS(mensaje: { email: string; contenido: string }) {
    this.mensajes.push(mensaje); // Añadir mensaje recibido al historial
  }

  aniadirInvitado() {
    console.log('Voy a añadir un invitado a la lista');
    this.listaService.aniadirInvitado(this.manager.listaSeleccionada!.id, this.emailInvitado).subscribe(
      async (response) => {
        console.log('Invitado añadido:', response);
        console.log('correo', this.emailInvitado);
        console.log('id de la lista', this.manager.listaSeleccionada!.id);
        this.invitado = true;
        
        // Enviar correo de invitación
        const emailUrl = `http://localhost:8000/email/enviar-invitacion?email=${encodeURIComponent(this.emailInvitado)}&lista=${encodeURIComponent(this.manager.listaSeleccionada!.id)}&url=${encodeURIComponent(response)}`;
        this.linkInv=response;
        try {
          const emailResponse = await fetch(emailUrl, { method: 'POST' });
          if (!emailResponse.ok) {
            throw new Error('Error al enviar el correo de invitación');
          }
        } catch (error) {
          console.error('Error al enviar el correo de invitación:', error);
          alert('Hubo un problema al enviar el correo de invitación.');
        }
      },
      (error) => {
        console.error('Error al añadir el invitado:', error);
      }
    );
  }
  

  
}
