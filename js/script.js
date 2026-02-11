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

## 🔧 CÓMO ACTUALIZAR EN GITHUB:

### **OPCIÓN 1 - Editar el archivo:**
1. Ve a tu repositorio
2. Abre `js/script.js`
3. Toca el ícono del lápiz (editar)
4. **BORRA TODO** el contenido actual
5. **COPIA Y PEGA** el código de arriba
6. Commit changes

### **OPCIÓN 2 - Reemplazar completo:**
1. Elimina `js/script.js`
2. Crea nuevo archivo `js/script.js`
3. Pega el código de arriba
4. Commit

---

## ✅ AHORA EL BOTÓN SE ACTIVARÁ CUANDO:

1. ✅ Deslices hasta el final (scroll completo)
2. ✅ **Y** marques el checkbox

**Ambas condiciones son necesarias.**

---

## 🧪 CÓMO PROBAR:

### **TEST 1 - Solo checkbox:**
1. Abre la página
2. Marca el checkbox SIN hacer scroll
3. **Resultado esperado:** Botón sigue deshabilitado ❌

### **TEST 2 - Solo scroll:**
1. Refresca la página
2. Desliza hasta el final SIN marcar checkbox
3. **Resultado esperado:** Botón sigue deshabilitado ❌

### **TEST 3 - Ambas condiciones:**
1. Refresca la página
2. Desliza hasta el final ✅
3. Marca el checkbox ✅
4. **Resultado esperado:** Botón se activa 🟢 y puedes hacer clic

---

## 📊 MENSAJES EN CONSOLA:

Abre la consola del navegador (Safari en iPhone: Configuración > Safari > Avanzado > Web Inspector) y verás:
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