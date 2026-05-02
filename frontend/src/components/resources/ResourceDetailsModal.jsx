import React from 'react';
import { X, ExternalLink, User } from 'lucide-react';
import Badge from '../ui/Badge';

const ResourceDetailsModal = ({ resource, onClose }) => {
  if (!resource) return null;

  const { titulo, descripcion, url_enlace, image_url, dificultad, User: author } = resource;

  const difficultyVariant = {
    'Principiante': 'success',
    'Intermedio': 'warning',
    'Avanzado': 'danger',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="glass w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl p-0 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Cerrar Flotante */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/40 text-white hover:bg-black/60 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Imagen Cabecera */}
        {image_url && (
          <div className="w-full h-64 bg-surface">
            <img src={image_url} alt={titulo} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Contenido Principal */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant={difficultyVariant[dificultad]}>{dificultad}</Badge>
          </div>
          
          <h2 className="text-3xl font-bold text-textPrimary mb-6">{titulo}</h2>

          <div className="prose prose-invert max-w-none text-textMuted mb-8 whitespace-pre-wrap">
            {descripcion || 'Sin descripción disponible.'}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-6 border-t border-border/50">
            {/* Autor */}
            <div className="flex items-center gap-3 text-sm text-textMuted">
              <div className="bg-surface p-2 rounded-full">
                <User size={18} className="text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider opacity-70">Aportado por</span>
                <span className="font-medium text-textPrimary text-base">{author?.nombre_usuario || 'Anónimo'}</span>
                <span className="text-primary text-xs">{author?.rol || 'Usuario'}</span>
              </div>
            </div>

            {/* Enlace Externo */}
            {url_enlace && (
              <a
                href={url_enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-3 px-6 flex items-center gap-2 shadow-lg shadow-primary/25 w-full sm:w-auto justify-center"
              >
                Abrir Recurso Original
                <ExternalLink size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailsModal;
