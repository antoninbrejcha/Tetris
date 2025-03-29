import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
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
const db = getFirestore(app);

const loginRegisterButton = document.getElementById("login-register-button-id");
const statusMessage = document.getElementById("status-message");
const statusOverlay = document.getElementById("status-overlay");
const overlayMessage = document.getElementById("overlay-message");

function showStatusMessage(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = "status-message";

  if (type) {
    statusMessage.classList.add(type);
  }

  setTimeout(() => {
    statusMessage.textContent = "";
  }, 5000);
}

function showOverlay(message) {
  overlayMessage.textContent = message;
  statusOverlay.classList.add("visible");
}

function hideOverlay() {
  statusOverlay.classList.remove("visible");
}

loginRegisterButton.addEventListener("click", function (event) {
  event.preventDefault();
  const username = document.getElementById("username-field").value;
  const email = document.getElementById("email-field").value;
  const password = document.getElementById("password-field").value;

  statusMessage.textContent = "";
  showOverlay("Creating account...");

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      overlayMessage.textContent = "Adding user details...";

      return setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
        uid: user.uid,
        highscore: 0,
      }).then(() => {
        overlayMessage.textContent = "Registration successful!";
        setTimeout(() => {
          window.location.href = "../profile/profile.html";
        }, 1500);
      });
    })
    .catch((error) => {
      hideOverlay();
      const errorCode = error.code;
      const errorMessage = error.message;

      if (errorCode === "auth/email-already-in-use") {
        showStatusMessage(
          "Email already in use. Try logging in instead.",
          "error"
        );
      } else if (errorCode === "auth/invalid-email") {
        showStatusMessage(
          "Invalid email format. Please check and try again.",
          "error"
        );
      } else if (errorCode === "auth/weak-password") {
        showStatusMessage(
          "Password is too weak. Use at least 6 characters.",
          "error"
        );
      } else {
        showStatusMessage(errorMessage, "error");
      }
    });
});
