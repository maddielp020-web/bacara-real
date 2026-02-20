// ==================== BIENVENIDA - COMPORTAMIENTO INTELIGENTE ====================
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== OBTENER ELEMENTOS ====================
    const codigoInput = document.getElementById('codigo-input');
    const telefonoContainer = document.getElementById('telefono-container');
    const telefonoInput = document.getElementById('telefono-input');
    const btnPrincipal = document.getElementById('btn-principal');
    const btnTerminos = document.getElementById('btn-terminos');
    const btnTexto = document.getElementById('btn-texto');
    
    // Mensajes de error
    const codigoError = document.getElementById('codigo-error');
    const telefonoError = document.getElementById('telefono-error');
    
    // ==================== VARIABLES DE ESTADO ====================
    let esRecurrente = false;  // Se determinaría con una llamada al bot
    
    // ==================== SIMULACIÓN DE DETECCIÓN DE USUARIO ====================
    // En un caso real, esto vendría del bot al cargar la página
    function detectarTipoUsuario() {
        // Simulación: si hay código guardado en localStorage, es recurrente
        const codigoGuardado = localStorage.getItem('codigo_usuario');
        if (codigoGuardado) {
            esRecurrente = true;
            telefonoContainer.style.display = 'none';
            btnTexto.textContent = 'ENTRAR AL LOBBY';
        } else {
            esRecurrente = false;
            telefonoContainer.style.display = 'block';
            btnTexto.textContent = 'VERIFICAR Y CONTINUAR';
        }
    }
    
    detectarTipoUsuario();
    
    // ==================== VALIDACIÓN DE CAMPOS ====================
    function validarCodigo() {
        const codigo = codigoInput.value.trim();
        if (codigo.length === 0) return false;
        
        // Simulación de validación (esto lo haría el bot realmente)
        if (codigo.length < 4) {
            mostrarError(codigoError, '❌ Código incorrecto. Verifica con quien te invitó');
            return false;
        }
        
        ocultarError(codigoError);
        return true;
    }
    
    function validarTelefono() {
        if (esRecurrente) return true;  // No aplica para recurrentes
        
        const telefono = telefonoInput.value.trim();
        if (telefono.length === 0) return false;
        
        // Validación muy básica de teléfono
        const telefonoLimpio = telefono.replace(/[^0-9+]/g, '');
        if (telefonoLimpio.length < 10) {
            mostrarError(telefonoError, '❌ Ingresa un número válido');
            return false;
        }
        
        ocultarError(telefonoError);
        return true;
    }
    
    function mostrarError(elemento, mensaje) {
        elemento.textContent = mensaje;
        elemento.classList.add('visible');
    }
    
    function ocultarError(elemento) {
        elemento.textContent = '';
        elemento.classList.remove('visible');
    }
    
    // ==================== VERIFICAR ESTADO DE BOTONES ====================
    function actualizarBotones() {
        const codigoValido = validarCodigo();
        const telefonoValido = validarTelefono();
        
        // Botón principal
        if (esRecurrente) {
            // Recurrente: solo necesita código
            btnPrincipal.disabled = !codigoValido;
        } else {
            // Nuevo: necesita código + teléfono
            btnPrincipal.disabled = !(codigoValido && telefonoValido);
        }
        
        if (!btnPrincipal.disabled) {
            btnPrincipal.classList.add('btn-activo');
        } else {
            btnPrincipal.classList.remove('btn-activo');
        }
        
        // Botón de términos
        if (esRecurrente) {
            // Recurrente: siempre activo
            btnTerminos.disabled = false;
            btnTerminos.classList.add('btn-activo');
        } else {
            // Nuevo: activo solo si ambos campos están llenos
            btnTerminos.disabled = !(codigoValido && telefonoValido);
            if (!btnTerminos.disabled) {
                btnTerminos.classList.add('btn-activo');
            } else {
                btnTerminos.classList.remove('btn-activo');
            }
        }
    }
    
    // ==================== EVENTOS ====================
    codigoInput.addEventListener('input', actualizarBotones);
    if (telefonoInput) {
        telefonoInput.addEventListener('input', actualizarBotones);
    }
    
    // ==================== ACCIONES DE BOTONES ====================
    btnPrincipal.addEventListener('click', function() {
        // Aquí se enviarían los datos al bot
        const datos = {
            codigo: codigoInput.value.trim(),
            telefono: esRecurrente ? null : telefonoInput.value.trim()
        };
        
        console.log('Enviando al bot:', datos);
        
        // Simulación de respuesta del bot
        alert('✅ Datos enviados. El bot responderá con la siguiente pantalla.');
        
        // En un caso real, el bot redirigiría a términos o lobby
    });
    
    btnTerminos.addEventListener('click', function() {
        if (!btnTerminos.disabled) {
            window.location.href = 'terminos.html';
        }
    });
    
    // ==================== INICIALIZAR ====================
    actualizarBotones();
});
