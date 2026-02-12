// ==================== MESA-UI.JS - CONTROLADOR VISUAL ====================
class MesaUI {
    constructor() {
        this.jugadores = {
            leon: 1250, dragon: 850, conejo: 420,
            aguila: 2100, cobra: 675, buho: 980
        };
        this.coronaActual = 'leon';
        this.retadorActual = 'dragon';
    }

    // 🖼️ ACTUALIZAR TODO
    actualizarTodo() {
        this.actualizarCartas();
        this.actualizarCajon();
        this.actualizarRoles();
        this.actualizarHistorial();
        this.actualizarFichas();
    }

    // 🃏 CAJÓN DE CARTAS
    actualizarCajon() {
        const estado = window.mesaCartas?.obtenerEstado() || { cartasRestantes: 416, barajando: false };
        document.getElementById('cartas-restantes').textContent = `🃏 ${estado.cartasRestantes} cartas`;
        document.getElementById('estado-barajando').style.display = estado.barajando ? 'block' : 'none';
    }

    // 👑⚔️ ROLES
    actualizarRoles() {
        document.querySelectorAll('.corona-badge, .retador-badge').forEach(b => b.style.display = 'none');
        if (document.getElementById(`corona-${this.coronaActual}`)) {
            document.getElementById(`corona-${this.coronaActual}`).style.display = 'block';
        }
        if (document.getElementById(`retador-${this.retadorActual}`)) {
            document.getElementById(`retador-${this.retadorActual}`).style.display = 'block';
        }
    }

    // 🃏 CARTAS CENTRAL
    actualizarCartas() {
        const estado = window.mesaCartas?.obtenerEstado() || {};
        const mano = estado.manoActual || { corona: { cartas: [], puntuacion: 0 }, retador: { cartas: [], puntuacion: 0 } };

        // Corona
        document.getElementById('carta1-corona').textContent = mano.corona.cartas[0]?.valor + mano.corona.cartas[0]?.palo || '?';
        document.getElementById('carta2-corona').textContent = mano.corona.cartas[1]?.valor + mano.corona.cartas[1]?.palo || '?';
        document.getElementById('puntuacion-corona').textContent = mano.corona.puntuacion;

        // Retador
        document.getElementById('carta1-retador').textContent = mano.retador.cartas[0]?.valor + mano.retador.cartas[0]?.palo || '?';
        document.getElementById('carta2-retador').textContent = mano.retador.cartas[1]?.valor + mano.retador.cartas[1]?.palo || '?';
        document.getElementById('puntuacion-retador').textContent = mano.retador.puntuacion;
    }

    // 📝 HISTORIAL
    actualizarHistorial() {
        const historial = window.mesaHistorial?.obtenerEstadoRapido()?.ultimasManos || [];
        const historialDiv = document.getElementById('historial-rapido');
        if (historialDiv) {
            historialDiv.innerHTML = historial.map(mano => 
                `<div>${mano.ganador} ${mano.coronaPuntos}-${mano.retadorPuntos}</div>`
            ).join('') || 'Sin historial';
        }
    }

    // 🪙 FICHAS
    actualizarFichas() {
        document.querySelectorAll('.fichas-numero').forEach(el => {
            const jugador = el.dataset.jugador;
            el.textContent = this.jugadores[jugador]?.toLocaleString() || '0';
        });
    }

    // 🎯 COMISIÓN
    mostrarComision() {
        const estadoApuestas = window.mesaApuestas?.obtenerEstado();
        if (estadoApuestas?.comisionActiva) {
            const alerta = document.getElementById('comision-alert');
            alerta.classList.add('mostrar');
            setTimeout(() => alerta.classList.remove('mostrar'), 3000);
        }
    }
}

// 🎮 INSTANCIA GLOBAL UI
window.mesaUI = new MesaUI();

// 🔗 FUNCIONES PÚBLICAS
window.actualizarUICompleta = () => window.mesaUI?.actualizarTodo();
window.mesaUI.mostrarComision = () => window.mesaUI?.mostrarComision();

console.log('🖼️ mesa-ui.js CARGADO - Controlador visual listo');
