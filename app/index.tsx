// app/index.tsx
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, TextInput } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'Iniciar sesión',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

export default function LoginScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = () => {
    if (!email || !password) {
      setError('Ingresa correo y contraseña');
      return;
    }

    // Aquí luego conectamos con el backend (otro commit).
    // Por ahora solo navegamos a Mis recetas.
    setError(null);
    router.replace('/mis-recetas');
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />

      <View className="flex-1 bg-zinc-50 px-4 pt-24 dark:bg-black">
        <Text className="mb-2 text-2xl font-semibold">Te Acerco Salud</Text>
        <Text className="mb-8 text-sm text-zinc-600 dark:text-zinc-300">
          Inicia sesión para ver tus recetas
        </Text>

        <View className="mb-4 gap-2">
          <Text className="text-sm font-medium">Correo electrónico</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            placeholder="paciente@ejemplo.com"
          />
        </View>

        <View className="mb-4 gap-2">
          <Text className="text-sm font-medium">Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            placeholder="••••••••"
          />
        </View>

        {error && (
          <Text className="mb-3 text-sm text-red-500">
            {error}
          </Text>
        )}

        <Button className="mt-2 w-full" onPress={handleLogin}>
          <Text className="font-medium text-white">Iniciar sesión</Text>
        </Button>
      </View>
    </>
  );
}
