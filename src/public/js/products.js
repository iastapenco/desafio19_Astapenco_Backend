document.getElementById("btn-logout").addEventListener("click", function () {
  fetch("http://localhost:8080/api/sessions/logout", {
    method: "GET",
  }).then((response) => {
    if (!response.ok) {
      throw new Error("HUbo un error en la solicitud");
    } else {
      localStorage.removeItem("dataUser");
      window.location.href = "/api/sessions/login";
    }
  });
});

const dataUser = JSON.parse(localStorage.getItem("dataUser"));

if (dataUser != {}) {
  const alert = document.getElementById("alert");
  const div = document.createElement("div");
  div.setAttribute(
    "class",
    "alert alert-info text-center fs-4 alert-dismissible fade show"
  );
  div.setAttribute("role", "alert");
  div.setAttribute("id", "messageWelcome");
  const strong = document.createElement("strong");
  strong.innerText = `¡Bienvenido ${dataUser.payload.first_name} ${dataUser.payload.last_name} a nuestro coffe shopp online!`;
  div.appendChild(strong);
  const buttonClose = document.createElement("button");
  buttonClose.setAttribute("class", "btn-close");
  buttonClose.setAttribute("type", "button");
  buttonClose.setAttribute("data-bs-dismiss", "alert");
  buttonClose.setAttribute("aria-label", "Close");
  div.appendChild(buttonClose);
  alert.appendChild(div);

  const btnLogout = document.getElementById("btn-logout");
  btnLogout.innerHTML = `<button
  type="button"
  id="btn-logout"
  class="btn btn-danger position-absolute position-absolute top-0 start-100 translate-middle"
>Logout</button>`;
}

const botones = document.querySelectorAll("#btn-add");

botones.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    const pid = e.currentTarget.dataset.id;
    console.log(pid);
    const quantity = 1;

    const cid = "6502418fd1726d7773d05287";

    const url = `http://localhost:8080/api/carts/${cid}/products/${pid}`;

    const data = { quantity };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Hubo un error al realizar la solicitud");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.products) {
          console.log(data.products);
          data.products.forEach((product, index) => {
            fetch(`http://localhost:8080/api/carts/${cid}`, {
              method: "GET",
            }).then((res) => {
              if (!res.ok) {
                throw new Error("Hubo un error al procesar la solicitud");
              } else {
                window.location.href = `http://localhost:8080/api/carts/${cid}`;
              }
            });
          });
        }
      });
  });
});
