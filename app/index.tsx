import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, FlatList } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'Te Acerco Salud',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

type Receta = {
  id: number;
  folio: string;
  estado: string;
  sucursal: string;
  fecha: string;
};

const MOCK_RECETAS: Receta[] = [
  {
    id: 1,
    folio: 'R-001',
    estado: 'SURTIDA',
    sucursal: 'Farmacia Centro',
    fecha: '2025-11-20',
  },
  {
    id: 2,
    folio: 'R-002',
    estado: 'SURTIÉNDOSE',
    sucursal: 'Farmacia Norte',
    fecha: '2025-11-24',
  },
  {
    id: 3,
    folio: 'R-003',
    estado: 'CANCELADA',
    sucursal: 'Farmacia Sur',
    fecha: '2025-11-25',
  },
];

export default function Screen() {
  const { colorScheme } = useColorScheme();

  const renderItem = ({ item }: { item: Receta }) => (
    <View className="mb-3 rounded-2xl bg-white/95 p-4 shadow-sm dark:bg-zinc-900/95">
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="text-base font-semibold">Receta {item.folio}</Text>

        <View className="rounded-full bg-emerald-100 px-3 py-1 dark:bg-emerald-900/40">
          <Text className="text-[11px] font-medium text-emerald-700 dark:text-emerald-200">
            {item.estado}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-zinc-600 dark:text-zinc-300">
        Sucursal: <Text className="font-medium">{item.sucursal}</Text>
      </Text>

      <Text className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Creada el {item.fecha}
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />

      <View className="flex-1 bg-zinc-50 px-4 pb-6 pt-24 dark:bg-black">
        <Text className="mb-1 text-2xl font-semibold">
        <Text className="text-2xl"> Mis recetas</Text>
        </Text>
        <Text className="mb-4 text-sm text-zinc-600 dark:text-zinc-300">
          Consulta el estado de tus recetas
        </Text>

        <FlatList
          data={MOCK_RECETAS}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </>
  );
}
