// ==================== LOBBY - VERSIÓN ESTABLE ====================
document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== DATOS DE PRUEBA ====================
    const jugador = {
        username: "@antonio",
        saldo: 1250,
        esAdmin: false
    };
    
    const mesas = [
        { id: 1, monto: 700, jugadores: 4, max: 6, estado: "activa" },
        { id: 2, monto: 1000, jugadores: 3, max: 6, estado: "activa" },
        { id: 3, monto: 1200, jugadores: 1, max: 6, estado: "espera" },
        { id: 4, monto: 1500, jugadores: 6, max: 6, estado: "llena" }
    ];
    
    // ==================== ELEMENTOS DEL DOM ====================
    const mesasLista = document.getElementById('mesas-lista');
    const botonesMonto = document.querySelectorAll('.btn-monto');
    const montoInput = document.getElementById('monto-input');
    const montoFeedback = document.getElementById('monto-feedback');
    
    // Mostrar datos del jugador
    document.getElementById('usuario-nombre').textContent = jugador.username;
    document.getElementById('saldo-usuario').textContent = jugador.saldo.toLocaleString();
    
    const adminBadge = document.getElementById('admin-badge');
    if (jugador.esAdmin) adminBadge.style.display = 'inline-block';
    
    // ==================== FUNCIONES ====================
    
    function validarMonto(valor) {
        const num = parseInt(valor);
        if (isNaN(num) || valor === '') return { valido: false, mensaje: 'Ingresa un monto' };
        if (num < 200) return { valido: false, mensaje: 'El monto mínimo es 200₽' };
        if (num % 50 !== 0) return { valido: false, mensaje: 'El monto debe ser múltiplo de 50' };
        return { valido: true, mensaje: '✓ Monto válido' };
    }
    
    function actualizarFeedbackMonto() {
        const valor = montoInput.value;
        const resultado = validarMonto(valor);
        const montoActual = !isNaN(parseInt(valor)) ? parseInt(valor) : null;
        
        // Limpiar clases
        montoInput.classList.remove('valido-formato', 'valido-con-mesa', 'invalido');
        montoFeedback.classList.remove('valido-formato', 'valido-con-mesa', 'invalido');
        
        if (valor === '') {
            montoFeedback.textContent = '';
            renderizarMesas(null);
            return;
        }
        
        if (!resultado.valido) {
            montoInput.classList.add('invalido');
            montoFeedback.classList.add('invalido');
            montoFeedback.textContent = '❌ ' + resultado.mensaje;
            renderizarMesas(montoActual);
            return;
        }
        
        const hayMesaExacta = mesas.some(m => m.monto === montoActual && m.jugadores < 6);
        
        if (hayMesaExacta) {
            montoInput.classList.add('valido-con-mesa');
            montoFeedback.classList.add('valido-con-mesa');
            montoFeedback.textContent = '✓ Monto válido';
        } else {
            montoInput.classList.add('valido-formato');
            montoFeedback.classList.add('valido-formato');
            montoFeedback.textContent = `Con ${montoActual}₽ no hay mesas disponibles. Estas son las opciones:`;
        }
        
        renderizarMesas(montoActual);
    }
    
    function getEstadoInfo(jugadores) {
        if (jugadores === 6) return { color: 'gris', texto: '⚪' };
        if (jugadores === 1) return { color: 'rojo', texto: '🔴' };
        if (jugadores >= 2) return { color: 'verde', texto: '🟢' };
        return { color: 'amarillo', texto: '🟡' };
    }
    
    function renderizarMesas(intencionMonto = null) {
        mesasLista.innerHTML = '';
        
        const mesasActivas = mesas.filter(m => m.jugadores < 6);
        let mesasAMostrar = [];
        
        if (intencionMonto && !isNaN(intencionMonto) && intencionMonto >= 200) {
            const superiores = mesasActivas.filter(m => m.monto >= intencionMonto);
            if (superiores.length > 0) {
                mesasAMostrar = superiores;
            } else {
                const inferiores = mesasActivas.filter(m => m.monto < intencionMonto);
                if (inferiores.length > 0) {
                    inferiores.sort((a, b) => b.monto - a.monto);
                    mesasAMostrar = [inferiores[0]];
                } else {
                    mesasAMostrar = [];
                }
            }
        } else {
            mesasAMostrar = mesasActivas;
        }
        
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
                    console.log(`👆 Mesa #${mesa.id} seleccionada`);
                    toggleGaveta(header, mesaCard);
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
            
            // El header YA NO abre la gaveta (solo el botón)
            header.addEventListener('click', function(e) {
                // No hace nada
            });
            
            mesaCard.appendChild(header);
            mesaCard.appendChild(gaveta);
            mesasLista.appendChild(mesaCard);
        });
        
        console.log(`🎲 Mostradas ${mesasAMostrar.length} mesas`);
    }
    
    // ==================== GAVETA ====================
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
    
    // ==================== FILTRO POR MONTO ====================
    function actualizarInput(valor) {
        montoInput.value = valor;
        actualizarFeedbackMonto();
    }
    
    botonesMonto.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            botonesMonto.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            actualizarInput(parseInt(this.dataset.monto));
        });
    });
    
    montoInput.addEventListener('input', function(e) {
        e.stopPropagation();
        actualizarFeedbackMonto();
        const valorActual = parseInt(this.value);
        botonesMonto.forEach(btn => {
            if (parseInt(btn.dataset.monto) === valorActual) {
                btn.classList.add('activo');
            } else {
                btn.classList.remove('activo');
            }
        });
    });
    
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
    
    console.log('✅ Lobby cargado - Modo simulación');
});