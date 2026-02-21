// ==================== LOBBY - DATOS SIMULADOS Y COMPORTAMIENTO ====================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== DATOS DE PRUEBA ====================
    const jugador = {
        username: "@antonio",
        saldo: 1250,
        esAdmin: false  // cambiar a true para probar botón admin
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
    
    // ==================== RENDERIZAR MESAS ====================
    const mesasLista = document.getElementById('mesas-lista');
    
    function getEstadoInfo(jugadores) {
        if (jugadores === 6) return { color: 'gris', texto: '⚪' };
        if (jugadores === 1) return { color: 'rojo', texto: '🔴' };
        if (jugadores >= 2) return { color: 'verde', texto: '🟢' };
        return { color: 'amarillo', texto: '🟡' };
    }
    
    function renderizarMesas(filtroMonto = null) {
        mesasLista.innerHTML = '';
        
        let mesasFiltradas = mesas;
        if (filtroMonto) {
            mesasFiltradas = mesas.filter(m => Math.abs(m.monto - filtroMonto) <= 300);
        }
        
        mesasFiltradas.sort((a, b) => a.monto - b.monto);
        
        mesasFiltradas.forEach(mesa => {
            const estadoInfo = getEstadoInfo(mesa.jugadores);
            const esLlena = mesa.jugadores === 6;
            
            const mesaCard = document.createElement('div');
            mesaCard.className = `mesa-card estado-${estadoInfo.color}`;
            mesaCard.dataset.mesaId = mesa.id;
            
            // Header de la mesa (click para abrir gaveta)
            const header = document.createElement('div');
            header.className = 'mesa-header';
            header.setAttribute('onclick', 'toggleGaveta(this)');
            
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
                entrarBtn.addEventListener('click', function(e) {
                    e.stopPropagation(); // Evita que se abra la gaveta
                    console.log(`Entrar a mesa #${mesa.id}`);
                    alert(`[SIMULACIÓN] Entrando a mesa #${mesa.id}`);
                });
                accionDiv.appendChild(entrarBtn);
            }
            
            header.appendChild(infoDiv);
            header.appendChild(accionDiv);
            
            // Gaveta (oculta por defecto)
            const gaveta = document.createElement('div');
            gaveta.className = 'mesa-gaveta';
            gaveta.style.display = 'none';
            gaveta.innerHTML = `
                <div class="gaveta-contenido">
                    <p class="gaveta-linea">✅ Ha seleccionado la mesa #${mesa.id}</p>
                    <p class="gaveta-linea">Valor de entrada: <span class="mesa-valor-gaveta">${mesa.monto}</span> ₽</p>
                    <p class="gaveta-linea">✨ ¡Gracias por jugar con nosotros!</p>
                    <p class="gaveta-linea">Excelente elección</p>
                    <button class="btn-comprar-gaveta" onclick="comprarFichas(this, ${mesa.id})">COMPRAR FICHAS</button>
                    <p class="gaveta-microcopia">(Toque el botón para continuar)</p>
                </div>
            `;
            
            mesaCard.appendChild(header);
            mesaCard.appendChild(gaveta);
            mesasLista.appendChild(mesaCard);
        });
    }
    
    renderizarMesas();
    
    // ==================== FILTRO POR MONTO Y SINCRONIZACIÓN CON INPUT ====================
    const botonesMonto = document.querySelectorAll('.btn-monto');
    const montoInput = document.getElementById('monto-input');
    
    function actualizarInput(valor) {
        montoInput.value = valor;
        // Disparar evento input para que se filtre
        const event = new Event('input', { bubbles: true });
        montoInput.dispatchEvent(event);
    }
    
    botonesMonto.forEach(btn => {
        btn.addEventListener('click', function() {
            // Quitar clase activo de todos
            botonesMonto.forEach(b => b.classList.remove('activo'));
            // Activar este
            this.classList.add('activo');
            
            const monto = parseInt(this.dataset.monto);
            actualizarInput(monto);
        });
    });
    
    montoInput.addEventListener('input', function() {
        const monto = parseInt(this.value);
        if (monto && monto >= 200) {
            renderizarMesas(monto);
        } else {
            renderizarMesas();
        }
        
        // Sincronizar botones: si el valor coincide con algún botón, activarlo
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
    
    window.toggleGaveta = function(element) {
        const mesaCard = element.closest('.mesa-card');
        if (!mesaCard) return;
        
        const gaveta = mesaCard.querySelector('.mesa-gaveta');
        if (!gaveta) return;
        
        // Cerrar otra gaveta abierta
        if (mesaAbierta && mesaAbierta !== mesaCard) {
            const gavetaAnterior = mesaAbierta.querySelector('.mesa-gaveta');
            if (gavetaAnterior) {
                gavetaAnterior.style.display = 'none';
            }
        }
        
        // Abrir/cerrar la actual
        if (gaveta.style.display === 'none' || !gaveta.style.display) {
            gaveta.style.display = 'block';
            mesaAbierta = mesaCard;
        } else {
            gaveta.style.display = 'none';
            mesaAbierta = null;
        }
    };
    
    window.comprarFichas = function(button, mesaId) {
        const mesaCard = button.closest('.mesa-card');
        if (!mesaCard) return;
        
        const mesaNumero = mesaCard.querySelector('.mesa-numero')?.textContent || 'desconocida';
        const mesaValor = mesaCard.querySelector('.mesa-monto')?.textContent || '0';
        
        console.log(`✅ Comprar fichas para ${mesaNumero} - Valor: ${mesaValor}`);
        alert(`[SIMULACIÓN] Comprar fichas para ${mesaNumero} - Valor: ${mesaValor}`);
        
        button.style.transform = 'scale(0.98)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    };
    
    // Inicializar gavetas cerradas (por si acaso)
    document.querySelectorAll('.mesa-gaveta').forEach(g => g.style.display = 'none');
});