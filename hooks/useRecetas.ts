import { useEffect, useState } from 'react';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export function useRecetas() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/recetas/medicamentos`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => setRecipes(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { recipes, loading, error };
}