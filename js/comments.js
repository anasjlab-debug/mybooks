import {
  loginWithGoogle,
  loginAnonymously,
  onUserChanged,
  addChapterComment,
  listenChapterComments
} from "./firebase.js";

let currentUser = null;

// Auth buttons (أسفل الصفحة)
const googleBtn = document.getElementById("login-google");
const guestBtn = document.getElementById("login-guest");
const userBox = document.getElementById("user-box");

if (googleBtn) googleBtn.onclick = loginWithGoogle;
if (guestBtn) guestBtn.onclick = loginAnonymously;

onUserChanged(user => {
  currentUser = user;
  if (userBox) {
    userBox.textContent = user
      ? `متصل: ${user.isAnonymous ? "زائر" : user.displayName}`
      : "غير متصل";
  }
});

// تعليقات الفصول (أسفل كل فصل)
document.querySelectorAll(".opinion[data-comments]").forEach(block => {
  const key = block.dataset.comments;
  const textarea = block.querySelector("textarea");
  const submitBtn = block.querySelector("[data-submit-comment]");
  const list = block.querySelector("[data-comment-list]");

  // إرسال تعليق
  submitBtn.addEventListener("click", async () => {
    if (!currentUser) {
      alert("الرجاء تسجيل الدخول أولاً");
      return;
    }
    if (!textarea.value.trim()) return;

    await addChapterComment({
      key,
      novel: key.split("_")[0],
      chapter: key.split("_")[1],
      text: textarea.value.trim(),
      userId: currentUser.uid,
      displayName: currentUser.isAnonymous
        ? "زائر"
        : currentUser.displayName
    });

    textarea.value = "";
  });

  // عرض التعليقات
  listenChapterComments(key, comments => {
    list.innerHTML = "";
    comments.forEach(c => {
      const div = document.createElement("div");
      div.className = "comment";
      div.innerHTML = `
        <div class="meta">${c.displayName}</div>
        <div class="text">${c.text}</div>
      `;
      list.appendChild(div);
    });
  });
});
