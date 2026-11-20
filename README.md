# Backend -- Servicios de Programación

API REST para administrar un catálogo de servicios de programación.
Incluye gestión de usuarios, verificación por correo, autenticación
mediante JWT en cookies, carrito de compras y generación de preferencias
de pago con Mercado Pago.

**Demo:** https://backend-servicios-smzy.onrender.com\
**Repositorio:** \[Agregar URL del repositorio\]

## Tecnologías

-   Node.js y Express 5
-   MongoDB y Mongoose
-   JWT y bcryptjs
-   express-validator
-   Multer y Cloudinary
-   Nodemailer (SMTP / Mailtrap)
-   Mercado Pago SDK

## Requisitos

-   Node.js
-   pnpm (el proyecto declara pnpm como package manager)
-   MongoDB accesible
-   Credenciales de los servicios externos que se vayan a utilizar

## Instalación y ejecución

``` bash
git clone <URL_DEL_REPOSITORIO>
cd backend-servicios
pnpm install
```

Crear un archivo `.env` en la raíz del backend. No subirlo al
repositorio.

### Variables de entorno

  -----------------------------------------------------------------------
  Variable                            Uso
  ----------------------------------- -----------------------------------
  `PORT`                              Puerto del servidor. Por defecto,
                                      `3000`.

  `MONGO_URI`                         Cadena de conexión a MongoDB.

  `FRONTEND_URL`                      Origen permitido por CORS. En
                                      desarrollo, por defecto
                                      `http://localhost:5173`.

  `JWT_SECRET`                        Clave para firmar y verificar los
                                      JWT.

  `NODE_ENV`                          Entorno de ejecución; en producción
                                      la cookie se configura como
                                      `secure`.

  `CLOUDINARY_CLOUD_NAME`             Cloud name de Cloudinary.

  `CLOUDINARY_API_KEY`                API key de Cloudinary.

  `CLOUDINARY_API_SECRET`             API secret de Cloudinary.

  `SMTP_HOST`                         Host del servidor SMTP.

  `SMTP_PORT`                         Puerto SMTP.

  `SMTP_USER`                         Usuario SMTP.

  `SMTP_PASS`                         Contraseña SMTP.

  `MP_ACCESS_TOKEN`                   Access token de Mercado Pago.

  `BACKEND_URL`                       URL pública del backend; se utiliza
                                      para registrar el webhook de
                                      Mercado Pago.

  `PAYMENT_FRONTEND_URL`              URL del frontend a la que Mercado
                                      Pago devuelve al usuario.
  -----------------------------------------------------------------------

Iniciar en desarrollo:

``` bash
pnpm dev
```

Iniciar en modo normal:

``` bash
pnpm start
```

La API queda disponible localmente en `http://localhost:3000/api`.

## Estructura principal

``` text
backend-servicios/
├── index.js
├── public/
└── src/
    ├── controllers/
    ├── database/
    ├── middlewares/
    ├── models/
    ├── routes/
    ├── server/
    └── utils/
```

-   `controllers`: lógica de los endpoints.
-   `database`: conexión con MongoDB.
-   `middlewares`: autenticación, validaciones y carga de imágenes.
-   `models`: esquemas de Mongoose.
-   `routes`: definición y agrupación de rutas.
-   `server`: configuración de Express, CORS y middlewares.
-   `utils`: utilidades para carrito, Cloudinary y correo.

## Convenciones de la API

Todas las rutas se encuentran bajo el prefijo `/api`.

En los ejemplos se utiliza:

``` text
http://localhost:3000/api
```

Para probar rutas protegidas desde Postman, iniciar sesión primero y
conservar la cookie `token` que devuelve el backend. La autenticación
lee esa cookie; no se documenta un encabezado Bearer como mecanismo de
acceso.

## Endpoints

