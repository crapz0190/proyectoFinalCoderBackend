/* eslint-disable no-undef */
const socketClient = io();

// Obtén todos los botones "Agregar al Carrito" por su clase
const addToCartButtons = document.querySelectorAll(".add-to-cart");

// Agrega un manejador de eventos a cada botón
addToCartButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    // Obtiene el ID del producto desde el atributo "data-product-id"
    const productId = e.target.getAttribute("data-product-id");

    // Emite un evento de Socket.IO para agregar el producto al carrito
    socketClient.emit("add-to-cart", { productId });

    // Puedes personalizar más la lógica aquí, como mostrar un mensaje de éxito
    // alert("Producto agregado al carrito.");
  });
});
