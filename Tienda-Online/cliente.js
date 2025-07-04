let stock = {};

async function cargarStock() {
    const res = await fetch("http://localhost:3000/stock");
    stock = await res.json();
    document.getElementById("stock_prub").value = stock["Prueba"];
}

async function actualizarStockServidor() {
    await fetch("http://localhost:3000/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stock)
    });
}

async function agregarAlCarrito(boton) {
    const id = "stock_prub"; 
    if (stock[id] <= 0) {
        alert("Sin stock disponible");
        return;
    }

    stock[id]--;
    document.getElementById("stock_prub").value = stock[id];
    await actualizarStockServidor();

    
}

async function eliminarDelCarrito(index) {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const id = "stock_prub";
    stock[id]++;
    document.getElementById("stock_prub").value = stock[id];
    await actualizarStockServidor();

    
}