### Servicios

  -------------------------------------------------------------------------
  Método            Ruta                Acceso            Descripción
  ----------------- ------------------- ----------------- -----------------
  GET               `/servicios/test`   Público           Endpoint de
                                                          prueba.

  GET               `/servicios`        Público           Lista servicios
                                                          con búsqueda y
                                                          paginación.

  GET               `/servicios/:id`    Público           Obtiene un
                                                          servicio por ID.

  POST              `/servicios`        Admin             Crea un servicio.

  PUT               `/servicios/:id`    Admin             Edita un
                                                          servicio.

  DELETE            `/servicios/:id`    Admin             Elimina un
                                                          servicio.

  PATCH             `/servicios/:id`    **Actualmente sin Actualiza
                                        autenticación en  parcialmente un
                                        el router**       servicio.
  -------------------------------------------------------------------------

#### Listar servicios

``` http
GET /api/servicios?pagina=1&limite=8&termino=web
```

Los parámetros `pagina`, `limite` y `termino` se leen desde la query. El
término es opcional y filtra por `nombreServicio`.

Respuesta exitosa (`200`), con esta estructura:

``` json
{
  "servicios": [],
  "cantidadServicios": 0,
  "paginaActual": 1,
  "totalPaginas": 0
}
```

#### Crear un servicio

``` http
POST /api/servicios
```

Requiere sesión de administrador. En Postman seleccionar **Body →
form-data**:

  Campo              Tipo          Descripción
  ------------------ ------------- -------------------------------------------
  `nombreServicio`   Text          Entre 5 y 100 caracteres; debe ser único.
  `precio`           Text/Number   Número mayor o igual a 50.
  `descripcion`      Text          Entre 10 y 500 caracteres.
  `categoria`        Text          ID de MongoDB de una categoría existente.
  `imagen`           File          Imagen opcional; máximo 2 MB.

Si no se adjunta imagen, el controlador asigna una imagen
predeterminada. Si se adjunta, se carga en Cloudinary.

Respuesta esperada (`201`):

``` json
{
  "mensaje": "El servicio fue creado correctamente"
}
```

#### Obtener, editar y eliminar

``` http
GET    /api/servicios/ID_DEL_SERVICIO
PUT    /api/servicios/ID_DEL_SERVICIO
DELETE /api/servicios/ID_DEL_SERVICIO
```

Para `PUT`, enviar los mismos campos de creación mediante `form-data`.
La imagen es opcional al editar: si se adjunta una nueva, se sube a
Cloudinary.

Ejemplo de respuesta al editar (`200`):

``` json
{
  "mensaje": "El servicio se actualizo correctamente",
  "servicio": {}
}
```

### Categorías

  Método   Ruta            Acceso                    Descripción
  -------- --------------- ------------------------- -----------------------------
  GET      `/categorias`   Público                   Lista todas las categorías.
  POST     `/categorias`   **Actualmente pública**   Crea una categoría.

Ejemplo:

``` http
POST /api/categorias
Content-Type: application/json
```

``` json
{
  "nombre": "Desarrollo Web",
  "descripcion": "Diseño y desarrollo de aplicaciones web."
}
```

Respuesta exitosa (`201`):

``` json
{
  "mensaje": "Categoria creada correctamente"
}
```

### Usuarios y autenticación

  -----------------------------------------------------------------------------------
  Método            Ruta                          Acceso            Descripción
  ----------------- ----------------------------- ----------------- -----------------
  POST              `/usuarios/registrar`         Público           Registra usuario
                                                                    y envía código de
                                                                    verificación.

  POST              `/usuarios/verificar`         Público           Confirma el
                                                                    código recibido
                                                                    por correo.

  POST              `/usuarios/reenviar-codigo`   Público           Genera y envía un
                                                                    nuevo código.

  POST              `/usuarios/login`             Público           Inicia sesión y
                                                                    establece cookie
                                                                    JWT.

  POST              `/usuarios/logout`            Sesión            Cierra sesión
                                                                    limpiando la
                                                                    cookie.

  GET               `/usuarios/perfil`            Sesión            Devuelve el
                                                                    perfil
                                                                    autenticado.

  GET               `/usuarios`                   Admin             Lista usuarios.

  POST              `/usuarios`                   Público           Crea un usuario
                                                                    directamente.

  GET               `/usuarios/:id`               Público           Busca un usuario
                                                                    por ID.
  -----------------------------------------------------------------------------------

