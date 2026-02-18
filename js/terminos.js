// ==================== TÉRMINOS Y CONDICIONES ====================
// Control de scroll, checkbox, navegación y acordeones por inciso

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ terminos.js cargado correctamente');
    
    // ==================== ELEMENTOS PRINCIPALES ====================
    const checkbox = document.getElementById('checkbox-acepto');
    const btnAceptar = document.getElementById('btn-aceptar');
    
    // El contenedor con scroll (ahora es terminos-contenido)
    const contenido = document.querySelector('.terminos-contenido');
    
    // Si no existe, creamos un wrapper o usamos el body como fallback
    if (!contenido) {
        console.warn('⚠️ No se encontró .terminos-contenido, usando window');
    }
    
    let haLlegadoAlFinal = false;
    
    // ==================== DETECCIÓN DE SCROLL AL FINAL ====================
    function verificarScroll() {
        if (!contenido) return;
        
        const scrollTop = contenido.scrollTop;
        const scrollHeight = contenido.scrollHeight;
        const clientHeight = contenido.clientHeight;
        const margenError = 30; // Un poco más de margen
        
        // Cálculo más robusto
        const distanciaAlFinal = scrollHeight - (scrollTop + clientHeight);
        
        console.log(`📊 Scroll: distancia al final: ${distanciaAlFinal.toFixed(0)}px`);
        
        if (distanciaAlFinal <= margenError) {
            if (!haLlegadoAlFinal) {
                haLlegadoAlFinal = true;
                checkbox.disabled = false;
                console.log('✅ Llegaste al final - checkbox habilitado');
            }
        } else {
            // Si el usuario vuelve a subir, no deshabilitamos, solo registramos
            if (haLlegadoAlFinal) {
                console.log('👆 Usuario subió, pero checkbox sigue habilitado');
            }
        }
    }
    
    // Escuchar scroll si existe el contenedor
    if (contenido) {
        contenido.addEventListener('scroll', verificarScroll);
        // Verificar inmediatamente por si ya está al final
        setTimeout(verificarScroll, 500);
    } else {
        // Fallback: detectar scroll en window
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const distanciaAlFinal = scrollHeight - (scrollTop + clientHeight);
            
            if (distanciaAlFinal <= 30 && !haLlegadoAlFinal) {
                haLlegadoAlFinal = true;
                checkbox.disabled = false;
                console.log('✅ Llegaste al final (window) - checkbox habilitado');
            }
        });
    }
    
    // ==================== CHECKBOX HABILITA BOTÓN ====================
    checkbox.addEventListener('change', function() {
        btnAceptar.disabled = !checkbox.checked;
        console.log('📌 Checkbox:', checkbox.checked ? 'marcado' : 'desmarcado');
    });
    
    // ==================== BOTÓN ACEPTAR - NAVEGACIÓN ====================
    btnAceptar.addEventListener('click', function(e) {
        e.preventDefault(); // Por si acaso
        
        console.log('🖱️ Botón clickeado');
        console.log('Estado - Checkbox:', checkbox.checked, '| Final:', haLlegadoAlFinal);
        
        // Verificaciones
        if (!checkbox.checked) {
            console.warn('⚠️ Checkbox no marcado');
            return;
        }
        
        if (!haLlegadoAlFinal) {
            console.warn('⚠️ No llegó al final del contenido');
            alert('Por favor, desliza hasta el final para leer todos los términos antes de aceptar.');
            return;
        }
        
        // Todo OK, navegar
        console.log('🚀 Navegando a lobby.html');
        
        // Múltiples métodos por compatibilidad
        try {
            window.location.href = 'lobby.html';
        } catch (error) {
            console.error('Error en navegación:', error);
            // Fallback
            window.location.replace('lobby.html');
        }
    });
    
    // ==================== ACORDEÓN POR INCISO ====================
    // Función global para toggle desde onclick en HTML
    window.toggleInciso = function(header) {
        if (!header) return;
        
        // Buscar el contenedor del inciso
        const inciso = header.closest('.inciso-item');
        if (!inciso) return;
        
        // Buscar el contenido
        const contenido = inciso.querySelector('.inciso-contenido');
        if (!contenido) return;
        
        // Toggle clase active en header
        header.classList.toggle('active');
        
        // Toggle display del contenido
        if (contenido.style.display === 'block') {
            contenido.style.display = 'none';
        } else {
            contenido.style.display = 'block';
        }
        
        console.log('🔽 Inciso toggled');
    };
    
    // Inicializar: todos los contenidos ocultos
    const contenidosIncisos = document.querySelectorAll('.inciso-contenido');
    contenidosIncisos.forEach(cont => {
        cont.style.display = 'none';
    });
    
    console.log('✅ Sistema de términos listo. Esperando interacción...');
});

// Backup: función global por si acaso (no interfiere)
window.toggleInciso = window.toggleInciso || function(header) {
    // Ya definida arriba, esto es solo respaldo
};
