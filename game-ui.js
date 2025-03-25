// Import Firebase functions
import {
  auth,
  currentUser,
  currentUserData,
  registerUser,
  loginUser,
  logoutUser,
  fetchUserData,
  updateHighScore,
  saveScore,
  getLeaderboard,
} from "./firebase-config.js";

// Game state management
let gameState = "start"; // 'start', 'game', 'gameOver', 'login', 'register', 'leaderboard'
let selectedMenuOption = 0;
const menuOptions = ["play", "leaderboard", "login"];

// Make gameState accessible to other modules
window.gameState = gameState;
window.showLoginSuccess = showLoginSuccess;

document.addEventListener("DOMContentLoaded", initializeUI);

function initializeUI() {
  // Add event listeners for menu navigation
  document.addEventListener("keydown", handleMenuNavigation);

  // Set up button event listeners
  setupButtonListeners();
}

function setupButtonListeners() {
  // Login screen buttons
  document
    .getElementById("login-button")
    .addEventListener("click", handleLogin);
  document
    .getElementById("to-register-button")
    .addEventListener("click", () => {
      hideScreen("login-screen");
      showScreen("register-screen");
      gameState = "register";
      window.gameState = gameState;
    });

  // Register screen buttons
  document
    .getElementById("register-button")
    .addEventListener("click", handleRegister);
  document
    .getElementById("back-to-login-button")
    .addEventListener("click", () => {
      hideScreen("register-screen");
      showScreen("login-screen");
      gameState = "login";
      window.gameState = gameState;
    });

  // Leaderboard screen button
  document
    .getElementById("back-from-leaderboard")
    .addEventListener("click", () => {
      hideScreen("leaderboard-screen");
      showScreen("start-screen");
      gameState = "start";
      window.gameState = gameState;
      highlightMenuOption(selectedMenuOption);
    });

  // Game over screen buttons
  document.getElementById("play-again-button").addEventListener("click", () => {
    hideScreen("game-over-screen");
    startNewGame();
  });

  document
    .getElementById("back-to-menu-button")
    .addEventListener("click", () => {
      hideScreen("game-over-screen");
      showScreen("start-screen");
      gameState = "start";
      window.gameState = gameState;
      highlightMenuOption(selectedMenuOption);
    });
}

function handleMenuNavigation(event) {
  if (gameState === "start") {
    if (event.keyCode === 87 || event.keyCode === 38) {
      // W or Up arrow
      event.preventDefault();
      changeMenuSelection(-1);
    } else if (event.keyCode === 83 || event.keyCode === 40) {
      // S or Down arrow
      event.preventDefault();
      changeMenuSelection(1);
    } else if (event.keyCode === 13 || event.keyCode === 32) {
      // Enter or Space
      event.preventDefault();
      selectMenuOption();
    }
  }
}

function changeMenuSelection(direction) {
  const menuElements = document.querySelectorAll(".menu-option");
  menuElements[selectedMenuOption].classList.remove("selected");

  selectedMenuOption =
    (selectedMenuOption + direction + menuOptions.length) % menuOptions.length;

  menuElements[selectedMenuOption].classList.add("selected");
}

function selectMenuOption() {
  const action = menuOptions[selectedMenuOption];

  switch (action) {
    case "play":
      hideScreen("start-screen");
      startNewGame();
      break;
    case "leaderboard":
      hideScreen("start-screen");
      showLeaderboard();
      break;
    case "login":
      hideScreen("start-screen");

      if (auth.currentUser) {
        // User is already logged in, show logout option
        logoutUser().then(() => {
          showScreen("login-screen");
          gameState = "login";
          window.gameState = gameState;
        });
      } else {
        showScreen("login-screen");
        gameState = "login";
        window.gameState = gameState;
      }
      break;
  }
}

function highlightMenuOption(index) {
  const menuElements = document.querySelectorAll(".menu-option");
  menuElements.forEach((el) => el.classList.remove("selected"));
  menuElements[index].classList.add("selected");
}

function hideScreen(screenId) {
  document.getElementById(screenId).classList.add("hidden");
}

function showScreen(screenId) {
  document.getElementById(screenId).classList.remove("hidden");
}

async function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  const errorElement = document.getElementById("login-error");

  if (!email || !password) {
    errorElement.textContent = "Please enter email and password";
    return;
  }

  errorElement.textContent = "";
  showLoadingSpinner("login-button");

  try {
    await loginUser(email, password);
    hideScreen("login-screen");
    showScreen("start-screen");
    gameState = "start";
    window.gameState = gameState;
    showLoginSuccess();

    // Update menu login/logout text
    updateLoginMenuOption();
  } catch (error) {
    errorElement.textContent = error.message;
  } finally {
    hideLoadingSpinner("login-button");
  }
}

