// ==================== LOBBY - DATOS SIMULADOS Y COMPORTAMIENTO ====================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== DATOS DE PRUEBA ====================
    const jugador = {
        username: "@antonio",
        saldo: 1250,
        esAdmin: false  // cambiar a true para probar botón admin
    };
    
    const mesas = [
        { id: 3, monto: 1000, jugadores: 3, max: 6, estado: "activa" },
        { id: 1, monto: 700, jugadores: 4, max: 6, estado: "activa" },
        { id: 5, monto: 1200, jugadores: 1, max: 6, estado: "espera" },
        { id: 2, monto: 1500, jugadores: 6, max: 6, estado: "llena" }
    ];
    
    // ==================== MOSTRAR DATOS DEL JUGADOR ====================
    document.getElementById('usuario-nombre').textContent = jugador.username;
    document.getElementById('saldo-usuario').textContent = jugador.saldo.toLocaleString();
    
    // Mostrar botón admin solo si es admin
    if (jugador.esAdmin) {
        document.getElementById('btn-admin').style.display = 'block';
    }
    
    // ==================== RENDERIZAR MESAS ====================
    const mesasLista = document.getElementById('mesas-lista');
    
    function getEstadoInfo(estado, jugadores) {
        if (jugadores === 6) return { color: 'gris', texto: '⚪', label: 'LLENA' };
        if (jugadores === 1) return { color: 'rojo', texto: '🔴', label: 'ENTRAR' };
        if (jugadores >= 2) return { color: 'verde', texto: '🟢', label: 'ENTRAR' };
        return { color: 'amarillo', texto: '🟡', label: 'ENTRAR' };
    }
    
    function renderizarMesas(filtroMonto = null) {
        mesasLista.innerHTML = '';
        
        let mesasFiltradas = mesas;
        if (filtroMonto) {
            mesasFiltradas = mesas.filter(m => Math.abs(m.monto - filtroMonto) <= 300);
        }
        
        mesasFiltradas.sort((a, b) => a.monto - b.monto);
        
        mesasFiltradas.forEach(mesa => {
            const estadoInfo = getEstadoInfo(mesa.estado, mesa.jugadores);
            const esLlena = mesa.jugadores === 6;
            
            const mesaCard = document.createElement('div');
            mesaCard.className = `mesa-card estado-${estadoInfo.color}`;
            mesaCard.innerHTML = `
                <div class="mesa-info">
                    <span class="mesa-estado">${estadoInfo.texto}</span>
                    <div class="mesa-detalles">
                        <span class="mesa-numero">MESA #${mesa.id}</span>
                        <span class="mesa-monto">${mesa.monto}₽</span>
                        <span class="mesa-ocupacion">${mesa.jugadores}/${mesa.max}</span>
                    </div>
                </div>
                <div class="mesa-accion">
                    ${esLlena ? 
                        '<span class="btn-llena">LLENA</span>' : 
                        `<button class="btn-entrar" data-mesa-id="${mesa.id}">▶ ENTRAR</button>`
                    }
                </div>
            `;
            
            mesasLista.appendChild(mesaCard);
        });
        
        // Agregar eventos a botones ENTRAR
        document.querySelectorAll('.btn-entrar').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const mesaId = this.dataset.mesaId;
                console.log(`Entrar a mesa #${mesaId}`);
                alert(`[SIMULACIÓN] Entrando a mesa #${mesaId}`);
            });
        });
    }
    
    renderizarMesas();
    
    // ==================== FILTRO POR MONTO ====================
    const botonesMonto = document.querySelectorAll('.btn-monto');
    const montoInput = document.getElementById('monto-input');
    
    botonesMonto.forEach(btn => {
        btn.addEventListener('click', function() {
            // Quitar clase activo de todos
            botonesMonto.forEach(b => b.classList.remove('activo'));
            // Activar este
            this.classList.add('activo');
            
            const monto = parseInt(this.dataset.monto);
            renderizarMesas(monto);
        });
    });
    
    montoInput.addEventListener('input', function() {
        const monto = parseInt(this.value);
        if (monto && monto >= 200) {
            renderizarMesas(monto);
        } else {
            renderizarMesas();
        }
    });
    
    // ==================== BOTONES DE ACCIÓN ====================
    document.getElementById('btn-comprar').addEventListener('click', function() {
        console.log('Comprar fichas');
        alert('[SIMULACIÓN] Abrir pantalla de compra');
    });
    
    const btnAdmin = document.getElementById('btn-admin');
    if (btnAdmin) {
        btnAdmin.addEventListener('click', function() {
            console.log('Panel admin');
            alert('[SIMULACIÓN] Abrir panel de administrador');
        });
    }
});