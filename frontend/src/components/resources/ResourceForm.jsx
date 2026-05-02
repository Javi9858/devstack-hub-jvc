import React, { useState } from 'react';
import { X, Loader } from 'lucide-react';
import api from '../../services/api';

const ResourceForm = ({ onClose, onResourceAdded }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    url_enlace: '',
    image_url: '',
    dificultad: 'Principiante',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/resources', formData);
      onResourceAdded(response.data.resource);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al publicar el recurso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass w-full max-w-2xl rounded-2xl p-6 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-textMuted hover:text-textPrimary bg-surface rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-textPrimary">Publicar Nuevo Recurso</h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Título *</label>
            <input
              type="text"
              name="titulo"
              required
              value={formData.titulo}
              onChange={handleChange}
              className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors"
              placeholder="Ej. Curso Completo de React"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Descripción</label>
            <textarea
              name="descripcion"
              rows="3"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Describe brevemente de qué trata..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">URL del Recurso</label>
              <input
                type="url"
                name="url_enlace"
                value={formData.url_enlace}
                onChange={handleChange}
                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1">URL de Imagen (Opcional)</label>
              <input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                placeholder="https://.../imagen.png"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Dificultad *</label>
            <select
              name="dificultad"
              value={formData.dificultad}
              onChange={handleChange}
              className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors appearance-none"
            >
              <option value="Principiante" className="bg-[#1a1a1a] text-textPrimary">Principiante</option>
              <option value="Intermedio" className="bg-[#1a1a1a] text-textPrimary">Intermedio</option>
              <option value="Avanzado" className="bg-[#1a1a1a] text-textPrimary">Avanzado</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium text-textMuted hover:text-textPrimary bg-surface transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary py-3 px-8 flex items-center justify-center min-w-[140px]"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : 'Publicar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceForm;
