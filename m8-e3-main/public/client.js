/* =========================
   REGISTER
========================= */
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    alert(data.mensaje || data.error);
  });
}

/* =========================
   LOGIN
========================= */
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      credentials: "include", // 🔥 IMPORTANTE
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "/perfil.html";
    } else {
      alert(data.error);
    }
  });
}

/* =========================
   PERFIL
========================= */
async function cargarPerfil() {
  try {
    const res = await fetch("/perfil", {
      credentials: "include",
    });

    if (!res.ok) {
      window.location.href = "/login.html";
      return;
    }

    const data = await res.json();

    document.getElementById("data").textContent = JSON.stringify(data, null, 2);

    document.body.style.visibility = "visible";
  } catch (error) {
    window.location.href = "/login.html";
  }
}

/* =========================
   LOGOUT
========================= */
async function logout() {
  await fetch("/logout", {
    method: "POST",
    credentials: "include",
  });

  window.location.href = "/login.html";
}
