// ==================== LOBBY - DATOS SIMULADOS Y COMPORTAMIENTO ====================
// Versión 1.2 - CON TODOS LOS AJUSTES FUNCIONALES FINALES
// - Mesas ocultas hasta selección de monto
// - Botón ENTRAR deshabilitado sin selección
// - COMPRAR FICHAS redirige directo al bot

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== CONSTANTES ====================
    const URL_COMPRA = 'https://t.me/mesa_baccarat_bot?start=deposito';
    
    const ESTADO_ICONOS = {
        6: '⚪',
        1: '🔴',
        defaultVerde: '🟢',
        defaultAmarillo: '🟡'
    };
    
    // ==================== DATOS DE PRUEBA ====================
    const jugador = {
        username: "@antonio",
        saldo: 0,
        esAdmin: false
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
    
    const adminBadge = document.getElementById('admin-badge');
    if (jugador.esAdmin) {
        adminBadge.classList.remove('oculto');
        console.log('👑 Usuario administrador detectado');
    }
    
    // ==================== ELEMENTOS DEL DOM ====================
    const mesasLista = document.getElementById('mesas-lista');
    const botonesMonto = document.querySelectorAll('.btn-monto');
    const montoInput = document.getElementById('monto-input');
    const montoFeedback = document.getElementById('monto-feedback');
    const errorDiv = document.getElementById('mesas-error');
    
    // ==================== FUNCIONES AUXILIARES ====================
    function getEstadoInfo(jugadores) {
        if (jugadores === 6) return { color: 'gris', texto: ESTADO_ICONOS[6] };
        if (jugadores === 1) return { color: 'rojo', texto: ESTADO_ICONOS[1] };
        if (jugadores >= 2) return { color: 'verde', texto: ESTADO_ICONOS.defaultVerde };
        return { color: 'amarillo', texto: ESTADO_ICONOS.defaultAmarillo };
    }
    
    function validarMonto(valor) {
        const num = parseInt(valor);
        
        if (isNaN(num) || valor === '') {
            return { valido: false, mensaje: 'Ingresa un monto' };
        }
        
        if (num < 200) {
            return { valido: false, mensaje: 'El monto mínimo es 200₽' };
        }
        
        if (num % 50 !== 0) {
            return { valido: false, mensaje: 'El monto debe ser múltiplo de 50' };
        }
        
        return { valido: true, mensaje: '✓ Monto válido' };
    }
    
    function actualizarFeedbackMonto() {
        const valor = montoInput.value;
        const resultado = validarMonto(valor);
        const montoActual = !isNaN(parseInt(valor)) ? parseInt(valor) : null;
        
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
            const headerAnterior = mesaAbierta.querySelector('.mesa-header');
            
            if (gavetaAnterior) {
                gavetaAnterior.classList.remove('abierta');
            }
            if (headerAnterior) {
                headerAnterior.classList.remove('active');
            }
        }
        
        gaveta.classList.toggle('abierta');
        
        if (gaveta.classList.contains('abierta')) {
            mesaAbierta = mesaCard;
            if (mesaHeader) mesaHeader.classList.add('active');
        } else {
            mesaAbierta = null;
            if (mesaHeader) mesaHeader.classList.remove('active');
        }
    }
    
    // ==================== RENDERIZAR MESAS ====================
    function renderizarMesas(intencionMonto = null) {
        mesasLista.innerHTML = '';
        
        const mesasActivas = mesas.filter(m => m.jugadores < 6);
        
        let mesasAMostrar = [];
        
        if (intencionMonto && !isNaN(intencionMonto) && intencionMonto >= 200) {
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
        
        if (mesasAMostrar.length === 0) {
            errorDiv.classList.remove('oculto');
            errorDiv.classList.add('visible');
            errorDiv.innerHTML = '<p>No hay mesas disponibles en este momento</p>';
        } else {
            errorDiv.classList.remove('visible');
            errorDiv.classList.add('oculto');
        }
        
        mesasAMostrar.forEach(mesa => {
            const estadoInfo = getEstadoInfo(mesa.jugadores);
            const esLlena = mesa.jugadores === 6;
            
            const mesaCard = document.createElement('div');
            mesaCard.className = `mesa-card estado-${estadoInfo.color}`;
            mesaCard.dataset.mesaId = mesa.id;
            mesaCard.dataset.monto = mesa.monto;
            
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
                
                // Deshabilitar botón si no hay monto seleccionado
                const montoActual = montoInput.value ? parseInt(montoInput.value) : null;
                if (!montoActual || isNaN(montoActual) || montoActual < 200 || montoActual % 50 !== 0) {
                    entrarBtn.disabled = true;
                }
                
                entrarBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    console.log(`👆 Mesa #${mesa.id} seleccionada (monto mesa: ${mesa.monto}₽)`);
                    
                    // ABRIR LA GAVETA (SOLO AQUÍ, NO EN EL HEADER)
                    const gaveta = mesaCard.querySelector('.mesa-gaveta');
                    const header = mesaCard.querySelector('.mesa-header');
                    
                    if (gaveta) {
                        // Cerrar cualquier otra gaveta abierta
                        if (mesaAbierta && mesaAbierta !== mesaCard) {
                            const gavetaAnterior = mesaAbierta.querySelector('.mesa-gaveta');
                            const headerAnterior = mesaAbierta.querySelector('.mesa-header');
                            
                            if (gavetaAnterior) {
                                gavetaAnterior.classList.remove('abierta');
                            }
                            if (headerAnterior) {
                                headerAnterior.classList.remove('active');
                            }
                        }
                        
                        // Abrir la gaveta actual
                        gaveta.classList.add('abierta');
                        mesaAbierta = mesaCard;
                        if (header) header.classList.add('active');
                    }
                });
                
                accionDiv.appendChild(entrarBtn);
            }
            
            header.appendChild(infoDiv);
            header.appendChild(accionDiv);
            
            const gaveta = document.createElement('div');
            gaveta.className = 'mesa-gaveta';
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
                    // REDIRECCIÓN DIRECTA AL BOT - SIN VALIDACIONES
                    window.location.href = URL_COMPRA;
                });
            }
            
            // ===== ELIMINADO: Event listener del header que abría la gaveta =====
            // Ahora el header NO abre la gaveta
            
            mesaCard.appendChild(header);
            mesaCard.appendChild(gaveta);
            mesasLista.appendChild(mesaCard);
        });
        
        console.log(`🎲 Mostradas ${mesasAMostrar.length} mesas`);
    }
    
    // ==================== FILTRO POR MONTO Y SINCRONIZACIÓN ====================
    function actualizarInput(valor) {
        montoInput.value = valor;
        actualizarFeedbackMonto();
    }
    
    botonesMonto.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            botonesMonto.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            
            const monto = parseInt(this.dataset.monto);
            actualizarInput(monto);
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
    // NO renderizar mesas al inicio (solo feedback de monto)
    actualizarFeedbackMonto();
    // El contenedor de mesas empieza vacío
    mesasLista.innerHTML = '';
    console.log('🔄 Mesas ocultas hasta selección de monto');
    
    console.log('✅ Lobby cargado - Modo simulación');
    if (jugador.esAdmin) {
        console.log('👑 Modo administrador activado');
    }
});