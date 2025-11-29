
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
      console.log('Response data:', data);

      if (!response.ok) {
        let errorMessage = 'Ocurrió un error inesperado.';
        
        // Traducciones de mensajes comunes
        const translations: Record<string, string> = {
          'The email field must be a valid email address.': 'Debes ingresar un correo electrónico válido.',
          'The provided credentials are incorrect.': 'Las credenciales proporcionadas son incorrectas.',
          'These credentials do not match our records.': 'Estas credenciales no coinciden con nuestros registros.',
        };

        // Verificar diferentes estructuras de error
        if (data.errors) {
          if (data.errors.email) {
            const emailError = Array.isArray(data.errors.email) 
              ? data.errors.email[0] 
              : data.errors.email;
            errorMessage = translations[emailError] || emailError;
          } else if (data.errors.password) {
            const passwordError = Array.isArray(data.errors.password)
              ? data.errors.password[0]
              : data.errors.password;
            errorMessage = passwordError;
          }
        } else if (data.message) {
          errorMessage = translations[data.message] || data.message;
        }

        setError(errorMessage);
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