import { Routes } from '@angular/router';
import { Login1Component } from './login1/login1.component';
import { Register1Component } from './register1/register1.component';
import { GestorListasComponent } from './gestor-listas/gestor-listas.component';
import { DetalleListaComponent } from './detalle-lista/detalle-lista.component';
//import { InvitacionesComponent } from './invitaciones/invitaciones.component';
import { GeolocalizacionComponent } from './geolocalizacion/geolocalizacion.component';
import { StripePaymentComponent } from './stripe-payment/stripe-payment.component';
import { Inicio1Component } from './inicio1/inicio1.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmAccountComponent } from './confirm-account/confirm-account.component';
import { InvitacionesComponent } from './invitaciones/invitaciones.component';
import { AuthGuard } from './auth.guard'; // Importa el guard


export const routes: Routes = [
    { path: '', component: Inicio1Component },
    { path: 'login', component: Login1Component },
    { path: 'register1', component: Register1Component },
    { path: 'gestor-listas', component: GestorListasComponent, canActivate: [AuthGuard] },
    { path: 'DetalleLista', component: DetalleListaComponent, canActivate: [AuthGuard] },
    { path: 'Geolocalizacion', component: GeolocalizacionComponent, canActivate: [AuthGuard] },
    { path: 'stripe-payment', component: StripePaymentComponent, canActivate: [AuthGuard] },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'confirm-account', component: ConfirmAccountComponent },
    { path: 'invitaciones', component: InvitacionesComponent }
];