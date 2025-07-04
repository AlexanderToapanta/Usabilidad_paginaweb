const { MongoClient } = require("mongodb");


const uri = "mongodb+srv://ajtoapanta6:12345@cluster0.gsl7pbw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);


const datosStock = {
    "producto1": "10",
    "producto2": "20",
    "producto3": "15"
};
app.get("/stock/:producto", async (req, res) => {
    try {
        const producto = req.params.producto;
        const stockDoc = await stockCollection.findOne({});
        
        if (stockDoc && stockDoc.stock && stockDoc.stock[producto]) {
            const stockCantidad = stockDoc.stock[producto];
            res.json({ stock: stockCantidad });
        } else {
            res.status(404).send("Producto no encontrado en el stock.");
        }
    } catch (err) {
        res.status(500).send("Error obteniendo stock desde MongoDB.");
    }
});
async function cargarStock() {
    try {
        
        await client.connect();
        const db = client.db("Prueba");
        const stockCollection = db.collection("Stock");

        const stockDoc = await stockCollection.findOne({});

        if (!stockDoc) {
            
            await stockCollection.insertOne({ stock: datosStock });
            console.log("Documento de stock creado con los datos iniciales.");
        } else {
            
            const nuevoStock = {
                ...stockDoc, 
                stock: {
                    ...stockDoc.stock,  
                    ...datosStock       
                }
            };

            await stockCollection.updateOne(
                {},
                { $set: { stock: nuevoStock.stock } },
                { upsert: true }
            );
            console.log("Stock actualizado, manteniendo los datos anteriores.");
        }
    } catch (err) {
        console.error("Error al cargar datos en MongoDB:", err);
    } finally {
        
        await client.close();
    }
}

cargarStock();


