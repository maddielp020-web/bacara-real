// ==================== BIENVENIDA - FUNCIONALIDADES ====================

// ==================== NUEVO: VALIDACIÓN DE ACCESO ====================
document.addEventListener('DOMContentLoaded', function() {
    const codigo = document.getElementById('codigo-input');
    const telefono = document.getElementById('telefono-input');
    const btnVerificar = document.getElementById('btn-verificar');
    
    function verificarCampos() {
        const codigoValido = codigo.value.trim().length >= 4;
        const telefonoValido = telefono.value.trim().length >= 10;
        btnVerificar.disabled = !(codigoValido && telefonoValido);
    }
    
    if (codigo) codigo.addEventListener('input', verificarCampos);
    if (telefono) telefono.addEventListener('input', verificarCampos);
    
    // ==================== BOTÓN TÉRMINOS ====================
    const btnTerminos = document.getElementById('btn-terminos');
    if (btnTerminos) {
        btnTerminos.addEventListener('click', function() {
            window.location.href = 'terminos.html';
        });
    }
});
