// ==================== TÉRMINOS Y CONDICIONES ====================
// Control de scroll, checkbox, navegación y acordeones por inciso
// VERSIÓN PRODUCCIÓN - logs reducidos

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ terminos.js cargado');
    
    // ==================== ELEMENTOS PRINCIPALES ====================
    const checkbox = document.getElementById('checkbox-acepto');
    const btnAceptar = document.getElementById('btn-aceptar');
    
    let haLlegadoAlFinal = false;
    
    // Asegurar estado inicial
    btnAceptar.disabled = true; // Siempre deshabilitado al inicio
    checkbox.disabled = false; // El checkbox siempre debe estar habilitado
    
    // ==================== BOTONES DE NAVEGACIÓN ====================
    const btnVolver = document.getElementById('btn-volver-terminos');
    const btnCerrar = document.getElementById('btn-cerrar-terminos');
    const modalCerrar = document.getElementById('modal-cerrar');
    const modalSi = document.getElementById('modal-si');
    const modalNo = document.getElementById('modal-no');
    
    // Botón volver atrás
    if (btnVolver) {
        btnVolver.addEventListener('click', function() {
            console.log('🔙 Volviendo a Bienvenida');
            window.location.href = 'index.html';
        });
    }
    
    // Botón cerrar - abre modal
    if (btnCerrar) {
        btnCerrar.addEventListener('click', function() {
            console.log('❓ Abriendo modal de confirmación');
            if (modalCerrar) {
                modalCerrar.style.display = 'flex';
            }
        });
    }
    
    // Modal - botón NO
    if (modalNo) {
        modalNo.addEventListener('click', function() {
            console.log('❌ Cierre cancelado');
            if (modalCerrar) {
                modalCerrar.style.display = 'none';
            }
        });
    }
    
    // Modal - botón SÍ
    if (modalSi) {
        modalSi.addEventListener('click', function() {
            console.log('🔴 Cerrando miniapp de Telegram');
            
            // Cerrar modal primero (por si acaso)
            if (modalCerrar) {
                modalCerrar.style.display = 'none';
            }
            
            // Intentar cerrar Telegram
            if (window.Telegram && Telegram.WebApp) {
                Telegram.WebApp.close();
            } else {
                // Fallback para pruebas
                console.log('⚠️ Modo desarrollo: no se puede cerrar Telegram');
                alert('✅ En Telegram real, esto cerraría la app');
            }
        });
    }
    
    // Cerrar modal si se hace clic en el overlay (opcional)
    if (modalCerrar) {
        modalCerrar.addEventListener('click', function(e) {
            if (e.target === modalCerrar) {
                modalCerrar.style.display = 'none';
            }
        });
    }
    
    // ==================== DETECCIÓN DE SCROLL AL FINAL ====================
    function verificarScroll() {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const margenError = 20; // Ajustado para mejor experiencia en iPhone
        
        const distanciaAlFinal = scrollHeight - (scrollTop + clientHeight);
        
        if (distanciaAlFinal <= margenError && !haLlegadoAlFinal) {
            haLlegadoAlFinal = true;
            // Actualizar estado del botón por si el checkbox ya estaba marcado
            btnAceptar.disabled = !(haLlegadoAlFinal && checkbox.checked);
        }
    }
    
    // Escuchar scroll en window
    window.addEventListener('scroll', verificarScroll);
    // Verificar inmediatamente por si ya está al final
    setTimeout(verificarScroll, 500);
    
    // ==================== CHECKBOX HABILITA BOTÓN (SOLO SI YA LLEGÓ AL FINAL) ====================
    checkbox.addEventListener('change', function() {
        // Solo habilitar botón si ha llegado al final Y el checkbox está marcado
        btnAceptar.disabled = !(haLlegadoAlFinal && checkbox.checked);
    });
    
    // ==================== BOTÓN ACEPTAR - NAVEGACIÓN ====================
    btnAceptar.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!checkbox.checked) {
            return;
        }
        
        if (!haLlegadoAlFinal) {
            alert('Por favor, desliza hasta el final para leer todos los términos antes de aceptar.');
            return;
        }
        
        // Navegación directa
        window.location.href = 'lobby.html';
    });
    
    // ==================== ACORDEÓN POR INCISO ====================
    window.toggleInciso = function(header) {
        if (!header) return;
        
        const inciso = header.closest('.inciso-item');
        if (!inciso) return;
        
        const contenido = inciso.querySelector('.inciso-contenido');
        if (!contenido) return;
        
        header.classList.toggle('active');
        
        if (contenido.style.display === 'block') {
            contenido.style.display = 'none';
        } else {
            contenido.style.display = 'block';
        }
    };
    
    // Inicializar: todos los contenidos ocultos
    const contenidosIncisos = document.querySelectorAll('.inciso-contenido');
    contenidosIncisos.forEach(cont => {
        cont.style.display = 'none';
    });
    
    console.log('✅ Sistema de términos listo');
});