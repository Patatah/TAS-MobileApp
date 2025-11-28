import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'Perfil del paciente',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

type Paciente = {
  nombre: string;
  correo: string;
  rol: string;
  curp?: string;
};

export default function PerfilScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const paciente: Paciente = {
    nombre: 'Paciente Demo',
    correo: 'paciente@ejemplo.com',
    rol: 'PACIENTE',
    curp: 'DEMO010101HCLLNS00',
  };

  const handleCerrarSesion = () => {
    router.replace('/');
  };

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />

      <View className="flex-1 bg-zinc-50 px-4 pb-6 pt-24 dark:bg-black">
        <View className="mb-4 rounded-2xl bg-white/95 p-4 shadow-sm dark:bg-zinc-900/95">
          <Text className="text-lg font-semibold">
            {paciente.nombre}
          </Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Correo: <Text className="font-medium">{paciente.correo}</Text>
          </Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Rol: <Text className="font-medium">{paciente.rol}</Text>
          </Text>
          {paciente.curp && (
            <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
              CURP: <Text className="font-medium">{paciente.curp}</Text>
            </Text>
          )}
        </View>

        <View className="mt-4 rounded-2xl bg-white/95 p-4 shadow-sm dark:bg-zinc-900/95">
          <Text className="mb-2 text-sm font-semibold">
            Preferencias
          </Text>
          <Text className="text-xs text-zinc-600 dark:text-zinc-300">
            Puedes cambiar entre modo claro y oscuro desde el botón en la barra superior.
          </Text>
        </View>

        <View className="mt-6">
          <Button
            className="w-full rounded-2xl"
            onPress={handleCerrarSesion}
          >
            <Text
              className={
                'text-center text-sm font-medium ' +
                (isDark ? 'text-zinc-900' : 'text-white')
              }
            >
              Cerrar sesión
            </Text>
          </Button>
        </View>
      </View>
    </>
  );
}
