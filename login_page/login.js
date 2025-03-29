import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyCCjbH0oI2ZWDt_15jHoEr-9LaebqcOrts",
  authDomain: "tetris-ab2dc.firebaseapp.com",
  projectId: "tetris-ab2dc",
  storageBucket: "tetris-ab2dc.firebasestorage.app",
  messagingSenderId: "435753979009",
  appId: "1:435753979009:web:0b1da3daa7e3e85e9ad180",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginRegisterButton = document.getElementById("login-register-button-id");
const statusMessage = document.getElementById("status-message");
const statusOverlay = document.getElementById("status-overlay");
const overlayMessage = document.getElementById("overlay-message");

// Function to show status message
function showStatusMessage(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = "status-message";

  if (type) {
    statusMessage.classList.add(type);
  }

  setTimeout(() => {
    statusMessage.textContent = ""; // This is the important part
  }, 5000);
}

// Function to show overlay
function showOverlay(message) {
  overlayMessage.textContent = message;
  statusOverlay.classList.add("visible");
}

// Function to hide overlay
function hideOverlay() {
  statusOverlay.classList.remove("visible");
}

loginRegisterButton.addEventListener("click", function (event) {
  event.preventDefault();

  const email = document.getElementById("email-field").value;
  const password = document.getElementById("password-field").value;

  // Clear any existing status messages
  statusMessage.textContent = "";

  // Show overlay with loading message
  showOverlay("Logging in...");

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem(
        "user",
        JSON.stringify({ uid: user.uid, email: user.email })
      );

      // Update overlay message
      overlayMessage.textContent = "Login successful!";

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "../game/index.html";
      }, 1500);
    })
    .catch((error) => {
      // Hide the overlay
      hideOverlay();

      // Show inline error message
      const errorCode = error.code;
      const errorMessage = error.message;

      // Display user-friendly error messages
      if (errorCode === "auth/invalid-credential") {
        showStatusMessage(
          "Invalid email or password. Please try again.",
          "error"
        );
      } else if (errorCode === "auth/user-not-found") {
        showStatusMessage(
          "User not found. Please check your email or register.",
          "error"
        );
      } else if (errorCode === "auth/wrong-password") {
        showStatusMessage("Incorrect password. Please try again.", "error");
      } else {
        showStatusMessage(errorMessage, "error");
      }
    });
});
