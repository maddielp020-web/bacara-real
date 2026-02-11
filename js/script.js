// ==================== TÉRMINOS Y CONDICIONES - JAVASCRIPT ====================

// ELEMENTOS DEL DOM
const contenidoScroll = document.getElementById('contenido-scroll');
const scrollIndicador = document.getElementById('scroll-indicador');
const checkboxAcepto = document.getElementById('checkbox-acepto');
const btnAcepto = document.getElementById('btn-acepto');

// ==================== VARIABLES DE ESTADO ====================
let haLeidoTodo = false;
let checkboxMarcado = false;

// ==================== DETECTAR SCROLL COMPLETO ====================
contenidoScroll.addEventListener('scroll', function () {
    const scrollTop = contenidoScroll.scrollTop;
    const scrollHeight = contenidoScroll.scrollHeight;
    const clientHeight = contenidoScroll.clientHeight;

    // Si está a menos de 50px del final, consideramos que leyó todo
    if (scrollTop + clientHeight >= scrollHeight - 50) {
        haLeidoTodo = true;
        if (scrollIndicador) {
            scrollIndicador.style.display = 'none';
        }
        verificarActivacionBoton();
    }
});

// ==================== DETECTAR CAMBIO EN CHECKBOX ====================
checkboxAcepto.addEventListener('change', function () {
    checkboxMarcado = this.checked;
    verificarActivacionBoton();
});

// ==================== VERIFICAR SI PUEDE ACTIVAR BOTÓN ====================
function verificarActivacionBoton() {
    // El botón se activa SOLO si:
    // 1. Ha leído todo (scroll completo)
    // 2. Y el checkbox está marcado
    if (haLeidoTodo && checkboxMarcado) {
        btnAcepto.disabled = false;
        console.log('✅ Botón ACEPTO habilitado');
    } else {
        btnAcepto.disabled = true;

        if (!haLeidoTodo) {
            console.log('⚠️ Debes leer todo antes de aceptar (desliza hasta el final)');
        }
        if (!checkboxMarcado) {
            console.log('⚠️ Debes marcar el checkbox para aceptar');
        }
    }
}

// ==================== ACCIÓN AL PRESIONAR "ACEPTO" ====================
btnAcepto.addEventListener('click', function () {
    if (!checkboxMarcado) {
        alert('⚠️ Debes marcar el checkbox para continuar');
        return;
    }

    if (!haLeidoTodo) {
        alert('⚠️ Debes leer todos los términos antes de aceptar');
        return;
    }

    localStorage.setItem('terminos_aceptados', 'true');
    localStorage.setItem('fecha_aceptacion', new Date().toISOString());

    console.log('✅ Términos aceptados - Redirigiendo a mesa.html');

    window.location.href = 'mesa.html';
});

// ==================== VERIFICAR SI YA ACEPTÓ ANTES ====================
window.addEventListener('load', function () {
    const yaAcepto = localStorage.getItem('terminos_aceptados');

    if (yaAcepto === 'true') {
        const fechaAceptacion = localStorage.getItem('fecha_aceptacion');

        const divAlternativo = document.createElement('div');
        divAlternativo.style.cssText =
            'background: rgba(34,197,94,0.1); border: 2px solid #22c55e; border-radius: 10px; padding: 15px; margin: 15px 20px; text-align: center;';
        divAlternativo.innerHTML = `
            <p style="color: #22c55e; margin-bottom: 10px; font-size: 14px;">
                ✅ Ya aceptaste los términos anteriormente<br>
                <span style="font-size: 12px; color: #9ca3af;">${fechaAceptacion ? 'Fecha: ' + fechaAceptacion : ''}</span>
            </p>
            <button onclick="window.location.href='mesa.html'" style="background: #22c55e; border: none; color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                🎮 IR DIRECTAMENTE AL JUEGO
            </button>
        `;

        const header = document.querySelector('.header');
        if (header) {
            header.after(divAlternativo);
        }
    }
});

// ==================== CONSOLA INFO ====================
console.log('✅ Términos y Condiciones cargados');
console.log('📋 Sistema de doble verificación activo:');
console.log('   1️⃣ Debe leer todo (scroll hasta el final)');
console.log('   2️⃣ Debe marcar checkbox');
console.log('   ✅ Solo entonces se habilita el botón ACEPTO');
