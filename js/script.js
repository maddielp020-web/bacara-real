// ==================== TÉRMINOS Y CONDICIONES - JAVASCRIPT ====================

// ELEMENTOS DEL DOM
const contenidoScroll = document.getElementById('contenido-scroll');
const scrollIndicador = document.getElementById('scroll-indicador');
const checkboxAcepto = document.getElementById('checkbox-acepto');
const btnAcepto = document.getElementById('btn-acepto');

// ==================== DETECTAR SCROLL COMPLETO ====================
let haLeidoTodo = false;

contenidoScroll.addEventListener('scroll', function() {
    // Calcular si llegó al final del scroll
    const scrollTop = contenidoScroll.scrollTop;
    const scrollHeight = contenidoScroll.scrollHeight;
    const clientHeight = contenidoScroll.clientHeight;
    
    // Si está a menos de 50px del final, considera que leyó todo
    if (scrollTop + clientHeight >= scrollHeight - 50) {
        haLeidoTodo = true;
        scrollIndicador.style.display = 'none';
    }
});

// ==================== HABILITAR BOTÓN AL MARCAR CHECKBOX ====================
checkboxAcepto.addEventListener('change', function() {
    if (this.checked) {
        btnAcepto.disabled = false;
    } else {
        btnAcepto.disabled = true;
    }
});

// ==================== ACCIÓN AL PRESIONAR "ACEPTO" ====================
btnAcepto.addEventListener('click', function() {
    // Verificar que el checkbox esté marcado
    if (!checkboxAcepto.checked) {
        alert('⚠️ Debes aceptar los términos para continuar');
        return;
    }
    
    // Guardar en localStorage que aceptó los términos
    localStorage.setItem('terminos_aceptados', 'true');
    localStorage.setItem('fecha_aceptacion', new Date().toISOString());
    
    // Redirigir a la mesa de juego
    // NOTA: Cambiar 'mesa.html' por el nombre de tu archivo de juego
    window.location.href = 'mesa.html';
});

// ==================== VERIFICAR SI YA ACEPTÓ ANTES ====================
window.addEventListener('load', function() {
    const yaAcepto = localStorage.getItem('terminos_aceptados');
    
    // Si ya aceptó antes, mostrar opción de ir directo al juego
    if (yaAcepto === 'true') {
        const fechaAceptacion = localStorage.getItem('fecha_aceptacion');
        
        // Crear botón alternativo
        const divAlternativo = document.createElement('div');
        divAlternativo.style.cssText = 'background: rgba(34,197,94,0.1); border: 2px solid #22c55e; border-radius: 10px; padding: 15px; margin: 15px 20px; text-align: center;';
        divAlternativo.innerHTML = `
            <p style="color: #22c55e; margin-bottom: 10px; font-size: 14px;">
                ✅ Ya aceptaste los términos anteriormente
            </p>
            <button onclick="window.location.href='mesa.html'" style="background: #22c55e; border: none; color: white; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">
                🎮 IR DIRECTAMENTE AL JUEGO
            </button>
        `;
        
        // Insertar después del header
        const header = document.querySelector('.header');
        header.after(divAlternativo);
    }
});

// ==================== CONSOLA INFO ====================
console.log('✅ Términos y Condiciones cargados');
console.log('📋 Sistema de scroll detectado');
console.log('🔒 Sistema de aceptación activado');
```

---

## 📁 ESTRUCTURA DE CARPETAS PARA GITHUB:
```
tu-repositorio/
├── index.html          (Archivo 1)
├── css/
│   └── styles.css     (Archivo 2)
├── js/
│   └── script.js      (Archivo 3)
└── mesa.html          (Lo crearás en Fase 2)