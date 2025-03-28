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

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    const usedDocRef = doc(db, "users", user.uid);
    getDoc(usedDocRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          usernameElement.textContent = userData.username;
          emailElement.textContent = userData.email;
          highscoreElement.textContent = userData.highscore;
        } else {
          alert("User data not found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data.");
      });
  } else {
    window.location.href = "../login_page/login.html";
  }
});

logoutButton.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "../login_page/login.html";
    })
    .catch((error) => {
      console.error("Error signing out:", error);
      alert("Logout failed. Please try again.");
    });
});
