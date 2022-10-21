//Simulación de un sitio de venta de ropa.

//Declaración de constantes y variables
const tienda = [];
const contadorCarrito = document.querySelector("#contadorCarrito");
const botonVerCarrito = document.querySelector("#botonVerCarrito");
const divCarrito = document.querySelector("#carrito");
const tituloPagina = document.querySelector("#tituloPagina");
const seccionFiltro=document.querySelector("#filtro");
const divComprar = document.querySelector("#comprar");
const toggleFiltro=document.querySelector("#toggleFiltro");
const mostrarOpciones = document.querySelector("#opcionesFiltro");
const botonesFiltro = document.querySelector("#botonesFiltro");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let seleccionEnvio;
let seleccionPago;
let nombreComprador;
let numerosTarjeta

//Funcion para cargar productos a un array
function cargar(array,producto) {
    array.push(producto);
}

//Eliminar algún producto del carrito
function eliminar(producto) {
    carrito.splice(carrito.indexOf(producto),1);
}

//Obtención de los productos a partir de un archivo data.json
fetch("./JS/data.json")
.then(res=>res.json())
.then(data=>{
    data.forEach(element=>{
        cargar(tienda,element);
    })
    crearTarjetas(tienda, 2000);
})

//Carga de tarjetas en el DOM
const divTienda = document.querySelector("#productos");
function crearTarjetas(array, tiempo) {
    divTienda.innerHTML=`<h6 class="mensajes">CARGANDO...</h6>`;
    setTimeout(()=>{
        divTienda.innerHTML="";
        array.forEach((producto)=>{
            divTienda.innerHTML += `<article class="card m-auto my-3" style="width: 18rem;">
            <img src=${producto.img} class="card-img-top">
            <div class="card-body text-center" id="${producto.id}">
            <h5 class="card-title">${producto.articulo}</h5>
            <p class="card-text">Talle: ${producto.talle} <br>Precio: $${producto.precio}</p>
            <button class="btn boton" id="btn-agregar${producto.id}">Agregar al carrito</button>
            </div>
            </article>`;
    })
        agregarBoton (array);
    }, tiempo)
}

//Muestra la cantidad de elementos que hay en el carrito (contador sobre el icono de carrito)
contadorCarrito.innerText=carrito.length;

//Funcionalidad del boton para mostrar u ocultar las opciones de filtrado
toggleFiltro.addEventListener("click", ()=> {
    let toggle = document.querySelector("#flecha");
    if (toggle.className==="bi bi-caret-down") {
        toggleFiltro.innerHTML=`<i class="bi bi-caret-up" id="flecha">`;
        mostrarOpciones.classList.remove("ocultar");
        botonesFiltro.classList.remove('ocultar');

        agregarFuncionAplicarFiltro();
        agregarFuncionRestablecerFiltro();
    } else {
        toggleFiltro.innerHTML=`<i class="bi bi-caret-down" id="flecha">`;
        mostrarOpciones.classList.add("ocultar");
        botonesFiltro.classList.add('ocultar');
    }
})

//Funcionalidad al boton de aplicar filtro segun las opciones seleccionadas
function agregarFuncionAplicarFiltro(){
    document.querySelector("#aplicarFiltro").addEventListener("click", ()=> {
        let categorias = document.querySelectorAll('input[name="categorias"]');
        let tiendaFiltrada = []
        for (const categoria of categorias) {
            if (categoria.checked){
                let categoriaFiltrada = tienda.filter(el=>el.categoria==categoria.id);
                categoriaFiltrada.forEach(el=>{
                    tiendaFiltrada.push(el)
                })
            }
        }
        divTienda.innerHTML = "";
        if (tiendaFiltrada.length==0) {
            Swal.fire('¡No ha seleccionado ninguna categoría!')
            crearTarjetas(tienda, 500)
        }else{
            crearTarjetas(tiendaFiltrada, 500);
        }
    })
}

