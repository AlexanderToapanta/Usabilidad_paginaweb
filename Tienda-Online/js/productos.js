let idProductoSeleccionado = null;
const productos = {};
function abrirModalProducto() {
    document.getElementById('modalProducto').style.display = 'flex';
}

function cerrarModalProducto() {
    document.getElementById('modalProducto').style.display = 'none';
    document.getElementById('nombreProducto').value = '';
    document.getElementById('cantidadProducto').value = '';
    document.getElementById('precioProducto').value = '';
    document.getElementById('tipoProducto').value = '';
    document.getElementById('imagenProducto').value = '';
}

function imagenA64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

function generarIdUnico() {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    if (productos.length === 0) return '1';
    const maxId = Math.max(...productos.map(p => parseInt(p.id)));
    return (maxId + 1).toString();
}

async function guardarProducto() {
  const nombre = document.getElementById('nombreProducto').value.trim();
  const cantidad = parseInt(document.getElementById('cantidadProducto').value);
  const precio = parseFloat(document.getElementById('precioProducto').value);
  const tipoRaw = document.getElementById('tipoProducto').value;
  const tipo = tipoRaw.trim().toLowerCase();

  console.log("Valor bruto tipo:", tipoRaw);
  console.log("Tipo procesado (id esperado):", tipo);

  const file = document.getElementById('imagenProducto').files[0];

  if (!nombre || isNaN(cantidad) || cantidad < 0 || isNaN(precio) || precio < 0 || !tipo || !file) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }


  try {
    const imagenBase64 = await imagenA64(file);

    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    if (!Array.isArray(productos)) productos = [];

    const nuevoId = productos.length > 0
      ? (Math.max(...productos.map(p => parseInt(p.id))) + 1).toString()
      : '1';

    const nuevoProducto = {
      id: nuevoId,
      nombre,
      cantidad,
      precio,
      tipo, // ya está normalizado
      imagen: imagenBase64
    };

    productos.push(nuevoProducto);
    localStorage.setItem('productos', JSON.stringify(productos));

    cerrarModalProducto();
    alert('Producto agregado correctamente.');
    console.log('Producto guardado en localStorage:', nuevoProducto);

    if (typeof mostraSegunTipo === "function") {
      mostraSegunTipo();
    }

  } catch (err) {
    console.error('Error al convertir imagen:', err);
    alert('Ocurrió un error al guardar el producto.');
  }
}






function mostrarProductosGuardados() {
    console.log("Cargando productos desde localStorage");

    const contenedor = document.getElementById("contenedor-productos-dinamicos");
    if (!contenedor) return;

    let productos = JSON.parse(localStorage.getItem("productos"));
    if (!Array.isArray(productos)) productos = [];

    console.log("Productos recuperados:", productos);

    if (productos.length === 0) {
        contenedor.innerHTML = "<p>No hay productos para mostrar.</p>";
        return;
    }

    contenedor.innerHTML = productos.map(producto => `
        <div class="col-md-5">
            <div class="card h-100" id="${producto.id}">
                <img class="card-img-top" src="${producto.imagen}" alt="${producto.nombre}" />
                <div class="card-body p-4">
                    <div class="text-center">
                        <h5 class="fw-bolder">${producto.nombre}</h5>
                        <p class="card-text">$${producto.precio}</p>
                        <p class="card-text stock-${producto.id}" id="stock_${producto.id}">Stock: ${producto.cantidad}</p>
                        <p class="card-text">Tipo: ${producto.tipo}</p>
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                    <a class="btn btn-primary" onclick="abrirModalEliminarProducto()">Eliminar producto</a>
                    <br><br>
                    <a class="btn btn-primary" onclick="abrirModalActualizarProducto(this)">Actualizar</a>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function mostraSegunTipo() {
  const productos = JSON.parse(localStorage.getItem("productos")) || [];

  // Primero limpiamos todas las secciones para evitar duplicados
  // Suponiendo que tienes secciones fijas con ids para cada tipo:
  const tiposUnicos = [...new Set(productos.map(p => p.tipo.toLowerCase().replace(/\s+/g, "")))];
  
  tiposUnicos.forEach(tipoId => {
    const seccion = document.querySelector(`section#${tipoId} .row`);
    if (seccion) {
      seccion.innerHTML = ''; // Limpia antes de volver a agregar
    }
  });

  productos.forEach(producto => {
    const tipoId = producto.tipo.toLowerCase().replace(/\s+/g, "");
    const seccion = document.querySelector(`section#${tipoId} .row`);

    if (seccion) {
      const card = document.createElement("div");
      card.className = "col-md-4";
      card.innerHTML = `
        <div class="card h-100">
          <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" />
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text stock-${producto.id}" id="stock_${producto.id}">Stock: ${producto.cantidad}</p>
            <p class="card-text">$${producto.precio}</p>
          </div>
          <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
            <div class="text-center">
              <a class="btn btn-outline-dark mt-auto" data-product="${producto.id}" 
                 onclick="agregarAlCarrito(this)" ${producto.cantidad === 0 ? "class='disabled' onclick='return false'" : ""}>
                 ${producto.cantidad === 0 ? "Sin stock" : "Add to cart"}
              </a>
            </div>
          </div>
        </div>
      `;
      seccion.appendChild(card);
    } else {
      console.warn(`No se encontró la sección para tipo: ${producto.tipo} (id buscado: ${tipoId})`);
    }
  });
}


