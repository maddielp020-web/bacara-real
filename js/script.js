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
contenidoScroll.addEventListener('scroll', function() {
    // Calcular si llegó al final del scroll
    const scrollTop = contenidoScroll.scrollTop;
    const scrollHeight = contenidoScroll.scrollHeight;
    const clientHeight = contenidoScroll.clientHeight;
    
    // Si está a menos de 50px del final, considera que leyó todo
    if (scrollTop + clientHeight >= scrollHeight - 50) {
        haLeidoTodo = true;
        scrollIndicador.style.display = 'none';
        
        // Verificar si puede habilitar el botón
        verificarActivacionBoton();
    }
});

// ==================== DETECTAR CAMBIO EN CHECKBOX ====================
checkboxAcepto.addEventListener('change', function() {
    checkboxMarcado = this.checked;
    
    // Verificar si puede habilitar el botón
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
        
        // Mensaje de ayuda en consola
        if (!haLeidoTodo) {
            console.log('⚠️ Debes leer todo antes de aceptar (desliza hasta el final)');
        }
        if (!checkboxMarcado) {
            console.log('⚠️ Debes marcar el checkbox para aceptar');
        }
    }
}

// ==================== ACCIÓN AL PRESIONAR "ACEPTO" ====================
btnAcepto.addEventListener('click', function() {
    // Verificación de seguridad
    if (!checkboxMarcado) {
        alert('⚠️ Debes marcar el checkbox para continuar');
        return;
    }
    
    if (!haLeidoTodo) {
        alert('⚠️ Debes leer todos los términos antes de aceptar');
        return;
    }
    
    // Guardar en localStorage que aceptó los términos
    localStorage.setItem('terminos_aceptados', 'true');
    localStorage.setItem('fecha_aceptacion', new Date().toISOString());
    
    console.log('✅ Términos aceptados - Redirigiendo a mesa.html');
    
    // Redirigir a la mesa de juego
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
console.log('📋 Sistema de doble verificación activo:');
console.log('   1️⃣ Debe leer todo (scroll hasta el final)');
console.log('   2️⃣ Debe marcar checkbox');
console.log('   ✅ Solo entonces se habilita el botón ACEPTO');
```

---

## ✅ CONFIRMACIÓN - ESTE CÓDIGO TIENE:

1. ✅ `function verificarActivacionBoton()` - Línea 41
2. ✅ Llamada dentro del evento scroll - Línea 31
3. ✅ Llamada dentro del evento checkbox - Línea 39
4. ✅ Variables de estado `haLeidoTodo` y `checkboxMarcado`
5. ✅ Mensajes en consola para debugging
6. ✅ Redirección a `mesa.html`
7. ✅ Sistema de "ya aceptó antes"

---

## 🎯 CÓMO ACTUALIZAR:

1. Abre GitHub → `js/script.js`
2. Editar (lápiz)
3. **CTRL+A** (seleccionar todo) o selecciona manualmente
4. **Borrar todo**
5. **Copiar** el código de arriba
6. **Pegar** en el archivo vacío
7. Commit changes
8. Espera 30 segundos
9. Prueba en: `https://maddielp020-web.github.io/bacara-real/`

---

## 🧪 PRUEBA PASO A PASO:

1. Abre la página
2. **NO hagas scroll** - Solo marca el checkbox
   - ❌ Botón debe seguir gris
3. **Desmarca** el checkbox
4. **Haz scroll hasta el final**
5. El indicador "⬇️ Desliza..." debe desaparecer
6. **Marca el checkbox**
7. ✅ **AHORA SÍ** el botón debe ponerse verde
8. Click en "ACEPTO Y QUIERO JUGAR"
9. Te redirige a `mesa.html`

---

## 📊 EN LA CONSOLA VERÁS:
```
✅ Términos y Condiciones cargados
📋 Sistema de doble verificación activo:
   1️⃣ Debe leer todo (scroll hasta el final)
   2️⃣ Debe marcar checkbox
   ✅ Solo entonces se habilita el botón ACEPTO
⚠️ Debes leer todo antes de aceptar (desliza hasta el final)
⚠️ Debes marcar el checkbox para aceptar
✅ Botón ACEPTO habilitado
✅ Términos aceptados - Redirigiendo a mesa.html