//Funcionalidad al boton de restablecer el filtro
function agregarFuncionRestablecerFiltro() {
    document.querySelector("#restablecerFiltro").addEventListener("click", ()=> {
        restablecerFiltro()
    })
}

//Funcion que restablece el filtro y pinta nuevamente todos los elementos de la tienda en el DOM
function restablecerFiltro() {
    let categorias = document.querySelectorAll('input[name="categorias"]');
    for (const categoria of categorias) {
        categoria.checked=false;
    }
    divTienda.innerHTML = "";
    crearTarjetas(tienda, 500);
}

//Declaración de la función para agregar funcionalidad al boton de "Agregar al carrito"
function agregarBoton (array){
    array.forEach(producto=>{
        document.querySelector(`#btn-agregar${producto.id}`).addEventListener("click",()=>{
            carrito.some(prod=>prod.id === producto.id) ? (carrito.find(prod=> prod.id===producto.id).cantidad++) : (producto.cantidad = 1, cargar(carrito,producto));
            contadorCarrito.innerText=carrito.length;
            Toastify({
                text: "Agregado al carrito \n\r VER CARRITO",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                stopOnFocus: true,
                style: {
                  background: "#4E5C23",
                  textAlign:"center",
                  lineHeight:"15px"
                },
                onClick: ()=>{crearCarrito(1000);} //Para ver el carrito de compras al clickear sobre el mensaje
              }).showToast();
        })
    })
}

//Creación del carrito de compras cuando se seleccionan productos (o a partir del local storage). La variable "tiempo" permite simular un proceso de carga
function crearCarrito(tiempo) {
    divTienda.innerHTML=`<h6 class="mensajes">PROCESANDO...</h6>`
    setTimeout(()=>{
        seccionFiltro.classList.add("ocultar")
        divTienda.innerHTML="";
        tituloPagina.innerText="Carrito";
        carrito.forEach((producto)=>{
            divCarrito.innerHTML += `
            <article class="tarjetaCarrito">
                <div>
                    <button class="btn boton botonSumaResta" id="btn-sumar${producto.id}">+</button>
                    </br>
                    <button class="btn boton botonSumaResta" id="btn-restar${producto.id}">-</button>
                </div>
                <img src=${producto.img}>
                <div class="divCarrito">
                    <h6>${producto.articulo}</h6>
                    <p>Precio: $${producto.precio}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                </div>
            </article>`;
        });
        let valorTotal = sumaTotal();
        let cantidadProductos = sumaCantidad();
            divCarrito.innerHTML+=`
            <div class="resumenCarrito">
                <p>Productos en el carrito: <b>${cantidadProductos}</b></p>
                <p>Valor total del carrito: <b>$${valorTotal}</b></p>
            </div>
            <button class="btn boton botonComprar" id="volverCatalogo">Volver al catalogo</button>
            <button class="btn boton botonComprar" id="vaciarCarrito">Vaciar carrito</button>
            <button class="btn boton botonComprar" id="comprarCarrito">Comprar</button>
            `;
        
        contadorCarrito.innerText=carrito.length;
        localStorage.setItem("carrito",JSON.stringify(carrito)); //Guardo los productos agregados al carrito en el local storage
        agregarBotonSumar ();
        agregarBotonRestar ();
        agregarBotonVolverCatalogo (); //falta agregar funcion
        agregarBotonVaciarCarrito ();
        agregarBotonComprar ();
    }, tiempo)
}

//Función para sumar el valor total de los productos del carrito
function sumaTotal() {
    let sum = carrito.reduce((acum,el)=>{
        return acum + el.precio * el.cantidad;
    }, 0);
    return sum
}

//Función para calcular la cantidad de elementos distintos del carrito
function sumaCantidad() {
    let sum = carrito.reduce((acum,el)=>{
        return acum + el.cantidad;
    }, 0)
    return sum;
}

