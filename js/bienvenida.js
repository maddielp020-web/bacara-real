// ==================== BIENVENIDA - FUNCIONALIDADES ====================
// VERSIÓN LIMPIA - 1.0 - Sin código muerto, sin redundancias
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
    const elementos = {
        codigoInput: document.getElementById('codigo-input'),
        telefonoInput: document.getElementById('telefono-input'),
        telefonoContainer: document.getElementById('telefono-container'),
        btnPrincipal: document.getElementById('btn-principal'),
        btnTerminos: document.getElementById('btn-terminos'),
        codigoError: document.getElementById('codigo-error'),
        telefonoError: document.getElementById('telefono-error')
    };
    
    // ==================== 3. VARIABLES DE ESTADO ====================
    let estado = {
        tipoJugador: 'nuevo', // 'nuevo' o 'recurrente'
        codigoValido: false,
        telefonoValido: false
    };
    
    // ==================== 4. FUNCIONES AUXILIARES ====================
    function limpiarError(elementoError) {
        elementoError.textContent = '';
        elementoError.classList.remove('visible');
    }
    
    function mostrarError(elementoError, mensaje) {
        elementoError.textContent = mensaje;
        elementoError.classList.add('visible');
    }
    
    function esCodigoValido(codigo) {
        return BD_SIMULADA.codigosValidos.includes(codigo);
    }
    
    function esCodigoUsado(codigo) {
        return BD_SIMULADA.codigosUsados.includes(codigo);
    }
    
    function determinarTipoJugador(codigo) {
        if (codigo.startsWith('REC-') || codigo === 'TEST-111') {
            return 'recurrente';
        }
        return 'nuevo'; // Por defecto, incluye INV-* y TEST-222
    }
    
    function validarFormatoTelefono(telefono) {
        const soloNumeros = telefono.replace(/\D/g, '');
        return soloNumeros.length === 10;
    }
    
    function actualizarEstilosInputs() {
        // Código
        if (estado.codigoValido) {
            elementos.codigoInput.classList.add('valido');
        } else {
            elementos.codigoInput.classList.remove('valido');
        }
        
        // Teléfono (solo si es nuevo y válido)
        if (estado.tipoJugador === 'nuevo' && estado.telefonoValido) {
            elementos.telefonoInput.classList.add('valido');
        } else {
            elementos.telefonoInput.classList.remove('valido');
        }
    }
    
    function actualizarBotones() {
        actualizarEstilosInputs();
        
        const codigoValido = estado.codigoValido;
        const telefonoValido = estado.telefonoValido;
        const esRecurrente = estado.tipoJugador === 'recurrente';
        
        // Botón términos
        if (esRecurrente) {
            elementos.btnTerminos.disabled = false;
        } else {
            elementos.btnTerminos.disabled = !(codigoValido && telefonoValido);
        }
        
        // Botón principal
        if (esRecurrente) {
            elementos.btnPrincipal.disabled = !codigoValido;
        } else {
            elementos.btnPrincipal.disabled = !(codigoValido && telefonoValido);
        }
    }
    
    function actualizarUITipoJugador() {
        document.body.classList.remove('nuevo', 'recurrente');
        document.body.classList.add(estado.tipoJugador);
    }
    
    // ==================== 5. VALIDACIÓN DE CÓDIGO ====================
    elementos.codigoInput.addEventListener('blur', function() {
        const codigo = elementos.codigoInput.value.trim();
        
        // Campo vacío
        if (codigo === '') {
            mostrarError(elementos.codigoError, '❌ El código es obligatorio');
            estado.codigoValido = false;
            actualizarBotones();
            return;
        }
        
        // Código ya usado
        if (esCodigoUsado(codigo)) {
            mostrarError(elementos.codigoError, '❌ Este código ya fue utilizado');
            estado.codigoValido = false;
            actualizarBotones();
            return;
        }
        
        // Código inválido
        if (!esCodigoValido(codigo)) {
            mostrarError(elementos.codigoError, '❌ Código incorrecto');
            estado.codigoValido = false;
            actualizarBotones();
            return;
        }
        
        // Código válido
        limpiarError(elementos.codigoError);
        estado.codigoValido = true;
        estado.tipoJugador = determinarTipoJugador(codigo);
        actualizarUITipoJugador();
        
        // Si es recurrente, limpiar teléfono
        if (estado.tipoJugador === 'recurrente') {
            estado.telefonoValido = false;
            limpiarError(elementos.telefonoError);
            elementos.telefonoInput.value = '';
        }
        
        actualizarBotones();
    });
    
    elementos.codigoInput.addEventListener('input', function() {
        if (elementos.codigoInput.value.trim() !== '') {
            limpiarError(elementos.codigoError);
        }
    });
    
    // ==================== 6. VALIDACIÓN DE TELÉFONO ====================
    elementos.telefonoInput.addEventListener('blur', function() {
        // Solo validar si es jugador nuevo
        if (estado.tipoJugador !== 'nuevo') return;
        
        const telefono = elementos.telefonoInput.value.trim();
        
        if (telefono === '') {
            mostrarError(elementos.telefonoError, '❌ El teléfono es obligatorio');
            estado.telefonoValido = false;
            actualizarBotones();
            return;
        }
        
        if (!validarFormatoTelefono(telefono)) {
            mostrarError(elementos.telefonoError, '❌ Número inválido (debe tener 10 dígitos)');
            estado.telefonoValido = false;
            actualizarBotones();
            return;
        }
        
        // Teléfono válido
        limpiarError(elementos.telefonoError);
        estado.telefonoValido = true;
        actualizarBotones();
    });
    
    elementos.telefonoInput.addEventListener('input', function() {
        if (estado.tipoJugador !== 'nuevo') return;
        
        const telefono = elementos.telefonoInput.value.trim();
        
        if (telefono !== '') {
            limpiarError(elementos.telefonoError);
        }
        
        // Revalidar en tiempo real
        estado.telefonoValido = validarFormatoTelefono(telefono);
        actualizarBotones();
    });
    
    // ==================== 7. ACCIONES DE BOTONES ====================
    elementos.btnPrincipal.addEventListener('click', function() {
        if (elementos.btnPrincipal.disabled) return;
        
        const codigo = elementos.codigoInput.value.trim();
        const telefono = elementos.telefonoInput.value.trim();
        
        console.log('✅ VERIFICACIÓN EXITOSA:', {
            codigo: codigo,
            telefono: estado.tipoJugador === 'nuevo' ? telefono : 'NO APLICA',
            tipo: estado.tipoJugador,
            timestamp: new Date().toISOString()
        });
        
        // Redirigir según tipo
        if (estado.tipoJugador === 'nuevo') {
            console.log('🔀 Nuevo jugador → terminos.html');
            window.location.href = 'terminos.html';
        } else {
            console.log('🔀 Recurrente → lobby.html');
            window.location.href = 'lobby.html';
        }
    });
    
    elementos.btnTerminos.addEventListener('click', function() {
        if (elementos.btnTerminos.disabled) return;
        
        console.log('📜 Abriendo términos (modo solo lectura)');
        window.location.href = 'terminos.html';
    });
    
    // ==================== 8. INICIALIZACIÓN ====================
    elementos.btnPrincipal.disabled = true;
    elementos.btnTerminos.disabled = true;
    document.body.classList.add('nuevo');
    
    console.log('✅ Sistema de validación listo. Esperando entrada...');
});