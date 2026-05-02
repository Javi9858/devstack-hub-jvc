require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Probar conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a PostgreSQL establecida correctamente.');

    // Sincronizar modelos (pasivo, respeta el esquema manual)
    await sequelize.sync();
    console.log('Modelos sincronizados con la base de datos.');

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log(`Swagger Docs disponibles en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
    process.exit(1);
  }
}

startServer();
