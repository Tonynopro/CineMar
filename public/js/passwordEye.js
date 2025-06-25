document.addEventListener('DOMContentLoaded', () => {
    const toggleEyeVisibility = (input, icon) => {
      if (input.value.length > 0) {
        icon.style.visibility = 'visible';  // Hace visible el icono del ojo cuando hay texto en el campo
      } else {
        icon.style.visibility = 'hidden';   // Oculta el icono del ojo si el campo está vacío
      }
    };
  
    const setupPasswordToggle = () => {
      const inputs = document.querySelectorAll('.eye-password');
      inputs.forEach(input => {
        const toggleIcon = input.nextElementSibling; // Se asume que el icono está justo después del campo input
        if (toggleIcon && toggleIcon.classList.contains('fas')) {
          // Mostrar/ocultar la contraseña cuando el icono del ojo es clickeado
          toggleIcon.addEventListener('click', () => {
            if (input.type === 'password') {
              input.type = 'text';
              toggleIcon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
              input.type = 'password';
              toggleIcon.classList.replace('fa-eye-slash', 'fa-eye');
            }
          });
  
          // Mostrar el icono del ojo cuando el usuario escribe
          input.addEventListener('input', () => {
            toggleEyeVisibility(input, toggleIcon);
          });
  
          // Inicializa la visibilidad del ojo al cargar la página (en caso de que ya haya algo escrito)
          toggleEyeVisibility(input, toggleIcon);
        }
      });
    };
  
    setupPasswordToggle();
  });