#### Registrar usuario

``` http
POST /api/usuarios/registrar
Content-Type: application/json
```

``` json
{
  "nombre": "Usuario Demo",
  "email": "demo@example.com",
  "password": "ClaveDemo1!"
}
```

La contraseña debe tener entre 8 y 50 caracteres, al menos una
mayúscula, una minúscula, un número y un símbolo. El registro genera un
código de seis dígitos con una vigencia de 15 minutos y lo envía por
SMTP. El rol predeterminado del modelo es `cliente`.

Respuesta exitosa (`201`):

``` json
{
  "mensaje": "Usuario registrado exitosamente. Por favor, revisa tu email para verificar tu cuenta."
}
```

#### Verificar correo

``` http
POST /api/usuarios/verificar
Content-Type: application/json
```

``` json
{
  "email": "demo@example.com",
  "codigo": "123456"
}
```

El código es ilustrativo: utilizar el recibido por correo. Respuesta
exitosa (`200`):

``` json
{
  "mensaje": "Cuenta verificada con exito. Ya puedes iniciar sesion"
}
```

#### Reenviar código

``` http
POST /api/usuarios/reenviar-codigo
Content-Type: application/json
```

``` json
{
  "email": "demo@example.com"
}
```

#### Iniciar sesión

``` http
POST /api/usuarios/login
Content-Type: application/json
```

``` json
{
  "email": "demo@example.com",
  "password": "ClaveDemo1!"
}
```

Respuesta (`200`):

``` json
{
  "mensaje": "Login exitoso",
  "usuario": "Usuario Demo"
}
```

El servidor establece una cookie `token` HttpOnly con duración de una
hora. En Postman, mantener habilitado el almacenamiento de cookies para
reutilizarla en las solicitudes siguientes.

#### Consultar perfil y cerrar sesión

``` http
GET  /api/usuarios/perfil
POST /api/usuarios/logout
```

El perfil requiere la cookie de sesión. El logout elimina la cookie.

### Carrito

Todas las rutas del carrito requieren autenticación.

  ---------------------------------------------------------------------------------
  Método                  Ruta                              Descripción
  ----------------------- --------------------------------- -----------------------
  GET                     `/carrito`                        Obtiene o crea el
                                                            carrito del usuario
                                                            autenticado.

  POST                    `/carrito`                        Agrega un servicio o
                                                            incrementa su cantidad.

  DELETE                  `/carrito`                        Vacía el carrito.

  PATCH                   `/carrito/restar/:servicioId`     Reduce en una unidad la
                                                            cantidad; elimina el
                                                            ítem al llegar a cero.

  DELETE                  `/carrito/servicio/:servicioId`   Elimina un servicio del
                                                            carrito.
  ---------------------------------------------------------------------------------

#### Agregar un servicio

``` http
POST /api/carrito
Content-Type: application/json
```

``` json
{
  "servicio": "ID_DEL_SERVICIO",
  "cantidad": 1
}
```

Respuesta exitosa (`201`): devuelve un mensaje y el carrito actualizado.

#### Consultar, restar, eliminar y vaciar

``` http
GET    /api/carrito
PATCH  /api/carrito/restar/ID_DEL_SERVICIO
DELETE /api/carrito/servicio/ID_DEL_SERVICIO
DELETE /api/carrito
```

