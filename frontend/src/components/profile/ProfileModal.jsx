import React, { useState } from 'react';
import { X, Loader, User as UserIcon, Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const ProfileModal = ({ onClose }) => {
  const { user, updateLocalUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('datos'); // 'datos', 'seguridad', 'eliminar'
  
  // States for 'datos' tab
  const [formData, setFormData] = useState({
    nombre_usuario: user?.nombre_usuario || '',
    correo: user?.correo || '',
  });

  // States for 'seguridad' tab
  const [passwordData, setPasswordData] = useState({
    password_actual: '',
    nuevo_password: '',
  });

  // State for 'eliminar' tab
  const [keepResources, setKeepResources] = useState(true);

  // General States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleDataChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const dataToSend = activeTab === 'datos' ? formData : passwordData;

    try {
      const response = await api.put('/users/profile', dataToSend);
      updateLocalUser(response.data.user);
      setSuccess(response.data.message);
      if (activeTab === 'seguridad') {
        setPasswordData({ password_actual: '', nuevo_password: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.delete('/users/profile', { data: { keepResources } });
      onClose();
      logout();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar la cuenta.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-2xl rounded-2xl relative overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-surface border-b md:border-b-0 md:border-r border-border/50 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-textPrimary mb-6">Mi Perfil</h2>
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto">
            <button
              onClick={() => { setActiveTab('datos'); setError(null); setSuccess(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${activeTab === 'datos' ? 'bg-primary/20 text-primary font-medium' : 'text-textMuted hover:bg-black/20 hover:text-textPrimary'}`}
            >
              <UserIcon size={18} /> Datos Personales
            </button>
            <button
              onClick={() => { setActiveTab('seguridad'); setError(null); setSuccess(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${activeTab === 'seguridad' ? 'bg-primary/20 text-primary font-medium' : 'text-textMuted hover:bg-black/20 hover:text-textPrimary'}`}
            >
              <Lock size={18} /> Seguridad
            </button>
            <div className="md:mt-auto pt-2">
              <button
                onClick={() => { setActiveTab('eliminar'); setError(null); setSuccess(null); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${activeTab === 'eliminar' ? 'bg-red-500/20 text-red-500 font-medium' : 'text-red-500/70 hover:bg-red-500/10 hover:text-red-500'}`}
              >
                <AlertTriangle size={18} /> Eliminar Cuenta
              </button>
            </div>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-textMuted hover:text-textPrimary bg-surface rounded-full transition-colors"
          >
            <X size={20} />
          </button>

          <div className="h-full flex flex-col pt-4">
            {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">{error}</div>}
            {success && <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-lg mb-6 text-sm">{success}</div>}

            {activeTab === 'datos' && (
              <form onSubmit={handleUpdateProfile} className="flex flex-col h-full animate-fade-in">
                <h3 className="text-lg font-semibold text-textPrimary mb-4">Información Básica</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Nombre de Usuario</label>
                    <input
                      type="text"
                      name="nombre_usuario"
                      value={formData.nombre_usuario}
                      onChange={handleDataChange}
                      required
                      className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      name="correo"
                      value={formData.correo}
                      onChange={handleDataChange}
                      required
                      className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="mt-auto pt-6 flex justify-end">
                  <button type="submit" disabled={loading} className="btn-primary py-3 px-8 w-full sm:w-auto">
                    {loading ? <Loader className="animate-spin mx-auto" size={20} /> : 'Guardar Datos'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'seguridad' && (
              <form onSubmit={handleUpdateProfile} className="flex flex-col h-full animate-fade-in">
                <h3 className="text-lg font-semibold text-textPrimary mb-4">Cambiar Contraseña</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Contraseña Actual</label>
                    <input
                      type="password"
                      name="password_actual"
                      value={passwordData.password_actual}
                      onChange={handlePasswordChange}
                      required
                      className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-textMuted mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      name="nuevo_password"
                      value={passwordData.nuevo_password}
                      onChange={handlePasswordChange}
                      required
                      minLength={6}
                      className="w-full bg-surface border border-border/50 rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="mt-auto pt-6 flex justify-end">
                  <button type="submit" disabled={loading} className="btn-primary py-3 px-8 w-full sm:w-auto">
                    {loading ? <Loader className="animate-spin mx-auto" size={20} /> : 'Actualizar Contraseña'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'eliminar' && (
              <div className="flex flex-col h-full animate-fade-in">
                <h3 className="text-lg font-semibold text-red-500 mb-4">Eliminar Cuenta Definitivamente</h3>
                <p className="text-textMuted mb-6 text-sm">
                  Estás a punto de eliminar tu cuenta permanentemente. Perderás el acceso a la plataforma.
                </p>
                
                <div className="bg-surface p-4 rounded-xl border border-border/50 mb-6">
                  <p className="font-medium text-textPrimary mb-2 text-sm">¿Qué hacemos con tus recursos publicados?</p>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="pt-0.5">
                      <input 
                        type="checkbox" 
                        checked={keepResources}
                        onChange={() => setKeepResources(!keepResources)}
                        className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary focus:ring-offset-glass bg-glass"
                      />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-textPrimary block group-hover:text-primary transition-colors">Conservarlos como "Aporte Anónimo"</span>
                      <span className="text-xs text-textMuted">Tus recursos seguirán ayudando a la comunidad, pero sin tu nombre. Si desmarcas esto, todos tus recursos se eliminarán.</span>
                    </div>
                  </label>
                </div>

                <div className="mt-auto pt-6">
                  <button 
                    onClick={handleDeleteProfile}
                    disabled={loading} 
                    className="w-full py-3 px-8 bg-red-500 text-white hover:bg-red-600 rounded-xl font-medium transition-colors shadow-lg shadow-red-500/20"
                  >
                    {loading ? <Loader className="animate-spin mx-auto" size={20} /> : 'Sí, Eliminar Mi Cuenta'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
