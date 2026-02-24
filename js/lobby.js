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
    const mesasError = document.getElementById('mesas-error');
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
    
    // NOTA: La validación de saldo se hace al intentar entrar a una mesa
    // porque el problema puede ser falta de mesas, no falta de saldo
    
    return { valido: true, mensaje: '✓ Monto válido' };
}
    
    // ==================== RENDERIZAR MESAS ====================
    function getEstadoInfo(jugadores) {
        if (jugadores === 6) return { color: 'gris', texto: '⚪' };
        if (jugadores === 1) return { color: 'rojo', texto: '🔴' };
        if (jugadores >= 2) return { color: 'verde', texto: '🟢' };
        return { color: 'amarillo', texto: '🟡' };
    }
    
    function encontrarMesaCercana(montoObjetivo) {
        // Buscar la mesa más cercana al monto objetivo (puede ser inferior o superior)
        let mesaCercana = null;
        let menorDiferencia = Infinity;
        
        mesas.forEach(mesa => {
            // Solo considerar mesas activas (no llenas) para sugerencia
            if (mesa.jugadores < 6) {
                const diferencia = Math.abs(mesa.monto - montoObjetivo);
                if (diferencia < menorDiferencia) {
                    menorDiferencia = diferencia;
                    mesaCercana = mesa;
                }
            }
        });
        
        return mesaCercana;
    }
    
    function renderizarMesas(filtroMonto = null) {
        mesasLista.innerHTML = '';
        mesasError.style.display = 'none';
        mesasError.innerHTML = '';
        
        // PASO 1: Filtrar mesas según disponibilidad para no-admins
        let mesasVisibles = [...mesas];
        
        if (!jugador.esAdmin) {
            // Filtro activado: no-admins no ven mesas llenas
            mesasVisibles = mesas.filter(m => m.jugadores < 6); // Ocultar llenas
            console.log('👤 Modo jugador normal - ocultando mesas llenas');
        } else {
            console.log('👑 Modo admin - mostrando todas las mesas');
        }
        
        // PASO 2: Aplicar filtro por monto (solo mesas >= monto seleccionado)
        let mesasFiltradas = mesasVisibles;
        if (filtroMonto && filtroMonto >= 200) {
            // REGLA DE NEGOCIO: Solo mostrar mesas con valor IGUAL O SUPERIOR al seleccionado
            mesasFiltradas = mesasVisibles.filter(m => m.monto >= filtroMonto);
            
            // PASO 3: Si no hay mesas disponibles con ese criterio
            if (mesasFiltradas.length === 0) {
                // Buscar la mesa más cercana (excepción a la regla)
                const mesaCercana = encontrarMesaCercana(filtroMonto);
                
                if (mesaCercana) {
                    // Mostrar mensaje de error con sugerencia
                    mesasError.style.display = 'block';
                    mesasError.innerHTML = `
                        <p>No hay mesas disponibles para el monto seleccionado (${filtroMonto}).</p>
                        <div class="mesa-sugerida" data-mesa-id="${mesaCercana.id}" data-mesa-monto="${mesaCercana.monto}">
                            <div class="sugerida-info">
                                <span class="sugerida-titulo">MESA #${mesaCercana.id}</span>
                                <span class="sugerida-detalle">Valor: ${mesaCercana.monto}₽ • ${mesaCercana.jugadores}/${mesaCercana.max} jugadores</span>
                            </div>
                            <button class="sugerida-accion">SELECCIONAR</button>
                        </div>
                    `;
                    
                    // Agregar evento al botón de sugerencia
                    const sugerencia = mesasError.querySelector('.mesa-sugerida');
                    if (sugerencia) {
                        sugerencia.addEventListener('click', function() {
                            const mesaId = this.dataset.mesaId;
                            const mesaMonto = parseInt(this.dataset.mesaMonto);
                            manejarEntrarMesa(parseInt(mesaId), mesaMonto);
                        });
                    }
                    
                    // No mostrar mesas adicionales
                    mesasFiltradas = [];
                }
            }
        }
        
        // Ordenar por monto ascendente
        mesasFiltradas.sort((a, b) => a.monto - b.monto);
        
        // Verificar si hay un monto válido seleccionado para habilitar botones
        const montoActual = parseInt(montoInput.value);
        const montoValido = !isNaN(montoActual) && montoActual >= 200 && montoActual % 50 === 0 && montoActual <= jugador.saldo;
        
        mesasFiltradas.forEach(mesa => {
            const estadoInfo = getEstadoInfo(mesa.jugadores);
            const esLlena = mesa.jugadores === 6;
            
            const mesaCard = document.createElement('div');
            mesaCard.className = `mesa-card estado-${estadoInfo.color}`;
            mesaCard.dataset.mesaId = mesa.id;
            
            // Header de la mesa
            const header = document.createElement('div');
            header.className = 'mesa-header';
            
            // Info izquierda
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
            
            // Botón Entrar
            const accionDiv = document.createElement('div');
            accionDiv.className = 'mesa-accion';
            
            if (esLlena) {
                accionDiv.innerHTML = '<span class="btn-llena">LLENA</span>';
            } else {
                const entrarBtn = document.createElement('button');
                entrarBtn.className = 'btn-entrar';
                entrarBtn.textContent = '▶ ENTRAR';
                entrarBtn.dataset.mesaId = mesa.id;
                
                // Deshabilitar si no hay monto válido
                if (!montoValido) {
                    entrarBtn.disabled = true;
                }
                
                entrarBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    manejarEntrarMesa(mesa.id, mesa.monto);
                });
                
                accionDiv.appendChild(entrarBtn);
            }
            
            header.appendChild(infoDiv);
            header.appendChild(accionDiv);
            
            // Gaveta
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
                    manejarComprarFichas(mesa.id, mesa.monto);
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
    }
    
    // ==================== MANEJADORES DE ACCIONES ====================
    function manejarEntrarMesa(mesaId, montoMesa) {
    const montoSeleccionado = parseInt(montoInput.value);
    const validacion = validarMonto(montoSeleccionado);
    
    if (!validacion.valido) {
        alert('❌ ' + validacion.mensaje);
        return;
    }
    
    // Validar saldo AQUÍ (después de validar el monto)
    if (montoSeleccionado > jugador.saldo) {
        alert('❌ Saldo insuficiente para este monto');
        return;
    }
    
    console.log(`✅ Entrando a mesa #${mesaId} con monto ${montoSeleccionado}₽`);
    
    sessionStorage.setItem('mesaId', mesaId);
    sessionStorage.setItem('montoJugada', montoSeleccionado);
    sessionStorage.setItem('mesaMonto', montoMesa);
    
    window.location.href = 'mesa.html';
}
    
    function manejarComprarFichas(mesaId, montoMesa) {
        const montoSeleccionado = parseInt(montoInput.value);
        const validacion = validarMonto(montoSeleccionado);
        
        if (!validacion.valido) {
            alert('❌ ' + validacion.mensaje);
            return;
        }
        
        console.log(`✅ Comprando fichas para mesa #${mesaId} con monto ${montoSeleccionado}₽`);
        
        sessionStorage.setItem('mesaId', mesaId);
        sessionStorage.setItem('montoJugada', montoSeleccionado);
        sessionStorage.setItem('mesaMonto', montoMesa);
        
        window.location.href = 'mesa.html';
    }
    
    // ==================== FILTRO POR MONTO Y SINCRONIZACIÓN ====================
    function actualizarInput(valor) {
        montoInput.value = valor;
        actualizarFeedbackMonto();
    }
    
    botonesMonto.forEach(btn => {
        btn.addEventListener('click', function() {
            botonesMonto.forEach(b => b.classList.remove('activo'));
            this.classList.add('activo');
            
            const monto = parseInt(this.dataset.monto);
            actualizarInput(monto);
        });
    });
    
    montoInput.addEventListener('input', function() {
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
    
    // ==================== GAVETA - COMPORTAMIENTO ====================
    let mesaAbierta = null;
    
    function toggleGaveta(header, mesaCard) {
        const gaveta = mesaCard.querySelector('.mesa-gaveta');
        if (!gaveta) return;
        
        if (mesaAbierta && mesaAbierta !== mesaCard) {
            const gavetaAnterior = mesaAbierta.querySelector('.mesa-gaveta');
            if (gavetaAnterior) {
                gavetaAnterior.style.display = 'none';
            }
        }
        
        if (gaveta.style.display === 'none' || !gaveta.style.display) {
            gaveta.style.display = 'block';
            mesaAbierta = mesaCard;
        } else {
            gaveta.style.display = 'none';
            mesaAbierta = null;
        }
    }
    
    // ==================== INICIALIZACIÓN ====================
    renderizarMesas();
    actualizarFeedbackMonto();
    
    console.log('✅ Lobby cargado - Modo simulación (datos temporales)');
    if (jugador.esAdmin) {
        console.log('👑 Modo administrador activado');
    }
});
