const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbUrl = process.env.DATABASE_URL;
let sequelize;

try {
  // Extraemos las partes manualmente para evitar que el constructor de Sequelize
  // falle con "URI malformed" debido a caracteres especiales en el password.
  const withoutProtocol = dbUrl.replace(/^postgres(ql)?:\/\//, '');
  
  // El último '@' separa el usuario:password del host:port/db
  const lastAtIndex = withoutProtocol.lastIndexOf('@');
  const authPart = withoutProtocol.substring(0, lastAtIndex);
  const restPart = withoutProtocol.substring(lastAtIndex + 1);
  
  // El primer ':' en la parte auth separa el usuario del password
  const firstColonIndex = authPart.indexOf(':');
  const username = authPart.substring(0, firstColonIndex);
  const password = authPart.substring(firstColonIndex + 1);
  
  // El primer '/' en la parte rest separa el host:port de la base de datos
  const firstSlashIndex = restPart.indexOf('/');
  const hostPort = restPart.substring(0, firstSlashIndex);
  const database = restPart.substring(firstSlashIndex + 1);
  
  // El ':' en hostPort separa host de puerto
  const [host, port] = hostPort.split(':');

  sequelize = new Sequelize(database, username, password, {
    host,
    port: port || 5432,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  });
} catch (error) {
  // Fallback final
  sequelize = new Sequelize(dbUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
  });
}

module.exports = sequelize;
