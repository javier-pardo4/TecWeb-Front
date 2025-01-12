import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaService } from '../lista.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-invitaciones',
  templateUrl: './invitaciones.component.html',
  styleUrls: ['./invitaciones.component.css']
})
export class InvitacionesComponent implements OnInit {
  email!: string;
  listaId!: string;
  listaNombre!: string;
  invitadorEmail!: string;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private listaService: ListaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'];
      this.listaId = params['listaId'];
      this.listaNombre = params['listaNombre'];
      this.invitadorEmail = params['invitadorEmail'];
    });
  }

  aceptarInvitacion() {
    this.loading = true;
  
    // Llamar al backend con los datos necesarios
    this.listaService.aceptarInvitacion(this.listaId, this.email).subscribe(
      (response: any) => {
        if (response.status === 200) {
          // Si la respuesta es exitosa, mostrar el mensaje del backend
          console.log('Respuesta del backend:', response.body);
  
          // Redirigir al usuario
          this.router.navigate(['/']);
        }
      },
      (error: HttpErrorResponse) => {
        // Si hay un error, mostrarlo
        console.error('Error al aceptar la invitación:', error);
        alert('Hubo un problema al aceptar la invitación. Inténtalo de nuevo.');
      },
      () => {
        this.loading = false;
      }
    );
  }
  
}
