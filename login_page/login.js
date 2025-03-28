import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";

// Your web app's Firebase configuration
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

document.addEventListener("DOMContentLoaded", function () {
  const loginRegisterButton = document.getElementById(
    "login-register-button-id"
  );

  loginRegisterButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username-field").value;
    const email = document.getElementById("email-field").value;
    const password = document.getElementById("password-field").value;

    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", "==", username),
        where("email", "==", email)
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Username and email combination not found");
        return;
      }
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      alert(`Welcome back, ${username}!`);
      window.location.href = "../game/index.html";
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        alert("Invalid password. Please try again.");
      } else {
        alert(error.message);
      }
    }
  });
});