//Agregando funcionalidad al boton de eliminar elementos individuales del carrito (reducir el atributo "cantidad")
function agregarBotonRestar (){
    carrito.forEach(producto=>{
        document.querySelector(`#btn-restar${producto.id}`).addEventListener("click",()=>{
            producto.cantidad>1 ?  producto.cantidad = producto.cantidad-1 : eliminar(producto);
            divCarrito.innerHTML="";
            carrito.length==0 ? restablecer () : crearCarrito(0);
        })
    })
}

//función para agregar un mismo productos al carrito (aumentar la cantidad)
function agregarBotonSumar() {
    carrito.forEach(producto=>{
        document.querySelector(`#btn-sumar${producto.id}`).addEventListener("click",()=>{
            producto.cantidad = producto.cantidad+1;
            divCarrito.innerHTML="";
            crearCarrito(0);
        })
})
}

//Agregando funcionalidad al boton de regresar al catalogo desde el carrito de compras
function agregarBotonVolverCatalogo () {
    document.querySelector("#volverCatalogo").addEventListener("click", ()=> {
        divCarrito.innerHTML="";
        divTienda.innerHTML="";
        crearTarjetas(tienda, 1000);
        seccionFiltro.classList.remove("ocultar");
        tituloPagina.innerText="Catálogo de productos";
    })
}

//Agregando funcionalidad al botón para vaciar todo el carrito de compras
function agregarBotonVaciarCarrito (){
    document.querySelector("#vaciarCarrito").addEventListener("click", ()=> {
        Swal.fire({
            title: '¿Estás seguro/a?',
            text: "Deberá elegir nuevamente los productos si da click en confirmar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, vaciar carrito'
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Se ha vaciado el carrito')
                restablecer ()
            }
          })
    })
}

//Declaración de una función para restablecer toda la tienda (vacia el carrito y limpia las etiquetas padres del DOM)
function restablecer () {
    carrito = [];
    localStorage.setItem("carrito",JSON.stringify(carrito));
    divCarrito.innerHTML="";
    divTienda.innerHTML="";
    divComprar.innerHTML="";
    contadorCarrito.innerText=carrito.length;
    botonVerCarrito.classList.remove("ocultar");
    tituloPagina.innerText="Catálogo de productos";
    restablecerFiltro()
}

//Agregando funcionalidad al boton de comprar los elementos del carrito
function agregarBotonComprar () {
    document.querySelector("#comprarCarrito").addEventListener("click", ()=> {
        divTienda.innerHTML="";
        divCarrito.innerHTML="";
        botonVerCarrito.classList.add("ocultar");
        tituloPagina.innerText="Proceso de compra"
        formaEnvio();
    })
}

//Funcionalidad del boton del carrito. Pinta los elementos del carrito o arroja un mensaje si el carrito está vacío
botonVerCarrito.addEventListener("click",()=>{
    if (carrito.length==0){
        Swal.fire('Aún no hay productos en el carrito')
    }else{
        divCarrito.innerHTML="";
        crearCarrito(1000)
    }
})

//función para cargar en el DOM los elementos de la sección para seleccionar la forma de envío
function formaEnvio(){
    divComprar.innerHTML=`
        <div class="seccionComprar">
            <h6>Seleccione la forma de envío</h6>
            <div>
                <input type="radio" id="domicilio" name="formaEnvio">
                <label for="domicilio">Envío a domicilio ($750)</label>
            </div>
            <div>
                <input type="radio" id="sucursal" name="formaEnvio">
                <label for="sucursal">Retiro personal por la tienda (Sin costo adicional)</label>
            </div>
            <div class="botonesCompra">
            <button class="btn boton" id="botonAtrasEnvio">Atrás</button>
            <button class="btn boton" id="botonSiguienteEnvio">Siguiente</button>
            </div>
        </div>
        `

        agregarFuncionBotonAtrasEnvio();
        agregarFuncionBotonSiguienteEnvio();
}

