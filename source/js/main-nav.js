var nav = document.querySelector(".main-nav");
nav.classList.remove("main-nav--nojs");

var toggle = document.querySelector(".main-nav__toggle");

toggle.addEventListener("click", function (evt) {
  evt.preventDefault();
  if (nav.classList.contains("main-nav--closed")) {
    nav.classList.remove("main-nav--closed");
    nav.classList.add("main-nav--opened");
  } else {
    nav.classList.remove("main-nav--opened");
    nav.classList.add("main-nav--closed");
  }
});
