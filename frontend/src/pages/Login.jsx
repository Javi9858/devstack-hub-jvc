import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { LogIn } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Todos los campos son obligatorios');
      setIsLoading(false);
      return;
    }

    const result = await login(email, password);
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
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-bold">Bienvenido de nuevo</h1>
          <p className="text-textMuted mt-2">Inicia sesión en DevStack Hub</p>
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
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            label="Contraseña" 
            type="password" 
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
            Iniciar Sesión
          </Button>
        </form>

        <p className="text-center text-textMuted mt-6 text-sm">
          ¿No tienes una cuenta? <Link to="/register" className="text-primary hover:underline">Regístrate</Link>
        </p>
      </Card>
    </div>
  );
};
