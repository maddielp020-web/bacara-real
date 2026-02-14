// ==================== MESA-UI.JS - CONTROLADOR VISUAL ====================
class MesaUI {
    constructor() {
        this.jugadores = {
            leon: 1250, dragon: 850, conejo: 420,
            aguila: 2100, cobra: 675, buho: 980
        };
    }

    // 🖼️ ACTUALIZAR TODO
    actualizarTodo() {
        this.crearBotonHistorial();
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
        if (document.getElementById('boton-historial')) return;
        const btn = document.createElement('div');
        btn.id = 'boton-historial';
        btn.className = 'boton-historial';
        btn.innerHTML = `<span class="icono">📜</span><span>Historial</span>`;
        overlay.appendChild(btn);
    }

    actualizarCajon() {
        const estado = window.mesaCartas?.obtenerEstado() || { cartasRestantes: 416, barajando: false };
        document.getElementById('cartas-restantes').textContent = `🃏 ${estado.cartasRestantes} cartas`;
        document.getElementById('estado-barajando').style.display = estado.barajando ? 'block' : 'none';
    }

    actualizarRoles() {
        document.querySelectorAll('.corona-badge, .retador-badge').forEach(b => b.style.display = 'none');
        const duelo = window.mesaDuelo?.obtenerEstadoDuelo?.() || {};
        if (duelo.coronaActual) {
            const badgeCorona = document.getElementById(`corona-${duelo.coronaActual}`);
            if (badgeCorona) badgeCorona.style.display = 'block';
        }
        if (duelo.retadorActual) {
            const badgeRetador = document.getElementById(`retador-${duelo.retadorActual}`);
            if (badgeRetador) badgeRetador.style.display = 'block';
        }
    }

    actualizarCartas() {
        const estado = window.mesaCartas?.obtenerEstado() || {};
        const mano = estado.manoActual || { corona: { cartas: [], puntuacion: 0 }, retador: { cartas: [], puntuacion: 0 } };
        const c1 = mano.corona.cartas[0];
        const c2 = mano.corona.cartas[1];
        document.getElementById('carta1-corona').innerHTML = c1 ? `<span style="color: ${window.mesaCartas?.obtenerColorPalo(c1.palo)}">${c1.valor}${c1.palo}</span>` : '?';
        document.getElementById('carta2-corona').innerHTML = c2 ? `<span style="color: ${window.mesaCartas?.obtenerColorPalo(c2.palo)}">${c2.valor}${c2.palo}</span>` : '?';
        document.getElementById('puntuacion-corona').textContent = mano.corona.puntuacion;
        const r1 = mano.retador.cartas[0];
        const r2 = mano.retador.cartas[1];
        document.getElementById('carta1-retador').innerHTML = r1 ? `<span style="color: ${window.mesaCartas?.obtenerColorPalo(r1.palo)}">${r1.valor}${r1.palo}</span>` : '?';
        document.getElementById('carta2-retador').innerHTML = r2 ? `<span style="color: ${window.mesaCartas?.obtenerColorPalo(r2.palo)}">${r2.valor}${r2.palo}</span>` : '?';
        document.getElementById('puntuacion-retador').textContent = mano.retador.puntuacion;
    }

    actualizarHistorial() {}

    actualizarFichas() {
        document.querySelectorAll('.fichas-numero').forEach(el => {
            const jugador = el.dataset.jugador;
            el.textContent = this.jugadores[jugador]?.toLocaleString() || '0';
        });
    }

    mostrarComision() {
        const estadoApuestas = window.mesaApuestas?.obtenerEstado();
        if (estadoApuestas?.comisionActiva) {
            const alerta = document.getElementById('comision-alert');
            if (alerta) {
                alerta.classList.add('mostrar');
                setTimeout(() => alerta.classList.remove('mostrar'), 3000);
            }
        }
    }

    // 🥳 EMOJIS REACCIÓN
    mostrarEmojiReaccion(jugadorId, emoji) {
        const jugadorElement = document.querySelector(`.jugador-${jugadorId}`);
        if (!jugadorElement) return;
        const emojiDiv = document.createElement('div');
        emojiDiv.className = `emoji-reaccion emoji-${jugadorId}`;
        emojiDiv.textContent = emoji;
        jugadorElement.appendChild(emojiDiv);
        setTimeout(() => emojiDiv.remove(), 2000);
    }

    mostrarReaccionesPorMano(ganador) {
        const duelo = window.mesaDuelo?.obtenerEstadoDuelo?.() || {};
        if (!duelo.coronaActual || !duelo.retadorActual) return;
        const coronaEmoji = ganador === 'corona' ? '🥳' : '🥵';
        this.mostrarEmojiReaccion(duelo.coronaActual, coronaEmoji);
        const retadorEmoji = ganador === 'retador' ? '🥳' : '🥵';
        this.mostrarEmojiReaccion(duelo.retadorActual, retadorEmoji);
    }
}

window.mesaUI = new MesaUI();
window.actualizarUICompleta = () => window.mesaUI?.actualizarTodo();
window.mesaUI.mostrarComision = () => window.mesaUI?.mostrarComision();
console.log('🖼️ mesa-ui.js CARGADO');
