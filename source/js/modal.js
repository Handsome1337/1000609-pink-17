var form = document.querySelector(".contest__button");
var modal = document.querySelectorAll(".modal");
var error = document.querySelector(".modal--error");
var notification = document.querySelector(".modal--notification");
var overlay = document.querySelector(".overlay");
var close = document.querySelectorAll(".modal__button");

var required = document.querySelectorAll("input[required]");
var tel = document.querySelector("input[type='tel']");
var email = document.querySelector("input[type='email']");

if (form) {
  form.addEventListener("click", function (evt) {

    if (tel.value == "" || /^[0-9\s\.\-\+\(\)]{2,20}$/.test(tel.value)) {
      var k = 0;
      for (var i = 0; i < required.length; i++) {
        if(required[i].value) {
          k++;
        } else {
          break;
        }
      }

      if (email.value != "") {
        if (k === required.length) {
          if (/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,4}$/.test(email.value)) {
            evt.preventDefault();
            notification.classList.toggle("modal--closed");
            overlay.classList.toggle("overlay--closed");
          }
        } else {
          evt.preventDefault();
          error.classList.toggle("modal--closed");
          overlay.classList.toggle("overlay--closed");
        }
      } else {
        evt.preventDefault();
        error.classList.toggle("modal--closed");
        overlay.classList.toggle("overlay--closed");
      }
    }
  });

  overlay.addEventListener("click", function (evt) {
    error.classList.add("modal--closed");
    notification.classList.add("modal--closed");
    overlay.classList.toggle("overlay--closed");
  });

  for (var i = 0; i < close.length; i++) {
    close[i].addEventListener("click", function (evt) {
      evt.preventDefault();
      error.classList.add("modal--closed");
      notification.classList.add("modal--closed");
      overlay.classList.add("overlay--closed");
    });
  }
}
