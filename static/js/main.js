function burgerMenu(selector) {
  let menu = document.querySelector(selector);
  let button = menu.querySelector('.burger-menu_button');
  let links = menu.querySelectorAll('.burger-menu_link');
  let overlay = menu.querySelector('.burger-menu_overlay');

  button.addEventListener('click', toggleMenu);
  links.forEach(link => link.addEventListener('click', toggleMenu));
  overlay.addEventListener('click', toggleMenu);

  function toggleMenu() {
    menu.classList.toggle('burger-menu_active');

    if (menu.classList.contains('burger-menu_active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
  }
}

burgerMenu('.burger-menu');
