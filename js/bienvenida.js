// ==================== BIENVENIDA - FUNCIONALIDADES ====================
// VERSIÓN PROFESIONAL CON SIMULACIÓN DE BOT
// FASE 1 - Validación local con arrays simulados

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ bienvenida.js cargado - Modo FASE 1');
    
    // ==================== 1. BASE DE DATOS SIMULADA ====================
    const BD_SIMULADA = {
        codigosValidos: [
            "INV-001",  // Nuevo (activará teléfono)
            "INV-002",  // Nuevo
            "REC-001",  // Recurrente (ocultará teléfono)
            "REC-002",  // Recurrente
            "TEST-111", // Recurrente (para pruebas)
            "TEST-222"  // Nuevo
        ],
        codigosUsados: [
            "USADO-001", // Código ya utilizado
            "USADO-002",
            "USADO-003"
        ]
    };
    
    // ==================== 2. ELEMENTOS DEL DOM ====================
    const codigoInput = document.getElementById('codigo-input');
    const telefonoInput = document.getElementById('telefono-input');
    const telefonoContainer = document.getElementById('telefono-container');
    const btnPrincipal = document.getElementById('btn-principal');
    const btnTerminos = document.getElementById('btn-terminos');
    const btnTexto = document.getElementById('btn-texto');
    const codigoError = document.getElementById('codigo-error');
    const telefonoError = document.getElementById('telefono-error');
    
    // ==================== 3. VARIABLES DE ESTADO ====================
    let tipoJugador = 'nuevo'; // 'nuevo' o 'recurrente'
    let codigoValidoActual = false;
    let telefonoValidoActual = false;
    
    // ==================== 4. FUNCIONES AUXILIARES ====================
    
    // Limpiar mensajes de error
    function limpiarError(elementoError) {
        elementoError.textContent = '';
        elementoError.classList.remove('visible');
    }
    
    // Mostrar mensaje de error
    function mostrarError(elementoError, mensaje) {
        elementoError.textContent = mensaje;
        elementoError.classList.add('visible');
    }
    
    // Verificar si un código está en la lista de válidos
    function esCodigoValido(codigo) {
        return BD_SIMULADA.codigosValidos.includes(codigo);
    }
    
    // Verificar si un código ya fue usado
    function esCodigoUsado(codigo) {
        return BD_SIMULADA.codigosUsados.includes(codigo);
    }
    
    // Determinar tipo de jugador según el código
    function determinarTipoJugador(codigo) {
        if (codigo.startsWith('REC-') || codigo === 'TEST-111') {
            return 'recurrente';
        } else if (codigo.startsWith('INV-') || codigo === 'TEST-222') {
            return 'nuevo';
        }
        return 'nuevo'; // Por defecto
    }
    
    // Validar formato de teléfono (10 dígitos exactos)
    function validarTelefono(telefono) {
        const soloNumeros = telefono.replace(/\D/g, '');
        return soloNumeros.length === 10;
    }
    
    // Actualizar estado de los botones según validaciones
    function actualizarBotones() {
        // Actualizar estilos de inputs
        actualizarEstilosInputs();
        
        // ===== BOTÓN TÉRMINOS =====
        if (tipoJugador === 'recurrente') {
            // Recurrente: siempre habilitado
            btnTerminos.disabled = false;
        } else {
            // Nuevo: solo cuando código + teléfono válidos
            btnTerminos.disabled = !(codigoValidoActual && telefonoValidoActual);
        }
        
        // ===== BOTÓN PRINCIPAL =====
        if (tipoJugador === 'recurrente') {
            // Recurrente: solo necesita código válido
            btnPrincipal.disabled = !codigoValidoActual;
        } else {
            // Nuevo: necesita código + teléfono válidos
            btnPrincipal.disabled = !(codigoValidoActual && telefonoValidoActual);
        }
    }
    
    // Actualizar UI según tipo de jugador
    function actualizarUITipoJugador() {
        if (tipoJugador === 'recurrente') {
            document.body.classList.add('recurrente');
            document.body.classList.remove('nuevo');
            // El texto NO cambia - siempre "VERIFICAR Y CONTINUAR"
        } else {
            document.body.classList.add('nuevo');
            document.body.classList.remove('recurrente');
            // El texto NO cambia - siempre "VERIFICAR Y CONTINUAR"
        }
    }
    
    // ==================== 5. VALIDACIÓN EN TIEMPO REAL ====================
    
    // Validación del código (al perder foco)
    codigoInput.addEventListener('blur', function() {
        const codigo = codigoInput.value.trim();
        
        // Campo vacío
        if (codigo === '') {
            mostrarError(codigoError, '❌ El código es obligatorio');
            codigoValidoActual = false;
            actualizarBotones();
            return;
        }
        
        // Código ya usado
        if (esCodigoUsado(codigo)) {
            mostrarError(codigoError, '❌ Este código ya fue utilizado');
            codigoValidoActual = false;
            actualizarBotones();
            return;
        }
        
        // Código inválido
        if (!esCodigoValido(codigo)) {
            mostrarError(codigoError, '❌ Código incorrecto');
            codigoValidoActual = false;
            actualizarBotones();
            return;
        }
        
        // Código válido
        limpiarError(codigoError);
        codigoValidoActual = true;
        
        // Determinar tipo de jugador y actualizar UI
        tipoJugador = determinarTipoJugador(codigo);
        actualizarUITipoJugador();
        
        // Si es recurrente, limpiar validación de teléfono y forzar actualización inmediata
        if (tipoJugador === 'recurrente') {
            telefonoValidoActual = false;
            limpiarError(telefonoError);
            telefonoInput.value = '';
            // Forzar que los botones se habiliten inmediatamente
            actualizarBotones();
        } else {
            actualizarBotones();
        }
    });
    
    // Validación del teléfono (al perder foco)
    telefonoInput.addEventListener('blur', function() {
        // Solo validar si es jugador nuevo
        if (tipoJugador !== 'nuevo') return;
        
        const telefono = telefonoInput.value.trim();
        const soloNumeros = telefono.replace(/\D/g, '');
        
        if (telefono === '') {
            mostrarError(telefonoError, '❌ El teléfono es obligatorio');
            telefonoValidoActual = false;
            actualizarBotones();
            return;
        }
        
        if (soloNumeros.length !== 10) {
            mostrarError(telefonoError, '❌ Número inválido (debe tener 10 dígitos)');
            telefonoValidoActual = false;
            actualizarBotones();
            return;
        }
        
        // Teléfono válido
        limpiarError(telefonoError);
        telefonoValidoActual = true;
        actualizarBotones();
    });
    
    // Validación mientras escribe (solo para limpiar errores)
    codigoInput.addEventListener('input', function() {
        const codigo = codigoInput.value.trim();
        
        if (codigo !== '') {
            limpiarError(codigoError);
        }
    });
    
    // Validación en tiempo real para teléfono
    telefonoInput.addEventListener('input', function() {
        // Solo validar si es jugador nuevo
        if (tipoJugador !== 'nuevo') return;
        
        const telefono = telefonoInput.value.trim();
        const soloNumeros = telefono.replace(/\D/g, '');
        
        // Limpiar error mientras escribe
        if (telefono !== '') {
            limpiarError(telefonoError);
        }
        
        // Revalidar en tiempo real
        if (soloNumeros.length === 10) {
            telefonoValidoActual = true;
        } else {
            telefonoValidoActual = false;
        }
        
        actualizarBotones();
    });
    
    // ==================== 5A. FUNCIÓN PARA ACTUALIZAR ESTILOS DE INPUTS ====================
    function actualizarEstilosInputs() {
        // Actualizar estilo del input código
        if (codigoValidoActual) {
            codigoInput.classList.add('valido');
        } else {
            codigoInput.classList.remove('valido');
        }
        
        // Actualizar estilo del input teléfono (solo si es nuevo y válido)
        if (tipoJugador === 'nuevo' && telefonoValidoActual) {
            telefonoInput.classList.add('valido');
        } else {
            telefonoInput.classList.remove('valido');
        }
    }
    
    // ==================== 6. ACCIONES DE BOTONES ====================
    
    // Botón principal
    btnPrincipal.addEventListener('click', function() {
        if (btnPrincipal.disabled) return;
        
        const codigo = codigoInput.value.trim();
        const telefono = telefonoInput.value.trim();
        
        console.log('✅ VERIFICACIÓN EXITOSA:', {
            codigo: codigo,
            telefono: tipoJugador === 'nuevo' ? telefono : 'NO APLICA',
            tipo: tipoJugador,
            timestamp: new Date().toISOString()
        });
        
        // Redirigir según tipo
        if (tipoJugador === 'nuevo') {
            console.log('🔀 Nuevo jugador → terminos.html');
            window.location.href = 'terminos.html';
        } else {
            console.log('🔀 Recurrente → lobby.html');
            window.location.href = 'lobby.html';
        }
    });
    
    // Botón términos
    btnTerminos.addEventListener('click', function() {
        if (btnTerminos.disabled) return;
        
        console.log('📜 Abriendo términos (modo solo lectura)');
        window.location.href = 'terminos.html';
    });
    
    // ==================== 6.1 MODAL DE CONFIRMACIÓN ====================
