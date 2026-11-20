class Producto {
    constructor(id, nombre, categoria, precio, cantidadDisp) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.cantidadDisp = cantidadDisp;
    }

    comprobarDisponibilidad(cantidad) {
        return cantidad <= this.cantidadDisp;
    }

    descontarCantidad(cantidad) {
        if (this.comprobarDisponibilidad) {
            this.cantidadDisp = this.cantidadDisp - cantidad;
            return true;
        } else {
            return false;
        }
    }
}