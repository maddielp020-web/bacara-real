// ==================== TÉRMINOS Y CONDICIONES ====================
// Versión limpia - 1.0 - Sin funciones globales, sin estilos inline
// Control de scroll, checkbox, navegación y acordeones por inciso

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ terminos.js cargado');
    
    // ==================== CONSTANTES ====================
    const MARGEN_ERROR_SCROLL = 20; // Píxeles de tolerancia para "llegó al final"
    
    // ==================== ELEMENTOS DEL DOM ====================
    const elementos = {
        checkbox: document.getElementById('checkbox-acepto'),
        btnAceptar: document.getElementById('btn-aceptar'),
        btnVolver: document.getElementById('btn-volver-terminos'),
        modalCerrar: document.getElementById('modal-cerrar'),
        btnModalNo: document.getElementById('modal-no'),
        btnModalSi: document.getElementById('modal-si'),
        incisosHeaders: document.querySelectorAll('.inciso-header')
    };
    
    // ==================== VARIABLES DE ESTADO ====================
    let haLlegadoAlFinal = false;
    
    // ==================== FUNCIONES AUXILIARES ====================
    function actualizarBotonAceptar() {
        elementos.btnAceptar.disabled = !(haLlegadoAlFinal && elementos.checkbox.checked);
    }
    
    function verificarScroll() {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        
        const distanciaAlFinal = scrollHeight - (scrollTop + clientHeight);
        
        if (distanciaAlFinal <= MARGEN_ERROR_SCROLL && !haLlegadoAlFinal) {
            haLlegadoAlFinal = true;
            actualizarBotonAceptar();
        }
    }
    
    // ==================== ACORDEONES (SIN GLOBALES) ====================
    function toggleInciso(header) {
        if (!header) return;
        
        const inciso = header.closest('.inciso-item');
        if (!inciso) return;
        
        const contenido = inciso.querySelector('.inciso-contenido');
        if (!contenido) return;
        
        // Toggle clase active en header
        header.classList.toggle('active');
        
        // Toggle clase abierto en contenido (CSS maneja display)
        contenido.classList.toggle('abierto');
    }
    
    // Asignar evento a cada header de inciso
    elementos.incisosHeaders.forEach(header => {
        header.addEventListener('click', function(e) {
            toggleInciso(this);
        });
    });
    
    // ==================== SCROLL ====================
    window.addEventListener('scroll', verificarScroll);
    // Verificar posición inicial (por si ya está al final al cargar)
    verificarScroll();
    
    // ==================== CHECKBOX ====================
    elementos.checkbox.addEventListener('change', function() {
        actualizarBotonAceptar();
    });
    
    // ==================== BOTÓN ACEPTAR ====================
    elementos.btnAceptar.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (!elementos.checkbox.checked) {
            return;
        }
        
        if (!haLlegadoAlFinal) {
            alert('Por favor, desliza hasta el final para leer todos los términos antes de aceptar.');
            return;
        }
        
        console.log('✅ Términos aceptados → lobby.html');
        window.location.href = 'lobby.html';
    });
    
    // ==================== BOTÓN VOLVER CON CONFIRMACIÓN ====================
    if (elementos.btnVolver) {
        elementos.btnVolver.addEventListener('click', function() {
            // Mostrar modal de confirmación
            elementos.modalCerrar.classList.remove('oculto');
        });
    }
    
    // ==================== MODAL DE CONFIRMACIÓN ====================
    if (elementos.btnModalNo) {
        elementos.btnModalNo.addEventListener('click', function() {
            elementos.modalCerrar.classList.add('oculto');
        });
    }
    
    if (elementos.btnModalSi) {
        elementos.btnModalSi.addEventListener('click', function() {
            console.log('🔙 Volviendo a Bienvenida');
            window.location.href = 'index.html';
        });
    }
    
    // Cerrar modal si se hace clic fuera del contenido
    elementos.modalCerrar.addEventListener('click', function(e) {
        if (e.target === elementos.modalCerrar) {
            elementos.modalCerrar.classList.add('oculto');
        }
    });
    
    // ==================== INICIALIZACIÓN ====================
    elementos.btnAceptar.disabled = true;
    console.log('✅ Sistema de términos listo');
});