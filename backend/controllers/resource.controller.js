const { Op } = require('sequelize');
const Resource = require('../models/resource.model');
const User = require('../models/user.model');

// Obtener recursos con paginación y filtros
exports.getResources = async (req, res) => {
  try {
    const { search, dificultad } = req.query;
    
    // Construir filtros
    const where = {};
    if (search) {
      where.titulo = { [Op.iLike]: `%${search}%` };
    }
    if (dificultad) {
      where.dificultad = dificultad;
    }

    const resources = await Resource.findAll({
      where,
      limit: 50,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          attributes: ['nombre_usuario', 'rol'], // Incluir créditos del autor
        }
      ]
    });

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener recursos.', error: error.message });
  }
};

// Crear un nuevo recurso
exports.createResource = async (req, res) => {
  try {
    const { titulo, descripcion, url_enlace, image_url, dificultad } = req.body;
    
    // req.user viene del middleware de autenticación (JWT)
    const id_user = req.user.id; 

    if (!titulo || !dificultad) {
      return res.status(400).json({ message: 'Título y Dificultad son obligatorios.' });
    }

    const newResource = await Resource.create({
      titulo,
      descripcion,
      url_enlace,
      image_url,
      dificultad,
      id_user
    });

    res.status(201).json({
      message: 'Recurso publicado exitosamente.',
      resource: newResource
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al publicar recurso.', error: error.message });
  }
};

// Eliminar un recurso
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const id_user = req.user.id;

    // Buscar el recurso
    const resource = await Resource.findByPk(id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Recurso no encontrado.' });
    }

    // Verificar autoría
    if (resource.id_user !== id_user) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este recurso.' });
    }

    await resource.destroy();

    res.status(200).json({ message: 'Recurso eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar recurso.', error: error.message });
  }
};
