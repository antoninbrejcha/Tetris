document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.getElementById("back-button");

  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "../game/index.html";
    });
  } else {
    console.error("Back button element not found!");
  }
});
