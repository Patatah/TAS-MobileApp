import { Text } from '@/components/ui/text';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { Stack, useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const SCREEN_OPTIONS = {
  title: 'Te Acerco Salud',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

type Receta = {
  idReceta: number;
  nombre: string;
  cedulaDoctor: string;
  estado: string;
  fechaLimiteRecogida: string;
  fechaCancelacion?: string | null;
  fechaCreacion: string;
  sucursalNombre?: string;
};

const MOCK_RECETAS: Receta[] = [
  {
    idReceta: 1,
    nombre: 'Receta para dolor de cabeza',
    cedulaDoctor: 'ABC123',
    estado: 'SURTIDA',
    fechaLimiteRecogida: '2025-11-30',
    fechaCancelacion: null,
    fechaCreacion: '2025-11-20',
    sucursalNombre: 'Farmacia Centro',
  },
  {
    idReceta: 2,
    nombre: 'Receta controlada',
    cedulaDoctor: 'DEF456',
    estado: 'SURTIÉNDOSE',
    fechaLimiteRecogida: '2025-12-05',
    fechaCancelacion: null,
    fechaCreacion: '2025-11-25',
    sucursalNombre: 'Farmacia Norte',
  },
  {
    idReceta: 3,
    nombre: 'Receta antibiótico',
    cedulaDoctor: 'GHI789',
    estado: 'CANCELADA',
    fechaLimiteRecogida: '2025-11-10',
    fechaCancelacion: '2025-11-09',
    fechaCreacion: '2025-11-05',
    sucursalNombre: 'Farmacia Sur',
  },
];

export default function MisRecetasScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [search, setSearch] = React.useState('');

  const handlePressReceta = (item: Receta, index: number) => {
    router.push({
      pathname: '/detalle-receta',
      params: {
        index: index.toString(),
        idReceta: item.idReceta.toString(),
        nombre: item.nombre,
        estado: item.estado,
        fechaCreacion: item.fechaCreacion,
        fechaLimiteRecogida: item.fechaLimiteRecogida,
        fechaCancelacion: item.fechaCancelacion ?? '',
        sucursalNombre: item.sucursalNombre ?? '',
      },
    });
  };

  const renderItem = ({ item, index }: { item: Receta; index: number }) => (
    <TouchableOpacity
      className="mb-3 rounded-2xl bg-white/95 p-4 shadow-sm dark:bg-zinc-900/95"
      onPress={() => handlePressReceta(item, index)}
    >
      <View className="mb-1 flex-row items-center justify-between">
        <Text className="text-base font-semibold">{item.nombre}</Text>
        <View className="rounded-full bg-emerald-100 px-3 py-1 dark:bg-emerald-900/40">
          <Text className="text-[11px] font-medium text-emerald-700 dark:text-emerald-200">
            {item.estado}
          </Text>
        </View>
      </View>

      {item.sucursalNombre && (
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          Sucursal:{' '}
          <Text className="font-medium">{item.sucursalNombre}</Text>
        </Text>
      )}

      <Text className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Creada el {item.fechaCreacion}
      </Text>
      <Text className="text-xs text-zinc-500 dark:text-zinc-400">
        Límite de recogida: {item.fechaLimiteRecogida}
      </Text>

      {item.fechaCancelacion && (
        <Text className="mt-1 text-xs text-red-500">
          Cancelada el {item.fechaCancelacion}
        </Text>
      )}
    </TouchableOpacity>
  );

  const filteredRecetas = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return MOCK_RECETAS;

    return MOCK_RECETAS.filter((r) => {
      const nombre = r.nombre.toLowerCase();
      const estado = r.estado.toLowerCase();
      const sucursal = (r.sucursalNombre ?? '').toLowerCase();

      return (
        nombre.includes(term) ||
        estado.includes(term) ||
        sucursal.includes(term)
      );
    });
  }, [search]);

  return (
    <>
      <Stack.Screen options={SCREEN_OPTIONS} />

      <View className="flex-1 bg-zinc-50 px-4 pb-6 pt-24 dark:bg-black">
        <Text className="mb-1 text-2xl font-semibold">
          Mis recetas
        </Text>
        <Text className="text-sm text-zinc-600 dark:text-zinc-300">
          Consulta el estado de tus recetas
        </Text>

        <View className="mt-4 mb-4 flex-row items-center rounded-2xl border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900">
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por nombre, estado o sucursal"
            className="flex-1 text-sm text-zinc-900 dark:text-zinc-100"
            placeholderTextColor={isDark ? '#71717A' : '#A1A1AA'}
          />
        </View>

        <FlatList
          data={filteredRecetas}
          keyExtractor={(item) => item.idReceta.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      </View>
    </>
  );
}
