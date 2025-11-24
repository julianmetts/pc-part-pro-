/* ---- Simple login system ---- */
/* You can change these */
const VALID_USER = "admin";
const VALID_PASS = "1234";

/* Save login state so user stays logged in */
function setLoggedIn(){
  localStorage.setItem("tpp_logged_in", "yes");
}

document.getElementById("loginBtn").onclick = () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("errorBox");

  if(user === VALID_USER && pass === VALID_PASS){
    setLoggedIn();
    window.location.href = "index.html"; // ← redirect to your main file
  } else {
    errorBox.style.display = "block";
  }
};

/* Auto-redirect if already logged in */
if(localStorage.getItem("tpp_logged_in") === "yes"){
  window.location.href = "index.html";
}