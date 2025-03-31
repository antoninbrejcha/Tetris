import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
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

const usernameElement = document.getElementById("username");
const emailElement = document.getElementById("email");
const highscoreElement = document.getElementById("highscore");
const logoutButton = document.getElementById("logout-button");
const backButton = document.getElementById("back-button");
const loadingMessage = document.getElementById("loading-message");

function loadUserProfile() {
  loadingMessage.style.display = "block";

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            usernameElement.textContent = userData.username || "Anonymous";
            emailElement.textContent = userData.email;

            const highscore = userData.highscore || 0;
            highscoreElement.textContent = highscore;

            highscoreElement.style.animation = "pulse 1s";
            setTimeout(() => {
              highscoreElement.style.animation = "";
            }, 1000);
          } else {
            showError("User data not found");
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          showError("Failed to fetch user data");
        })
        .finally(() => {
          loadingMessage.style.display = "none";
        });
    } else {
      window.location.href = "../login_page/login.html";
    }
  });
}

function showError(message) {
  usernameElement.textContent = "-";
  emailElement.textContent = "-";
  highscoreElement.textContent = "0";

  loadingMessage.style.display = "block";
  loadingMessage.textContent = message;
  loadingMessage.style.color = "#ff6b6b";

  setTimeout(() => {
    loadingMessage.style.display = "none";
  }, 3000);
}

logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "../login_page/login.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
      showError("Logout failed. Please try again.");
    });
});

backButton.addEventListener("click", () => {
  window.location.href = "../game/index.html";
});

document.addEventListener("DOMContentLoaded", loadUserProfile);
