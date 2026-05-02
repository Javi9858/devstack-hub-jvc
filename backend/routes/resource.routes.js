const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resource.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/resources:
 *   get:
 *     summary: Obtiene la lista de recursos (Biblioteca)
 *     tags: [Resources]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por título
 *       - in: query
 *         name: dificultad
 *         schema:
 *           type: string
 *           enum: [Principiante, Intermedio, Avanzado]
 *         description: Filtrar por dificultad
 *     responses:
 *       200:
 *         description: Lista de recursos (limitado a 50)
 */
router.get('/', resourceController.getResources);

/**
 * @swagger
 * /api/resources:
 *   post:
 *     summary: Publica un nuevo recurso
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - dificultad
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               url_enlace:
 *                 type: string
 *               image_url:
 *                 type: string
 *               dificultad:
 *                 type: string
 *                 enum: [Principiante, Intermedio, Avanzado]
 *     responses:
 *       201:
 *         description: Recurso publicado exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/', authMiddleware, resourceController.createResource);

/**
 * @swagger
 * /api/resources/{id}:
 *   delete:
 *     summary: Elimina un recurso por ID (solo el autor)
 *     tags: [Resources]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Recurso eliminado
 *       403:
 *         description: No autorizado (no es el autor)
 *       404:
 *         description: Recurso no encontrado
 */
router.delete('/:id', authMiddleware, resourceController.deleteResource);

module.exports = router;
