// ==================== MESA-APUESTAS.JS - FASE 3B ====================
// Sistema apuestas + comisión 5% (según T&C Bacará Cubano)

class MesaApuestas {
    constructor() {
        this.apuestasEspectadores = {
            corona: 0,  // Total apostado a Corona
            retador: 0  // Total apostado a Retador
        };
        this.rachaVictoriasCorona = 0;  // 0% primera victoria
        this.comisionCasa = 0;          // Total comisiones cobradas
        this.manoGanador = null;        // 'corona' o 'retador'
    }

    // 💰 APOSTAR (espectadores 1:1, sin comisión)
    apostarEspectador(destino, cantidad) {
        if (destino === 'corona') {
            this.apuestasEspectadores.corona += cantidad;
        } else if (destino === 'retador') {
            this.apuestasEspectadores.retador += cantidad;
        }
        console.log(`💰 Apuesta ${cantidad} a ${destino.toUpperCase()}`);
        return this.apuestasEspectadores;
    }

    // 🏆 PROCESAR RESULTADO MANO (comisión según racha)
    procesarResultado(ganador) {
        this.manoGanador = ganador;
        this.rachaVictoriasCorona = (ganador === 'corona') ? 
            this.rachaVictoriasCorona + 1 : 0;

        let comisionAplicada = 0;
        
        // 🎯 COMISIÓN 5% DESDE 2DA VICTORIA CONSECUTIVA
        if (ganador === 'corona' && this.rachaVictoriasCorona >= 2) {
            comisionAplicada = 0.05; // 5%
            this.mostrarAlertaComision();
        }

        // 📊 PAGOS ESPECTADORES (1:1 SIN COMISIÓN)
        if (ganador === 'corona') {
            console.log(`👑 CORONA GANA: Espectadores ganan ${this.apuestasEspectadores.corona} (1:1)`);
        } else {
            console.log(`⚔️ RETADOR GANA: Espectadores ganan ${this.apuestasEspectadores.retador} (1:1)`);
        }

        // 🔄 RESET APUESTAS PARA SIGUIENTE MANO
        this.apuestasEspectadores = { corona: 0, retador: 0 };

        return {
            ganador: ganador,
            rachaCorona: this.rachaVictoriasCorona,
            comision: comisionAplicada,
            totalCasa: this.comisionCasa
        };
    }

    // ⚠️ ALERTA COMISIÓN VISUAL (según T&C)
    mostrarAlertaComision() {
        console.log('🎯 -5% COMISIÓN ACTIVADA (racha >= 2)');
        // UI disparará: document.getElementById('comision-alert').classList.add('mostrar');
    }

    // 💵 ACTUALIZAR FICHAS JUGADOR (después de mano)
    actualizarFichas(jugadorId, gananciaNeta) {
        if (!window.jugadoresFichas) {
            window.jugadoresFichas = { leon: 1250, dragon: 850, conejo: 420, aguila: 2100, cobra: 675, buho: 980 };
        }
        
        window.jugadoresFichas[jugadorId] += gananciaNeta;
        console.log(`🪙 ${jugadorId.toUpperCase()}: ${window.jugadoresFichas[jugadorId]} fichas`);
    }

    // 📊 ESTADO COMPLETO (para UI)
    obtenerEstado() {
    return {
        apuestasCorona: this.apuestasEspectadores.corona,
        apuestasRetador: this.apuestasEspectadores.retador,
        rachaCorona: this.rachaVictoriasCorona,
        comisionActiva: this.rachaVictoriasCorona >= 2,
        manoGanador: this.manoGanador,
        totalCasa: this.comisionCasa
    };
}

    // 🎲 SIMULAR APUESTA PRUEBAS
    simularApuestas() {
        const apuesta = Math.floor(Math.random() * 100) + 50;
        const destino = Math.random() > 0.5 ? 'corona' : 'retador';
        return this.apostarEspectador(destino, apuesta);
    
    // 🧮 REGISTRAR RESULTADO PARA RACHA Y COMISIÓN
// info: { ganador: 'corona'|'retador', coronaActual, retadorActual, coronaAnterior, retadorAnterior }
registrarResultado(info) {
    if (!info || !info.ganador) return;

    // ¿Quién es el jugador que ganó esta mano?
    // Si ganó 'corona', el ganador es info.coronaActual
    // Si ganó 'retador', el ganador es info.retadorAnterior (el retador que jugó esa mano)
    const jugadorGanadorId = info.ganador === 'corona'
        ? info.coronaActual
        : info.retadorAnterior;

    // Actualizar racha SOLO para Corona (según T&C la comisión se asocia a la posición Corona)
    if (info.ganador === 'corona') {
        // Corona ganó una mano
        this.rachaVictoriasCorona += 1;
    } else {
        // Corona perdió → racha se reinicia
        this.rachaVictoriasCorona = 0;
    }

    // ¿Hay comisión activa?
    const comisionActiva = this.rachaVictoriasCorona >= 2;
    if (comisionActiva) {
        // Aquí NO calculamos aún el monto exacto (falta enlazar apuestaActual),
        // pero sí podemos activar el cartel visual
        this.mostrarAlertaComision();
    }

    // Guardar por si hace falta en otros módulos
    this.manoGanador = info.ganador;
}

// 🎮 INSTANCIA GLOBAL
const mesaApuestas = new MesaApuestas();

// 🔗 EXPORTS PARA OTROS MÓDULOS
window.mesaApuestas = mesaApuestas;
window.apostar = (destino, cantidad = 100) => {
    return mesaApuestas.apostarEspectador(destino, cantidad);
};
window.procesarResultado = (ganador) => {
    return mesaApuestas.procesarResultado(ganador);
};

// 🧪 DEMO AUTOMÁTICA (pruebas)
setInterval(() => {
    if (Math.random() > 0.7) {
        mesaApuestas.simularApuestas();
    }
}, 5000);

console.log('💰 mesa-apuestas.js CARGADO');
console.log('✅ Apuestas espectadores 1:1 (sin comisión)');
console.log('✅ Comisión 5% desde 2da victoria Corona');
console.log('✅ Racha continúa entre oponentes');
console.log('✅ Listo para mesa-ui.js integración');
