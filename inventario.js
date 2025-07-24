// Seleccionar elementos del DOM
const formularioMaterial = document.getElementById('formularioMaterial');
const cuerpoTablaInventario = document.getElementById('cuerpoTablaInventario');
const botonLimpiarFormulario = document.getElementById('botonLimpiarFormulario');

// Recuperar datos del localStorage al cargar la página
document.addEventListener('DOMContentLoaded', cargarInventario);

// Manejar el envío del formulario
formularioMaterial.addEventListener('submit', function (event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const nombre = document.getElementById('nombreMaterial').value;
    const tipo = document.getElementById('tipoMaterial').value;
    const stock = document.getElementById('cantidadStock').value;
    const unidad = document.getElementById('unidadMedida').value;
    const proveedor = document.getElementById('proveedorMaterial').value;
    const ultimaEntrada = document.getElementById('fechaUltimaEntrada').value;

    // Crear un objeto para el material
    const material = {
        id: Date.now(),
        nombre,
        tipo,
        stock,
        unidad,
        proveedor,
        ultimaEntrada,
    };

    // Guardar el material en localStorage
    guardarMaterialEnLocalStorage(material);

    // Agregar la nueva fila a la tabla
    agregarFilaATabla(material);

    // Limpiar el formulario
    formularioMaterial.reset();
});

// Manejar el botón de limpiar formulario
botonLimpiarFormulario.addEventListener('click', function () {
    formularioMaterial.reset();
});

// Función para guardar un material en localStorage
function guardarMaterialEnLocalStorage(material) {
    const inventario = JSON.parse(localStorage.getItem('inventario')) || [];
    inventario.push(material);
    localStorage.setItem('inventario', JSON.stringify(inventario));
    Swal.fire({
        title: "Ingreso de producto exitoso",
        icon: "success",
        draggable: true
      });
}

// Función para cargar el inventario desde localStorage
function cargarInventario() {
    const inventario = JSON.parse(localStorage.getItem('inventario')) || [];
    inventario.forEach(material => agregarFilaATabla(material));
}

// Función para agregar una fila a la tabla
function agregarFilaATabla(material) {
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
        <td>${material.id}</td>
        <td>${material.nombre}</td>
        <td>${material.tipo}</td>
        <td>${material.stock}</td>
        <td>${material.unidad}</td>
        <td>${material.proveedor}</td>
        <td>${material.ultimaEntrada}</td>
        <td>
            <button class="botonAccion" onclick="eliminarFila(this, ${material.id})">Eliminar</button>
        </td>
    `;
    cuerpoTablaInventario.appendChild(nuevaFila);
}

// Función para eliminar una fila de la tabla y del localStorage
function eliminarFila(boton, id) {
    const fila = boton.parentElement.parentElement;
    fila.remove();

    // Eliminar el material del localStorage
    let inventario = JSON.parse(localStorage.getItem('inventario')) || [];
    inventario = inventario.filter(material => material.id !== id);
    localStorage.setItem('inventario', JSON.stringify(inventario));
}