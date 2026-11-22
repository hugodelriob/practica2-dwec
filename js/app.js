const catalogo = [
    new Producto(101, "Ratón USB", "perifericos", 12.5, 8),
    new Producto(102, "Teclado", "perifericos", 24.9, 0),
    new Producto(103, "Monitor 24 pulgadas", "perifericos", 129.9, 3),
    new Producto(104, "Memoria USB 64 GB", "almacenamiento", 9.95, 25),
    new Producto(105, "Disco SSD 500 GB", "almacenamiento", 50, 5),
    new Producto(106, "Cuaderno A4", "oficina", 3.2, 40),
    new Producto(107, "Silla ergonómica", "oficina", 99.99, 2),
    new Producto(108, "Pack de bolígrafos", "oficina", 4.5, 1)
];
const carrito = [];
const pedidos = [];

function calcularSubtotal(carrito, catalogo) {
    let subtotal = 0;
    for (const producto of carrito) {
        const prod = catalogo.find(p => p.id === producto.productoId);
        subtotal = subtotal + prod.precio * producto.cantidad;
    }
    return subtotal;
}

function calcularDescuento(subtotal, porcentaje = 0) {
    if (porcentaje.isInteger && porcentaje > 0) {
        if (subtotal >= 100) {
            porcentaje = 10;
        } else {
            porcentaje = 0;
        }
        return porcentaje / 100 * subtotal;
    } else {
        return null;
    }
}

function siguienteIdPedido(pedidos) {
    if (pedidos.length === 0) {
        return 1;
    } else {
        return pedidos[pedidos.length - 1].id + 1;
    }
}

function validarDatosPedido(datos) {
    const errores = [];
    const nombre = datos.cliente.nombre;
    const expRegEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const expRegCP = /^((0[1-9])|([1-4][0-9])|(5[0-2]))(\d{3})$/;
    if (!nombre || nombre.trim().length < 2 || nombre.trim().length > 60) {
        errores.push('El nombre no se ha introducido o contiene un número de carácteres incorrecto');
    }
    if (!datos.cliente.email || !expRegEmail.test(datos.cliente.email)) {
        errores.push('El email no ha sido introducido o el formato es incorrecto');
    }
    if (!datos.entrega || datos.entrega !== 'recogida' && datos.entrega !== 'envio') {
        errores.push('No se a introducido valor para el campo entrega o es incorrecto');
    } else if (datos.entrega === 'envio') {
        if (!datos.direccion || datos.direccion.length < 5 || datos.direccion.length > 100) {
            errores.push('La dirección no se ha introducido o contiene un número de carácteres incorrecto');
        }
        if (!datos.codigoPostal || !expRegCP.test(datos.codigoPostal)) {
            errores.push('El código postal no ha sido introducido o es incorrecto');
        }
    }
    if (datos.observaciones.length > 200) {
        errores.push('Se ha superado el número máximo de carácteres para el campo "observaciones"');
    }
    return errores;
}

function validarCarrito(carrito, catalogo) {
    const lineasValidas = [];
    if (carrito.length !== 0) {
        for (const producto of carrito) {
            const prod = catalogo.find(p => p.id === producto.productoId);
            if (prod === undefined) {
                lineasValidas.push({ productoId: producto.productoId, valida: false, error: 'Id no válido' });
            } else {
                if (Number.isInteger(producto.cantidad) && producto.cantidad > 0) {
                    if (prod.comprobarDisponibilidad(producto.cantidad)) {
                        lineasValidas.push({ productoId: producto.productoId, valida: true, error: '' });
                    } else {
                        lineasValidas.push({ productoId: producto.productoId, valida: false, error: 'Stock insuficiente' });
                    }
                } else {
                    lineasValidas.push({ productoId: producto.productoId, valida: false, error: 'Cantidad no válida' });
                }
            }
        }
    } else {
        return null;
    }
    return lineasValidas;
}

function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("tarjeta-producto");
    tarjeta.dataset.productoId = producto.id;

    const titulo = document.createElement("h3");
    titulo.textContent = producto.nombre;

    const categoria = document.createElement("p");
    categoria.textContent = `Categoría: ${producto.categoria}`;

    const precio = document.createElement("p");
    precio.textContent = `Precio: ${producto.precio.toFixed(2)} €`;

    const existencias = document.createElement("p");
    existencias.textContent = producto.stock > 0
        ? `Existencias: ${producto.stock}`
        : "Agotado";

    const idCantidad = `cantidad-${producto.id}`;

    const etiqueta = document.createElement("label");
    etiqueta.htmlFor = idCantidad;
    etiqueta.textContent = "Cantidad";

    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.id = idCantidad;
    inputCantidad.min = "1";
    inputCantidad.max = String(producto.stock);
    inputCantidad.step = "1";
    inputCantidad.value = "1";
    inputCantidad.required = true;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.classList.add("btn-anadir");
    boton.dataset.productoId = producto.id;
    boton.textContent = "Añadir al carrito";

    if (producto.stock === 0) {
        inputCantidad.disabled = true;
        boton.disabled = true;
    }

    tarjeta.append(titulo, categoria, precio, existencias, etiqueta, inputCantidad, boton);
    return tarjeta;
}