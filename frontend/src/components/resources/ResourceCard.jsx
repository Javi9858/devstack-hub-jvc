import React from 'react';
import { ExternalLink, User, BookOpen, Trash2 } from 'lucide-react';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';

const ResourceCard = ({ resource, onClick, onDelete }) => {
  const { user } = useAuth();
  const { id_resource, titulo, descripcion, url_enlace, image_url, dificultad, id_user, User: author } = resource;

  const difficultyVariant = {
    'Principiante': 'success',
    'Intermedio': 'warning',
    'Avanzado': 'danger',
  };

  const isAuthor = user?.id === id_user;

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(id_resource);
  };

  return (
    <div 
      onClick={() => onClick(resource)}
      className="glass p-6 rounded-2xl flex flex-col h-full transition-all duration-300 hover:translate-y-[-4px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer relative group"
    >
      {/* Botón Eliminar (Solo Autor) */}
      {isAuthor && (
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
          title="Eliminar Recurso"
        >
          <Trash2 size={16} />
        </button>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4 gap-4 pr-8">
        <h3 className="text-xl font-bold text-textPrimary leading-tight">
          {titulo}
        </h3>
        <Badge variant={difficultyVariant[dificultad]}>
          {dificultad}
        </Badge>
      </div>

      {/* Image (Optional) */}
      {image_url && (
        <div className="w-full h-40 mb-4 rounded-xl overflow-hidden bg-surface">
          <img src={image_url} alt={titulo} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Description */}
      <p className="text-textMuted text-sm line-clamp-3 mb-6 flex-grow">
        {descripcion || 'Sin descripción disponible.'}
      </p>

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-border/50 flex flex-wrap justify-between items-center gap-3">
        {/* Author Credits */}
        <div className="flex items-center gap-2 text-sm text-textMuted min-w-0">
          <div className="bg-surface p-1.5 rounded-full shrink-0">
            <User size={14} className="text-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-medium text-textPrimary truncate">{author?.nombre_usuario || 'Anónimo'}</span>
            <span className="text-xs opacity-80 truncate">{author?.rol || 'Usuario'}</span>
          </div>
        </div>

        {/* Action Button */}
        {url_enlace ? (
          <a
            href={url_enlace}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Evita que se abra el modal si se hace clic aquí
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors text-sm font-medium shrink-0 whitespace-nowrap ml-auto"
          >
            Ver Recurso
            <ExternalLink size={16} />
          </a>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-surface text-textMuted rounded-lg text-sm font-medium cursor-not-allowed shrink-0 ml-auto">
            <BookOpen size={16} />
            Sin Enlace
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceCard;
