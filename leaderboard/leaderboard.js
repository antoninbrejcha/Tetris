import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
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
const db = getFirestore(app);
const auth = getAuth(app);

const leaderboardBody = document.getElementById("leaderboard-body");
const loadingMessage = document.getElementById("loading-message");
const refreshButton = document.getElementById("refresh-button");
const backButton = document.getElementById("back-button");

const TOP_PLAYERS_LIMIT = 20;
let currentUserId = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUserId = user.uid;
    if (document.readyState === "complete") {
      fetchLeaderboard();
    }
  } else {
    currentUserId = null;
  }
});

function fetchLeaderboard() {
  loadingMessage.style.display = "block";
  leaderboardBody.innerHTML = "";
  const leaderboardQuery = query(
    collection(db, "users"),
    orderBy("highscore", "desc"),
    limit(TOP_PLAYERS_LIMIT)
  );

  getDocs(leaderboardQuery)
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        leaderboardBody.innerHTML = `<tr><td colspan="3">No scores yet!</td></tr>`;
      } else {
        let rank = 1;
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const row = document.createElement("tr");

          const rankCell = document.createElement("td");
          const rankBadge = document.createElement("span");
          rankBadge.classList.add("rank-badge");
          const rankNumber = document.createElement("p");
          rankNumber.textContent = rank;
          rankNumber.classList.add("rank-number");
          rankBadge.appendChild(rankNumber);
          rankCell.appendChild(rankBadge);

          const usernameCell = document.createElement("td");
          if (currentUserId && userData.uid === currentUserId) {
            const username = document.createElement("span");
            username.textContent = userData.username || "Anonymous";
            usernameCell.appendChild(username);

            const youIndicator = document.createElement("span");
            youIndicator.textContent = " (You)";
            youIndicator.classList.add("current-user-indicator");
            usernameCell.appendChild(youIndicator);

            row.classList.add("current-user-row");
          } else {
            usernameCell.textContent = userData.username || "Anonymous";
          }

          const scoreCell = document.createElement("td");
          scoreCell.textContent = userData.highscore || 0;

          row.appendChild(rankCell);
          row.appendChild(usernameCell);
          row.appendChild(scoreCell);

          leaderboardBody.appendChild(row);

          rank++;
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching leaderboard data:", error);
      leaderboardBody.innerHTML = `<tr><td colspan="3">Error loading leaderboard. Try again later.</td></tr>`;
    })
    .finally(() => {
      loadingMessage.style.display = "none";
    });
}

refreshButton.addEventListener("click", fetchLeaderboard);

backButton.addEventListener("click", () => {
  window.location.href = "../game/index.html";
});
