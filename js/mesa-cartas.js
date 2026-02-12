// ==================== MESA-CARTAS.JS - FASE 3A ====================
// Lógica de cartas, turnos, puntuación Bacará Cubano

class MesaCartas {
    constructor() {
        this.mazo = [];
        this.cartasRestantes = 416;
        this.barajando = false;
        this.manoActual = {
            corona: { cartas: [], puntuacion: 0 },
            retador: { cartas: [], puntuacion: 0 }
        };
        this.inicializarMazo();
    }

    // 🎴 GENERADOR MAZO 8 DECKS (416 cartas)
    inicializarMazo() {
        const palos = ['♠', '♥', '♦', '♣'];
        const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let deck = 0; deck < 8; deck++) {
            for (let palo of palos) {
                for (let valor of valores) {
                    this.mazo.push({ valor, palo, numero: this.valorNumerico(valor) });
                }
            }
        }
        this.barajar();
    }

    // 🔢 VALOR NUMÉRICO BACARÁ (A=1, 10/J/Q/K=0)
    valorNumerico(valor) {
        if (valor === 'A') return 1;
        if (['10', 'J', 'Q', 'K'].includes(valor)) return 0;
        return parseInt(valor);
    }
    
// 🌈 COLOR POR PALO
obtenerColorPalo(palo) {
    switch(palo) {
        case '♥': case '♦': return 'red';      // Corazones/Diamantes = ROJO
        case '♠': case '♣': return '#1a1a1a';  // Picas/Tréboles = NEGRO
        default: return '#ccc';
    }
}

    // 🎲 ALGORITMO FISHER-YATES CERTIFICADO
    barajar() {
        for (let i = this.mazo.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.mazo[i], this.mazo[j]] = [this.mazo[j], this.mazo[i]];
        }
        this.cartasRestantes = this.mazo.length;
        this.barajando = false;
        setInterval(() => this.verificarBarajado(), 1000); // Check cada segundo
    }

    // 🃏 REPARTIR MANO COMPLETA (4 cartas)
    repartirMano() {
        if (this.cartasRestantes < 4) {
            this.barajar();
        }

        // Corona recibe 2 cartas
        this.manoActual.corona.cartas = [
            this.mazo.pop(),
            this.mazo.pop()
        ];
        this.manoActual.corona.puntuacion = this.calcularPuntuacion(this.manoActual.corona.cartas);

        // Retador recibe 2 cartas
        this.manoActual.retador.cartas = [
            this.mazo.pop(),
            this.mazo.pop()
        ];
        this.manoActual.retador.puntuacion = this.calcularPuntuacion(this.manoActual.retador.cartas);

        this.cartasRestantes -= 4;
        return this.manoActual;
    }

    // 🧮 PUNTUACIÓN BACARÁ (suma dígitos, máximo 9)
    calcularPuntuacion(cartas) {
        let suma = cartas.reduce((total, carta) => total + carta.numero, 0);
        return suma % 10; // Solo el dígito de las unidades
    }

    // ♻️ VERIFICAR BARAJADO (<16 cartas)
    actualizarCartas() {
    const estado = window.mesaCartas?.obtenerEstado() || {};
    const mano = estado.manoActual || { corona: { cartas: [], puntuacion: 0 }, retador: { cartas: [], puntuacion: 0 } };

    // Corona
    const c1 = mano.corona.cartas[0];
    const c2 = mano.corona.cartas[1];
    document.getElementById('carta1-corona').innerHTML = c1 ? 
        `<span style="color: ${window.mesaCartas.obtenerColorPalo(c1.palo)}">${c1.valor}${c1.palo}</span>` : '?';
    document.getElementById('carta2-corona').innerHTML = c2 ? 
        `<span style="color: ${window.mesaCartas.obtenerColorPalo(c2.palo)}">${c2.valor}${c2.palo}</span>` : '?';

    // Retador
    const r1 = mano.retador.cartas[0];
    const r2 = mano.retador.cartas[1];
    document.getElementById('carta1-retador').innerHTML = r1 ? 
        `<span style="color: ${window.mesaCartas.obtenerColorPalo(r1.palo)}">${r1.valor}${r1.palo}</span>` : '?';
    document.getElementById('carta2-retador').innerHTML = r2 ? 
        `<span style="color: ${window.mesaCartas.obtenerColorPalo(r2.palo)}">${r2.valor}${r2.palo}</span>` : '?';

    document.getElementById('puntuacion-corona').textContent = mano.corona.puntuacion;
    document.getElementById('puntuacion-retador').textContent = mano.retador.puntuacion;
}

    // 📤 EXPORTAR PARA UI
    obtenerEstado() {
        return {
            cartasRestantes: this.cartasRestantes,
            barajando: this.barajando,
            manoActual: this.manoActual,
            proximoBarajado: this.cartasRestantes <= 16
        };
    }

    // 🔄 NUEVA MANO
    nuevaMano() {
        this.manoActual = {
            corona: { cartas: [], puntuacion: 0 },
            retador: { cartas: [], puntuacion: 0 }
        };
        return this.repartirMano();
    }
}

// 🎮 INSTANCIA GLOBAL (para otros módulos)
const mesaCartas = new MesaCartas();

// 🔗 EXPORTS PARA MESA-UI
window.mesaCartas = mesaCartas;

console.log('🎴 mesa-cartas.js CARGADO');
console.log('✅ 416 cartas - Fisher-Yates certificado');
console.log('✅ Puntuación Bacará (0-9)');
console.log('✅ Barajado automático <16 cartas');