//Funcionalidad del boton "atrás" para retornar al carrito de compras
function agregarFuncionBotonAtrasEnvio () {
    botonAtrasEnvio=document.querySelector("#botonAtrasEnvio").addEventListener("click", ()=>{
        divComprar.innerHTML="";
        crearCarrito (500);
    });
}

//Funcionalidad del boton avanzar en el proceso de compras 
function agregarFuncionBotonSiguienteEnvio () {
    botonSiguienteEnvio=document.querySelector("#botonSiguienteEnvio").addEventListener("click", ()=>{
        const radioBotones = document.querySelectorAll('input[name="formaEnvio"]');
        for (const radioBoton of radioBotones) {
            if (radioBoton.checked) {
                seleccionEnvio=radioBoton.id;
                // if (seleccionEnvio=="domicilio"){
                //     datosEnvio();
                // }else{
                //     metodoPago();
                // }
            }
        }
        datosEnvio();
    })
}

//Función para pintar en el DOM la sección donde se cargan los datos para el envío o retiro en tienda
function datosEnvio () {
    if (seleccionEnvio=="domicilio"){
        divComprar.innerHTML=`
        <div class="seccionComprar">
            <h6>Complete los datos para la entrega</h6>
            <div>
            <label for="nombre" class="textoDireccion">Nombre</label>
            <input type="text" id="nombre">
            </div>
            <div>
                <label for="apellido" class="textoDireccion">Apellido</label>
                <input type="text" id="apellido">
            </div>
            <div>
                <label for="dni" class="textoDireccion">DNI</label>
                <input type="text" id="dni">
            </div>
            <div>
                <label for="email" class="textoDireccion">Email de contacto</label>
                <input type="email" id="email">
            </div>
            <div>
                <label for="provincia" class="textoDireccion">Provincia</label>
                <input type="text" id="provincia">
            </div>
            <div>
                <label for="ciudad" class="textoDireccion">Ciudad</label>
                <input type="text" id="ciudad">
            </div>
            <div>
                <label for="codigo" class="textoDireccion">Código Postal</label>
                <input type="text" id="codigo">
            </div>
            <div>
                <label for="calle" class="textoDireccion">Calle</label>
                <input type="text" id="calle">
            </div>
            <div>
                <label for="altura" class="textoDireccion">Altura</label>
                <input type="text" id="altura">
            </div>
            <div>
                <label for="piso" class="textoDireccion">Piso y departamento</label>
                <input type="text" id="piso">
            </div>
            <div class="botonesCompra">
                <button class="btn boton" id="botonAtrasDireccion">Atrás</button>
                <button class="btn boton" id="botonSiguienteDireccion">Siguiente</button>
            </div>
        </div>
        `
    }else{
        divComprar.innerHTML=`
        <div class="seccionComprar">
            <h6>Ingrese los datos para el retiro</h6>
            <div>
                <label for="nombre" class="textoDireccion">Nombre</label>
                <input type="text" id="nombre">
            </div>
            <div>
                <label for="apellido" class="textoDireccion">Apellido</label>
                <input type="text" id="apellido">
            </div>
            <div>
                <label for="dni" class="textoDireccion">DNI</label>
                <input type="text" id="dni">
            </div>
            <div>
                <label for="email" class="textoDireccion">Email de contacto</label>
                <input type="email" id="email">
            </div>
            <div class="botonesCompra">
                <button class="btn boton" id="botonAtrasDireccion">Atrás</button>
                <button class="btn boton" id="botonSiguienteDireccion">Siguiente</button>
            </div>
        </div>
        `
    }
        agregarFuncionBotonAtrasDireccion();
        agregarFuncionBotonSiguienteDireccion();
}

