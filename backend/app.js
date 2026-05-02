const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const { swaggerUi, specs } = require('./swagger');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/resources', require('./routes/resource.routes'));
app.use('/api/users', require('./routes/user.routes'));

// Ruta de estado
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API funcionando correctamente' });
});

module.exports = app;
