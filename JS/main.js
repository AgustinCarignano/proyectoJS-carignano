//Simulación de un sitio de venta de ropa.

//Declaración del array "carrito"
const tienda = [];
const tiendaTodo = [];
const carrito = [];
let resp
let resp2
let resp3
let resp4
let resp5
let avanzar=true;
let filtro
const filtrado = [];
const filtroPrecio = []
const categorias =[]

//Clase constructora de objetos
class productos {
    constructor (articulo, categoria, talle, precio){
        this.articulo = articulo.toUpperCase();
        this.categoria = categoria.toLowerCase();
        this.talle = talle.toUpperCase();
        this.precio = parseFloat(precio);
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
function mostrar(array) {
    console.log("Agregado al carrito: ");
    array.forEach(element => {
        console.log(element.articulo);
    });
}

//Calcular y mostrar el total del carrito
function sumaTotal(array) {
    let sum = array.reduce((acum,el)=>{
        return acum + el.precio;
    }, 0);
    console.log("El total del carrito es de: " + sum);
}


//Creación de los objetos
const camisaMulticolor = new productos ("camisa Multicolor", "camisas", "l", "3500");
const pantalonFloreado = new productos ("pantalón floreado", "pantalones", "xl", "2700");
const remeraEstampada = new productos ("remera estampada", "remeras", "xxl", "2250");
const conjuntoVerde = new productos ("conjunto verde", "conjuntos", "xl", "4500");
const jeanAzul = new productos ("jean azul", "pantalones", "l", "2900");
const jeanGastado = new productos ("jean gastado", "pantalones", "xl", "2900");
const conjuntoNegro = new productos ("conjunto negro", "conjuntos", "m", "4700");
const camperaVerde = new productos ("campera verde", "camperas", "m", "3800");
const camisaLenadora = new productos ("camisa leñadora", "camisas", "l", "2800");
const bermuda = new productos ("bermuda", "bermudas", "m", "2100");
const maxiCamisa = new productos ("maxicamisa", "camisas", "xxl", "2400");
const vestidoLila = new productos ("vestido lila", "vestidos","m", "3500");

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

//creación de función de filtrado
/* const camisas = tienda.filter(el => el.categoria == "camisa"); */
/* console.log(camisas); */

//Creando un array que pueda ver el cliente
    for (const element of tienda) {
        let i= tienda.indexOf(element)+1;
        tiendaTodo.push(i+"-"+element.articulo+" --> $" + element.precio);
    }

//creación de una lista de categorias disponibles
const categoriasRepetidas = tienda.map (el => el.categoria);
const categoriasFiltradas = categoriasRepetidas.filter((item,index)=>{
    return categoriasRepetidas.indexOf(item) === index;
  })
for (const element of categoriasFiltradas) {
    let i= categoriasFiltradas.indexOf(element)+1;
    categorias.push(i+"-"+element);
}

//Blucle para interactuar con el comprador
while (avanzar) {
    //Se le pide que elija directamente un producto, filtre según la categoria o salga
    resp = prompt("Las prendas disponibles en la tienda son :" + "\r\n" + tiendaTodo.join("\r\n") + "\r\n" + "Puede aplicar un filtro (F), agregar un producto al carrito (escriba el número) o salir (esc)");
    if (resp=="f" || resp=="F") {
        //para mantener limpio el array con los elementos filtrados
        while (filtrado.length!=0) {
            filtrado.pop()
        }
        //Se pide elegir una categoría
        resp2 = prompt("Lista de categorías :" + "\r\n" + categorias.join("\r\n") + "\r\n" + "Seleccione la categoría eligiendo el número o vuelva al inicio (esc)");
        if (resp2=="esc" || resp2=="ESC") {
            continue
        } else {
            //creación del array con los productos de la categoría seleccionada
            let index=parseInt(resp2)-1;
            let variable = categoriasFiltradas[index];
            filtro = tienda.filter(el => el.categoria == variable);
            for (const element of filtro) {
                let i= filtro.indexOf(element)+1;
                filtrado.push(i+"-"+element.articulo);
                filtroPrecio.push(i+"-"+element.articulo+" --> $" + element.precio)
            }
            //Se da la opción de comprar o de volver al menú principal
            resp3=prompt("Las prendas disponibles en la tienda son :" + "\r\n" + filtrado.join("\r\n") + "\r\n" + "Seleccione una prenda o elimine el filtro (esc)");
            if (resp3=="esc" || resp3=="ESC") {
                continue;
            } else {
                //Si selecciona un artículo, se agrega al carrito y se da la opción de continuar o finalizar la operacion de compra
                let index=parseInt(resp3)-1
                carrito.push(filtro[index])
                resp4=prompt("Artículo agregado con éxito!" + "\r\n" + "¿Desea continuar comprando? (S o N)")
                if (resp4=="n" || resp4=="N") {
                avanzar=false;
                }
            }
        }
    }else if (resp=="esc" || resp=="ESC") {
        avanzar=false;
    }else {
        //Si se seleccionó un artículo directamente, se agrega al carrito
        let index=parseInt(resp)-1
        carrito.push(tienda[index])
        resp5=prompt("Artículo agregado con éxito!" + "\r\n" + "¿Desea continuar comprando? (S o N)")
            if (resp5=="n" || resp5=="N") {
                avanzar=false;
            }
    }
}


//ver los objetos del carrito y el total
if (carrito.length==0) {
    console.log("¡Gracias por su visita!");
}else {
    mostrar(carrito);
    sumaTotal(carrito);
    console.log("Puede avanzar con el pago");
}

//eliminar un objeto, agregar otro y mostrar por consola el carrito y el total
/* eliminar(campera);
cargar(remera);
mostrar(carrito);
sumaTotal(carrito); */