//Funcionalidad del boton para volver. Llama a la función para pintar nuevamente las opciones de "forma de envío"
function agregarFuncionBotonAtrasDireccion () {
    botonAtrasDireccion = document.querySelector("#botonAtrasDireccion").addEventListener("click", ()=>{
        formaEnvio();
    })
}

//Funcionalidad  del boton para avanzar en el proceso de compras
function agregarFuncionBotonSiguienteDireccion () {
    botonSiguienteDireccion = document.querySelector("#botonSiguienteDireccion").addEventListener("click", ()=>{
        nombreComprador = document.querySelector("#nombre").value;
        metodoPago ();
    }) 
}

//Función que pinta en el DOM la seccion correspondiente al método de pago
function metodoPago () {
    if (seleccionEnvio=="domicilio"){
        divComprar.innerHTML=`
        <div class="seccionComprar">
            <h6>Seleccione un método de pago</h6>
            <div>
                <input type="radio" id="credito" name="formaPago">
                <label for="credito">Tarjeta de crédito</label>
            </div>
            <div>
                <input type="radio" id="debito" name="formaPago">
                <label for="debito">Tarjeta de débito</label>
            </div>
            <div class="botonesCompra">
            <button class="btn boton" id="botonAtrasPago">Atrás</button>
            <button class="btn boton" id="botonSiguientePago">Siguiente</button>
            </div>
        </div>
        `
    }else {
        divComprar.innerHTML=`
            <div class="seccionComprar">
                <h6>Seleccione un método de pago</h6>
                <div>
                    <input type="radio" id="credito" name="formaPago">
                    <label for="credito">Tarjeta de crédito</label>
                </div>
                <div>
                    <input type="radio" id="debito" name="formaPago">
                    <label for="debito">Tarjeta de débito</label>
                </div>
                <div>
                    <input type="radio" id="efectivo" name="formaPago">
                    <label for="efectivo">Efectivo (solo si retira en sucursal)</label>
                </div>
                <div class="botonesCompra">
                <button class="btn boton" id="botonAtrasPago">Atrás</button>
                <button class="btn boton" id="botonSiguientePago">Siguiente</button>
                </div>
            </div>
        `
    }

    agregarFuncionBotonAtrasPago();
    agregarFuncionBotonSiguientePago();
}

//Funcionalidad del boton retornar. Llama a la función que pinta los campos de datos de envío o retiro en tienda
function agregarFuncionBotonAtrasPago() {
    botonAtrasPago = document.querySelector("#botonAtrasPago").addEventListener("click", ()=>{
        datosEnvio ();
    })
}

//Funcionalidad del boton para avanzar el proceso de compras.
function agregarFuncionBotonSiguientePago() {
    botonSiguientePago = document.querySelector("#botonSiguientePago").addEventListener("click", ()=>{
        const radioBotones = document.querySelectorAll('input[name="formaPago"]');
        for (const radioBoton of radioBotones) {
            if (radioBoton.checked) {
                seleccionPago=radioBoton.id;
                if (seleccionPago=="efectivo"){
                    resumenCompra();
                }else{
                    datosTarjeta();
                }
            }
        }        
    })
}

//Funcion para pintar en el DOM los campos de "datos de la tarjeta"
function datosTarjeta () {
    divComprar.innerHTML=`
        <div class="seccionComprar">
            <h6>Complete los datos para la entrega</h6>
            <div>
                <label for="numeroTarjeta" class="textoDireccion">Número de Tarjeta</label>
                <input type="text" id="numeroTarjeta" name="datosTarejta">
            </div>
            <div>
                <label for="codigoTarjeta" class="textoDireccion">Código de seguridad</label>
                <input type="text" id="codigoTarjeta" name="datosTarejta">
            </div>
            <div class="botonesCompra">
                <button class="btn boton" id="botonAtrasTarjeta">Atrás</button>
                <button class="btn boton" id="botonSiguienteTarjeta">Siguiente</button>
            </div>
        </div>
    `

    agregarFuncionAtrasTarjeta ();
    agregarFuncionSiguienteTarjeta ();
}

