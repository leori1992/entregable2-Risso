
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('usuario');
const passwordInput = document.getElementById('contraseña');




function handleLogin(event) {
    event.preventDefault(); 

    const username = usernameInput.value;
    const password = passwordInput.value;

    // Validar usuario y contraseña 
    if (username === 'admin' && password === '1234') {
        // Redirigir 
        window.location.href = 'principal.html';
    } else {
        alert('Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
}


loginForm.addEventListener('submit', handleLogin);


                             

