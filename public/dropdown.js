var burger = document.querySelector('.burger');
var navContainer = document.querySelector('nav');

burger.addEventListener('click', function () {
    navContainer.classList.toggle('active');
    burger.classList.toggle('active');
});