const btnCerrar = document.getElementById('btn-cerrar-bienvenida');
const modalCerrar = document.getElementById('modal-cerrar-bienvenida');
const modalSi = document.getElementById('modal-si-bienvenida');
const modalNo = document.getElementById('modal-no-bienvenida');

// Botón cerrar - abre modal
if (btnCerrar) {
    btnCerrar.addEventListener('click', function() {
        console.log('❓ Abriendo modal de confirmación');
        if (modalCerrar) {
            modalCerrar.style.display = 'flex';
        }
    });
}

// Modal - botón NO
if (modalNo) {
    modalNo.addEventListener('click', function() {
        console.log('❌ Cierre cancelado');
        if (modalCerrar) {
            modalCerrar.style.display = 'none';
        }
    });
}

// Modal - botón SÍ
if (modalSi) {
    modalSi.addEventListener('click', function() {
        console.log('🔴 Cerrando miniapp de Telegram');
        
        // Cerrar modal primero
        if (modalCerrar) {
            modalCerrar.style.display = 'none';
        }
        
        // Pequeño retraso para asegurar que el modal se cierra antes
        setTimeout(function() {
            if (window.Telegram && Telegram.WebApp) {
                Telegram.WebApp.close();
            }
        }, 50);
    });
}

// Cerrar modal si se hace clic en el overlay
if (modalCerrar) {
    modalCerrar.addEventListener('click', function(e) {
        if (e.target === modalCerrar) {
            modalCerrar.style.display = 'none';
        }
    });
}
    
    // ==================== 7. INICIALIZACIÓN ====================
    // Asegurar que todo comienza deshabilitado
    btnPrincipal.disabled = true;
    btnTerminos.disabled = true;
    
    // Clase por defecto en body
    document.body.classList.add('nuevo');
    
    console.log('✅ Sistema de validación listo. Esperando entrada...');
});