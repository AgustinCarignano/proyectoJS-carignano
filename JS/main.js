//Simulación de un sitio de venta de ropa.

//Declaración del array "carrito"
const tienda = [];
//const tiendaTodo = [];
const carrito = JSON.parse(localStorage.getItem("carrito")) || [];;
// let resp
// let resp2
// let resp3
// let resp4
// let resp5
// let avanzar=true;
// let filtro
// const filtrado = [];
// const filtroPrecio = []
// const categorias =[]

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

//Mostrar en consola los objetos del carrito
// function mostrar(array) {
//     console.log("Agregado al carrito: ");
//     array.forEach(element => {
//         console.log(element.articulo);
//     });
// }

//Calcular y mostrar el total del carrito
function sumaTotal(array) {
    let sum = array.reduce((acum,el)=>{
        return acum + el.precio;
    }, 0);
    console.log("El total del carrito es de: " + sum);
}


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

const divTienda = document.querySelector("#productos")
function crearTarjetas() {
    tienda.forEach((producto)=>{
        divTienda.innerHTML += `<article class="card m-auto my-3" style="width: 18rem;">
        <img src=${producto.img} class="card-img-top">
        <div class="card-body text-center" id="${producto.id}">
        <h5 class="card-title">${producto.articulo}</h5>
        <p class="card-text">Talle: ${producto.talle} <br>Precio: $${producto.precio}</p>
        <button class="btn boton" id="btn-agregar${producto.id}">Agregar al carrito</button>
        </div>
        </article>`
})
    agregarBoton ();
}
crearTarjetas()

function agregarBoton (){
    tienda.forEach(producto=>{
        document.querySelector(`#btn-agregar${producto.id}`).addEventListener("click",()=>{
            let existe = carrito.some(prod=>prod.id === producto.id);
            if(existe===false){
            producto.cantidad = 1;
            cargar(carrito,producto)
            }else{
            let prodFind = carrito.find(prod=> prod.id===producto.id);
            prodFind.cantidad++;
            }
            
            // cargar(carrito,producto)
            // console.log(carrito);
            console.log(carrito);
            crearCarrito()
        })
    })
}
//`<h3>Carrito</h3>`
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
        divCarrito.innerHTML="";
    }
    localStorage.setItem("carrito",JSON.stringify(carrito))
    agregarBotonEliminar ();
}

function agregarBotonEliminar (){
    carrito.forEach(producto=>{
        document.querySelector(`#btn-quitar${producto.id}`).addEventListener("click",()=>{
            let cantidad = producto.cantidad// = carrito.some(prod=>prod.id === producto.id);
            if(cantidad>1){
            producto.cantidad = producto.cantidad-1;
            //cargar(carrito,producto)
            }else{
                eliminar(producto);
            //let prodFind = carrito.find(prod=> prod.id===producto.id);
            //prodFind.cantidad++;
            }
            
            // cargar(carrito,producto)
            // console.log(carrito);
            let vacio=carrito.length;
            if (vacio==0) {
                divCarrito.innerHTML="";
            }
            crearCarrito()
        })
    })
}
crearCarrito()

//Creando las etiquetas visibles en la página


//creación de función de filtrado
/* const camisas = tienda.filter(el => el.categoria == "camisa"); */
/* console.log(camisas); */

//Creando un array que pueda ver el cliente
    // for (const element of tienda) {
    //     let i= tienda.indexOf(element)+1;
    //     tiendaTodo.push(i+"-"+element.articulo+" --> $" + element.precio);
    // }

//creación de una lista de categorias disponibles
// const categoriasRepetidas = tienda.map (el => el.categoria);
// const categoriasFiltradas = categoriasRepetidas.filter((item,index)=>{
//     return categoriasRepetidas.indexOf(item) === index;
//   })
// for (const element of categoriasFiltradas) {
//     let i= categoriasFiltradas.indexOf(element)+1;
//     categorias.push(i+"-"+element);
// }

//Blucle para interactuar con el comprador
// while (avanzar) {
//     //Se le pide que elija directamente un producto, filtre según la categoria o salga
//     resp = prompt("Las prendas disponibles en la tienda son :" + "\r\n" + tiendaTodo.join("\r\n") + "\r\n" + "Puede aplicar un filtro (F), agregar un producto al carrito (escriba el número) o salir (esc)");
//     if (resp=="f" || resp=="F") {
//         //para mantener limpio el array con los elementos filtrados
//         while (filtrado.length!=0) {
//             filtrado.pop()
//         }
//         //Se pide elegir una categoría
//         resp2 = prompt("Lista de categorías :" + "\r\n" + categorias.join("\r\n") + "\r\n" + "Seleccione la categoría eligiendo el número o vuelva al inicio (esc)");
//         if (resp2=="esc" || resp2=="ESC") {
//             continue
//         } else {
//             //creación del array con los productos de la categoría seleccionada
//             let index=parseInt(resp2)-1;
//             let variable = categoriasFiltradas[index];
//             filtro = tienda.filter(el => el.categoria == variable);
//             for (const element of filtro) {
//                 let i= filtro.indexOf(element)+1;
//                 filtrado.push(i+"-"+element.articulo);
//                 filtroPrecio.push(i+"-"+element.articulo+" --> $" + element.precio)
//             }
//             //Se da la opción de comprar o de volver al menú principal
//             resp3=prompt("Las prendas disponibles en la tienda son :" + "\r\n" + filtrado.join("\r\n") + "\r\n" + "Seleccione una prenda o elimine el filtro (esc)");
//             if (resp3=="esc" || resp3=="ESC") {
//                 continue;
//             } else {
//                 //Si selecciona un artículo, se agrega al carrito y se da la opción de continuar o finalizar la operacion de compra
//                 let index=parseInt(resp3)-1
//                 carrito.push(filtro[index])
//                 resp4=prompt("Artículo agregado con éxito!" + "\r\n" + "¿Desea continuar comprando? (S o N)")
//                 if (resp4=="n" || resp4=="N") {
//                 avanzar=false;
//                 }
//             }
//         }
//     }else if (resp=="esc" || resp=="ESC") {
//         avanzar=false;
//     }else {
//         //Si se seleccionó un artículo directamente, se agrega al carrito
//         let index=parseInt(resp)-1
//         carrito.push(tienda[index])
//         resp5=prompt("Artículo agregado con éxito!" + "\r\n" + "¿Desea continuar comprando? (S o N)")
//             if (resp5=="n" || resp5=="N") {
//                 avanzar=false;
//             }
//     }
// }


//ver los objetos del carrito y el total
// if (carrito.length==0) {
//     console.log("¡Gracias por su visita!");
// }else {
//     mostrar(carrito);
//     sumaTotal(carrito);
//     console.log("Puede avanzar con el pago");
// }

//eliminar un objeto, agregar otro y mostrar por consola el carrito y el total
/* eliminar(campera);
cargar(remera);
mostrar(carrito);
sumaTotal(carrito); */
