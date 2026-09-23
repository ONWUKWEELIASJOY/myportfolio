document.querySelectorAll('.mp-switch').forEach(button => {
  button.addEventListener('click', () => {
    button.setAttribute('aria-checked', String(button.getAttribute('aria-checked') !== 'true'));
  });
});
