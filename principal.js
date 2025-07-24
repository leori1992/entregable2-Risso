// principal.js

document.addEventListener('DOMContentLoaded', () => {
    async function obtenerCotizacionDolarExchangeRateAPI() {
        
        const API_KEY = 'e58f6e869b344ab4dcf02251'; 
       
        const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                
                let errorMessage = `Error HTTP: ${response.status} - ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    if (errorData && errorData.error_type) { 
                        errorMessage = `Error de la API: ${errorData.error_type}`;
                    } else if (errorData && errorData.message) {
                        errorMessage = `Error de la API: ${errorData.message}`;
                    }
                } catch (jsonError) {
                    console.error("Error al parsear el error JSON de ExchangeRate-API:", jsonError);
                }
                throw new Error(errorMessage);
            }

            const data = await response.json(); 

            // Verificar si la respuesta fue exitosa y contiene las tasas
            if (data.result === 'success' && data.conversion_rates && data.conversion_rates.ARS) {
                const cotizacionARS = data.conversion_rates.ARS; // Obtener la cotización del ARS
                /
                const fechaActualizacion = new Date(data.time_last_update_unix * 1000).toLocaleString();

                const elementoCotizacion = document.getElementById('cotizacionDolarDisplay');
                if (elementoCotizacion) {
                    elementoCotizacion.innerHTML = `
                        <p class="valor-dolar"><strong>1 USD =</strong> $${cotizacionARS.toFixed(2)} ARS</p>
                        <p class="ultima-actualizacion">Última actualización: ${fechaActualizacion}</p>
                        <small class="origen-datos">Fuente: ExchangeRate-API</small>
                    `;
                }
                console.log("Cotización del dólar (ExchangeRate-API) obtenida:", cotizacionARS);
                return cotizacionARS;
            } else {
                throw new Error("No se encontraron datos de cotización válidos en la respuesta de ExchangeRate-API.");
            }

        } catch (error) {
            console.error("Error al obtener la cotización del dólar (ExchangeRate-API):", error);
            Swal.fire({
                icon: 'error',
                title: 'Error de cotización',
                text: `No se pudo obtener la cotización del dólar: ${error.message}.`
            });
            const elementoCotizacion = document.getElementById('cotizacionDolarDisplay');
            if (elementoCotizacion) {
                elementoCotizacion.innerHTML = `
                    <p style="color: red;">Error al cargar la cotización.</p>
                    <small>Intenta de nuevo más tarde o revisa tu clave API.</small>
                `;
            }
            return null;
        }
    }

    
    obtenerCotizacionDolarExchangeRateAPI();
});