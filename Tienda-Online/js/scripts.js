
let sesionActiva = false;

const PRODUCT_IDS = [
    'Silent_Hill2', 'DMC5', 'RE7', 'Skyrim', 'Bayoneta3', 'Switch', 
    'Play_Slim_4', 'Xbon_One_x', 'Mando_PS5', 'Audifonos_Argolla', 
    'Cargador_Ps4', 'Expedition33', 'Oblivion', 'FatalFury', 'Rust', 'Baldurs_Gate3'
];

function agregarAlCarrito(boton) {
    const card = boton.closest(".card");
    const productoId = card.id;
    
    if (!PRODUCT_IDS.includes(productoId)) {
        console.error("ID de producto no válido:", productoId);
        return;
    }
    
    if (actualizarStock(productoId)) {
        const nombre = card.querySelector(".fw-bolder").textContent.trim();
        let precioTexto = card.querySelector(".card-text").textContent.trim();
        let precio = precioTexto.replace("$", "").trim();
        const imagen = card.querySelector("img").src;
        const producto = { nombre, precio, imagen, id: productoId };
        
        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito.push(producto);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContadorCarrito();
    } else {
        alert("No hay suficiente stock disponible");
    }
}

function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contador = document.getElementById("cantidad_carrito");
    if (contador) contador.textContent = carrito.length;
}

function actualizarStock(productoId) {
    const stockSpan = document.getElementById(`stock_${productoId}`);
    
    if (!stockSpan) {
        console.error("Elemento de stock no encontrado para:", productoId);
        return false;
    }
    
    let stockActual = parseInt(stockSpan.textContent.trim()) || 0;

    if (stockActual > 0) {
        stockActual -= 1;
        stockSpan.textContent = stockActual;
        localStorage.setItem(`stock_${productoId}`, stockActual);

        document.querySelectorAll(`.card .stock-${productoId}`).forEach(el => {
            el.textContent = `Stock: ${stockActual}`;
        });

        if (stockActual === 0) {
            document.querySelectorAll(`.card .btn[data-product="${productoId}"]`).forEach(boton => {
                boton.classList.add("disabled");
                boton.onclick = null;
                boton.textContent = "Sin stock";
            });
        }
        return true;
    }
    return false;
}

function inicializarStocks() {
    PRODUCT_IDS.forEach(productoId => {
        const stockSpan = document.getElementById(`stock_${productoId}`);
        if (stockSpan) {
            const stockGuardado = localStorage.getItem(`stock_${productoId}`);
            const stockActual = stockGuardado !== null ? parseInt(stockGuardado) : parseInt(stockSpan.textContent.trim()) || 0;
            stockSpan.textContent = stockActual;
            
            document.querySelectorAll(`.card .stock-${productoId}`).forEach(el => {
                el.textContent = `Stock: ${stockActual}`;
            });

            if (stockActual === 0) {
                document.querySelectorAll(`.card .btn[data-product="${productoId}"]`).forEach(boton => {
                    boton.classList.add("disabled");
                    boton.onclick = null;
                    boton.textContent = "Sin stock";
                });
            }
        }
    });
}

function cargarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const contenedor = document.getElementById("carrito");
    const totalElement = document.getElementById("total");
    let total = 0;

    if (contenedor) {
        contenedor.innerHTML = ''; 

        carrito.forEach((producto, index) => {
            total += parseFloat(producto.precio); 
            const card = document.createElement("div");
            card.className = "col";
            card.innerHTML = `
                <div class="card h-100">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">$${producto.precio}</p>
                        <button class="btn btn-danger" onclick="eliminarDelCarrito(${index})">Eliminar</button>
                    </div>
                </div>
            `;
            contenedor.appendChild(card);
        });

        if (totalElement) totalElement.textContent = total.toFixed(2); 
    }
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    
    if (index < 0 || index >= carrito.length) return;
    
    const productoEliminado = carrito[index];
    const productoId = productoEliminado.id;
    
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    const stockSpan = document.getElementById(`stock_${productoId}`);
    if (stockSpan) {
        let stockActual = parseInt(stockSpan.textContent.trim()) || 0;
        stockActual += 1;
        stockSpan.textContent = stockActual;
        localStorage.setItem(`stock_${productoId}`, stockActual);
        
        document.querySelectorAll(`.card .stock-${productoId}`).forEach(el => {
            el.textContent = `Stock: ${stockActual}`;
        });
        
        if (stockActual === 1) {
            document.querySelectorAll(`.card .btn[data-product="${productoId}"]`).forEach(boton => {
                boton.classList.remove("disabled");
                boton.onclick = function() { agregarAlCarrito(this); };
                boton.textContent = "Añadir al carrito";
            });
        }
    }
    
    cargarCarrito();
    actualizarContadorCarrito();
}

