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
