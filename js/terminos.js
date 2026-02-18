// ==================== TÉRMINOS Y CONDICIONES ====================
document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.getElementById('checkbox-acepto');
    const btnAceptar = document.getElementById('btn-aceptar');
    const contenido = document.getElementById('terminos-contenido');
    
    let haLlegadoAlFinal = false;
    
    // Detectar scroll al final
    contenido.addEventListener('scroll', function() {
        const scrollTop = contenido.scrollTop;
        const scrollHeight = contenido.scrollHeight;
        const clientHeight = contenido.clientHeight;
        
        if ((scrollTop + clientHeight) >= (scrollHeight - 20)) {
            if (!haLlegadoAlFinal) {
                haLlegadoAlFinal = true;
                checkbox.disabled = false;
                console.log('✅ Llegaste al final - checkbox habilitado');
            }
        }
    });
    
    // Habilitar botón al marcar checkbox
    checkbox.addEventListener('change', function() {
        btnAceptar.disabled = !checkbox.checked;
        console.log('📌 Checkbox:', checkbox.checked ? 'marcado' : 'desmarcado');
    });
    
    // Navegar a lobby
    btnAceptar.addEventListener('click', function() {
        if (checkbox.checked && haLlegadoAlFinal) {
            console.log('🚀 Navegando a lobby.html');
            window.location.href = 'lobby.html';
        } else {
            console.warn('⚠️ No se cumplen condiciones para navegar');
        }
    });
    
    console.log('✅ terminos.js cargado correctamente');
});

// ==================== ACORDEÓN (NUEVO) ====================
function toggleSeccion(header) {
    // Buscar el contenedor de la sección
    const seccion = header.closest('.terminos-seccion');
    if (!seccion) return;
    
    // Buscar el contenido
    const contenido = seccion.querySelector('.seccion-contenido');
    if (!contenido) return;
    
    // Buscar la flecha
    const flecha = header.querySelector('.seccion-flecha');
    
    // Toggle
    if (contenido.style.display === 'none' || !contenido.style.display) {
        contenido.style.display = 'block';
        header.classList.add('active');
    } else {
        contenido.style.display = 'none';
        header.classList.remove('active');
    }
}

// Inicializar: dejar todos los contenidos ocultos al cargar
// (Esto ya se ejecuta dentro del DOMContentLoaded existente)
// Solo agregamos esto dentro del DOMContentLoaded que ya existe
document.addEventListener('DOMContentLoaded', function() {
    // El código existente ya está, solo agregamos al final:
    const contenidos = document.querySelectorAll('.seccion-contenido');
    contenidos.forEach(contenido => {
        contenido.style.display = 'none';
    });
});
