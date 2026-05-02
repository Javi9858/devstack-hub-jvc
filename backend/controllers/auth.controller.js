const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Registro de usuario
exports.register = async (req, res) => {
  try {
    const { email, password, role, username } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { correo: email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario
    const newUser = await User.create({
      nombre_usuario: username || email.split('@')[0],
      correo: email,
      password: hashedPassword,
      rol: role || 'Estudiante'
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      user: {
        id: newUser.id_user,
        email: newUser.correo,
        role: newUser.rol
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor.', error: error.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ where: { correo: email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas.' });
    }

    // Generar JWT
    const payload = {
      id: user.id_user,
      email: user.correo,
      role: user.rol
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(200).json({
      message: 'Login exitoso.',
      token,
      user: payload
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor.', error: error.message });
  }
};
