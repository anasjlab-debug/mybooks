import {
  loginWithGoogle,
  loginAnonymously,
  onUserChanged
} from "./firebase.js";

import {
  getAuth,
  updateProfile,
  getRedirectResult
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

const googleBtn = document.getElementById("login-google");
const guestBtn = document.getElementById("login-guest");
const guestNameInput = document.getElementById("guest-name");
const errorBox = document.getElementById("login-error");

/* ====== GOOGLE LOGIN ====== */
googleBtn.addEventListener("click", () => {
  loginWithGoogle();
});

/* ====== HANDLE REDIRECT RESULT ====== */
getRedirectResult(auth)
  .then(result => {
    if (result && result.user) {
      window.location.href = "index.html";
    }
  })
  .catch(() => {
    showError("فشل تسجيل الدخول بحساب Google");
  });

/* ====== GUEST LOGIN ====== */
guestBtn.addEventListener("click", async () => {
  const name = guestNameInput.value.trim();

  if (!name) {
    showError("الرجاء كتابة اسمك قبل المتابعة");
    return;
  }

  try {
    const result = await loginAnonymously();
    await updateProfile(result.user, { displayName: name });
    window.location.href = "index.html";
  } catch {
    showError("فشل الدخول كزائر");
  }
});

/* ====== ALREADY LOGGED IN ====== */
onUserChanged(user => {
  if (user) {
    window.location.href = "index.html";
  }
});

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.style.display = "block";
}
