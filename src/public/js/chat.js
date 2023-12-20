const socket = io();

const botonChat = document.getElementById("botonChat");
const parrafosMensajes = document.getElementById("parrafosMensajes");
const valInput = document.getElementById("chatBox");
let user;

Swal.fire({
  title: "Identificacion de usuario",
  text: "Por favor ingrese su nombre de usuario",
  input: "email",
  inputLabel: "Tu dirección de email",
  inputPlaceholder: "Entra tu dirección de email",
  inputValidator: (valor) => {
    return !valor && "Ingrese su nombre de usuario valido";
  },
  allowOutsideClick: false,
}).then((resultado) => {
  user = resultado.value;
  console.log(user);
});

botonChat.addEventListener("click", () => {
  if (valInput.value.trim().length > 0) {
    socket.emit("mensaje", {
      email: user,
      message: valInput.value,
    });
    valInput.value = "";
    socket.on();
  }
});

socket.on("mensajes", (arrayMensajes) => {
  parrafosMensajes.innerHTML = "";
  arrayMensajes.forEach((mensaje) => {
    parrafosMensajes.innerHTML += `<p>${mensaje.postTime}: el usuario ${mensaje.email} escribio ${mensaje.message} </p>`;
  });
});
