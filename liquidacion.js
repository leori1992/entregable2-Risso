




function guardarLiquidacion(liquidacion) {
    const liquidaciones = recuperarLiquidaciones();
    liquidaciones.push(liquidacion);
    localStorage.setItem('liquidaciones', JSON.stringify(liquidaciones));
    Swal.fire({
        title: "liquidacion de  " + liquidacion.nombre + " guardada exitosamente",
        icon: "success",
        draggable: true
      });
}

function recuperarLiquidaciones() {
    try {
        const liquidacionesJSON = localStorage.getItem('liquidaciones');
        return liquidacionesJSON ? JSON.parse(liquidacionesJSON) : [];
    } catch (e) {
        console.error("Error al recuperar liquidaciones de localStorage:", e);
        return [];
    }
}



function SelectorLiquidaciones() {
    const selector = document.getElementById('selectorLiquidaciones');
    selector.innerHTML = '<option value="">-- Selecciona --</option>'; 

    const liquidaciones = recuperarLiquidaciones();
    
    
    const nombresUnicos = new Set();
    liquidaciones.forEach(liq => {
        nombresUnicos.add(liq.nombre);
    });

    
    nombresUnicos.forEach(nombre => {
        const option = document.createElement('option');
        option.value = nombre; 
        option.textContent = nombre;
        selector.appendChild(option);
    });
}


function mostrarDetalleLiquidacion() {
    const selector = document.getElementById('selectorLiquidaciones');
    const nombreSeleccionado = selector.value; 
    const detalleDiv = document.getElementById('detalleLiquidacionSeleccionada');

    if (!nombreSeleccionado) {
        detalleDiv.innerHTML = '<p>Selecciona un empleado.</p>';
        return;
    }

    const liquidaciones = recuperarLiquidaciones();
 
    const liquidacionEncontrada = liquidaciones.findLast(liq => liq.nombre === nombreSeleccionado);

    if (liquidacionEncontrada) {
        const fechaFormateada = liquidacionEncontrada.fecha ? new Date(liquidacionEncontrada.fecha).toLocaleDateString('es-AR') : 'Fecha desconocida';

        detalleDiv.innerHTML = `
            <h3>Liquidación de ${liquidacionEncontrada.nombre}</h3>
            <p><strong>Fecha de Cálculo:</strong> ${fechaFormateada}</p>
            <p><strong>Sueldo Bruto:</strong> ${liquidacionEncontrada.sueldoBruto.toFixed(2)}</p>
            <p><strong>Pago por Horas Extras:</strong> ${liquidacionEncontrada.pagoHorasExtras.toFixed(2)}</p>
            <p><strong>Bonificación por Antigüedad:</strong> ${liquidacionEncontrada.bonificacionAntiguedad.toFixed(2)}</p>
            <p><strong>Bonificación por Presentismo:</strong> ${liquidacionEncontrada.bonificacionPresentismo.toFixed(2)}</p>
            <p><strong>Deducciones:</strong> ${liquidacionEncontrada.deducciones.toFixed(2)}</p>
            <p><strong>Sueldo Neto:</strong> ${liquidacionEncontrada.sueldoNeto.toFixed(2)}</p>
            <button onclick="confirmarYEliminarLiquidacion('${liquidacionEncontrada.nombre}', '${liquidacionEncontrada.fecha}')">Eliminar esta liquidación</button>
        `;
    } else {
        detalleDiv.innerHTML = '<p>No se encontró la liquidación</p>';
    }
}

// Función para confirmar y eliminar una liquidación específica
function confirmarYEliminarLiquidacion(nombre, fecha) {
    if (confirm(`¿Estás seguro de que quieres eliminar la liquidación de ${nombre} del ${new Date(fecha).toLocaleDateString('es-AR')}?`)) {
        let liquidaciones = recuperarLiquidaciones();
        
        liquidaciones = liquidaciones.filter(liq => !(liq.nombre === nombre && liq.fecha === fecha));
        localStorage.setItem('liquidaciones', JSON.stringify(liquidaciones));
        
        
        SelectorLiquidaciones();
        document.getElementById('selectorLiquidaciones').value = ""; // Resetea el selector
        document.getElementById('detalleLiquidacionSeleccionada').innerHTML = '<p>Selecciona un empleado del desplegable para ver su liquidación.</p>';
    }
}



function liquidacion(event) {
    event.preventDefault(); 

    const nombre = document.getElementById('nombreingresado').value.trim();
    const sueldoBruto = parseFloat(document.getElementById('sueldoBrutoIngresado').value);
    const horasExtras = parseFloat(document.getElementById('horasExtras').value);
    const antiguedad = parseFloat(document.getElementById('antiguedad').value);
    const presentismo = parseFloat(document.getElementById('presentismo').value);
    
    if (!nombre || isNaN(sueldoBruto) || sueldoBruto <= 0 || isNaN(horasExtras) || horasExtras < 0 || isNaN(antiguedad) || antiguedad < 0 || isNaN(presentismo) || presentismo < 0 || presentismo > 100) {
        alert("completa cn valores válidos.");
        return;
    }

    const valorHoraNormal = sueldoBruto / 180;
    const valorHoraExtra = valorHoraNormal * 1.5; 
    const pagoHorasExtras = horasExtras * valorHoraExtra;
    const bonificacionAntiguedad = sueldoBruto * (antiguedad * 0.01); 
    const bonificacionPresentismo = sueldoBruto * (presentismo / 100);
    const deducciones = sueldoBruto * 0.11; 
    const sueldoNeto = sueldoBruto + pagoHorasExtras + bonificacionAntiguedad + bonificacionPresentismo - deducciones;

    const nuevaLiquidacion = {
        nombre: nombre,
        sueldoBruto: sueldoBruto,
        pagoHorasExtras: pagoHorasExtras,
        bonificacionAntiguedad: bonificacionAntiguedad,
        bonificacionPresentismo: bonificacionPresentismo,
        deducciones: deducciones,
        sueldoNeto: sueldoNeto,
        fecha: new Date().toISOString() 
    };

    guardarLiquidacion(nuevaLiquidacion);

    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = `
        <h3>Resultados de la Liquidación</h3>
        <p><strong>Nombre:</strong> ${nombre}</p> <br>
        <p><strong>Sueldo Bruto:</strong> ${sueldoBruto.toFixed(2)}</p><br>
        <p><strong>Pago por Horas Extras:</strong> ${pagoHorasExtras.toFixed(2)}</p><br>
        <p><strong>Bonificación por Antigüedad:</strong> ${bonificacionAntiguedad.toFixed(2)}</p><br>
        <p><strong>Bonificación por Presentismo:</strong> ${bonificacionPresentismo.toFixed(2)}</p><br>
        <p><strong>Deducciones:</strong> ${deducciones.toFixed(2)}</p><br>
        <p><strong>Sueldo Neto:</strong> ${sueldoNeto.toFixed(2)}</p><br>
    `;

    document.getElementById('formliq').reset();
    document.getElementById('nombreingresado').focus();
    
    
    SelectorLiquidaciones(); 
   
    document.getElementById('selectorLiquidaciones').value = nombre;
    mostrarDetalleLiquidacion(); 
}



document.addEventListener('DOMContentLoaded', SelectorLiquidaciones);


document.getElementById('selectorLiquidaciones').addEventListener('change', mostrarDetalleLiquidacion);


document.getElementById('formliq').addEventListener('submit', liquidacion);