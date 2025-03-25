// Import Firebase SDK modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCBFPpK-hIIJLHD4im4smoDKSm5UEZHEGE",
  authDomain: "tetris-a08df.firebaseapp.com",
  projectId: "tetris-a08df",
  storageBucket: "tetris-a08df.firebasestorage.app",
  messagingSenderId: "327041072335",
  appId: "1:327041072335:web:84651f444077cae7b44bba",
  measurementId: "G-VPJNYE0MPV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Current user data
let currentUser = null;
let currentUserData = null;

// Authentication functions
async function registerUser(email, password, username) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Add username to user profile
    await updateProfile(user, {
      displayName: username,
    });

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      username: username,
      highScore: 0,
      createdAt: serverTimestamp(),
    });

    currentUser = user;
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    currentUser = userCredential.user;
    await fetchUserData(currentUser.uid);
    return currentUser;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

async function logoutUser() {
  try {
    await signOut(auth);
    currentUser = null;
    currentUserData = null;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

async function fetchUserData(userId) {
  try {
    const docSnap = await getDoc(doc(db, "users", userId));
    if (docSnap.exists()) {
      currentUserData = docSnap.data();
      return currentUserData;
    } else {
      console.log("No user data found!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

// Set up auth state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    await fetchUserData(user.uid).then(() => {
      if (window.gameState === "start") {
        window.showLoginSuccess && window.showLoginSuccess();
      }
    });
  } else {
    currentUser = null;
    currentUserData = null;
  }
});

// Scores and leaderboard functions
async function updateHighScore(score) {
  if (!currentUser) return false;

  try {
    const docRef = doc(db, "users", currentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      // Only update if the new score is higher
      if (score > userData.highScore) {
        await updateDoc(docRef, {
          highScore: score,
          lastUpdated: serverTimestamp(),
        });
        return true; // Score was updated
      }
    }
    return false; // Score was not updated
  } catch (error) {
    console.error("Error updating high score:", error);
    throw error;
  }
}

async function saveScore(score) {
  if (!currentUser) return;

  try {
    await addDoc(collection(db, "scores"), {
      userId: currentUser.uid,
      username: currentUser.displayName,
      score: score,
      level: window.level || 1,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving score:", error);
    throw error;
  }
}

async function getLeaderboard() {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("highScore", "desc"),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const leaderboard = [];

    querySnapshot.forEach((doc) => {
      leaderboard.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return leaderboard;
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    throw error;
  }
}

// Export Firebase functions and data
export {
  auth,
  db,
  currentUser,
  currentUserData,
  registerUser,
  loginUser,
  logoutUser,
  fetchUserData,
  updateHighScore,
  saveScore,
  getLeaderboard,
};