//Funcionalidad del boton para ir atras desde la sección de "datos de la tarjeta"
function agregarFuncionAtrasTarjeta () {
    botonAtrasTarjeta = document.querySelector("#botonAtrasTarjeta").addEventListener("click", ()=>{
        metodoPago();
    })
}

//Funcionalidad del boton de avanzar en el proceso de compra desde la seccion "datos de la tarjeta"
function agregarFuncionSiguienteTarjeta () {
    botonSiguienteTarjeta = document.querySelector("#botonSiguienteTarjeta").addEventListener("click", ()=>{
        const numeroTarjeta = document.querySelector("#numeroTarjeta").value
        numerosTarjeta = numeroTarjeta.slice(-4);
        resumenCompra ();
    })
}

//Función para pintar en el DOM el resumen de la compra, con los productos, datos de envío, pago y valor total de la compra
function resumenCompra () {
    let subTotal = sumaTotal()
    let costoEnvio;
    let valorTotal;

    seleccionEnvio=="domicilio" ? costoEnvio = "$750" : costoEnvio = "Sin cargo";
    seleccionEnvio=="domicilio" ?  valorTotal = 750+subTotal : valorTotal = subTotal;
    seleccionPago=="efectivo" ? formaPago = "Al retirar la compra" : formaPago = `Tarjeta terminada en ${numerosTarjeta}`;
    const divResumen = document.createElement("div");
    
    carrito.forEach((producto)=>{
        divResumen.innerHTML += `
        <article class="resumenCompra">
            <h6>${producto.articulo}</h6>
            <div class="resumenCompraDetalle">
                <div>
                    <p>Precio: $${producto.precio}</p>
                    <p>Cantidad: ${producto.cantidad}</p>
                </div>
                <div>
                    <img src=${producto.img}>
                </div>
            </div>
        </article>
        `;
    });

    divResumen.innerHTML+=`
    <div class="resumenValores">
    <p>Subtotal de la compra: <b>$${subTotal}</b></p>
    <p>Gastos de envío: <b>${costoEnvio}</b></p>
    <p>Total de la compra: <b>$${valorTotal}</b></p>
    <p>Forma de pago: <b>${formaPago}</b></p>
    </div>
    <div class="botonesCompra">
        <button class="btn boton" id="botonAtrasResumen">Atrás</button>
        <button class="btn boton" id="botonFinalizarCompra">Finalizar compra</button>
    </div>
    `
    divComprar.innerHTML="";
    divResumen.classList.add("finalizarCompra");
    divComprar.appendChild(divResumen);

    agregarFuncionAtrasResumen ();
    agregarFuncionFinalizarCompra ();
}

//Funcionalidad para volver desde la sección "resumen de compra"
function agregarFuncionAtrasResumen () {
    botonAtrasResumen = document.querySelector("#botonAtrasResumen").addEventListener("click",()=>{
        metodoPago ();
    })
}

//Función del boton "finalizar compra". Procesa el pedido, simulando una carga, y devuelve un mensaje al ususario. Se vacia el carrito y se vuelve al inicio
function agregarFuncionFinalizarCompra () {
    botonFinalizarCompra = document.querySelector("#botonFinalizarCompra").addEventListener("click",()=>{
        divComprar.innerHTML=`
        <h6 class="mensajes">Estamos procesando el pedido...</h6>
        `
        setTimeout(()=>{
            divComprar.innerHTML=`
            <h6 class="mensajes">Ya casi esta listo...</h6>
            `  
            setTimeout(()=>{
                divComprar.innerHTML=`
                <h6 class="mensajes">¡Hecho! Gracias por tu compra <b>${nombreComprador}</b></h6>
                `
                setTimeout(()=>{
                    restablecer ();
                }, 1500)
            }, 1500)
        }, 1500)
    })
}