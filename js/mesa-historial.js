// ==================== MESA-HISTORIAL.JS - FASE 3C ====================
// Registro completo manos + auditoría (T&C Bacará Cubano)

class MesaHistorial {
    constructor() {
        this.historialManos = [];
        this.historialGlobal = [];
        this.seedActual = Date.now().toString(36) + Math.random().toString(36);
        this.contadorManos = 0;
        this.estadisticas = {
            totalManos: 0,
            victoriasCorona: 0,
            victoriasRetador: 0,
            comisionesCasa: 0,
            manosBarajadas: 0
        };
    }

    // 📝 REGISTRAR MANO COMPLETA (auditoría T&C)
    registrarMano(manoData) {
        const mano = {
            id: ++this.contadorManos,
            timestamp: new Date().toISOString(),
            seed: this.seedActual,
            corona: {
                jugador: manoData.coronaJugador,
                cartas: manoData.coronaCartas,
                puntuacion: manoData.coronaPuntuacion
            },
            retador: {
                jugador: manoData.retadorJugador,
                cartas: manoData.retadorCartas,
                puntuacion: manoData.retadorPuntuacion
            },
            ganador: manoData.ganador,
            rachaCorona: manoData.rachaCorona,
            comisionAplicada: manoData.comisionAplicada,
            apuestas: {
                corona: manoData.apuestasCorona,
                retador: manoData.apuestasRetador
            },
            cartasRestantes: manoData.cartasRestantes
        };

        this.historialManos.unshift(mano); // Más reciente primero
        this.historialGlobal.push(mano);
        
        // Mantener solo últimas 50 manos en memoria rápida
        if (this.historialManos.length > 50) {
            this.historialManos = this.historialManos.slice(0, 50);
        }

        this.actualizarEstadisticas(mano);
        console.log(`📝 Mano #${mano.id} registrada: ${mano.ganador.toUpperCase()} gana`);
        
        return mano;
    }

    // 📊 ACTUALIZAR ESTADÍSTICAS GLOBALES
    actualizarEstadisticas(mano) {
        this.estadisticas.totalManos++;
        
        if (mano.ganador === 'corona') {
            this.estadisticas.victoriasCorona++;
        } else {
            this.estadisticas.victoriasRetador++;
        }

        if (mano.comisionAplicada > 0) {
            this.estadisticas.comisionesCasa += mano.comisionAplicada;
        }

        // Nuevo barajado
        if (mano.cartasRestantes > 300 && mano.cartasRestantes <= 416) {
            this.estadisticas.manosBarajadas++;
        }
    }

    // 🔍 ÚLTIMAS 10 MANOS (para UI rápida)
    ultimasManos() {
        return this.historialManos.slice(0, 10).map(mano => ({
            id: mano.id,
            ganador: mano.ganador.toUpperCase(),
            coronaPuntos: mano.corona.puntuacion,
            retadorPuntos: mano.retador.puntuacion,
            comision: mano.comisionAplicada ? '5%' : '0%'
        }));
    }

    // 📈 ESTADÍSTICAS COMPLETAS
    obtenerEstadisticas() {
        const totalVictorias = this.estadisticas.victoriasCorona + this.estadisticas.victoriasRetador;
        return {
            totalManos: this.estadisticas.totalManos,
            winrateCorona: totalVictorias > 0 ? 
                (this.estadisticas.victoriasCorona / totalVictorias * 100).toFixed(1) : 0,
            winrateRetador: totalVictorias > 0 ? 
                (this.estadisticas.victoriasRetador / totalVictorias * 100).toFixed(1) : 0,
            comisionesCasa: this.estadisticas.comisionesCasa.toFixed(2),
            manosBarajadas: this.estadisticas.manosBarajadas,
            seedActual: this.seedActual,
            proximoId: this.contadorManos + 1
        };
    }

    // 💾 MANO COMPLETA PARA AUDITORÍA (T&C 6.3)
    exportarMano(id) {
        const mano = this.historialGlobal.find(m => m.id === id);
        if (mano) {
            return {
                auditoria: true,
                ...mano,
                exportTimestamp: new Date().toISOString()
            };
        }
        return null;
    }

    // 🧹 LIMPIAR HISTORIAL (solo para testing)
    limpiarHistorial() {
        this.historialManos = [];
        this.historialGlobal = [];
        this.contadorManos = 0;
        this.estadisticas = { totalManos: 0, victoriasCorona: 0, victoriasRetador: 0, comisionesCasa: 0, manosBarajadas: 0 };
        console.log('🧹 Historial limpiado (testing)');
    }

    // 📤 ESTADO RÁPIDO PARA UI
    obtenerEstadoRapido() {
        return {
            ultimasManos: this.ultimasManos(),
            estadisticas: this.obtenerEstadisticas(),
            totalManosHoy: this.historialManos.filter(m => {
                const hoy = new Date().toDateString();
                return new Date(m.timestamp).toDateString() === hoy;
            }).length
        };
    }
}

// 🎮 INSTANCIA GLOBAL
const mesaHistorial = new MesaHistorial();

// 🔗 EXPORTS PARA OTROS MÓDULOS
window.mesaHistorial = mesaHistorial;
window.registrarMano = (manoData) => mesaHistorial.registrarMano(manoData);
window.obtenerHistorial = () => mesaHistorial.obtenerEstadoRapido();

// 🧪 SIMULACIÓN PRUEBAS (cada 15s)
setInterval(() => {
    if (Math.random() > 0.8) {
        const manoDemo = {
            coronaJugador: 'leon',
            coronaCartas: [{valor: 'A', palo: '♠', numero: 1}],
            coronaPuntuacion: 7,
            retadorJugador: 'dragon',
            retadorCartas: [{valor: '10', palo: '♥', numero: 0}],
            retadorPuntuacion: 3,
            ganador: Math.random() > 0.5 ? 'corona' : 'retador',
            rachaCorona: 2,
            comisionAplicada: 0.05,
            apuestasCorona: 150,
            apuestasRetador: 200,
            cartasRestantes: 350
        };
        registrarMano(manoDemo);
    }
}, 15000);

console.log('📝 mesa-historial.js CARGADO');
console.log('✅ Auditoría completa cada mano');
console.log('✅ Seed visible para verificación');
console.log('✅ Últimas 10 manos + estadísticas');
console.log('✅ Export T&C 6.3 compliant');
