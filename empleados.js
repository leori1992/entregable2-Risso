document.addEventListener('DOMContentLoaded', () => {
    const formularioEmpleado = document.getElementById('formularioEmpleado');
    const cuerpoTablaEmpleados = document.getElementById('cuerpoTablaEmpleados');

    // Array para almacenar los empleados
    let empleados = [];

    // Función para guardar empleados en localStorage
    const guardarEmpleados = () => {
        localStorage.setItem('empleadosData', JSON.stringify(empleados));
    };

    // Función para cargar empleados desde localStorage
    const cargarEmpleados = () => {
        const dataGuardada = localStorage.getItem('empleadosData');
        if (dataGuardada) {
            empleados = JSON.parse(dataGuardada);
        }
    };

    // Función para renderizar la tabla de empleados
    const renderizarEmpleados = () => {
        cuerpoTablaEmpleados.innerHTML = ''; // Limpiar la tabla antes de renderizar
        empleados.forEach((empleado, index) => {
            const fila = cuerpoTablaEmpleados.insertRow();

            // Añadir atributos data-label para responsividad
            fila.insertCell().textContent = empleado.nombre;
            fila.cells[0].setAttribute('data-label', 'Nombre');

            fila.insertCell().textContent = empleado.apellido;
            fila.cells[1].setAttribute('data-label', 'Apellido');

            fila.insertCell().textContent = empleado.puesto;
            fila.cells[2].setAttribute('data-label', 'Puesto');

            fila.insertCell().textContent = `$${parseFloat(empleado.salario).toFixed(2)}`; // Formatear salario
            fila.cells[3].setAttribute('data-label', 'Salario');

            fila.insertCell().textContent = empleado.fechaContratacion;
            fila.cells[4].setAttribute('data-label', 'Fecha de Contratación');

            const celdaAcciones = fila.insertCell();
            celdaAcciones.setAttribute('data-label', 'Acciones');

            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.classList.add('botonEliminarEmpleado');
            botonEliminar.addEventListener('click', () => {
                eliminarEmpleado(index);
            });
            celdaAcciones.appendChild(botonEliminar);

       
        });
    };

    
    formularioEmpleado.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const nuevoEmpleado = {
            nombre: document.getElementById('nombreEmpleado').value,
            apellido: document.getElementById('apellidoEmpleado').value,
            puesto: document.getElementById('puestoEmpleado').value,
            salario: parseFloat(document.getElementById('salarioEmpleado').value),
            fechaContratacion: document.getElementById('fechaContratacionEmpleado').value
        };

        empleados.push(nuevoEmpleado);
        guardarEmpleados(); 
        renderizarEmpleados(); 
        formularioEmpleado.reset(); 

        Swal.fire({
            title: "Empleado nuevo agregado",
            icon: "success",
            draggable: true
          });
    });

    
    const eliminarEmpleado = (index) => {
        if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
            empleados.splice(index, 1); // Eliminar el empleado del array
            guardarEmpleados(); // Guardar después de eliminar
            renderizarEmpleados(); // Volver a renderizar la tabla
        }
    };

    // Cargar empleados y renderizar la tabla al inicio
    cargarEmpleados();
    renderizarEmpleados();
});