const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil
 * 
 *   put:
 *     summary: Actualiza el perfil del usuario (datos y/o contraseña)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_usuario:
 *                 type: string
 *               correo:
 *                 type: string
 *               password_actual:
 *                 type: string
 *               nuevo_password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Perfil actualizado
 *       400:
 *         description: Error de validación (correo en uso o contraseña incorrecta)
 * 
 *   delete:
 *     summary: Elimina la cuenta del usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               keepResources:
 *                 type: boolean
 *                 description: Si es true, los recursos se vuelven anónimos en lugar de borrarse
 *     responses:
 *       200:
 *         description: Cuenta eliminada
 */
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, userController.updateProfile);
router.delete('/profile', authMiddleware, userController.deleteProfile);

module.exports = router;
