// ==================== SCRIPT PARA TÉRMINOS Y CONDICIONES ====================
// Controla: scroll, checkbox, botón aceptar, navegación a mesa.html
// ============================================================================

console.log('✅ script.js cargado correctamente');

// ==================== ESPERAR A QUE EL DOM CARGUE ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM completamente cargado');
    
    // ==================== OBTENER ELEMENTOS ====================
    const contenidoScroll = document.getElementById('contenido-scroll');
    const checkbox = document.getElementById('checkbox-acepto');
    const btnAceptar = document.getElementById('btn-acepto');
    const indicadorScroll = document.getElementById('indicador-scroll');
    
    // Verificar que los elementos existen
    if (!contenidoScroll) {
        console.error('❌ No se encontró #contenido-scroll');
        return;
    }
    if (!checkbox) {
        console.error('❌ No se encontró #checkbox-acepto');
        return;
    }
    if (!btnAceptar) {
        console.error('❌ No se encontró #btn-acepto');
        return;
    }
    
    console.log('✅ Todos los elementos encontrados');
    
    // ==================== VARIABLES DE ESTADO ====================
    let haLlegadoAlFinal = false;
    
    // ==================== DETECCIÓN DE SCROLL AL FINAL ====================
    function verificarScroll() {
        // Altura total del contenido scrollable
        const alturaTotal = contenidoScroll.scrollHeight;
        
        // Altura visible del contenedor
        const alturaVisible = contenidoScroll.clientHeight;
        
        // Posición actual del scroll
        const scrollActual = contenidoScroll.scrollTop;
        
        // Margen de error (20px desde el final)
        const margenError = 20;
        
        // Calcular si llegó al final
        const llegoAlFinal = (scrollActual + alturaVisible) >= (alturaTotal - margenError);
        
        console.log(`📊 Scroll: ${scrollActual + alturaVisible} / ${alturaTotal} - ¿Final? ${llegoAlFinal}`);
        
        if (llegoAlFinal && !haLlegadoAlFinal) {
            // Primera vez que llega al final
            haLlegadoAlFinal = true;
            console.log('🎉 Usuario llegó al final de los términos');
            
            // Habilitar el checkbox
            checkbox.disabled = false;
            
            // Opcional: cambiar apariencia del indicador
            if (indicadorScroll) {
                indicadorScroll.style.opacity = '0';
                indicadorScroll.style.transition = 'opacity 0.5s';
            }
            
            // Opcional: pequeño mensaje
            console.log('✅ Checkbox habilitado');
        }
    }
    
    // Escuchar evento scroll
    contenidoScroll.addEventListener('scroll', verificarScroll);
    
    // Verificar inmediatamente por si ya está al final (poco probable)
    setTimeout(verificarScroll, 500);
    
    // ==================== MANEJAR CHECKBOX ====================
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            console.log('📌 Checkbox marcado - habilitando botón');
            btnAceptar.disabled = false;
        } else {
            console.log('📌 Checkbox desmarcado - deshabilitando botón');
            btnAceptar.disabled = true;
        }
    });
    
    // ==================== MANEJAR BOTÓN ACEPTAR ====================
    btnAceptar.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Verificaciones de seguridad
        if (!checkbox.checked) {
            console.warn('⚠️ Intento de aceptar sin marcar checkbox');
            return;
        }
        
        if (!haLlegadoAlFinal) {
            console.warn('⚠️ Intento de aceptar sin leer todo');
            alert('Por favor, lee todos los términos antes de aceptar.');
            return;
        }
        
        console.log('🚀 Aceptando términos y navegando a mesa.html');
        
        // Navegar a la mesa
        window.location.href = 'mesa.html';
    });
    
    // ==================== ESTADO INICIAL ====================
    console.log('🏁 Estado inicial:');
    console.log(`- Checkbox deshabilitado? ${checkbox.disabled}`);
    console.log(`- Botón deshabilitado? ${btnAceptar.disabled}`);
    console.log(`- ¿Llegó al final? ${haLlegadoAlFinal}`);
    
    // ==================== VERIFICACIÓN FINAL ====================
    console.log('✅ Sistema de términos listo. Esperando scroll...');
});
