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
        this.crearBotonHistorial();   // ← NUEVO: botón historial
        this.actualizarCartas();
        this.actualizarCajon();
        this.actualizarRoles();
        this.actualizarHistorial();
        this.actualizarFichas();
    }

    // 🆕 CREAR BOTÓN HISTORIAL
    crearBotonHistorial() {
        const overlay = document.getElementById('mesa-overlay');
        if (!overlay) return;

        // Evitar duplicados
        if (document.getElementById('boton-historial')) return;

        const btn = document.createElement('div');
        btn.id = 'boton-historial';
        btn.className = 'boton-historial';
        btn.innerHTML = `<span class="icono">📜</span><span>Historial</span>`;
        overlay.appendChild(btn);
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
    const mano = estado.manoActual || { 
        corona: { cartas: [], puntuacion: 0 }, 
        retador: { cartas: [], puntuacion: 0 } 
    };

    // CORONA
    const c1 = mano.corona.cartas[0];
    const c2 = mano.corona.cartas[1];

    document.getElementById('carta1-corona').innerHTML = c1
        ? `<span style="color: ${window.mesaCartas.obtenerColorPalo(c1.palo)}">${c1.valor}${c1.palo}</span>`
        : '?';

    document.getElementById('carta2-corona').innerHTML = c2
        ? `<span style="color: ${window.mesaCartas.obtenerColorPalo(c2.palo)}">${c2.valor}${c2.palo}</span>`
        : '?';

    document.getElementById('puntuacion-corona').textContent = mano.corona.puntuacion;

    // RETADOR
    const r1 = mano.retador.cartas[0];
    const r2 = mano.retador.cartas[1];

    document.getElementById('carta1-retador').innerHTML = r1
        ? `<span style="color: ${window.mesaCartas.obtenerColorPalo(r1.palo)}">${r1.valor}${r1.palo}</span>`
        : '?';

    document.getElementById('carta2-retador').innerHTML = r2
        ? `<span style="color: ${window.mesaCartas.obtenerColorPalo(r2.palo)}">${r2.valor}${r2.palo}</span>`
        : '?';

    document.getElementById('puntuacion-retador').textContent = mano.retador.puntuacion;
}

    // 📝 HISTORIAL (placeholder)
    actualizarHistorial() {
        // Por ahora no hacemos nada: solo existe el botón visual "📜 Historial"
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

console.log('🖼️ mesa-ui.js CARGADO - Controlador visual con botón historial');