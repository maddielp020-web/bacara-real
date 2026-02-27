// ==================== LOBBY - DATOS SIMULADOS Y COMPORTAMIENTO ====================
// NOTA: Los datos hardcodeados (username, saldo, esAdmin) son SIMULACIONES
// En producción vendrán del bot de Telegram y backend

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== DATOS DE PRUEBA (TEMPORALES) ====================
    // Estos datos serán reemplazados por los del bot de Telegram
    const jugador = {
        username: "@antonio",
        saldo: 1250,
        esAdmin: false  // cambiar a true para probar funcionalidad admin
    };
    
    const mesas = [
        { id: 1, monto: 700, jugadores: 4, max: 6, estado: "activa" },
        { id: 2, monto: 1000, jugadores: 3, max: 6, estado: "activa" },
        { id: 3, monto: 1200, jugadores: 1, max: 6, estado: "espera" },
        { id: 4, monto: 1500, jugadores: 6, max: 6, estado: "llena" }
    ];
    
    // ==================== MOSTRAR DATOS DEL JUGADOR ====================
    document.getElementById('usuario-nombre').textContent = jugador.username;
    document.getElementById('saldo-usuario').textContent = jugador.saldo.toLocaleString();
    
    // Mostrar badge de admin si corresponde
    const adminBadge = document.getElementById('admin-badge');
    if (jugador.esAdmin) {
        adminBadge.style.display = 'inline-block';
        console.log('👑 Usuario administrador detectado');
    }
    
    // ==================== ELEMENTOS DEL DOM ====================
    const mesasLista = document.getElementById('mesas-lista');
    const botonesMonto = document.querySelectorAll('.btn-monto');
    const montoInput = document.getElementById('monto-input');
    const montoFeedback = document.getElementById('monto-feedback');
    
    // ==================== VALIDACIÓN DE MONTO ====================
    function validarMonto(valor) {
        const num = parseInt(valor);
        
        // Vacío o no numérico
        if (isNaN(num) || valor === '') {
            return { valido: false, mensaje: 'Ingresa un monto' };
        }
        
        // Mínimo 200
        if (num < 200) {
            return { valido: false, mensaje: 'El monto mínimo es 200₽' };
        }
        
        // Múltiplo de 50
        if (num % 50 !== 0) {
            return { valido: false, mensaje: 'El monto debe ser múltiplo de 50' };
        }
        
        return { valido: true, mensaje: '✓ Monto válido' };
    }
    
    function actualizarFeedbackMonto() {
        const valor = montoInput.value;
        const resultado = validarMonto(valor);
        
        // Actualizar clases del input
        montoInput.classList.remove('valido', 'invalido');
        montoFeedback.classList.remove('valido', 'invalido');
        
        if (valor === '') {
            montoFeedback.textContent = '';
            renderizarMesas(null);
            return;
        }
        
        if (resultado.valido) {
            montoInput.classList.add('valido');
            montoFeedback.classList.add('valido');
            montoFeedback.textContent = resultado.mensaje;
        } else {
            montoInput.classList.add('invalido');
            montoFeedback.classList.add('invalido');
            montoFeedback.textContent = '❌ ' + resultado.mensaje;
        }
        
        const montoActual = !isNaN(parseInt(valor)) ? parseInt(valor) : null;
        renderizarMesas(montoActual);
    }
    
    // ==================== RENDERIZAR MESAS ====================
    function getEstadoInfo(jugadores) {
        if (jugadores === 6) return { color: 'gris', texto: '⚪' };
        if (jugadores === 1) return { color: 'rojo', texto: '🔴' };
        if (jugadores >= 2) return { color: 'verde', texto: '🟢' };
        return { color: 'amarillo', texto: '🟡' };
    }
    
    function renderizarMesas(intencionMonto = null) {
        mesasLista.innerHTML = '';
        
        // Filtrar mesas NO llenas para mostrar
        const mesasActivas = mesas.filter(m => m.jugadores < 6);
        
        let mesasAMostrar = [];
        
        if (intencionMonto && !isNaN(intencionMonto) && intencionMonto >= 200) {
            // Buscar mesas activas con monto >= intencion
            const mesasSuperiores = mesasActivas.filter(m => m.monto >= intencionMonto);
            
            if (mesasSuperiores.length > 0) {
                mesasAMostrar = mesasSuperiores;
            } else {
                const mesasInferiores = mesasActivas.filter(m => m.monto < intencionMonto);
                if (mesasInferiores.length > 0) {
                    mesasInferiores.sort((a, b) => b.monto - a.monto);
                    mesasAMostrar = [mesasInferiores[0]];
                } else {
                    mesasAMostrar = [];
                }
            }
        } else {
            mesasAMostrar = mesasActivas;
        }
        
        // Mostrar mensaje en el div de error si no hay mesas
        const errorDiv = document.getElementById('mesas-error');
        if (mesasAMostrar.length === 0) {
            errorDiv.style.display = 'block';
            errorDiv.innerHTML = '<p>No hay mesas disponibles en este momento</p>';
        } else {
            errorDiv.style.display = 'none';
        }
        
        mesasAMostrar.forEach(mesa => {
            const estadoInfo = getEstadoInfo(mesa.jugadores);
            const esLlena = mesa.jugadores === 6;
            
            const mesaCard = document.createElement('div');
            mesaCard.className = `mesa-card estado-${estadoInfo.color}`;
            mesaCard.dataset.mesaId = mesa.id;
            
            const header = document.createElement('div');
            header.className = 'mesa-header';
            
            const infoDiv = document.createElement('div');
            infoDiv.className = 'mesa-info';
            infoDiv.innerHTML = `
                <span class="mesa-estado">${estadoInfo.texto}</span>
                <div class="mesa-detalles">
                    <span class="mesa-numero">MESA #${mesa.id}</span>
                    <span class="mesa-monto">${mesa.monto}₽</span>
                    <span class="mesa-ocupacion">${mesa.jugadores}/${mesa.max}</span>
                </div>
            `;
            
            const accionDiv = document.createElement('div');
            accionDiv.className = 'mesa-accion';
            
            if (esLlena) {
                accionDiv.innerHTML = '<span class="btn-llena">LLENA</span>';
            } else {
                const entrarBtn = document.createElement('button');
                entrarBtn.className = 'btn-entrar';
                entrarBtn.textContent = '▶ ENTRAR';
                entrarBtn.dataset.mesaId = mesa.id;
                
                entrarBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    manejarEntrarMesa(mesa.id, mesa.monto);
                });
                
                accionDiv.appendChild(entrarBtn);
            }
            
            header.appendChild(infoDiv);
            header.appendChild(accionDiv);
            
            const gaveta = document.createElement('div');
            gaveta.className = 'mesa-gaveta';
            gaveta.style.display = 'none';
            gaveta.innerHTML = `
                <div class="gaveta-contenido">
                    <p class="gaveta-linea">✅ Ha seleccionado la mesa #${mesa.id}</p>
                    <p class="gaveta-linea">Valor de entrada: <span class="mesa-valor-gaveta">${mesa.monto}</span> ₽</p>
                    <p class="gaveta-linea">✨ ¡Gracias por jugar con nosotros!</p>
                    <p class="gaveta-linea">Excelente elección</p>
                    <button class="btn-comprar-gaveta" data-mesa-id="${mesa.id}">COMPRAR FICHAS</button>
                    <p class="gaveta-microcopia">(Toque el botón para continuar)</p>
                </div>
            `;
            
            const comprarBtn = gaveta.querySelector('.btn-comprar-gaveta');
            if (comprarBtn) {
                comprarBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    window.location.href = 'https://t.me/mesa_baccarat_bot?start=deposito';
                });
            }
            
            header.addEventListener('click', function(e) {
                if (e.target.closest('.btn-entrar')) return;
                toggleGaveta(this, mesaCard);
            });
            
            mesaCard.appendChild(header);
            mesaCard.appendChild(gaveta);
            mesasLista.appendChild(mesaCard);
        });
        
        console.log(`🎲 Mostradas ${mesasAMostrar.length} mesas`);
    }
    
    // ==================== MANEJADORES DE ACCIONES ====================
    function manejarEntrarMesa(mesaId, montoMesa) {
        console.log(`👆 Mesa #${mesaId} seleccionada (monto mesa: ${montoMesa}₽)`);
    }
    
    // ==================== FILTRO POR MONTO Y SINCRONIZACIÓN ====================
