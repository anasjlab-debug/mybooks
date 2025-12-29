import { onUserChanged } from "./firebase.js";

onUserChanged(user => {
  if (!user) {
    // غير مسجّل → رجوع لصفحة الدخول
    window.location.href = "login.html";
  }
});
