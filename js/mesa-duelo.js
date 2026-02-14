// ==================== MESA-DUELO.JS - SISTEMA DE DUELOS ROTATIVOS ====================
// Árbitro de quién es 👑 Corona, quién es ⚔️ Retador y cómo rota el duelo.

class MesaDuelo {
    constructor() {
        // Orden físico fijo en sentido horario
        this.ordenFisico = ['leon', 'aguila', 'cobra', 'buho', 'conejo', 'dragon'];

        // Estado principal del duelo
        this.coronaActual = 'leon';     // Se puede ajustar en iniciarDueloInicial
        this.retadorActual = 'aguila';  // Siguiente después de León
        this.manoEnDuelo = 1;           // 1, 2 o 3
        this.dueloActivo = true;

        // Derrotas consecutivas del retador en el duelo actual
        this.derrotasRetador = 0;
    }

    // 🌟 SETUP INICIAL (puedes llamarlo al cargar la mesa)
    iniciarDueloInicial(coronaOpcional, retadorOpcional) {
        this.coronaActual = coronaOpcional || 'leon';

        // Retador por defecto: siguiente en orden físico
        if (retadorOpcional) {
            this.retadorActual = retadorOpcional;
        } else {
            this.retadorActual = this.obtenerSiguienteJugador(this.coronaActual, this.coronaActual);
        }

        this.manoEnDuelo = 1;
        this.dueloActivo = true;
        this.derrotasRetador = 0;
    }

    // 🧭 Obtener siguiente jugador en orden físico, evitando uno concreto (normalmente la corona)
    obtenerSiguienteJugador(desdeJugador, evitarJugador) {
        const idx = this.ordenFisico.indexOf(desdeJugador);
        if (idx === -1) return null;

        let i = (idx + 1) % this.ordenFisico.length;

        // Avanzar hasta encontrar un jugador distinto del que queremos evitar
        while (this.ordenFisico[i] === evitarJugador) {
            i = (i + 1) % this.ordenFisico.length;
        }

        return this.ordenFisico[i];
    }

    // 📊 Estado completo para UI / apuestas
    obtenerEstadoDuelo() {
        return {
            ordenFisico: [...this.ordenFisico],
            coronaActual: this.coronaActual,
            retadorActual: this.retadorActual,
            manoEnDuelo: this.manoEnDuelo,
            dueloActivo: this.dueloActivo,
            derrotasRetador: this.derrotasRetador
        };
    }

    // 🧠 PROCESAR FIN DE MANO
    // ganador: 'corona' | 'retador'
    procesarFinDeMano(ganador) {
        const coronaAnterior = this.coronaActual;
        const retadorAnterior = this.retadorActual;
        const manoEnDueloAnterior = this.manoEnDuelo;

        let coronaNueva = this.coronaActual;
        let retadorNuevo = this.retadorActual;
        let manoEnDueloNueva = this.manoEnDuelo;
        let dueloTerminado = false;

        // 1) El ganador SIEMPRE se convierte en corona (regla de oro)
        if (ganador === 'corona') {
            // Ya era corona → se mantiene
            coronaNueva = this.coronaActual;
        } else if (ganador === 'retador') {
            // El retador pasa a ser la nueva corona
            coronaNueva = this.retadorActual;
        }

        // 2) Lógica de derrotas del retador y manos del duelo
        if (ganador === 'retador') {
            // Retador gana → se reinicia su contador de derrotas (nuevo retador vendrá después)
            this.derrotasRetador = 0;

            // Elegir nuevo retador en orden físico, evitando a la nueva corona
            retadorNuevo = this.obtenerSiguienteJugador(retadorAnterior, coronaNueva);

            // Nuevo duelo: mano 1
            manoEnDueloNueva = 1;
            dueloTerminado = true;
        } else {
            // Ganó la corona
            if (this.coronaActual === retadorAnterior) {
                // Caso teórico raro: si corona y retador coincidieran (no debería pasar)
                this.derrotasRetador = 0;
            } else {
                // Retador pierde una mano: sumamos derrota
                this.derrotasRetador += 1;
            }

            if (this.derrotasRetador >= 3) {
                // Retador perdió 3 veces seguidas → sale del duelo, entra el siguiente
                retadorNuevo = this.obtenerSiguienteJugador(retadorAnterior, coronaNueva);
                this.derrotasRetador = 0;
                manoEnDueloNueva = 1;
                dueloTerminado = true;
            } else {
                // El duelo continúa, misma corona y retador, siguiente mano (hasta 3)
                manoEnDueloNueva = Math.min(this.manoEnDuelo + 1, 3);
                // Nota: la regla “cambia retador al llegar a 3 manos” la podrás afinar aquí más adelante
            }
        }

        // 3) Actualizar estado interno
        this.coronaActual = coronaNueva;
        this.retadorActual = retadorNuevo;
        this.manoEnDuelo = manoEnDueloNueva;
        this.dueloActivo = !!(this.coronaActual && this.retadorActual);

        // 4) Devolver resumen para UI / apuestas / emojis de reacción
        return {
            coronaAnterior,
            coronaNueva,
            retadorAnterior,
            retadorNuevo,
            manoEnDueloAnterior,
            manoEnDueloNueva,
            dueloTerminado
        };
    }
}

// 🎮 Instancia global para que la usen mesa-ui / mesa-apuestas / orquestador
const mesaDuelo = new MesaDuelo();
window.mesaDuelo = mesaDuelo;

// Helpers globales opcionales
window.iniciarDueloInicial = (...args) => mesaDuelo.iniciarDueloInicial(...args);
window.obtenerEstadoDuelo = () => mesaDuelo.obtenerEstadoDuelo();
window.procesarFinDeManoDuelo = (ganador) => mesaDuelo.procesarFinDeMano(ganador);

console.log('⚔️ mesa-duelo.js CARGADO - Sistema de duelos rotativos listo');