function abrirModalEliminarProducto(){
    document.getElementById('modalEliminarProducto').style.display = 'flex';
    document.getElementById('nombreEliminarProducto').value = ''; // Limpiar el campo

}
function cerrarModalEliminarProducto() {
    document.getElementById('modalEliminarProducto').style.display = 'none';
    document.getElementById('nombreEliminarProducto').value = ''; // Limpiar el campo
}
function eliminarProducto() {
    const nombreEliminar = document.getElementById('nombreEliminarProducto').value.trim();
    if (!nombreEliminar) {
        alert('Por favor, ingresa el nombre del producto a eliminar.');
        return;
    }

    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    const index = productos.findIndex(p => p.nombre.toLowerCase() === nombreEliminar.toLowerCase());

    if (index === -1) {
        alert('Producto no encontrado.');
        return;
    }

    productos.splice(index, 1);
    localStorage.setItem('productos', JSON.stringify(productos));

    cerrarModalEliminarProducto();
    alert('Producto eliminado correctamente.');

    if (typeof mostraSegunTipo === "function") {
        mostraSegunTipo();
    }
}

function abrirModalActualizarProducto(boton) {
  const card = boton.closest(".card");
  const idProducto = card.id;

  const productos = JSON.parse(localStorage.getItem("productos")) || [];
  const producto = productos.find(p => p.id === idProducto);

  if (!producto) {
    alert("Producto no encontrado.");
    return;
  }

  // Guardar el ID del producto para luego usar en actualizarProducto()
  idProductoSeleccionado = idProducto;

  // Cargar los datos en el modal
  document.getElementById('nombreActualizarProducto').value = producto.nombre;
  document.getElementById('cantidadActualizarProducto').value = producto.cantidad;
  document.getElementById('precioActualizarProducto').value = producto.precio;
  document.getElementById('tipoActualizarProducto').value = producto.tipo.toLowerCase();

  // Mostrar el modal
  document.getElementById('modalActualizarProducto').style.display = 'flex';
}
function cerrarModalActualizarProducto() {
    document.getElementById('modalActualizarProducto').style.display = 'none';
    document.getElementById('nombreActualizarProducto').value = ''; // Limpiar el campo
    document.getElementById('cantidadActualizarProducto').value = ''; // Limpiar el campo
    document.getElementById('precioActualizarProducto').value = ''; // Limpiar el campo
    document.getElementById('tipoActualizarProducto').value = ''; // Limpiar el campo
}

async function actualizarProducto(boton) {
  if (!idProductoSeleccionado) {
    alert("ID del producto no seleccionado.");
    return;
  }

  const nombreActualizar = document.getElementById('nombreActualizarProducto').value.trim();
  const cantidadActualizar = parseInt(document.getElementById('cantidadActualizarProducto').value);
  const precioActualizar = parseFloat(document.getElementById('precioActualizarProducto').value);
  const tipoActualizar = document.getElementById('tipoActualizarProducto').value.trim().toLowerCase();
  const file = document.getElementById('imagenActualizarProducto').files[0];

  if (!nombreActualizar || isNaN(cantidadActualizar) || cantidadActualizar < 0 || isNaN(precioActualizar) || precioActualizar < 0 || !tipoActualizar) {
    alert('Por favor completa todos los campos correctamente.');
    return;
  }

  let productos = JSON.parse(localStorage.getItem('productos')) || [];
  const index = productos.findIndex(p => p.id === idProductoSeleccionado);

  if (index === -1) {
    alert('Producto no encontrado.');
    return;
  }

  productos[index].nombre = nombreActualizar;
  productos[index].cantidad = cantidadActualizar;
  productos[index].precio = precioActualizar;
  productos[index].tipo = tipoActualizar;

  if (file) {
    try {
      productos[index].imagen = await imagenA64(file);
    } catch (err) {
      console.error('Error al convertir imagen:', err);
      alert('Error al actualizar la imagen.');
      return;
    }
  }

  localStorage.setItem('productos', JSON.stringify(productos));

  cerrarModalActualizarProducto();
  alert('Producto actualizado correctamente.');

  if (typeof mostraSegunTipo === "function") {
    mostraSegunTipo();
  }

  if (typeof mostrarProductosGuardados === "function") {
    mostrarProductosGuardados();
  }
}


