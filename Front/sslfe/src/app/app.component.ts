import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Register1Component } from "./register1/register1.component";
import { Login1Component } from './login1/login1.component';
import { GestorListasComponent } from './gestor-listas/gestor-listas.component';
import { DetalleListaComponent } from './detalle-lista/detalle-lista.component';
import { UserService } from './user.service';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';
import { Inicio1Component } from './inicio1/inicio1.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ListaCompraPersonal';
}