//Simulación de un sitio de venta de ropa.

//Declaración del variables tienda y carrito
const tienda = [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || []; //Operedor lógico OR para acceso condicional a la variable en el local storage
const contadorCarrito = document.querySelector("#contadorCarrito"),
botonVerCarrito = document.querySelector("#botonVerCarrito");

//Clase constructora de objetos
class productos {
    constructor (articulo, categoria, talle, precio, id, img){
        this.articulo = articulo.toUpperCase();
        this.categoria = categoria.toLowerCase();
        this.talle = talle.toUpperCase();
        this.precio = parseFloat(precio);
        this.id = id;
        this.img = img;
    }
}


//Carga de productos al un array
function cargar(array,producto) {
    array.push(producto);
}

//Eliminar algún producto del carrito
function eliminar(producto) {
    carrito.splice(carrito.indexOf(producto),1);
}


fetch("./JS/data.json")
.then(res=>res.json())
.then(data=>{
    data.forEach(element=>{
        cargar(tienda,element);
    })
    crearTarjetas(tienda);
})


//Carga de tarjetas en el DOM
const divTienda = document.querySelector("#productos");
function crearTarjetas(array) {
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
}

//declaración de la función para agregar funcionalidad al boton de "Agregar al carrito"
function agregarBoton (array){
    array.forEach(producto=>{
        document.querySelector(`#btn-agregar${producto.id}`).addEventListener("click",()=>{
            //cambio de un if..else por el operador ternario
            carrito.some(prod=>prod.id === producto.id) ? (carrito.find(prod=> prod.id===producto.id).cantidad++) : (producto.cantidad = 1, cargar(carrito,producto));
            crearCarrito();

            Toastify({
                text: "Agregado 1 elemento al carrito",
                duration: 2000,
                gravity: "bottom", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "#4E5C23",
                },
              }).showToast();

        })
    })
}

//Creación del carrito de compras cuando se seleccionan productos (o a partir del local storage)
const divCarrito = document.querySelector("#carrito");
function crearCarrito() {
    divCarrito.innerHTML=`<h3 class="carritoTitulo">Carrito</h3>`;
    carrito.forEach((producto)=>{
        divCarrito.innerHTML += `
        <article class="tarjetaCarrito">
            <div>
                <button class="btn boton" id="btn-quitar${producto.id}">🗑</button>
            </div>
            <img src=${producto.img}>
            <div class="divCarrito">
                <h6>${producto.articulo}</h6>
                <p>Precio: $${producto.precio}</p>
                <p>Cantidad: ${producto.cantidad}</p>
            </div>
        </article>`;
    });
    //cambio de un if..else por operador ternario
    carrito.length==0 ? divCarrito.innerHTML="" : divCarrito.innerHTML+=`<button class="btn boton botonComprar" id="vaciarCarrito">Vaciar carrito</button>
    <button class="btn boton botonComprar" id="comprarCarrito">Comprar</button>`;
   
    contadorCarrito.innerText=carrito.length;
    localStorage.setItem("carrito",JSON.stringify(carrito)); //Guardo los productos agregados al carrito en el local storage
    agregarBotonEliminar ();
    agregarBotonVaciarCarrito ();
    agregarBotonComprar ();
}

//Agregando funcionalidad al boton de eliminar elementos individuales del carrito
function agregarBotonEliminar (){
    carrito.length!=0 &&
    carrito.forEach(producto=>{
        document.querySelector(`#btn-quitar${producto.id}`).addEventListener("click",()=>{
            producto.cantidad>1 ?  producto.cantidad = producto.cantidad-1 : eliminar(producto); //Operador ternario
            
            Toastify({
                text: "Se ha eliminado un item del carrito",
                duration: 2000,
                gravity: "bottom", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "#A81C07",
                },
              }).showToast();

            crearCarrito();
        })
    })
}

//Agregando funcionalidad al botón para vaciar todo el carrito de compras
function agregarBotonVaciarCarrito (){
    carrito.length!=0 &&
    document.querySelector("#vaciarCarrito").addEventListener("click", ()=> {
        Swal.fire({
            title: '¿Estás seguro/a?',
            text: "Deberá elegir nuevamente los productos si elije vaciar el carrito",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, vaciar carrito'
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Se ha vaciado el carrito')
                carrito = [];
                crearCarrito();
            }
          })
    })
}

//Funcionalidad limitada del boton comprar. El proyecto debe avanzar por este lado.
function agregarBotonComprar () {
    carrito.length!=0 &&
    document.querySelector("#comprarCarrito").addEventListener("click", ()=> {
        //alert("¡Lo siento! El botón aún no hace lo que esperas.");

        Swal.fire(
            '¡Aún no hay nada por aquí!',
            'Sigo trabajando en esto.',
            'error'
          )
    })
}
//Creación de un array de las categorías disponibles para poder filtrar
//función redefinida usando la desectructuración de un objeto y obteniendo el parámetro de interes
const categorias = []
fetch("./JS/data.json")
.then(res=>res.json())
.then(data=>{
    data.forEach(producto=>{
        let {categoria}=producto;
        categorias.some(prod => prod===categoria) ? "" : categorias.push(categoria)
    })

    categorias.forEach(element=> {
        document.querySelector(`#${element}`).addEventListener("click", ()=> {
            divTienda.innerHTML = "";
                const mostrarfiltro = tienda.filter (el => el.categoria.includes(`${element}`));
                crearTarjetas(mostrarfiltro);
        })
    })
})


//Agregando funcionalidad al boton para eliminar el filtro aplicado y mostrar toda la tienda
const eliminarFiltro=document.querySelector("#eliminarFiltro");
eliminarFiltro.addEventListener("click", ()=> {
    let toggle = document.querySelector("#flecha");
    toggle.className==="bi bi-caret-down" ? eliminarFiltro.innerHTML=`<i class="bi bi-caret-up" id="flecha">` : eliminarFiltro.innerHTML=`<i class="bi bi-caret-down" id="flecha">`;
    divTienda.innerHTML = "";
    crearTarjetas(tienda);
})


//Mostrar tarjeta de productos y carrito si existen valores guardados en el local storage
//crearTarjetas(tienda);
crearCarrito();
