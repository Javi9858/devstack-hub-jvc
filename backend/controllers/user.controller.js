const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Resource = require('../models/resource.model');

// Obtener perfil actual
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'reset_password_token', 'reset_password_expires'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil.', error: error.message });
  }
};

// Actualizar perfil (Datos y/o Contraseña)
exports.updateProfile = async (req, res) => {
  try {
    const { nombre_usuario, correo, password_actual, nuevo_password } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    // Actualizar datos básicos
    if (nombre_usuario) user.nombre_usuario = nombre_usuario;
    
    if (correo && correo !== user.correo) {
      // Verificar si el nuevo correo ya existe
      const existingUser = await User.findOne({ where: { correo } });
      if (existingUser) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso.' });
      }
      user.correo = correo;
    }

    // Actualizar contraseña si se proporciona
    if (nuevo_password) {
      if (!password_actual) {
        return res.status(400).json({ message: 'Debe proporcionar la contraseña actual para cambiarla.' });
      }

      const isMatch = await bcrypt.compare(password_actual, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'La contraseña actual es incorrecta.' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(nuevo_password, salt);
    }

    await user.save();

    // Retornar datos actualizados sin la contraseña
    const userData = user.toJSON();
    delete userData.password;
    delete userData.reset_password_token;
    delete userData.reset_password_expires;

    res.status(200).json({
      message: 'Perfil actualizado exitosamente.',
      user: userData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el perfil.', error: error.message });
  }
};

// Eliminar cuenta
exports.deleteProfile = async (req, res) => {
  try {
    const { keepResources } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    if (keepResources) {
      // Convertir recursos a anónimos (id_user = null)
      await Resource.update(
        { id_user: null },
        { where: { id_user: userId } }
      );
    } else {
      // Eliminar recursos permanentemente
      await Resource.destroy({ where: { id_user: userId } });
    }

    // Eliminar el usuario
    await user.destroy();

    res.status(200).json({ message: 'Cuenta eliminada exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la cuenta.', error: error.message });
  }
};