### Pagos -- Mercado Pago

  ---------------------------------------------------------------------------------
  Método            Ruta                        Acceso            Descripción
  ----------------- --------------------------- ----------------- -----------------
  POST              `/pago/crear-preferencia`   Sesión            Crea una orden
                                                                  pendiente y una
                                                                  preferencia de
                                                                  pago.

  POST              `/pago/webhook`             Público           Recibe
                                                (notificación     notificaciones de
                                                externa)          Mercado Pago.
  ---------------------------------------------------------------------------------

#### Crear preferencia

``` http
POST /api/pago/crear-preferencia
```

Requiere cookie de sesión y un carrito con al menos un producto.

Respuesta exitosa (`201`):

``` json
{
  "mensaje": "La preferencia de pago fue creada con exito",
  "init_point": "URL_DE_CHECKOUT",
  "sandbox_init_point": "URL_DE_CHECKOUT_DE_PRUEBA",
  "ordenId": "ID_DE_LA_ORDEN"
}
```

Abrir `init_point` o `sandbox_init_point` para continuar con el
checkout, según el entorno y las credenciales utilizadas.

#### Webhook

Mercado Pago notifica a:

``` text
POST /api/pago/webhook
```

El backend consulta el pago en Mercado Pago. Cuando el estado informado
es `approved`, actualiza la orden a `aprobado`, guarda el ID del pago y
vacía el carrito del usuario.

## Modelos principales

-   **Usuario:** nombre, email, contraseña hasheada, rol, estado de
    verificación y datos temporales del código.
-   **Servicio:** nombre, precio, descripción, URL de imagen y
    referencia a categoría.
-   **Categoria:** nombre y descripción.
-   **Carrito:** usuario propietario y lista de servicios con
    cantidades.
-   **Orden:** usuario, detalle de compra, monto total, estado e
    identificadores de preferencia y pago.

## Códigos HTTP utilizados

  -----------------------------------------------------------------------
  Código                              Significado en la API
  ----------------------------------- -----------------------------------
  `200`                               Operación exitosa.

  `201`                               Recurso creado.

  `400`                               Datos inválidos, código
                                      incorrecto/expirado o carrito
                                      vacío.

  `401`                               No se envió una cookie de
                                      autenticación.

  `403`                               Token inválido/expirado, cuenta sin
                                      verificar o permisos insuficientes.

  `404`                               Recurso no encontrado.

  `409`                               El email ya está registrado.

  `500`                               Error interno del servidor.
  -----------------------------------------------------------------------

## Consideraciones para pruebas

1.  Levantar el backend y comprobar que MongoDB esté conectado.
2.  Crear una categoría y guardar su `_id`.
3.  Registrar un usuario, verificar el código recibido y luego iniciar
    sesión.
4.  Para probar operaciones administrativas, utilizar un usuario cuyo
    rol en la base sea `admin`.
5.  Conservar la cookie `token` en Postman para las rutas protegidas.
6.  Crear un servicio con `form-data`, usando el ID de la categoría.
7.  Agregar el servicio al carrito y crear la preferencia de pago.
8.  Para probar el webhook, configurar la URL pública del backend en
    Mercado Pago.

## Observaciones del código actual

-   La ruta `PATCH /servicios/:id` está declarada sin `authenticate` ni
    `isAdmin`, a diferencia de POST, PUT y DELETE. Conviene protegerla
    antes de publicar la API.
-   La creación de categorías (`POST /categorias`) y la creación directa
    de usuarios (`POST /usuarios`) no tienen middleware de autorización
    en el router. Revisar si deben permanecer públicas.
-   El controlador de listado de servicios lee `pagina` y `limite`. El
    frontend incluido en este proyecto envía `pagina` y `cantServicios`;
    para que el límite se aplique correctamente, alinear ambos nombres.
-   El endpoint `GET /usuarios/:id` devuelve el documento de usuario
    según el controlador actual. Revisar la exposición de datos antes de
    utilizarlo públicamente.
-   El código de verificación también se imprime en la consola durante
    el registro. Evitar mantener ese log en producción.

## Autor

**Fátima Alfaro**
