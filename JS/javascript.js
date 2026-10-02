/* =========================================================
   SIRAME — script compartido
   Cargado por todas las páginas desde JS/javascript.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Menú móvil ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMobile?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Resaltar el enlace activo según la página actual ---------- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .nav__mobile a').forEach((link) => {
    const linkPath = (link.getAttribute('href') || '').split('#')[0];
    if (linkPath && linkPath === currentPath) {
      link.classList.add('is-active');
    }
  });

  /* ---------- Estado del equipo en la ficha (solo existe en index.html) ---------- */
  const tagStatus = document.getElementById('tagStatus');
  const floatStatusText = document.getElementById('floatStatusText');

  if (tagStatus) {
    const estados = [
      { texto: 'Disponible', color: '--green' },
      { texto: 'En mantenimiento', color: '--gold' },
      { texto: 'En traslado', color: '--blue-gray' },
    ];
    let estadoIndex = 0;
    const rootStyles = getComputedStyle(document.documentElement);

    function actualizarEstado() {
      estadoIndex = (estadoIndex + 1) % estados.length;
      const estado = estados[estadoIndex];
      tagStatus.style.opacity = '0';
      if (floatStatusText) floatStatusText.textContent = `Actualizando estado: ${estado.texto}`;
      window.setTimeout(() => {
        tagStatus.textContent = estado.texto;
        tagStatus.style.color = rootStyles.getPropertyValue(estado.color).trim();
        tagStatus.style.opacity = '1';
      }, 250);
    }

    tagStatus.style.setProperty('transition', 'opacity 0.25s ease');
    window.setInterval(actualizarEstado, 3200);
  }

  /* ---------- Formulario de solicitud de acceso (solo existe en acceso.html) ---------- */
  const accessForm = document.getElementById('accessForm');
  const accessCard = document.getElementById('accessCard');
  const accessConfirm = document.getElementById('accessConfirm');
  const accessConfirmText = document.getElementById('accessConfirmText');

  if (accessForm && accessCard && accessConfirm) {
    accessForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!accessForm.checkValidity()) {
        accessForm.reportValidity();
        return;
      }

      const nombre = accessForm.querySelector('#nombre').value.trim();
      const rol = accessForm.querySelector('#rol').value;
      const primerNombre = nombre.split(' ')[0] || '';

      if (accessConfirmText) {
        accessConfirmText.textContent = `Gracias${primerNombre ? ', ' + primerNombre : ''}. Recibimos tu solicitud para el rol de ${rol}. Administración se comunicará a tu correo institucional para habilitar tu acceso.`;
      }

      accessCard.classList.add('is-hidden');
      accessConfirm.classList.remove('is-hidden');
      accessConfirm.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Contadores animados de estadísticas ---------- */
  const statNumbers = document.querySelectorAll('.stat__number');

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window && statNumbers.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    statNumbers.forEach((el) => observer.observe(el));
  } else {
    statNumbers.forEach((el) => { el.textContent = el.dataset.count; });
  }

});