function actualizarInput(valor) {
    montoInput.value = valor;
    actualizarFeedbackMonto();
}

// Manejador para botones rápidos
botonesMonto.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();  // Evita que el clic se propague
        
        // Remover clase activo de todos los botones
        botonesMonto.forEach(b => b.classList.remove('activo'));
        
        // Activar el botón clickeado
        this.classList.add('activo');
        
        const monto = parseInt(this.dataset.monto);
        actualizarInput(monto);
    });
});

// Manejador para input personalizado
montoInput.addEventListener('input', function(e) {
    e.stopPropagation();
    actualizarFeedbackMonto();
    
    const valorActual = parseInt(this.value);
    
    // Sincronizar botones según el valor del input
    botonesMonto.forEach(btn => {
        if (parseInt(btn.dataset.monto) === valorActual) {
            btn.classList.add('activo');
        } else {
            btn.classList.remove('activo');
        }
    });
});

// ==================== VALIDACIÓN Y FEEDBACK DE MONTO ====================
function validarMonto(valor) {
    const num = parseInt(valor);
    
    // Vacío o no numérico
    if (isNaN(num) || valor === '') {
        return { valido: false, mensaje: 'Ingresa un monto' };
    }
    
    // Mínimo 200
    if (num < 200) {
        return { valido: false, mensaje: 'El monto mínimo es 200₽' };
    }
    
    // Múltiplo de 50
    if (num % 50 !== 0) {
        return { valido: false, mensaje: 'El monto debe ser múltiplo de 50' };
    }
    
    return { valido: true, mensaje: '✓ Monto válido' };
}

