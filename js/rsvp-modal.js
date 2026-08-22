/**
 * Gestor del Modal de Confirmación de Asistencia (RSVP)
 * Guarda los datos en Google Sheets y genera enlace directo a WhatsApp.
 */

(function () {
  const rsvpModal = document.getElementById('rsvp-modal');
  const openModalBtns = document.querySelectorAll('.js-open-rsvp');
  const closeModalBtns = document.querySelectorAll('.js-close-rsvp');
  const rsvpForm = document.getElementById('rsvp-form');

  // Configuración de WhatsApp oficial para confirmación de asistencia
  const WHATSAPP_PHONE = '59176185040'; // +591 76185040

  // 🔴 REEMPLAZA ESTA URL CON TU URL DE GOOGLE APPS SCRIPT OBTENIDA EN EL PASO 3 🔴
  const GOOGLE_SCRIPT_URL = https://script.google.com/macros/s/AKfycbyo-v_T5JNGVTsFtmExZr5SyxVxHfjSr1vgfpni6jtih_vHfjhacDrbXtScU4lCN4Q/exec;

  function openModal() {
    if (!rsvpModal) return;
    rsvpModal.classList.add('modal-active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!rsvpModal) return;
    rsvpModal.classList.remove('modal-active');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  // Cerrar al hacer clic fuera del card o presionar ESC
  if (rsvpModal) {
    rsvpModal.addEventListener('click', (e) => {
      if (e.target === rsvpModal) {
        closeModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rsvpModal && rsvpModal.classList.contains('modal-active')) {
      closeModal();
    }
  });

  // Enviar a Google Sheets y redirigir a WhatsApp
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('rsvp-name').value.trim();
      const attendance = document.getElementById('rsvp-attendance').value;
      const guests = document.getElementById('rsvp-guests').value;
      const message = document.getElementById('rsvp-message').value.trim();

      if (!name) {
        alert('Por favor ingresa tu nombre completo.');
        return;
      }

      // Deshabilitar botón y mostrar indicador de carga
      const submitBtn = rsvpForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>⏳ Guardando confirmación...</span>';

      // 1. Estructura de datos para Google Sheets
      const sheetData = {
        nombre: name,
        asistencia: attendance,
        invitados: guests,
        mensaje: message
      };

      // 2. Enviar datos a Google Sheets usando fetch
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sheetData)
      })
      .then(() => {
        // 3. Crear mensaje y abrir WhatsApp
        let whatsappText = `✨ *CONFIRMACIÓN XV AÑOS - LUCIANA ARCE ALTAMIRANO* ✨\n\n`;
        whatsappText += `👤 *Nombre:* ${name}\n`;
        whatsappText += `💌 *Asistencia:* ${attendance}\n`;
        whatsappText += `👥 *Pases / Personas:* ${guests}\n`;

        if (message) {
          whatsappText += `\n💬 *Mensaje para Luciana:*\n"${message}"\n`;
        }

        whatsappText += `\n🍄 _¡Nos vemos en el País de las Maravillas!_ 👑`;

        const encodedText = encodeURIComponent(whatsappText);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${WHATSAPP_PHONE}&text=${encodedText}`;

        // Abrir WhatsApp en nueva pestaña
        window.open(whatsappUrl, '_blank');

        // Restaurar estado del formulario y cerrar modal
        rsvpForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
        closeModal();
      })
      .catch(error => {
        console.error('Error al guardar en Google Sheets:', error);
        alert('Hubo un problema registrando tu respuesta. Intenta nuevamente.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      });
    });
  }
})();
