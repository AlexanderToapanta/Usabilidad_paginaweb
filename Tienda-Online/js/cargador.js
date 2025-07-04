fetch("menu.html")
  .then(res => res.text())
  .then(data => document.getElementById("menu").innerHTML = data);

fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data);


  fetch("./paginas/index.html")
  .then(res => res.text())
  .then(data => document.getElementById("contenido").innerHTML = data);

function cargarPaginas(url_pagina){
    fetch(`paginas/${url_pagina}.html`)
        .then(res => res.text())
        .then(data => {
            document.getElementById("contenido").innerHTML = data;

            setTimeout(() => {
                if (url_pagina === "carrito" && typeof cargarCarrito === "function") {
                    cargarCarrito();
                }
            }, 100); 
        });
}

  
window.onload=()=>cargarPaginas("index")