function realizarPago() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((acc, producto) => acc + parseFloat(producto.precio), 0);

    if (carrito.length > 0) {
        if (!sesionActiva) {
            alert('Debe iniciar sesión para completar la compra');
            cargarPaginas('Login');
        } else {
            if (confirm(`El total a pagar es $${total.toFixed(2)}. ¿Deseas finalizar el pago?`)) {
                localStorage.removeItem("carrito");
                alert("¡Gracias por tu compra!");
                cargarCarrito();
                actualizarContadorCarrito();
            }
        }
    } else {
        alert("El carrito está vacío. No puedes realizar el pago.");
    }
}

function aumentarStock(productoId) {
    const stockSpan = document.getElementById(`stock_${productoId}`);
    if (!stockSpan) return false;
    
    let stockActual = parseInt(stockSpan.textContent.replace('Stock:', '').trim()) || 0;
    stockActual += 1;
    stockSpan.textContent = ` ${stockActual}`;
    
    localStorage.setItem(`stock_${productoId}`, stockActual);
    actualizarEstadoProducto(productoId, stockActual);
    return true;
}


function disminuirStock(productoId) {
    const stockSpan = document.getElementById(`stock_${productoId}`);
    if (!stockSpan) return false;
    
    let stockActual = parseInt(stockSpan.textContent.replace('Stock:', '').trim()) || 0;
    if (stockActual > 0) {
        stockActual -= 1;
        stockSpan.textContent = ` ${stockActual}`;
        
        localStorage.setItem(`stock_${productoId}`, stockActual);
        actualizarEstadoProducto(productoId, stockActual);
        return true;
    }
    return false;
}


function actualizarEstadoProducto(productoId, stockActual) {
    
    document.querySelectorAll(`.stock-${productoId}`).forEach(el => {
        el.textContent = `Stock: ${stockActual}`;
    });

    
    const btnRestar = document.getElementById(`btn_restar_${productoId}`);
    if (btnRestar) {
        btnRestar.disabled = stockActual === 0;
    }

    
    document.querySelectorAll(`.btn[data-product="${productoId}"]`).forEach(boton => {
        if (stockActual === 0) {
            boton.classList.add("disabled");
            boton.onclick = null;
            boton.textContent = "Sin stock";
        } else {
            boton.classList.remove("disabled");
            boton.onclick = function() { agregarAlCarrito(this); };
            boton.textContent = "Añadir al carrito";
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    inicializarStocks();
   
});
function Login() {
    let emailInput = document.getElementById('txt_email_login');
    let passwordInput = document.getElementById('txt_password_login');
    let email = emailInput.value;
    let password = passwordInput.value;

    if (email === "alexandertoapanata05@gmail.com" && password === "12346") {
    sesionActiva = true;
    document.getElementById('btn_Login').style.display = 'none';
    document.getElementById('btn_usuario').style.display = 'inline-block';
    alert('Inicio de sesión correcto');
    cargarPaginas('index');
} else if (email === "ajtoapanta6@espe.edu.ec" && password === "12345") {
    sesionActiva = true;
    document.getElementById('btn_Login').style.display = 'none';
    document.getElementById('btn_Stock').style.display = 'inline-block';
    document.getElementById('btn_admin').style.display = 'inline-block';
    alert('Inicio de sesión correcto');
    cargarPaginas('index');
} else {
    alert('Correo o contraseña erróneos');
    emailInput.value = '';
    passwordInput.value = '';
    emailInput.focus();
}
}

function CerrarSesion(){
    document.getElementById('btn_usuario').style.display='none';
    document.getElementById('btn_Login').style.display='inline-block';
    document.getElementById('btn_admin').style.display = 'none';
    document.getElementById('btn_Stock').style.display = 'none';
    alert('Sesion cerrada correctamente');
    cargarPaginas('index');
}
