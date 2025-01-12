# TecWeb-Front

Autores: Carlos Sánchez Diaz, Javier Pardo González y Álvaro García Caballero

---

## 🔧 *Descripción del Proyecto*

Este es el *frontend* de la aplicación *TecWeb*, el cual proporciona una interfaz interactiva y amigable para que los usuarios puedan:

- 🔑 *Registrarse*: Una vez completado el registro, se enviará un correo de confirmación para verificar la cuenta.
- 📂 *Gestionar Listas*: Permite crear, visualizar, editar y eliminar listas personales y los productos asociados.
- 🛠️ *Invitar a Otros Usuarios*: Comparte tus listas con otros usuarios.
- 💬 *Chat en Tiempo Real: Gracias a la implementación de **WebSocket* con el backend, los usuarios pueden comunicarse entre ellos en listas compartidas.

---

## 📧 *Configuración de Stripe*

Para habilitar las funcionalidades relacionadas con pagos en la aplicación, es necesario configurar *Stripe*:

- *Clave Pública*:
  - Asegúrate de añadir tu *Public API Key* de Stripe en el archivo del componente stripe-payment el cual se llama stripe-payment.ts.
  - Puedes obtener esta clave desde el [Dashboard de Stripe](https://dashboard.stripe.com).

---

## 🚀 *Principales Funcionalidades*

### 🔑 *Registro y Confirmación de Cuenta*
- Los usuarios pueden registrarse fácilmente en la plataforma proporcionando su correo electrónico.
- Tras el registro, se envía un correo de confirmación que permite activar la cuenta.

### 📂 *Gestor de Listas y Productos*
- Los usuarios tienen la capacidad de:
  - Crear y gestionar sus propias listas.
  - Añadir, editar o eliminar productos dentro de cada lista.

### 🛠️ *Invitaciones a Listas Compartidas*
- Comparte listas con otros usuarios enviando invitaciones.
- La aceptación de invitaciones permite la colaboración en tiempo real sobre listas compartidas.

### 💬 *Chat en Tiempo Real*
- El chat permite a los miembros de una lista compartida comunicarse directamente desde la plataforma.
- La comunicación se realiza en tiempo real gracias a la integración con *WebSocket* en el backend.

---

## 💡 *Notas Importantes*

- Las claves de Stripe son esenciales para que las funcionalidades de pago operen correctamente.
- El sistema está diseñado para trabajar en conjunto con el backend *TecWeb-Back*, que implementa la lógica y la gestión de datos.