function actualizarFeedbackMonto() {
    const valor = montoInput.value;
    const resultado = validarMonto(valor);
    const montoActual = !isNaN(parseInt(valor)) ? parseInt(valor) : null;
    
    // Limpiar clases previas
    montoInput.classList.remove('valido-formato', 'valido-con-mesa', 'invalido');
    montoFeedback.classList.remove('valido-formato', 'valido-con-mesa', 'invalido');
    
    // Caso 1: Campo vacío
    if (valor === '') {
        montoFeedback.textContent = '';
        renderizarMesas(null);
        return;
    }
    
    // Caso 2: Formato inválido (no cumple reglas)
    if (!resultado.valido) {
        montoInput.classList.add('invalido');
        montoFeedback.classList.add('invalido');
        montoFeedback.textContent = '❌ ' + resultado.mensaje;
        renderizarMesas(montoActual);
        return;
    }
    
    // Si llegamos aquí, el monto es válido (≥200 y múltiplo de 50)
    
    // Verificar si hay mesa con el monto EXACTO
    const hayMesaExacta = mesas.some(m => m.monto === montoActual && m.jugadores < 6);
    
    if (hayMesaExacta) {
        // Caso 3: Monto válido Y hay mesa exacta
        montoInput.classList.add('valido-con-mesa');
        montoFeedback.classList.add('valido-con-mesa');
        montoFeedback.textContent = '✓ Monto válido';
    } else {
        // Caso 4: Monto válido pero NO hay mesa exacta
        montoInput.classList.add('valido-formato');
        montoFeedback.classList.add('valido-formato');
        
        // Mensaje neutral informativo
        if (montoActual) {
            montoFeedback.textContent = `Con ${montoActual}₽ no hay mesas disponibles. Estas son las opciones:`;
        } else {
            montoFeedback.textContent = '';
        }
    }
    
    renderizarMesas(montoActual);
}
    
    // ==================== GAVETA - COMPORTAMIENTO ====================
    let mesaAbierta = null;
    
    function toggleGaveta(header, mesaCard) {
        const gaveta = mesaCard.querySelector('.mesa-gaveta');
        if (!gaveta) return;
        
        const mesaHeader = mesaCard.querySelector('.mesa-header');
        
        if (mesaAbierta && mesaAbierta !== mesaCard) {
            const gavetaAnterior = mesaAbierta.querySelector('.mesa-gaveta');
            if (gavetaAnterior) {
                gavetaAnterior.style.display = 'none';
                const headerAnterior = mesaAbierta.querySelector('.mesa-header');
                if (headerAnterior) headerAnterior.classList.remove('active');
            }
        }
        
        if (gaveta.style.display === 'none' || !gaveta.style.display) {
            gaveta.style.display = 'block';
            mesaAbierta = mesaCard;
            if (mesaHeader) mesaHeader.classList.add('active');
        } else {
            gaveta.style.display = 'none';
            mesaAbierta = null;
            if (mesaHeader) mesaHeader.classList.remove('active');
        }
    }
    
    // ==================== BOTÓN VOLVER ====================
    const btnVolver = document.getElementById('btn-volver-lobby');
    if (btnVolver) {
        btnVolver.addEventListener('click', function() {
            window.location.href = 'terminos.html';
        });
    }
    
    // ==================== INICIALIZACIÓN ====================
    renderizarMesas();
    actualizarFeedbackMonto();
    
    console.log('✅ Lobby cargado - Modo simulación (datos temporales)');
    if (jugador.esAdmin) {
        console.log('👑 Modo administrador activado');
    }
});