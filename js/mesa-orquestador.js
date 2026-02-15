// ==================== MESA-ORQUESTADOR.JS - CONTROLADOR CENTRAL ====================
class MesaOrquestador {
    constructor() {
        this.enPausaBarajado = false;
        this.estadoJuego = 'jugando'; // 'jugando', 'pausa', 'fin-mano'
        this.historialManos = [];
    }

    // 🎮 INICIALIZAR TODO
    inicializar() {
        console.log('🎯 ORQUESTADOR: Inicializando sistema completo...');
        
        // Pausar barajado automático durante simulación
        this.pausarBarajadoAutomatico(true);
        
        // Iniciar duelo
        window.mesaDuelo?.iniciarDueloInicial?.('leon', 'aguila');
        
        // Primera actualización UI
        this.actualizarTodo();
        
        console.log('✅ ORQUESTADOR: Sistema listo');
    }

    // 🔄 BUCLE PRINCIPAL DE JUEGO (llamar cada 7s)
    nuevaManoCompleta() {
        if (this.estadoJuego !== 'jugando') return;
        
        console.log('=== 🚀 NUEVA MANO COMPLETA ===');
        
        // 1. OBTENER ESTADO DUEL
        const duelo = window.mesaDuelo?.obtenerEstadoDuelo?.() || {};
        console.log(`👑 ${duelo.coronaActual} vs ⚔️ ${duelo.retadorActual} (Mano ${duelo.manoEnDuelo})`);
        
        // 2. REPARTIR CARTAS
        const mano = window.mesaCartas?.nuevaMano?.() || {};
        
        // 3. ACTUALIZAR UI CARTAS
        window.mesaUI?.actualizarCartas?.();
        
        // 4. CALCULAR GANADOR (evitar empates)
        const coronaPuntos = mano.corona?.puntuacion || 0;
        const retadorPuntos = mano.retador?.puntuacion || 0;
        const ganador = coronaPuntos > retadorPuntos ? 'corona' : 
                       (retadorPuntos > coronaPuntos ? 'retador' : 
                        (Math.random() > 0.5 ? 'corona' : 'retador'));
        
        console.log(`🏆 ${ganador.toUpperCase()}: ${coronaPuntos} vs ${retadorPuntos}`);
        
        // 5. EMOJIS REACCIÓN
        window.mesaUI?.mostrarReaccionesPorMano?.(ganador);
        
        // 6. PROCESAR ROTACIÓN DUEL (🎯 CRÍTICO)
const resultadoDuelo = window.procesarFinDeManoDuelo?.(ganador) || {};
console.log('🔄 Duelo:', resultadoDuelo);

// ✅ NUEVAS LÍNEAS DE VERIFICACIÓN
console.log('🔍 ¿procesarFinDeManoDuelo existe?', typeof window.procesarFinDeManoDuelo);
console.log('🔍 ganador recibido:', ganador);

// 7. PROCESAR APUESTAS/COMISIÓN
window.procesarResultado?.(ganador);
        
        // 8. MOSTRAR COMISIÓN
        window.mesaUI?.mostrarComision?.();
        
        // 9. REGISTRAR EN HISTORIAL
        this.registrarMano({
            corona: duelo.coronaActual,
            retador: duelo.retadorActual,
            coronaPuntos,
            retadorPuntos,
            ganador,
            manoNum: duelo.manoEnDuelo
        });
        
        // 10. ACTUALIZAR VISUAL COMPLETO
        this.actualizarTodo();
    }

    // 🖼️ ACTUALIZAR TODO VISUAL
    actualizarTodo() {
        window.actualizarUICompleta?.();
        window.mesaUI?.actualizarCajon?.();
        window.mesaUI?.actualizarRoles?.();
        window.mesaUI?.actualizarFichas?.();
    }

    // 📝 REGISTRAR MANO EN HISTORIAL
    registrarMano(mano) {
        this.historialManos.unshift(mano);
        this.historialManos = this.historialManos.slice(0, 10); // Últimas 10
        console.log('📝 Mano registrada:', mano);
    }

    // ⏸️ CONTROL BARAJADO AUTOMÁTICO
    pausarBarajadoAutomatico(pausar) {
        this.enPausaBarajado = pausar;
        window.mesaCartas = window.mesaCartas || {};
        
        // Monkey patch para pausar/resumir barajado
        const originalVerificar = window.mesaCartas.verificarBarajado;
        window.mesaCartas.verificarBarajado = function() {
            if (this.enPausaBarajado) return;
            originalVerificar?.call(this);
        }.bind({ enPausaBarajado: this.enPausaBarajado });
    }

    // 🔧 FIJAR COLORES DE CARTAS
    fixColoresCartas() {
        if (!window.mesaCartas?.obtenerColorPalo) return;
        
        const originalColor = window.mesaCartas.obtenerColorPalo;
        window.mesaCartas.obtenerColorPalo = function(palo) {
            const color = originalColor(palo);
            return palo === '♥' || palo === '♦' ? 'red' : '#ffffff';
        };
    }
}

// 🎮 INSTANCIA GLOBAL
window.mesaOrquestador = new MesaOrquestador();
window.nuevaManoCompleta = () => window.mesaOrquestador.nuevaManoCompleta();
window.actualizarUICompleta = () => window.mesaOrquestador.actualizarTodo();

console.log('🎯 mesa-orquestador.js CARGADO - Controlador central activo');
