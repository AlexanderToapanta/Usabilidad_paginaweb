fetch("menu.html")
  .then(res => res.text())
  .then(data => document.getElementById("menu").innerHTML = data);

fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data);

fetch("./paginas/index.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("contenido").innerHTML = data;

    setTimeout(() => {
      if (typeof mostrarProductosGuardados === "function") {
        mostrarProductosGuardados();
      }
    }, 100);
  });

function cargarPaginas(url_pagina){
  fetch(`paginas/${url_pagina}.html`)
    .then(res => res.text())
    .then(data => {
      document.getElementById("contenido").innerHTML = data;

     setTimeout(() => {
    if (url_pagina === "carrito" && typeof cargarCarrito === "function") {
        cargarCarrito();
    } else if (url_pagina === "index" && typeof mostrarProductosGuardados === "function") {
        mostrarProductosGuardados();
    }
}, 100);

    });
}

// Cargar index por defecto
window.onload = () => cargarPaginas("index");