async function handleRegister() {
  const username = document.getElementById("register-username").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const errorElement = document.getElementById("register-error");

  if (!username || !email || !password) {
    errorElement.textContent = "Please fill in all fields";
    return;
  }

  if (password.length < 6) {
    errorElement.textContent = "Password must be at least 6 characters";
    return;
  }

  errorElement.textContent = "";
  showLoadingSpinner("register-button");

  try {
    await registerUser(email, password, username);
    hideScreen("register-screen");
    showScreen("start-screen");
    gameState = "start";
    window.gameState = gameState;
    showLoginSuccess();

    // Update menu login/logout text
    updateLoginMenuOption();
  } catch (error) {
    errorElement.textContent = error.message;
  } finally {
    hideLoadingSpinner("register-button");
  }
}

function showLoginSuccess() {
  // Create a temporary toast message
  const toast = document.createElement("div");
  toast.textContent = `Welcome, ${auth.currentUser?.displayName || "Player"}!`;
  toast.style.position = "absolute";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = "#99CC33";
  toast.style.color = "#000";
  toast.style.padding = "5px 10px";
  toast.style.borderRadius = "5px";
  toast.style.fontFamily = "Tiny5, monospace";
  toast.style.fontSize = "10px";
  toast.style.zIndex = "100";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function updateLoginMenuOption() {
  const loginOption = document.querySelector(
    '.menu-option[data-action="login"]'
  );
  if (auth.currentUser) {
    loginOption.textContent = "LOGOUT";
  } else {
    loginOption.textContent = "LOGIN";
  }
}

function showLoadingSpinner(buttonId) {
  const button = document.getElementById(buttonId);
  const buttonText = button.textContent;
  button.dataset.originalText = buttonText;

  button.innerHTML = '<div class="loading-spinner"></div>';
  button.disabled = true;
}

function hideLoadingSpinner(buttonId) {
  const button = document.getElementById(buttonId);
  button.textContent = button.dataset.originalText;
  button.disabled = false;
}

async function showLeaderboard() {
  showScreen("leaderboard-screen");
  gameState = "leaderboard";
  window.gameState = gameState;

  const leaderboardList = document.getElementById("leaderboard-list");
  leaderboardList.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const leaderboardData = await getLeaderboard();
    leaderboardList.innerHTML = "";

    if (leaderboardData.length === 0) {
      leaderboardList.innerHTML =
        '<div style="text-align: center; padding: 20px;">No scores yet</div>';
      return;
    }

    leaderboardData.forEach((entry, index) => {
      const item = document.createElement("div");
      item.className = "leaderboard-item";

      const rank = document.createElement("div");
      rank.className = "leaderboard-rank";
      rank.textContent = `${index + 1}.`;

      const name = document.createElement("div");
      name.className = "leaderboard-name";
      name.textContent = entry.username || "Anonymous";

      const score = document.createElement("div");
      score.className = "leaderboard-score";
      score.textContent = entry.highScore;

      item.appendChild(rank);
      item.appendChild(name);
      item.appendChild(score);

      leaderboardList.appendChild(item);
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    leaderboardList.innerHTML =
      '<div style="text-align: center; color: red;">Error loading leaderboard</div>';
  }
}

function startNewGame() {
  gameState = "game";
  window.gameState = gameState;
  window.resetGame();

  // Add user info to game screen if logged in
  if (auth.currentUser) {
    const userInfo = document.createElement("div");
    userInfo.className = "user-info";
    userInfo.textContent = auth.currentUser.displayName || "Player";
    document.querySelector(".screen-container").appendChild(userInfo);
  }
}

async function showGameOver(finalScore, finalLevel) {
  gameState = "gameOver";
  window.gameState = gameState;
  showScreen("game-over-screen");

  document.getElementById("final-score").textContent = `Score: ${finalScore}`;
  document.getElementById("final-level").textContent = `Level: ${finalLevel}`;

  // Remove user info from game screen
  const userInfo = document.querySelector(".user-info");
  if (userInfo) {
    userInfo.remove();
  }

  if (auth.currentUser) {
    try {
      // Check if this is a new high score
      const isNewHighScore = await updateHighScore(finalScore);

      if (isNewHighScore) {
        document.getElementById("high-score-message").textContent =
          "NEW HIGH SCORE!";
      } else {
        document.getElementById("high-score-message").textContent = "";
      }

      // Save the score to history
      await saveScore(finalScore);
    } catch (error) {
      console.error("Error updating score:", error);
    }
  }
}

// Export functions to be used in Tetris.js
export { showGameOver };
