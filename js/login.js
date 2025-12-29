import {
  loginWithGoogle,
  loginAnonymously,
  onUserChanged
} from "./firebase.js";

import {
  getAuth,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const googleBtn = document.getElementById("login-google");
const guestBtn = document.getElementById("login-guest");
const guestNameInput = document.getElementById("guest-name");
const errorBox = document.getElementById("login-error");

const auth = getAuth();

// Google login
googleBtn.addEventListener("click", () => {
  loginWithGoogle();
});


// Guest login with name
guestBtn.addEventListener("click", async () => {
  const name = guestNameInput.value.trim();

  if (!name) {
    showError("الرجاء كتابة اسمك قبل المتابعة");
    return;
  }

  try {
    const result = await loginAnonymously();

    await updateProfile(result.user, {
      displayName: name
    });

    window.location.href = "index.html";
  } catch (e) {
    showError("فشل الدخول كزائر");
  }
});

// Already logged in? Redirect
onUserChanged(user => {
  if (user) {
    window.location.href = "index.html";
  }
});

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = "block";
}
