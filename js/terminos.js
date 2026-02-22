// ==================== TÉRMINOS Y CONDICIONES ====================
// Control de scroll, checkbox, navegación y acordeones por inciso
// VERSIÓN PRODUCCIÓN - logs reducidos

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ terminos.js cargado');
    
    // ==================== ELEMENTOS PRINCIPALES ====================
    const checkbox = document.getElementById('checkbox-acepto');
    const btnAceptar = document.getElementById('btn-aceptar');
    
    let haLlegadoAlFinal = false;
    
    // ==================== DETECCIÓN DE SCROLL AL FINAL ====================
    function verificarScroll() {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const margenError = 20; // Ajustado para mejor experiencia en iPhone
        
        const distanciaAlFinal = scrollHeight - (scrollTop + clientHeight);
        
        if (distanciaAlFinal <= margenError && !haLlegadoAlFinal) {
            haLlegadoAlFinal = true;
            checkbox.disabled = false;
        }
    }
    
    // Escuchar scroll en window
    window.addEventListener('scroll', verificarScroll);
    // Verificar inmediatamente por si ya está al final
    setTimeout(verificarScroll, 500);
    
    // ==================== CHECKBOX HABILITA BOTÓN ====================
    checkbox.addEventListener('change', function() {
        btnAceptar.disabled = !checkbox.checked;
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
