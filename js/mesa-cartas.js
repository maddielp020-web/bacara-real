// ==================== MESA-CARTAS.JS - BARAJADO CORREGIDO ====================
class MesaCartas {
    constructor() {
        this.cartasRestantes = 416;
        this.barajando = false;
        this.mazo = [];
        this.manoActual = {
            corona: { cartas: [], puntuacion: 0 },
            retador: { cartas: [], puntuacion: 0 }
        };
        this.inicializarMazoCompleto();
        this.intervaloBarajado = setInterval(() => this.verificarBarajado(), 1000);
    }

    // 🎴 MAZO COMPLETO 8 DECKS (416 cartas)
    inicializarMazoCompleto() {
        this.mazo = [];
        const palos = ['♠', '♥', '♦', '♣'];
        const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        
        for (let deck = 0; deck < 8; deck++) {
            for (let palo of palos) {
                for (let valor of valores) {
                    this.mazo.push({ 
                        valor, palo, 
                        numero: this.valorNumerico(valor) 
                    });
                }
            }
        }
        this.cartasRestantes = this.mazo.length; // ← ESTO ES CRÍTICO
        console.log(`✅ Mazo inicializado: ${this.cartasRestantes} cartas`);
    }

    // 🔢 VALOR NUMÉRICO
    valorNumerico(valor) {
        if (valor === 'A') return 1;
        if (['10', 'J', 'Q', 'K'].includes(valor)) return 0;
        return parseInt(valor);
    }

    // 🌈 COLOR PALO
    obtenerColorPalo(palo) {
        switch(palo) {
            case '♥': case '♦': return 'red';
            case '♠': case '♣': return '#1a1a1a';
            default: return '#ccc';
        }
    }

    // 🎲 FISHER-YATES CERTIFICADO
    barajar() {
        // ← CRÍTICO: SI MAZO VACÍO, REINICIALIZAR
        if (this.mazo.length === 0) {
            console.log('⚠️ Mazo vacío detectado → Reinicializando');
            this.inicializarMazoCompleto();
        }

        for (let i = this.mazo.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.mazo[i], this.mazo[j]] = [this.mazo[j], this.mazo[i]];
        }
        this.cartasRestantes = this.mazo.length;
        this.barajando = false;
        console.log(`✅ Barajado: ${this.cartasRestantes} cartas listas`);
    }

    // 🃏 REPARTIR
    repartirMano() {
        if (this.cartasRestantes < 4) {
            console.log('🃏 Pocos cartas → Forzando barajado');
            this.barajar();
        }

        this.manoActual.corona.cartas = [this.mazo.pop(), this.mazo.pop()];
        this.manoActual.corona.puntuacion = this.calcularPuntuacion(this.manoActual.corona.cartas);

        this.manoActual.retador.cartas = [this.mazo.pop(), this.mazo.pop()];
        this.manoActual.retador.puntuacion = this.calcularPuntuacion(this.manoActual.retador.cartas);

        this.cartasRestantes = this.mazo.length; // ← ACTUALIZAR SIEMPRE
        return this.manoActual;
    }

    calcularPuntuacion(cartas) {
        let suma = cartas.reduce((total, carta) => total + carta.numero, 0);
        return suma % 10;
    }

    // ♻️ BARAJADO AUTOMÁTICO ≤16 - FIX DEFINITIVO
verificarBarajado() {
    // ✅ FIX 1: Pausar si orquestador activo
    if (window.mesaOrquestador && window.mesaOrquestador.enPausaBarajado) {
        return; // Silenciosamente pausado
    }
    
    // ✅ FIX 2: Solo si NO está barajando YA
    if (this.barajando) {
        return;
    }
    
    // ✅ FIX 3: Solo si realmente quedan pocas cartas
    if (this.mazo.length > 16) {
        return;
    }
    
    // 🎯 EJECUTAR BARAJADO
    this.barajando = true;
    console.log(`♻️ Barajando (${this.mazo.length} cartas restantes)`);
    
    const barajandoEl = document.getElementById('estado-barajando');
    if (barajandoEl) {
        barajandoEl.style.display = 'block';
    }
    
    setTimeout(() => {
        this.barajar();
        this.barajando = false; // ← CRÍTICO: Resetear flag
        if (barajandoEl) {
            barajandoEl.style.display = 'none';
        }
        console.log(`✅ Barajado completo: ${this.cartasRestantes} cartas listas`);
    }, 2500); // 2.5s visual
}

// 🎮 GLOBAL
const mesaCartas = new MesaCartas();
window.mesaCartas = mesaCartas;

console.log('🎴 mesa-cartas.js CORREGIDO - Barajado automático FIX');
console.log('✅ Reinicializa mazo vacío → 416 cartas');
console.log('✅ Verificación cada 1s ≤16 cartas');
