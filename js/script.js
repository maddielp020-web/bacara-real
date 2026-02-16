// ==================== SCRIPT.JS - NAVEGACIÓN A MESA ====================
// ========== 1. INICIALIZACIÓN TELEGRAM WEBAPP ==========
console.log('🎮 Bacará Real - Inicializando...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM cargado');
    
    // Telegram WebApp (si está disponible)
    if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.ready();
        console.log('✅ Telegram WebApp detectado');
    }
    
    inicializarAceptacion();
});

// ========== 2. CONTROL DE CHECKBOX + BOTÓN ==========
function inicializarAceptacion() {
    const checkbox = document.getElementById('checkbox-acepto');
    const boton = document.getElementById('btn-acepto');
    
    if (!checkbox || !boton) {
        console.error('❌ Elementos no encontrados:', {checkbox: !!checkbox, boton: !!boton});
        return;
    }
    
    console.log('✅ Checkbox y botón encontrados');
    
    // Activar botón al marcar checkbox
    checkbox.addEventListener('change', function() {
        boton.disabled = !this.checked;
        console.log('🔘 Checkbox:', this.checked ? 'MARCADO' : 'DESMARCADO');
        console.log('🔘 Botón:', boton.disabled ? 'DESACTIVADO' : 'ACTIVO');
    });
    
    // Navegación al hacer clic
    boton.addEventListener('click', function() {
        console.log('🚀 Botón ACEPTAR presionado');
        abrirMesa();
    });
    
    console.log('✅ Sistema de aceptación inicializado');
}

// ========== 3. NAVEGACIÓN A MESA.HTML ==========
function abrirMesa() {
    console.log('🎯 Abriendo mesa.html...');
    
    const mesaUrl = 'mesa.html';
    
    // Prioridad 1: Telegram WebApp (mantener en mini-app)
    if (window.Telegram?.WebApp?.openLink) {
        console.log('📱 Usando Telegram.WebApp.openLink');
        window.Telegram.WebApp.openLink(mesaUrl);
        return;
    }
    
    // Prioridad 2: Navegación nativa (funciona en todos los dispositivos)
    console.log('🌐 Usando window.location.href');
    window.location.href = mesaUrl;
    
    // Fallback de emergencia (3 segundos)
    setTimeout(() => {
        console.error('⏰ EMERGENCIA: Redirección manual');
        window.location.replace('mesa.html');
    }, 3000);
}

// ========== 4. VERIFICACIÓN VISUAL ==========
console.log('✅ script.js cargado correctamente');
console.log('🎮 Listo para aceptar términos → mesa.html');