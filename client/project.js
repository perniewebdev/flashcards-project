
const consent = document.getElementById("consent");
const signupBtn = document.getElementById("signup-btn");
const form = document.getElementById("signup-form");

consent.addEventListener("change", () => {
  signupBtn.disabled = !consent.checked;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await fetch("http://localhost:3000/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      acceptToS: true
    })
  });
});

document.getElementById("delete-account").addEventListener("click", async () => {
  const token = localStorage.getItem("token");

  await fetch("http://localhost:3000/users/me", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  localStorage.removeItem("token");
});


console.log("Client scaffold running");