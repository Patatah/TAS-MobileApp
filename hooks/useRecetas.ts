import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Receta } from './tipos';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export function useRecetas() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecetas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await SecureStore.getItemAsync('api_token');
      
      if (!token) {
        setError('No hay token de autenticación');
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/recetas`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setRecetas(data.recetas || []);
    } catch (err: any) {
      console.error('Error fetching recetas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRecetas();
    }, [fetchRecetas])
  );

  return { recetas, loading, error, refetch: fetchRecetas };
}
