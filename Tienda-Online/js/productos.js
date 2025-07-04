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
    const tipo = document.getElementById('tipoProducto').value.trim();
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
            tipo,
            imagen: imagenBase64
        };

        productos.push(nuevoProducto);
        localStorage.setItem('productos', JSON.stringify(productos));

        cerrarModalProducto();
        alert('Producto agregado correctamente.');
        console.log('Producto guardado en localStorage:', nuevoProducto);

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
                        <p class="card-text"><em>Tipo: ${producto.tipo}</em></p>
                    </div>
                </div>
                <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                    <div class="text-center">
                        <a class="btn btn-outline-dark mt-auto" onclick="agregarAlCarrito(this)">Add to cart</a>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}
