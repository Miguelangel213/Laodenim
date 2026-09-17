/* ===== LAODENIM — interacciones ===== */

document.addEventListener('DOMContentLoaded', () => {

    /* Header con sombra al hacer scroll */
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
      } else {
        header.style.boxShadow = 'none';
      }
    });
  
    /* Scroll suave para los enlaces internos */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  
    /* Animación de aparición al hacer scroll (fade + slide up) */
    const revealTargets = document.querySelectorAll(
      '.modal-card, .clase, .incluye-item, .precio-card'
    );
  
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity .6s ease, transform .6s ease';
    });
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  
    revealTargets.forEach(el => observer.observe(el));
  
    /* Marquee: duplicar contenido dinámicamente por si se edita el HTML */
    const track = document.querySelector('.marquee-track');
    if (track && track.children.length > 0) {
      const originalHTML = track.innerHTML;
      // Nos aseguramos de tener al menos 2 copias para el loop infinito
      if (!track.dataset.duplicated) {
        track.innerHTML = originalHTML;
        track.dataset.duplicated = 'true';
      }
    }
  
  });