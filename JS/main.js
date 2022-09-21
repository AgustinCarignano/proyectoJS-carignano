//Simulación de un sitio de venta de ropa.

//Declaración del variables tienda y carrito
const tienda = [];
let carrito = JSON.parse(localStorage.getItem("carrito"))

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

//Calcular y mostrar el total del carrito
// function sumaTotal(array) {
//     let sum = array.reduce((acum,el)=>{
//         return acum + el.precio;
//     }, 0);
//     console.log("El total del carrito es de: " + sum);
// }


//Creación de los objetos
const camisaMulticolor = new productos ("camisa Multicolor", "camisas", "l", "3500", "camisaMulticolor", "./imagenes/camisa.webp");
const pantalonFloreado = new productos ("pantalón floreado", "pantalones", "xl", "2700", "pantalonFloreado", "./imagenes/pantalon1.webp");
const remeraEstampada = new productos ("remera estampada", "remeras", "xxl", "2250", "remeraEstampada", "./imagenes/remera.webp");
const conjuntoVerde = new productos ("conjunto verde", "conjuntos", "xl", "4500", "conjuntoVerde", "./imagenes/conjunto-verde.webp");
const jeanAzul = new productos ("jean azul", "pantalones", "l", "2900", "jeanAzul", "./imagenes/jean.webp");
const jeanGastado = new productos ("jean gastado", "pantalones", "xl", "2900", "jeanGastado", "./imagenes/jean2.webp");
const conjuntoNegro = new productos ("conjunto negro", "conjuntos", "m", "4700", "conjuntoNegro", "./imagenes/conjunto-negro.webp");
const camperaVerde = new productos ("campera verde", "camperas", "m", "3800", "camperaVerde", "./imagenes/campera.webp");
const camisaLenadora = new productos ("camisa leñadora", "camisas", "l", "2800", "camisaLenadora", "./imagenes/camisa-lenadora.webp");
const bermuda = new productos ("bermuda", "bermudas", "m", "2100", "bermuda", "./imagenes/bermuda.webp");
const maxiCamisa = new productos ("maxicamisa", "camisas", "xxl", "2400", "maxiCamisa", "./imagenes/maxi-camisa.webp");
const vestidoLila = new productos ("vestido lila", "vestidos","m", "3500", "vestidoLila", "./imagenes/vestido.webp");

//creación del array de productos disponibles
cargar(tienda, camisaMulticolor);
cargar(tienda, pantalonFloreado);
cargar(tienda, remeraEstampada);
cargar(tienda, conjuntoVerde);
cargar(tienda, jeanAzul);
cargar(tienda, jeanGastado);
cargar(tienda, conjuntoNegro);
cargar(tienda, camperaVerde);
cargar(tienda, camisaLenadora);
cargar(tienda, bermuda);
cargar(tienda, maxiCamisa);
cargar(tienda, vestidoLila);

//Carga de tarjetas en el DOM
const divTienda = document.querySelector("#productos")
function crearTarjetas(array) {
    array.forEach((producto)=>{
        divTienda.innerHTML += `<article class="card m-auto my-3" style="width: 18rem;">
        <img src=${producto.img} class="card-img-top">
        <div class="card-body text-center" id="${producto.id}">
        <h5 class="card-title">${producto.articulo}</h5>
        <p class="card-text">Talle: ${producto.talle} <br>Precio: $${producto.precio}</p>
        <button class="btn boton" id="btn-agregar${producto.id}">Agregar al carrito</button>
        </div>
        </article>`
})
    agregarBoton (array);
}

//declaración de la función para agregar funcionalidad al boton de "Agregar al carrito"
function agregarBoton (array){
    array.forEach(producto=>{
        document.querySelector(`#btn-agregar${producto.id}`).addEventListener("click",()=>{
            let existe = carrito.some(prod=>prod.id === producto.id);
            if(existe===false){
            producto.cantidad = 1;
            cargar(carrito,producto)
            }else{
            let prodFind = carrito.find(prod=> prod.id===producto.id);
            prodFind.cantidad++;
            }
            
            crearCarrito()
        })
    })
}

//Creación del carrito de compras cuando se seleccionan productos (o a partir del local storage)
const divCarrito = document.querySelector("#carrito")
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
            </article>`
        })
    if (carrito.length==0) {
        divCarrito.innerHTML=""; //limpio el carrito si no quedan productos
    }else { //Si hay productos en el carrito, se agregan botones adicionales para vaciar o avanzar con la compra
        divCarrito.innerHTML+=`<button class="btn boton botonComprar" id="vaciarCarrito">Vaciar carrito</button>
        <button class="btn boton botonComprar" id="comprarCarrito">Comprar</button>`
    }
    localStorage.setItem("carrito",JSON.stringify(carrito)) //Guardo los productos agregados al carrito en el local storage
    agregarBotonEliminar ();
    agregarBotonVaciarCarrito ();
    agregarBotonComprar ();
}

//Agregando funcionalidad al boton de eliminar elementos individuales del carrito
function agregarBotonEliminar (){
    carrito.forEach(producto=>{
        document.querySelector(`#btn-quitar${producto.id}`).addEventListener("click",()=>{
            let cantidad = producto.cantidad// = carrito.some(prod=>prod.id === producto.id);
            if(cantidad>1){
            producto.cantidad = producto.cantidad-1;
            }else{
                eliminar(producto);
            }
            
            crearCarrito()
        })
    })
}

//Agregando funcionalidad al botón para vaciar todo el carrito de compras
function agregarBotonVaciarCarrito (){
    document.querySelector("#vaciarCarrito").addEventListener("click", ()=> {
        carrito = []
        crearCarrito()
    })
}

//Funcionalidad limitada del boton comprar. El proyecto debe avanzar por este lado.
function agregarBotonComprar () {
    document.querySelector("#comprarCarrito").addEventListener("click", ()=> {
        alert("¡Lo siento! El botón aún no hace lo que esperas.")
    })
}

//Creación de un array de las categorías disponibles para poder filtrar
const categoriasRepetidas = tienda.map (el => el.categoria);
const categoriasFiltradas = categoriasRepetidas.filter((item,index)=>{
    return categoriasRepetidas.indexOf(item) === index;
})

//Agregando funcionalidad al filtro
categoriasFiltradas.forEach(element=> {
    document.querySelector(`#${element}`).addEventListener("click", ()=> {
        divTienda.innerHTML = ""
            const mostrarfiltro = tienda.filter (el => el.categoria.includes(`${element}`))
            crearTarjetas(mostrarfiltro);
    })
})

//Agregando funcionalidad al boton para eliminar el filtro aplicado y mostrar toda la tienda
const eliminarFiltro=document.querySelector("#eliminarFiltro")
eliminarFiltro.addEventListener("click", ()=> {
    divTienda.innerHTML = ""
    crearTarjetas(tienda)
})


//Mostrar tarjeta de productos y carrito si existen valores guardados en el local storage
crearTarjetas(tienda)
crearCarrito()

//Falta agregar funcionalidad a los botones del carrito
