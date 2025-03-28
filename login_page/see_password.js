document.addEventListener("DOMContentLoaded", function () {
  const passwordField = document.getElementById("password-field");
  const seePassword = document.querySelector(".see-password");

  seePassword.addEventListener("mousedown", function () {
    passwordField.type = "text";
  });

  seePassword.addEventListener("mouseup", function () {
    passwordField.type = "password";
  });

  seePassword.addEventListener("mouseleave", function () {
    passwordField.type = "password";
  });
});
