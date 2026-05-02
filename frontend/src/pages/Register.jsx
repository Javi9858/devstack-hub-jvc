import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { UserPlus } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Estudiante'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError('Correo y contraseña son obligatorios');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    const result = await register(formData.email, formData.password, formData.role);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-bold">Crear Cuenta</h1>
          <p className="text-textMuted mt-2">Únete a DevStack Hub</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input 
            label="Correo Electrónico" 
            type="email" 
            name="email"
            placeholder="tu@correo.com"
            value={formData.email}
            onChange={handleChange}
          />
          <Input 
            label="Contraseña" 
            type="password" 
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
          />
          
          <div className="flex flex-col space-y-1 mb-4">
            <label className="text-sm font-medium text-textMuted">Rol</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-premium appearance-none"
            >
              <option value="Estudiante">Estudiante</option>
              <option value="Profesional">Profesional</option>
              <option value="Entusiasta">Entusiasta</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
          
          <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
            Registrarse
          </Button>
        </form>

        <p className="text-center text-textMuted mt-6 text-sm">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-primary hover:underline">Inicia Sesión</Link>
        </p>
      </Card>
    </div>
  );
};
