// app/detalle-receta.tsx
import { Text } from '@/components/ui/text';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { View, FlatList } from 'react-native';

const SCREEN_OPTIONS = {
  title: 'Detalle de receta',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

type Receta = {
  idReceta: number;
  nombre: string;
  estado: string;
  fechaCreacion: string;
  fechaLimiteRecogida: string;
  fechaCancelacion?: string | null;
  sucursalNombre?: string;
};

type DetalleLinea = {
  idLinea: number;
  nombreMedicamento: string;
  presentacion: string;
  cantidad: number;
};

const MOCK_DETALLES: DetalleLinea[] = [
  {
    idLinea: 1,
    nombreMedicamento: 'Paracetamol 500mg',
    presentacion: 'Caja 10 tabletas',
    cantidad: 2,
  },
  {
    idLinea: 2,
    nombreMedicamento: 'Ibuprofeno 400mg',
    presentacion: 'Caja 20 tabletas',
    cantidad: 1,
  },
];

export default function DetalleRecetaScreen() {
  const { colorScheme } = useColorScheme();
  const params = useLocalSearchParams<{
    idReceta?: string;
    nombre?: string;
    estado?: string;
    fechaCreacion?: string;
    fechaLimiteRecogida?: string;
    fechaCancelacion?: string;
    sucursalNombre?: string;
  }>();

  const receta: Receta = {
    idReceta: Number(params.idReceta ?? 0),
    nombre: params.nombre ?? 'Receta',
    estado: params.estado ?? 'SIN ESTADO',
    fechaCreacion: params.fechaCreacion ?? '',
    fechaLimiteRecogida: params.fechaLimiteRecogida ?? '',
    fechaCancelacion: params.fechaCancelacion || null,
    sucursalNombre: params.sucursalNombre || undefined,
  };

  const renderDetalle = ({ item }: { item: DetalleLinea }) => (
    <View className="mb-2 rounded-xl bg-white/95 p-3 shadow-sm dark:bg-zinc-900/95">
      <Text className="font-semibold">{item.nombreMedicamento}</Text>
      <Text className="text-xs text-zinc-500 dark:text-zinc-400">
        {item.presentacion}
      </Text>
      <Text className="mt-1 text-sm">
        Cantidad: <Text className="font-medium">{item.cantidad}</Text>
      </Text>
    </View>
  );

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />

      <View className="flex-1 bg-zinc-50 px-4 pb-6 pt-24 dark:bg-black">
        <View className="mb-4 rounded-2xl bg-white/95 p-4 shadow-sm dark:bg-zinc-900/95">
          <Text className="text-lg font-semibold">{receta.nombre}</Text>
          <Text className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Estado: <Text className="font-medium">{receta.estado}</Text>
          </Text>

          {receta.sucursalNombre && (
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              Sucursal:{' '}
              <Text className="font-medium">{receta.sucursalNombre}</Text>
            </Text>
          )}

          <Text className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Creada el {receta.fechaCreacion}
          </Text>
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">
            Límite de recogida: {receta.fechaLimiteRecogida}
          </Text>

          {receta.fechaCancelacion && (
            <Text className="mt-1 text-xs text-red-500">
              Cancelada el {receta.fechaCancelacion}
            </Text>
          )}
        </View>

        <Text className="mb-2 text-base font-semibold">
          Medicamentos de la receta
        </Text>

        <FlatList
          data={MOCK_DETALLES}
          keyExtractor={(item) => item.idLinea.toString()}
          renderItem={renderDetalle}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </>
  );
}
