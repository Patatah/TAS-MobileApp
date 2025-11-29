
import { useState } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';


// URL DE API LARAVEL
const API_URL = 'http://192.168.1.150:8000/api/login';

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);

  const login = async ({ email, password }: LoginCredentials): Promise<boolean> => {
    if (!email || !password) {
      setError('Ingresa correo y contraseña');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          device_name: Platform.OS,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && data.errors.email) {
          setError(data.errors.email[0]);
        } else {
          setError(data.message || 'Ocurrió un error inesperado.');
        }
        setLoading(false);
        return false;
      }

      setToken(data.token);
      setUser(data.user);
      setLoading(false);

      await SecureStore.setItemAsync('api_token', data.token);

      return true;
    } catch (e) {
      console.error(e);
      setError('No se pudo conectar al servidor. Intenta más tarde.');
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setError(null);
    await SecureStore.deleteItemAsync('api_token');
  };

  return {
    login,
    logout,
    loading,
    error,
    token,
    user,
    isAuthenticated: !!token,
  };
}