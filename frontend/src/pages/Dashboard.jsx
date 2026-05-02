import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Filter, LogOut, Settings } from 'lucide-react';
import api from '../services/api';
import ResourceCard from '../components/resources/ResourceCard';
import { ResourceCardSkeleton } from '../components/ui/Skeleton';
import ResourceForm from '../components/resources/ResourceForm';
import ResourceDetailsModal from '../components/resources/ResourceDetailsModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import ProfileModal from '../components/profile/ProfileModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  // Fetch Resources
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filterDifficulty) params.append('dificultad', filterDifficulty);

      const response = await api.get(`/resources?${params.toString()}`);
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterDifficulty]);

  useEffect(() => {
    // Debounce for search
    const delayDebounceFn = setTimeout(() => {
      fetchResources();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterDifficulty, fetchResources]);

  const handleResourceAdded = (newResource) => {
    // Optimistically add the new resource with the current user's data
    const completeResource = {
      ...newResource,
      User: {
        nombre_usuario: user.nombre_usuario || user.email.split('@')[0],
        rol: user.role
      }
    };
    setResources([completeResource, ...resources]);
  };

  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;
    try {
      await api.delete(`/resources/${resourceToDelete}`);
      setResources(resources.filter((res) => res.id_resource !== resourceToDelete));
      setResourceToDelete(null);
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert(error.response?.data?.message || 'Error al eliminar el recurso.');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10 glass p-6 rounded-2xl">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Biblioteca Colaborativa</h1>
          <p className="text-textMuted mt-1">Descubre y comparte los mejores recursos técnicos.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="font-medium text-textPrimary">{user?.email}</span>
            <span className="text-xs text-primary">{user?.role}</span>
          </div>
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="p-3 bg-surface hover:bg-black/20 text-textMuted hover:text-textPrimary rounded-xl transition-colors"
            title="Mi Perfil"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={logout}
            className="p-3 bg-surface hover:bg-red-500/10 hover:text-red-500 text-textMuted rounded-xl transition-colors"
            title="Cerrar Sesión"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Toolbar: Search, Filter, Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted">
            <Search size={20} />
          </div>
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface border border-border/50 rounded-xl py-3 pl-12 pr-4 text-textPrimary focus:outline-none focus:border-primary transition-colors shadow-sm"
            />
        </div>

        <div className="flex gap-4">
          <div className="relative min-w-[160px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-textMuted">
              <Filter size={18} />
            </div>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full bg-surface border border-border/50 rounded-xl py-3 pl-10 pr-8 text-textPrimary focus:outline-none focus:border-primary transition-colors appearance-none shadow-sm cursor-pointer"
            >
              <option value="" className="bg-[#1a1a1a] text-textPrimary">Cualquier dificultad</option>
              <option value="Principiante" className="bg-[#1a1a1a] text-textPrimary">Principiante</option>
              <option value="Intermedio" className="bg-[#1a1a1a] text-textPrimary">Intermedio</option>
              <option value="Avanzado" className="bg-[#1a1a1a] text-textPrimary">Avanzado</option>
            </select>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="btn-primary flex items-center gap-2 px-6 shadow-lg shadow-primary/25 whitespace-nowrap"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Publicar</span>
          </button>
        </div>
      </div>

      {/* Grid de Recursos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Skeletons
          Array.from({ length: 8 }).map((_, i) => <ResourceCardSkeleton key={i} />)
        ) : resources.length > 0 ? (
          // Tarjetas Reales
          resources.map((resource) => (
            <ResourceCard 
              key={resource.id_resource} 
              resource={resource} 
              onClick={setSelectedResource}
              onDelete={setResourceToDelete}
            />
          ))
        ) : (
          // Empty State
          <div className="col-span-full py-20 text-center glass rounded-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface mb-4">
              <Search size={32} className="text-textMuted" />
            </div>
            <h3 className="text-xl font-medium text-textPrimary mb-2">No se encontraron recursos</h3>
            <p className="text-textMuted max-w-md mx-auto">
              {searchTerm 
                ? `No hay coincidencias para "${searchTerm}". Intenta con otros términos.`
                : "Aún no hay recursos publicados. ¡Sé el primero en aportar!"}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Publicación */}
      {isFormOpen && (
        <ResourceForm 
          onClose={() => setIsFormOpen(false)} 
          onResourceAdded={handleResourceAdded} 
        />
      )}

      {/* Modal de Detalles */}
      <ResourceDetailsModal 
        resource={selectedResource} 
        onClose={() => setSelectedResource(null)} 
      />

      {/* Modal de Confirmación de Eliminación */}
      <ConfirmModal
        isOpen={!!resourceToDelete}
        onClose={() => setResourceToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="¿Eliminar Recurso?"
        message="¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer y el contenido desaparecerá de la biblioteca."
        confirmText="Eliminar permanentemente"
        cancelText="Cancelar"
      />

      {/* Modal de Perfil */}
      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;
