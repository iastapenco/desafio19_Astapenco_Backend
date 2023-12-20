const login_form = document.getElementById("login_form");

const loginUser = async (userLogin) => {
  const response = await fetch("http://localhost:8080/api/sessions/login", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(userLogin),
  });

  if (!response.ok) {
    throw new Error("Hubo un error al procesar la solicitud");
  }

  const data = await response.json();
  localStorage.setItem("dataUser", JSON.stringify(data));
  window.location.href = "/products";
};

login_form.addEventListener("submit", (e) => {
  e.preventDefault();
  const userLogin = Object.fromEntries(new FormData(e.target));
  e.target.reset();
  loginUser(userLogin).catch((error) => console.error(error));
});
