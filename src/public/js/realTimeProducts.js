const socket = io();

const form = document.getElementById("idForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const datForm = new FormData(e.target);
  const prod = Object.fromEntries(datForm);
  socket.emit("nuevoProducto", prod);
  e.target.reset();
});

socket.on("productoUpdated", (prod) => {
  const listaProductos = document.getElementById("listaProductos");
  const divProduct = document.createElement("div");
  divProduct.setAttribute("class", "card text-center mt-2 mb-2");
  divProduct.setAttribute("style", "width: 18rem");
  divProduct.innerHTML = ` <h2 class="card-title">${prod.title}</h2>
  <h4>Precio: $${prod.price}</h4>
  <h5>Categoría: ${prod.category}</h5>
  <div class="border rounded-4">
    <h4>Descripción:</h4>
    <p class="card-text">${prod.description}</p>
  </div>
  <h5 class="mt-2">Stock: ${prod.stock} || Código:${prod.code}</h5>`;
  listaProductos.appendChild(divProduct);
});
