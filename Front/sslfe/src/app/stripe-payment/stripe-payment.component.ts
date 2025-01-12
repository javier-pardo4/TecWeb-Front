import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { Router } from '@angular/router'; // Importar Router para la redirección


@Component({
  selector: 'app-stripe-payment',
  standalone: true,
  templateUrl: './stripe-payment.component.html',
  styleUrls: ['./stripe-payment.component.css'],
})
export class StripePaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  clientSecret: string | null = null;

  // Inyectar Router en el constructor
  constructor(private router: Router) {}

  ngOnInit(): void {
    loadStripe('pk_test_51Q7a8sP9Eym6eygIl7EnMULYHnduzW2u5uuxcyRoM14NHkxSfZuhsL8xUFgqIJmvY2jatT78rUnmbTlCf8jULSbg003u5F6GZF').then((stripe) => {
      if (stripe) {
        this.stripe = stripe;
        this.elements = stripe.elements();
        this.card = this.elements.create('card');
        this.card.mount('#stripe-payment-form');

        document.getElementById('premium-btn')?.addEventListener('click', () => {
          this.showPaymentForm();
        });

        document.getElementById('pay-button')?.addEventListener('click', () => {
          this.prepareTransaction();
        });

        document.getElementById('confirm-payment-button')?.addEventListener('click', () => {
          this.confirmPayment();
        });
      } else {
        alert('No se pudo cargar Stripe.');
      }
    }).catch((error) => {
      console.error('Error al cargar Stripe:', error);
    });
  }

  showPaymentForm(): void {
    document.getElementById('cards-container')!.style.display = 'none';
    document.getElementById('payment-container')!.style.display = 'block';
  }

  // Preparar la transacción, enviando el importe al backend
  async prepareTransaction(): Promise<void> {
    const amount = parseFloat((document.getElementById('amount') as HTMLInputElement).value);
    const email = (document.getElementById('email') as HTMLInputElement).value;

    if (isNaN(amount) || amount <= 0) {
      alert('Por favor, introduce un importe válido.');
      return;
    }

    if (!email) {
      alert('Por favor, introduce un correo electrónico válido.');
      return;
    }

    // Realizar la solicitud PUT al backend para obtener el client_secret
    const url = `http://localhost:8000/pagos/prepararTransaccion`;
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(amount),
      });

      if (!response.ok) {
        throw new Error('Error al procesar el pago');
      }

      this.clientSecret = await response.text(); // Obtener el client_secret

      // Mostrar el formulario de pago de Stripe y el botón de confirmación
      document.getElementById('stripe-form')!.style.display = 'block';
      document.getElementById('payment-form')!.style.display = 'none';
      document.getElementById('confirm-payment-button')!.style.display = 'block';
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al intentar preparar el pago.');
    }
  }

  // Confirmar el pago con el client_secret
  async confirmPayment(): Promise<void> {
    if (!this.stripe || !this.clientSecret || !this.card) {
      alert('Stripe no está correctamente inicializado.');
      return;
    }

    const { error, paymentIntent } = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card,
      },
    });

    if (error) {
      alert('Error en el pago: ' + error.message);
    } else if (paymentIntent?.status === 'succeeded') {
      alert('Pago exitoso!');
      this.confirmPaymentBackend(paymentIntent.id);
    }
  }

  // Confirmar el pago en el backend
  async confirmPaymentBackend(paymentIntentId: string): Promise<void> {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const confirmUrl = `http://localhost:8000/pagos/confirmarPago?paymentIntentId=${paymentIntentId}&email=${encodeURIComponent(email)}`;

    try {
      const confirmResponse = await fetch(confirmUrl, {
        method: 'POST',
      });

      if (!confirmResponse.ok) {
        throw new Error('Error al confirmar el pago');
      }

      const confirmMessage = await confirmResponse.text();
      alert(confirmMessage);
      this.enviarCorreoPremium();
    } catch (confirmError) {
      console.error('Error al confirmar el pago:', confirmError);
      alert('Hubo un problema al confirmar el pago.');
    }
  }

  async enviarCorreoPremium(): Promise<void> {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const emailUrl = `http://localhost:8000/email/confirmar-premium?email=${encodeURIComponent(email)}`;

    try {
      const emailResponse = await fetch(emailUrl, { method: 'POST' });

      if (!emailResponse.ok) {
        throw new Error('Error al enviar el correo de confirmación premium');
      }
      alert('Correo de confirmación premium enviado.');
      this.router.navigate(['/gestor-listas']);
    } catch (error) {
      console.error('Error al enviar el correo premium:', error);
      alert('Hubo un problema al enviar el correo de confirmación premium.');
    }
  }
}