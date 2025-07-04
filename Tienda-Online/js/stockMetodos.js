const { MongoClient } = require("mongodb");
const Conexion = require("./conexion");

class StockMetodos {
  constructor() {
    this.conn = new Conexion();
    this.conn.crearConexion().then(() => {
      this.database = this.conn.getDataB();
      this.stockCollection = this.database.collection("Stock"); // Nombre de la colección
    });
  }

  // Método para guardar el stock
  async guardarStock(stock) {
    try {
      const doc = {
        stock_prub: stock, // Aquí guardamos el stock en el campo 'stock_prub'
      };

      await this.stockCollection.updateOne({}, { $set: doc }, { upsert: true }); // Usamos 'upsert' para que lo inserte si no existe
      console.log("Stock guardado en MongoDB");
      return true;
    } catch (e) {
      console.error("Error al guardar el stock:", e);
      return false;
    }
  }

  // Método para cargar solo el campo 'stock_prub'
  async cargarStock() {
    try {
      // Buscamos el primer documento y solo traemos el campo 'stock_prub'
      const documento = await this.stockCollection.findOne({}, { projection: { stock_prub: 1 } });

      if (documento) {
        return documento.stock_prub;
      } else {
        console.log("No se encontró stock");
        return null;
      }
    } catch (e) {
      console.error("Error al cargar el stock:", e);
      return null;
    }
  }
}

module.exports = StockMetodos;
